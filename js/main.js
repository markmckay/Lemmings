import { CONFIG }    from './config.js';
import { Terrain }   from './terrain.js';
import { Lemming, STATE } from './lemming.js';
import { Renderer }  from './renderer.js';
import { Camera }    from './camera.js';
import { Input }     from './input.js';
import { UI }        from './ui.js';
import { Audio }     from './audio.js';
import { FUN }       from './levels/fun.js';
import { TRICKY }    from './levels/tricky.js';
import { TAXING }    from './levels/taxing.js';
import { MAYHEM }    from './levels/mayhem.js';

const ALL_LEVELS = { FUN, TRICKY, TAXING, MAYHEM };

// ── Saved progress in localStorage ──
const SAVE_KEY = 'lemmings_progress';
function loadProgress() {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch { return {}; }
}
function saveProgress(p) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(p)); } catch {}
}

// ── Game state ──────────────────────────────────────────────────────────
const game = {
  // State machine
  screen: 'menu',   // 'menu' | 'select' | 'playing' | 'result'
  paused: false,

  // Level
  category: 'FUN',
  levelIdx:  0,
  level:     null,
  skillCounts: {},
  releaseRate: 50,
  minRate: 1,

  // Entities
  terrain:  null,
  lemmings: [],
  exits:    [],
  traps:    [],
  entrances: [],

  // Counters
  spawned:    0,
  savedCount: 0,
  deadCount:  0,
  spawnTimer: 0,

  // Timer
  timeLeft: 0,
  lastTime: 0,

  // Cursor (world coords)
  cursorX: 0, cursorY: 0,
  selectedSkill: null,

  progress: loadProgress(),
};

// ── DOM refs ──────────────────────────────────────────────────────────
const canvas    = document.getElementById('game-canvas');
const container = document.getElementById('game-container');
const mainMenu  = document.getElementById('main-menu');
const levelSel  = document.getElementById('level-select');
const appEl     = document.getElementById('app');
const hudIn     = document.getElementById('hud-in');

// ── Core objects ──────────────────────────────────────────────────────
const camera   = new Camera();
const renderer = new Renderer(canvas);
const ui       = new UI(game);
let   input    = null;  // created after resize

// ── Resize ────────────────────────────────────────────────────────────
function resize() {
  const cw = container.clientWidth;
  const ch = container.clientHeight;

  // Scale to fit level height
  const scale = ch / CONFIG.GAME_HEIGHT;
  const displayW = cw;
  const displayH = ch;

  canvas.style.width  = displayW + 'px';
  canvas.style.height = displayH + 'px';
  renderer.resize(Math.round(displayW / scale), Math.round(displayH / scale));
  camera.resize(renderer.canvas.width, CONFIG.GAME_HEIGHT);

  if (input) input.setScale(scale);
  else {
    input = new Input(canvas, camera);
    input.setScale(scale);
    input.onClick = handleClick;
  }
}
window.addEventListener('resize', resize);
resize();

// ── Show/hide screens ─────────────────────────────────────────────────
function showMenu() {
  game.screen = 'menu';
  mainMenu.style.display = 'flex';
  levelSel.classList.remove('visible');
  appEl.style.visibility = 'hidden';
  ui.hideOverlay();
}

function showLevelSelect() {
  game.screen = 'select';
  mainMenu.style.display = 'none';
  levelSel.classList.add('visible');
  appEl.style.visibility = 'hidden';
  renderLevelGrid(game.category);
}

function renderLevelGrid(cat) {
  game.category = cat;
  const levels = ALL_LEVELS[cat] || FUN;
  const grid = document.getElementById('level-grid');
  grid.innerHTML = '';

  levels.forEach((lvl, i) => {
    const key = `${cat}_${i}`;
    const completed = !!game.progress[key];
    const unlocked  = i === 0 || !!game.progress[`${cat}_${i-1}`];

    const card = document.createElement('div');
    card.className = `level-card ${completed ? 'completed' : unlocked ? 'unlocked' : 'locked'}`;
    card.innerHTML = `<div class="level-num">${lvl.num}</div><div class="level-name">${lvl.name}</div>`;
    if (unlocked) card.addEventListener('click', () => startLevel(cat, i));
    grid.appendChild(card);
  });

  // Tab highlight
  document.querySelectorAll('.cat-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.cat === cat.toLowerCase());
  });
}

