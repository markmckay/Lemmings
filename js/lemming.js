import { CONFIG } from './config.js';
import { T_AIR, T_STEEL } from './terrain.js';

export const STATE = {
  WALK:    'walk',
  FALL:    'fall',
  CLIMB:   'climb',
  FLOAT:   'float',
  BLOCK:   'block',
  BUILD:   'build',
  BASH:    'bash',
  MINE:    'mine',
  DIG:     'dig',
  BOMB:    'bomb',
  EXIT:    'exit',
  DEAD:    'dead',
  SPLAT:   'splat',  // brief death animation
};

let _id = 0;

export class Lemming {
  constructor(x, y) {
    this.id  = _id++;
    this.x   = x;
    this.y   = y;
    this.vx  = CONFIG.WALK_SPEED;  // positive = right
    this.vy  = 0;
    this.dir = 1;   // 1=right, -1=left
    this.state = STATE.FALL;

    // Permanent skills
    this.isClimber = false;
    this.isFloater = false;

    // Skill state
    this.fallDist    = 0;
    this.buildStep   = 0;
    this.buildTick   = 0;
    this.bombTimer   = 0;
    this.bombActive  = false;
    this.splatTimer  = 0;
    this.climbDist   = 0;

    // Pixel animation frame
    this.frame     = 0;
    this.frameTick = 0;
    this.FRAME_RATE = 4;  // ticks per anim frame

    // Death counting flag (prevent double-count)
    this.counted = false;
  }

  /** Assign a new action skill (not permanent) */
  assignSkill(skill) {
    switch (skill) {
      case 'climber': this.isClimber = true; return true;
      case 'floater': this.isFloater = true; return true;
      case 'bomber':
        if (this.state === STATE.BLOCK || this.state === STATE.BOMB) return false;
        this.state = STATE.BOMB;
        this.bombTimer = CONFIG.BOMB_FUSE;
        this.bombActive = true;
        return true;
      case 'blocker':
        if ([STATE.FALL,STATE.DEAD,STATE.SPLAT,STATE.EXIT].includes(this.state)) return false;
        this.state = STATE.BLOCK;
        this.vx = 0;
        return true;
      case 'builder':
        if ([STATE.FALL,STATE.DEAD,STATE.SPLAT,STATE.EXIT,STATE.CLIMB].includes(this.state)) return false;
        this.state = STATE.BUILD;
        this.buildStep = 0;
        this.buildTick = 0;
        return true;
      case 'basher':
        if ([STATE.FALL,STATE.DEAD,STATE.SPLAT,STATE.EXIT].includes(this.state)) return false;
        this.state = STATE.BASH;
        return true;
      case 'miner':
        if ([STATE.FALL,STATE.DEAD,STATE.SPLAT,STATE.EXIT].includes(this.state)) return false;
        this.state = STATE.MINE;
        return true;
      case 'digger':
        if ([STATE.FALL,STATE.DEAD,STATE.SPLAT,STATE.EXIT].includes(this.state)) return false;
        this.state = STATE.DIG;
        return true;
    }
    return false;
  }

  get alive() {
    return this.state !== STATE.DEAD && this.state !== STATE.SPLAT && this.state !== STATE.EXIT;
  }

  get done() {
    return this.state === STATE.DEAD || this.state === STATE.SPLAT;
  }

  get cx() { return this.x + CONFIG.LEM_W / 2; }
  get cy() { return this.y + CONFIG.LEM_H / 2; }
  get footX() { return this.x + CONFIG.LEM_W / 2; }
  get footY() { return this.y + CONFIG.LEM_H; }

  /** Check if this lemming's feet overlap the exit zone */
  checkExit(exits) {
    for (const e of exits) {
      if (this.footX >= e.x && this.footX <= e.x + e.w &&
          this.footY >= e.y && this.footY <= e.y + e.h) {
        return true;
      }
    }
    return false;
  }

  /** Check if close to a trap */
  checkTraps(traps) {
    for (const t of traps) {
      if (this.cx >= t.x && this.cx <= t.x + t.w &&
          this.cy >= t.y && this.cy <= t.y + t.h) {
        return true;
      }
    }
    return false;
  }

  tickAnim() {
    this.frameTick++;
    if (this.frameTick >= this.FRAME_RATE) {
      this.frameTick = 0;
      this.frame = (this.frame + 1) % 8;
    }
  }

