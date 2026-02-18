import { CONFIG } from './config.js';
import { STATE }  from './lemming.js';

// Colour palettes per level theme
export const PALETTES = {
  dirt: {
    sky:   '#1a1a2e',
    solid: [120, 80, 40],
    steel: [100, 100, 110],
    entrance: '#ffaa00',
    exit:     '#00ff88',
  },
  snow: {
    sky:   '#0d1b2a',
    solid: [180, 200, 220],
    steel: [80, 80, 100],
    entrance: '#ffcc44',
    exit:     '#44ffcc',
  },
  brick: {
    sky:   '#0a0a0a',
    solid: [140, 60, 50],
    steel: [90, 90, 100],
    entrance: '#ffaa00',
    exit:     '#00ff88',
  },
  crystal: {
    sky:   '#050520',
    solid: [60, 100, 160],
    steel: [150, 150, 180],
    entrance: '#ffee44',
    exit:     '#ff44ee',
  },
};

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.palette = PALETTES.dirt;
  }

  setPalette(name) {
    this.palette = PALETTES[name] || PALETTES.dirt;
  }

  resize(w, h) {
    this.canvas.width  = w;
    this.canvas.height = h;
  }

  clear() {
    this.ctx.fillStyle = this.palette.sky;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawTerrain(terrain, camX) {
    terrain.draw(this.ctx, camX, this.palette);
  }

  drawEntrance(ent, camX) {
    const sx = ent.x - camX;
    const ctx = this.ctx;
    ctx.fillStyle = '#442200';
    ctx.fillRect(sx - 1, ent.y - 14, ent.w + 2, 14);
    ctx.fillStyle = this.palette.entrance;
    ctx.fillRect(sx, ent.y - 12, ent.w, 12);
    // hatch lines
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    for (let i = 0; i < ent.w; i += 4) {
      ctx.beginPath(); ctx.moveTo(sx + i, ent.y - 12); ctx.lineTo(sx + i, ent.y); ctx.stroke();
    }
    // Drop indicator
    ctx.fillStyle = 'rgba(255,170,0,0.3)';
    ctx.fillRect(sx + 1, ent.y, ent.w - 2, 6);
  }

  drawExit(exit, camX) {
    const sx = exit.x - camX;
    const ctx = this.ctx;
    // Door frame
    ctx.fillStyle = '#003322';
    ctx.fillRect(sx - 2, exit.y - 2, exit.w + 4, exit.h + 4);
    // Door fill
    ctx.fillStyle = this.palette.exit;
    ctx.fillRect(sx, exit.y, exit.w, exit.h);
    // Glow pulse
    const t = Date.now() / 800;
    const alpha = 0.2 + 0.15 * Math.sin(t);
    ctx.fillStyle = `rgba(0,255,136,${alpha})`;
    ctx.fillRect(sx - 4, exit.y - 4, exit.w + 8, exit.h + 8);
    // Arrow
    ctx.fillStyle = '#fff';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('→', sx + exit.w / 2, exit.y + exit.h / 2 + 4);
  }

  drawTrap(trap, camX) {
    const sx = trap.x - camX;
    const ctx = this.ctx;
    ctx.fillStyle = '#600';
    ctx.fillRect(sx, trap.y, trap.w, trap.h);
    ctx.fillStyle = '#f44';
    ctx.font = '8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('✕', sx + trap.w / 2, trap.y + trap.h / 2 + 3);
  }

  drawLemming(lem, camX) {
    const sx = lem.x - camX;
    if (sx < -20 || sx > this.canvas.width + 20) return;

    const ctx = this.ctx;
    const sy = lem.y;
    const w  = 8, h = 10;

    // Body
    ctx.fillStyle = lem.state === STATE.DEAD ? '#333' : '#4488ff';
    ctx.fillRect(sx + 1, sy + 4, w - 2, h - 4);

    // Head
    ctx.fillStyle = '#ffcc88';
    ctx.fillRect(sx + 1, sy + 1, w - 2, 4);

    // Hair colour — climber=orange, floater=cyan, else=green
    ctx.fillStyle = lem.isClimber ? '#ff8800' :
                    lem.isFloater ? '#00ffff' : '#00cc00';
    ctx.fillRect(sx + 1, sy, w - 2, 2);

    // Legs (animated walk)
    if (lem.state === STATE.WALK || lem.state === STATE.BOMB) {
      const legPhase = lem.frame % 4;
      ctx.fillStyle = '#2266cc';
      if (legPhase < 2) {
        ctx.fillRect(sx + 1, sy + h - 2, 2, 2);  // left leg
        ctx.fillRect(sx + 4, sy + h - 3, 2, 3);  // right leg
      } else {
        ctx.fillRect(sx + 1, sy + h - 3, 2, 3);
        ctx.fillRect(sx + 4, sy + h - 2, 2, 2);
      }
    }

    // Floater umbrella
    if (lem.state === STATE.FLOAT) {
      ctx.fillStyle = '#ff4488';
      ctx.beginPath();
      ctx.arc(sx + w / 2, sy - 4, 7, Math.PI, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#ccc';
      ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(sx + 2, sy - 4); ctx.lineTo(sx + w/2, sy + 1); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(sx + w - 2, sy - 4); ctx.lineTo(sx + w/2, sy + 1); ctx.stroke();
    }

    // Bomb countdown
    if (lem.state === STATE.BOMB && lem.bombActive) {
      const secs = Math.ceil(lem.bombTimer / 1000);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(secs, sx + w / 2, sy - 2);
    }

    // Splat X
    if (lem.state === STATE.SPLAT) {
      ctx.fillStyle = '#f44';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('✸', sx + w / 2, sy + h / 2 + 4);
    }

    // Blocker indicator
    if (lem.state === STATE.BLOCK) {
      ctx.fillStyle = 'rgba(255,255,0,0.5)';
      ctx.fillRect(sx - 1, sy, 2, h);
      ctx.fillRect(sx + w - 1, sy, 2, h);
    }

    // Builder backpack
    if (lem.state === STATE.BUILD) {
      ctx.fillStyle = '#ffcc00';
      ctx.fillRect(sx + (lem.dir > 0 ? 0 : w - 3), sy + 3, 3, 5);
    }

    // Hard hat (miner)
    if (lem.state === STATE.MINE) {
      ctx.fillStyle = '#ffdd00';
      ctx.fillRect(sx, sy, w, 2);
    }
  }

  drawLemmings(lemmings, camX) {
    for (const lem of lemmings) {
      if (lem.state !== STATE.EXIT) this.drawLemming(lem, camX);
    }
  }

  // Highlight a lemming the cursor is near
  drawCursor(x, y, camX) {
    const sx = x - camX;
    const ctx = this.ctx;
    ctx.strokeStyle = '#ff0';
    ctx.lineWidth = 1;
    ctx.strokeRect(sx - 6, y - 6, 20, 20);
  }
}