// Category tab clicks
document.querySelectorAll('.cat-tab').forEach(tab => {
  tab.addEventListener('click', () => renderLevelGrid(tab.dataset.cat.toUpperCase()));
});
document.getElementById('btn-back-menu').addEventListener('click', showMenu);
document.getElementById('btn-play').addEventListener('click', showLevelSelect);

// ── Start a level ─────────────────────────────────────────────────────
function startLevel(cat, idx) {
  const levels = ALL_LEVELS[cat];
  if (!levels || !levels[idx]) return;

  game.category = cat;
  game.levelIdx = idx;
  game.level    = levels[idx];
  const lvl     = game.level;

  // Reset state
  game.paused     = false;
  game.spawned    = 0;
  game.savedCount = 0;
  game.deadCount  = 0;
  game.spawnTimer = 0;
  game.lemmings   = [];
  game.exits      = [];
  game.traps      = [];
  game.entrances  = [];
  game.timeLeft   = lvl.timeSecs;
  game.lastTime   = performance.now();
  game.releaseRate = lvl.releaseRate;
  game.minRate    = lvl.releaseRate;
  game.skillCounts = { ...lvl.skills };

  // Build terrain
  if (!game.terrain) game.terrain = new Terrain();
  game.terrain.clear();
  lvl.build(game.terrain, game.entrances, game.exits);

  // Show traps (steel tiles act as trap zones for now)
  // We use a simple approach: mark areas from level data
  game.traps = lvl.traps || [];

  // Camera to entrance
  if (game.entrances.length) camera.centerOn(game.entrances[0].x + 12);

  // Renderer palette
  renderer.setPalette(lvl.palette || 'dirt');

  // UI
  ui.updateSkills(game.skillCounts);
  ui.updateRate(game.releaseRate);
  ui.hideOverlay();
  ui.deselectSkill();
  game.selectedSkill = null;

  // Show game screen
  mainMenu.style.display = 'none';
  levelSel.classList.remove('visible');
  appEl.style.visibility = 'visible';
  game.screen = 'playing';

  document.getElementById('pause-btn').textContent = '⏸';
}

// ── Input ─────────────────────────────────────────────────────────────
function handleClick(wx, wy) {
  if (game.screen !== 'playing' || game.paused) return;
  if (!game.selectedSkill) return;

  const skill = game.selectedSkill;
  const count = game.skillCounts[skill] ?? 0;
  if (count <= 0) return;

  // Find closest lemming within 16px
  let closest = null, bestDist = 18;
  for (const lem of game.lemmings) {
    if (!lem.alive) continue;
    const dx = lem.cx - wx, dy = lem.cy - wy;
    const d  = Math.sqrt(dx*dx + dy*dy);
    if (d < bestDist) { bestDist = d; closest = lem; }
  }

  if (closest && closest.assignSkill(skill)) {
    game.skillCounts[skill]--;
    ui.updateSkills(game.skillCounts);
    Audio.assign();
  }
}

// ── Public API used by UI ─────────────────────────────────────────────
game.onSkillSelected = (skill) => { game.selectedSkill = skill; };
game.changeRate = (delta) => {
  game.releaseRate = Math.max(game.minRate, Math.min(99, game.releaseRate + delta));
  ui.updateRate(game.releaseRate);
};
game.togglePause = () => {
  game.paused = !game.paused;
  document.getElementById('pause-btn').textContent = game.paused ? '▶' : '⏸';
  if (!game.paused) game.lastTime = performance.now();
};
game.nuke = () => {
  if (game.screen !== 'playing') return;
  for (const lem of game.lemmings) {
    if (lem.alive) { lem.state = STATE.BOMB; lem.bombTimer = 1; lem.bombActive = true; }
  }
};
game.nextLevel = () => {
  const levels = ALL_LEVELS[game.category];
  const nextIdx = game.levelIdx + 1;
  if (nextIdx < levels.length) startLevel(game.category, nextIdx);
  else showLevelSelect();
};
game.retryLevel = () => startLevel(game.category, game.levelIdx);
game.showMenu   = showMenu;
game.showLevelSelect = showLevelSelect;

// ── Spawn ─────────────────────────────────────────────────────────────
function spawnLemming(dt) {
  const lvl = game.level;
  if (game.spawned >= lvl.lemmings) return;

  game.spawnTimer += dt;
  const interval = CONFIG.BASE_SPAWN / game.releaseRate * 1;
  if (game.spawnTimer < interval) return;
  game.spawnTimer = 0;

  const ent = game.entrances[game.spawned % game.entrances.length];
  const lem = new Lemming(ent.x + 4, ent.y);
  lem.vy = 0;
  game.lemmings.push(lem);
  game.spawned++;
  Audio.spawn();
}