  /** Main update — returns 'dead'|'exit'|null */
  update(terrain, exits, traps, lemmings, dt) {
    this.tickAnim();

    if (this.state === STATE.DEAD) return 'dead';
    if (this.state === STATE.EXIT) return 'exit';

    if (this.state === STATE.SPLAT) {
      this.splatTimer += dt;
      if (this.splatTimer > 600) { this.state = STATE.DEAD; return 'dead'; }
      return null;
    }

    // Bomb countdown
    if (this.bombActive && this.state === STATE.BOMB) {
      this.bombTimer -= dt;
      if (this.bombTimer <= 0) return 'explode';
    }

    // --- Physics dispatch ---
    switch (this.state) {
      case STATE.WALK:  this._walk(terrain, lemmings);  break;
      case STATE.FALL:  this._fall(terrain);             break;
      case STATE.CLIMB: this._climb(terrain);            break;
      case STATE.FLOAT: this._float(terrain);            break;
      case STATE.BLOCK: /* stand still */                break;
      case STATE.BUILD: this._build(terrain);            break;
      case STATE.BASH:  this._bash(terrain);             break;
      case STATE.MINE:  this._mine(terrain);             break;
      case STATE.DIG:   this._dig(terrain);              break;
      case STATE.BOMB:  this._walk(terrain, lemmings);  break; // walk while counting down
    }

    // Out of bounds → dead
    if (this.y >= CONFIG.GAME_HEIGHT || this.x < -20 || this.x > CONFIG.GAME_WIDTH + 20) {
      this.state = STATE.DEAD;
      return 'dead';
    }

    // Trap check
    if (this.checkTraps(traps)) {
      this.state = STATE.SPLAT;
      this.splatTimer = 0;
      return 'dead';
    }

    // Exit check
    if (this.checkExit(exits)) {
      this.state = STATE.EXIT;
      return 'exit';
    }

    return null;
  }

  // ── Walk ──────────────────────────────────────────────────────────────
  _walk(terrain, lemmings) {
    const fw = CONFIG.LEM_W, fh = CONFIG.LEM_H;

    // Check if standing on ground
    if (!this._onGround(terrain)) {
      this.fallDist = 0;
      this.state = (this.isFloater) ? STATE.FLOAT : STATE.FALL;
      this.vy = 0;
      return;
    }

    // Blocker collision
    for (const lem of lemmings) {
      if (lem === this || lem.state !== STATE.BLOCK) continue;
      const dx = lem.cx - this.cx;
      if (Math.abs(dx) < fw && Math.abs(lem.y - this.y) < fh) {
        this.dir *= -1;
        this.vx  *= -1;
        return;
      }
    }

    const nx = this.x + this.dir * CONFIG.WALK_SPEED;

    // Wall check: look at the column ahead at foot level
    const checkX = this.dir > 0 ? (nx + fw) | 0 : nx | 0;
    let wallHit = false;
    let stepUp  = 0;

    // Scan from feet upward — find how many pixels we'd need to step up
    for (let dy = 0; dy <= CONFIG.STEP_UP_MAX; dy++) {
      if (terrain.isSolid(checkX, (this.y + fh - dy) | 0)) {
        if (dy === 0) { wallHit = true; stepUp = 0; }
        else { wallHit = true; stepUp = dy; }
        break;
      }
    }
    // Only a wall if it's solid at foot level but we can't step over it
    const headBlocked = terrain.isSolid(checkX, (this.y + 1) | 0);

    if (wallHit && headBlocked) {
      // Can't step up — turn or climb
      if (this.isClimber) {
        this.state = STATE.CLIMB;
        this.climbDist = 0;
        this.vx = 0;
      } else {
        this.dir *= -1;
        this.vx  *= -1;
      }
    } else if (wallHit && !headBlocked) {
      // Can step up
      this.y -= stepUp;
      this.x  = nx;
    } else {
      this.x = nx;
    }

    // Slope down
    this._stickToGround(terrain);
  }

  _stickToGround(terrain) {
    const fh = CONFIG.LEM_H;
    // Step down up to STEP_UP_MAX pixels
    for (let dy = 0; dy <= CONFIG.STEP_UP_MAX; dy++) {
      if (terrain.isSolid(this.footX, this.y + fh + dy)) {
        this.y = this.y + dy;
        return;
      }
    }
  }

  _onGround(terrain) {
    return terrain.isSolid(this.footX, this.footY + 1) ||
           terrain.isSolid(this.footX - 1, this.footY + 1) ||
           terrain.isSolid(this.footX + 1, this.footY + 1);
  }

  // ── Fall ──────────────────────────────────────────────────────────────
  _fall(terrain) {
    this.vy = Math.min(this.vy + CONFIG.GRAVITY, CONFIG.MAX_FALL);
    this.y += this.vy;
    this.fallDist += this.vy;

    if (this._onGround(terrain)) {
      // Snap to ground
      while (this._onGround(terrain) && this.vy > 0) this.y -= 1;
      if (this.fallDist > CONFIG.SPLAT_HEIGHT && !this.isFloater) {
        this.state = STATE.SPLAT;
        this.splatTimer = 0;
      } else {
        this.state = STATE.WALK;
        this.vx = this.dir * CONFIG.WALK_SPEED;
        this.vy = 0;
        this.fallDist = 0;
      }
    }
  }

  // ── Float ─────────────────────────────────────────────────────────────
  _float(terrain) {
    this.vy = Math.min(this.vy + CONFIG.GRAVITY, CONFIG.FLOAT_SPEED);
    this.y += this.vy;

    if (this._onGround(terrain)) {
      while (this._onGround(terrain) && this.vy > 0) this.y -= 1;
      this.state = STATE.WALK;
      this.vx = this.dir * CONFIG.WALK_SPEED;
      this.vy = 0;
      this.fallDist = 0;
    }
  }

  // ── Climb ─────────────────────────────────────────────────────────────
  _climb(terrain) {
    const fw = CONFIG.LEM_W;
    const wallX = this.dir > 0 ? this.x + fw : this.x - 1;

    // Check for overhang at head
    if (!terrain.isSolid(wallX, this.y - 1)) {
      // Wall gone — start falling or walking over top
      this.state = this.isFloater ? STATE.FLOAT : STATE.FALL;
      this.vy = 0; this.fallDist = 0;
      this.x += this.dir * 2;
      return;
    }

    this.y -= CONFIG.CLIMB_SPEED;
    this.climbDist++;

    // Check if we cleared the top
    const topFree = !terrain.isSolid(wallX, this.y - 1);
    if (topFree) {
      // Move over the top
      this.x += this.dir * (fw + 1);
      this.state = STATE.WALK;
      this.vx = this.dir * CONFIG.WALK_SPEED;
    }
  }

  // ── Build ─────────────────────────────────────────────────────────────
  _build(terrain) {
    if (!this._onGround(terrain)) {
      this.state = STATE.FALL; this.vy = 0; this.fallDist = 0; return;
    }

    this.buildTick++;
    if (this.buildTick < CONFIG.BUILD_TICKS) {
      // Walk forward a bit
      this.x += this.dir * 0.5;
      return;
    }
    this.buildTick = 0;

    if (this.buildStep >= CONFIG.BUILD_STEPS) {
      this.state = STATE.WALK;
      this.vx = this.dir * CONFIG.WALK_SPEED;
      return;
    }

    // Place brick
    const bx = this.dir > 0 ? this.footX : this.footX - CONFIG.BUILD_STEP_W;
    const by = this.footY - 1;
    terrain.addRect(bx | 0, by, CONFIG.BUILD_STEP_W, CONFIG.BUILD_STEP_H);

    // Step up onto brick
    this.x += this.dir * CONFIG.BUILD_STEP_W;
    this.y -= CONFIG.BUILD_STEP_H;
    this.buildStep++;

    // Check for wall ahead — stop building
    const checkX = this.dir > 0 ? this.x + CONFIG.LEM_W + 1 : this.x - 1;
    if (terrain.isSolid(checkX, this.y + CONFIG.LEM_H - 2)) {
      this.state = STATE.WALK;
      this.dir  *= -1;
      this.vx    = this.dir * CONFIG.WALK_SPEED;
    }
  }

  // ── Bash ──────────────────────────────────────────────────────────────
  _bash(terrain) {
    if (!this._onGround(terrain)) {
      this.state = STATE.FALL; this.vy = 0; return;
    }

    const fw = CONFIG.LEM_W, fh = CONFIG.LEM_H;
    const bx = this.dir > 0 ? this.x + fw - 1 : this.x - CONFIG.BASH_W;
    const by = this.y + 1;
    const bh = CONFIG.BASH_H;

    // Check there's something to bash
    let hasWall = false;
    for (let dy = 0; dy < bh; dy++) {
      if (terrain.isSolid(bx, by + dy)) { hasWall = true; break; }
    }

    if (!hasWall) {
      this.state = STATE.WALK; this.vx = this.dir * CONFIG.WALK_SPEED; return;
    }

    terrain.removeRect(bx, by, CONFIG.BASH_W, bh);
    this.x += this.dir * CONFIG.BASH_W;
    this._stickToGround(terrain);
  }

  // ── Mine ──────────────────────────────────────────────────────────────
  _mine(terrain) {
    const r = CONFIG.MINE_RADIUS;
    const mx = this.footX + this.dir * r;
    const my = this.footY + r / 2;
    terrain.removeCircle(mx, my, r);
    this.x += this.dir * 1;
    this.y += 1;

    // Stop if no more terrain below
    if (!terrain.isSolid(this.footX, this.footY + r)) {
      this.state = this.isFloater ? STATE.FLOAT : STATE.FALL;
      this.vy = 0; this.fallDist = 0;
    }
  }

  // ── Dig ───────────────────────────────────────────────────────────────
  _dig(terrain) {
    const dw = CONFIG.DIG_W;
    const dx = (this.footX - dw / 2) | 0;
    terrain.removeRect(dx, this.footY, dw, 2);
    this.y += 2;

    // Stop if fallen into air
    if (!terrain.isSolid(this.footX, this.footY + 1)) {
      this.state = this.isFloater ? STATE.FLOAT : STATE.FALL;
      this.vy = 0; this.fallDist = 0;
    }
  }
}