// ── Win / Lose ────────────────────────────────────────────────────────
function checkEndCondition() {
  const lvl  = game.level;
  const total = lvl.lemmings;
  const done  = game.savedCount + game.deadCount;

  // All out AND all resolved (or time up)
  const allSpawned  = game.spawned >= total;
  const allResolved = done >= game.spawned;
  const timeUp      = game.timeLeft <= 0;

  if ((allSpawned && allResolved) || timeUp) {
    const pct      = Math.round(game.savedCount / total * 100);
    const needed   = lvl.mustSave;
    const win      = game.savedCount >= needed;
    showResult(win, game.savedCount, total, needed, pct);
  }
}

function showResult(win, saved, total, needed, pct) {
  if (game.screen === 'result') return;
  game.screen = 'result';

  if (win) {
    // Save progress
    const key = `${game.category}_${game.levelIdx}`;
    game.progress[key] = true;
    saveProgress(game.progress);
    Audio.win();
    ui.showOverlay(
      '🎉 LEVEL COMPLETE!',
      `You saved ${saved} of ${total} lemmings`,
      `${pct}%`,
      { next: true, retry: true }
    );
  } else {
    Audio.lose();
    ui.showOverlay(
      '💀 LEVEL FAILED',
      `You needed ${needed}, but only saved ${saved}`,
      `${pct}%`,
      { next: false, retry: true }
    );
  }
}

// ── Main game loop ────────────────────────────────────────────────────
let _raf = null;
function loop(now) {
  _raf = requestAnimationFrame(loop);

  if (game.screen !== 'playing') {
    // Still render if paused/result so canvas stays visible
    if (game.terrain) drawFrame();
    return;
  }

  const rawDt = Math.min(now - game.lastTime, 50);
  game.lastTime = now;

  if (!game.paused) {
    const dt = rawDt;
    // Countdown timer
    game.timeLeft = Math.max(0, game.timeLeft - dt / 1000);

    // Spawn
    spawnLemming(dt);

    // Update lemmings
    for (const lem of game.lemmings) {
      const result = lem.update(game.terrain, game.exits, game.traps, game.lemmings, dt);
      if (result === 'exit') {
        game.savedCount++;
        lem.state = STATE.EXIT;
        Audio.saved();
      } else if (result === 'explode') {
        game.terrain.removeCircle(lem.cx, lem.cy, CONFIG.BOMB_RADIUS);
        Audio.explode();
        lem.state = STATE.DEAD;
        if (!lem.counted) { lem.counted = true; game.deadCount++; }
      } else if (result === 'dead') {
        // Only count once — splat lemmings return 'dead' once when animation ends
        if (!lem.counted) {
          lem.counted = true;
          game.deadCount++;
          if (lem.state !== STATE.SPLAT) Audio.die();
        }
      }
    }
    // Remove fully resolved lemmings (dead or exited), keep splat animation running
    game.lemmings = game.lemmings.filter(l =>
      l.state !== STATE.DEAD && l.state !== STATE.EXIT
    );

    // HUD
    const living = game.lemmings.filter(l => l.alive).length;
    hudIn.textContent = `IN: ${living}`;
    ui.updateHUD({
      out: game.spawned, saved: game.savedCount,
      needed: game.level.mustSave, timeLeft: game.timeLeft, paused: false,
    });

    checkEndCondition();
  } else {
    ui.updateHUD({
      out: game.spawned, saved: game.savedCount,
      needed: game.level.mustSave, timeLeft: game.timeLeft, paused: true,
    });
  }

  drawFrame();
}

function drawFrame() {
  const camX = camera.x;
  renderer.clear();
  renderer.drawTerrain(game.terrain, camX);

  for (const ent of game.entrances) renderer.drawEntrance(ent, camX);
  for (const ex  of game.exits)     renderer.drawExit(ex, camX);
  for (const tr  of game.traps)     renderer.drawTrap(tr, camX);

  renderer.drawLemmings(game.lemmings, camX);
}

// ── Boot ──────────────────────────────────────────────────────────────
showMenu();
_raf = requestAnimationFrame(loop);
