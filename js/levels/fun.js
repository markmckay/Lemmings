// Fun levels 1-30
// Each level: { meta, terrain(t), entrance, exits, traps, skills }
// terrain(t) receives a Terrain instance and draws into it
// All coordinates are in game pixels (1600×320)

import { T_SOLID, T_STEEL } from '../terrain.js';

const W = 1600, H = 320;

// Helper to build a standard level object
function lvl(meta, build) {
  return { ...meta, build };
}

export const FUN = [

  /* ── 01: Just Dig! ─────────────────────────────────────────── */
  lvl({
    name: 'Just Dig!', num: 1, category: 'FUN',
    lemmings: 10, mustSave: 10, timeSecs: 7*60, releaseRate: 50,
    skills: { digger: 5 },
    palette: 'dirt',
  }, (t, e, x) => {
    // Ground floor
    t.fillRect(0, 290, W, 30, T_SOLID);
    // Thick top platform with entrance
    t.fillRect(0, 60, W, 40, T_SOLID);
    // Middle platforms (must dig through)
    t.fillRect(0, 140, W, 30, T_SOLID);
    t.fillRect(0, 210, W, 30, T_SOLID);

    e.push({ x: 100, y: 60, w: 24, h: 10 });       // entrance top of top platform
    x.push({ x: 700, y: 272, w: 20, h: 18 });       // exit at ground floor
  }),

  /* ── 02: Only Floaters Can Survive This ─────────────────────── */
  lvl({
    name: 'Only Floaters Can Survive This', num: 2, category: 'FUN',
    lemmings: 10, mustSave: 8, timeSecs: 7*60, releaseRate: 50,
    skills: { floater: 10 },
    palette: 'dirt',
  }, (t, e, x) => {
    // Entrance platform high up
    t.fillRect(0, 30, 300, 20, T_SOLID);
    // Deep shaft — lemmings fall unless floated
    t.fillRect(0, 270, W, 50, T_SOLID);  // ground
    t.fillRect(0,  30, 20, 250, T_SOLID); // left wall
    t.fillRect(280, 30, 20, 250, T_SOLID); // right wall
    // Exit platform
    t.fillRect(400, 270, 200, 20, T_SOLID);

    e.push({ x: 100, y: 30, w: 24, h: 10 });
    x.push({ x: 450, y: 252, w: 20, h: 18 });
  }),

  /* ── 03: Tailor Made For Blockers ───────────────────────────── */
  lvl({
    name: 'Tailor Made For Blockers', num: 3, category: 'FUN',
    lemmings: 50, mustSave: 5, timeSecs: 7*60, releaseRate: 50,
    skills: { blocker: 6, bomber: 2 },
    palette: 'dirt',
  }, (t, e, x) => {
    // Staircase of descending platforms
    t.fillRect(0,   80, 400, 20, T_SOLID);
    t.fillRect(50, 140, 350, 20, T_SOLID);
    t.fillRect(100, 200, 300, 20, T_SOLID);
    t.fillRect(150, 260, 250, 20, T_SOLID);
    // Ground
    t.fillRect(0, 295, W, 25, T_SOLID);
    // Exit area
    t.fillRect(350, 240, 60, 60, T_STEEL);

    e.push({ x: 60, y: 80, w: 24, h: 10 });
    x.push({ x: 360, y: 238, w: 20, h: 18 });
  }),

  /* ── 04: Now Use Miners And Climbers ────────────────────────── */
  lvl({
    name: 'Now Use Miners And Climbers', num: 4, category: 'FUN',
    lemmings: 10, mustSave: 10, timeSecs: 7*60, releaseRate: 50,
    skills: { climber: 10, miner: 5 },
    palette: 'brick',
  }, (t, e, x) => {
    // Wide top platform
    t.fillRect(0, 50, W, 30, T_SOLID);
    // Tall vertical wall in middle
    t.fillRect(700, 50, 30, 220, T_SOLID);
    // Ground
    t.fillRect(0, 270, W, 50, T_SOLID);
    // Exit is past the wall
    e.push({ x: 100, y: 50, w: 24, h: 10 });
    x.push({ x: 900, y: 252, w: 20, h: 18 });
  }),

  /* ── 05: You Need Bashers This Time ─────────────────────────── */
  lvl({
    name: 'You Need Bashers This Time', num: 5, category: 'FUN',
    lemmings: 50, mustSave: 5, timeSecs: 7*60, releaseRate: 50,
    skills: { basher: 10 },
    palette: 'dirt',
  }, (t, e, x) => {
    // Ground with three thick walls to bash through
    t.fillRect(0, 260, W, 60, T_SOLID);
    t.fillRect(300, 200, 40, 60, T_SOLID);
    t.fillRect(600, 200, 40, 60, T_SOLID);
    t.fillRect(900, 200, 40, 60, T_SOLID);
    // Entrance platform
    t.fillRect(0, 200, 300, 20, T_SOLID);

    e.push({ x: 80, y: 200, w: 24, h: 10 });
    x.push({ x: 1100, y: 242, w: 20, h: 18 });
  }),

  /* ── 06: A Task For Blockers and Bombers ────────────────────── */
  lvl({
    name: 'A Task For Blockers and Bombers', num: 6, category: 'FUN',
    lemmings: 50, mustSave: 10, timeSecs: 7*60, releaseRate: 50,
    skills: { blocker: 4, bomber: 4 },
    palette: 'dirt',
  }, (t, e, x) => {
    // Long top platform with thin spots
    t.fillRect(0, 40, W, 20, T_SOLID);
    // Middle platform with wall
    t.fillRect(0, 160, 800, 20, T_SOLID);
    t.fillRect(500, 120, 20, 60, T_SOLID); // wall to blow up
    // Ground
    t.fillRect(0, 285, W, 35, T_SOLID);

    e.push({ x: 80, y: 40, w: 24, h: 10 });
    x.push({ x: 700, y: 267, w: 20, h: 18 });
  }),

  /* ── 07: Builders Will Help You Here ────────────────────────── */
  lvl({
    name: 'Builders Will Help You Here', num: 7, category: 'FUN',
    lemmings: 50, mustSave: 25, timeSecs: 7*60, releaseRate: 50,
    skills: { builder: 15 },
    palette: 'dirt',
  }, (t, e, x) => {
    // Platforms with gaps to bridge
    t.fillRect(0,  200, 200, 20, T_SOLID);
    // Gap of 80px
    t.fillRect(280, 200, 200, 20, T_SOLID);
    // Gap of 80px
    t.fillRect(560, 200, 200, 20, T_SOLID);
    // Small step up
    t.fillRect(760, 180, 200, 40, T_SOLID);
    // Gap
    t.fillRect(960, 160, 200, 60, T_SOLID);
    // Exit platform
    t.fillRect(1160, 140, 200, 80, T_SOLID);
    // Ground
    t.fillRect(0, 290, W, 30, T_SOLID);

    e.push({ x: 60, y: 200, w: 24, h: 10 });
    x.push({ x: 1220, y: 122, w: 20, h: 18 });
  }),

  /* ── 08: Not As Complicated As It Looks ─────────────────────── */
  lvl({
    name: 'Not As Complicated As It Looks', num: 8, category: 'FUN',
    lemmings: 100, mustSave: 95, timeSecs: 7*60, releaseRate: 50,
    skills: { blocker: 3 },
    palette: 'snow',
  }, (t, e, x) => {
    // Simple U shape — lemmings enter top right, exit top left
    t.fillRect(0, 260, W, 60, T_SOLID);
    t.fillRect(0, 100, 200, 170, T_SOLID); // left wall
    t.fillRect(1400, 100, 200, 170, T_SOLID); // right wall
    // Entrance platform
    t.fillRect(1200, 100, 200, 20, T_SOLID);

    e.push({ x: 1250, y: 100, w: 24, h: 10 });
    x.push({ x: 60, y: 82, w: 20, h: 18 });
  }),

  /* ── 09: As Long As You Try Your Best ───────────────────────── */
  lvl({
    name: 'As Long As You Try Your Best', num: 9, category: 'FUN',
    lemmings: 100, mustSave: 90, timeSecs: 7*60, releaseRate: 50,
    skills: { basher: 5, blocker: 3 },
    palette: 'dirt',
  }, (t, e, x) => {
    // Long corridor with pillar in middle and blades at end
    t.fillRect(0, 200, W, 20, T_SOLID);  // floor
    t.fillRect(0, 140, W, 20, T_SOLID);  // ceiling
    t.fillRect(600, 140, 40, 80, T_SOLID); // pillar to bash
    // Traps (drawn as red rectangles in renderer)
    t.fillRect(1350, 180, 20, 20, T_STEEL); // blade trap marker

    e.push({ x: 60, y: 140, w: 24, h: 10 });
    x.push({ x: 1450, y: 182, w: 20, h: 18 });
  }),

  /* ── 10: Smile If You Love Lemmings ─────────────────────────── */
  lvl({
    name: 'Smile If You Love Lemmings', num: 10, category: 'FUN',
    lemmings: 20, mustSave: 10, timeSecs: 7*60, releaseRate: 50,
    skills: { floater: 20, blocker: 2 },
    palette: 'dirt',
  }, (t, e, x) => {
    // Platform up high, long drop, exit at bottom right
    t.fillRect(0, 60, 400, 20, T_SOLID);
    t.fillRect(0, 280, W, 40, T_SOLID);
    // Exit platform raised slightly
    t.fillRect(900, 260, 300, 20, T_SOLID);

    e.push({ x: 100, y: 60, w: 24, h: 10 });
    x.push({ x: 1000, y: 242, w: 20, h: 18 });
  }),

  /* ── 11: Keep Your Hair On Mr. Lemming ──────────────────────── */
  lvl({
    name: 'Keep Your Hair On Mr. Lemming', num: 11, category: 'FUN',
    lemmings: 60, mustSave: 50, timeSecs: 7*60, releaseRate: 50,
    skills: { climber: 5, floater: 5, blocker: 2, basher: 3 },
    palette: 'brick',
  }, (t, e, x) => {
    // One-way wall (use steel as visual, but actually diggable from one side only — simulate with solid)
    t.fillRect(0, 200, W, 20, T_SOLID);
    t.fillRect(700, 60, 30, 160, T_SOLID);  // one-way wall
    t.fillRect(0, 270, W, 50, T_SOLID);

    e.push({ x: 100, y: 200, w: 24, h: 10 });
    x.push({ x: 1100, y: 252, w: 20, h: 18 });
  }),

  /* ── 12: Patience ────────────────────────────────────────────── */
  lvl({
    name: 'Patience', num: 12, category: 'FUN',
    lemmings: 80, mustSave: 40, timeSecs: 7*60, releaseRate: 50,
    skills: { climber: 20, floater: 20, basher: 5, builder: 10 },
    palette: 'dirt',
  }, (t, e, x) => {
    // Tall wall, then a well
    t.fillRect(0, 100, W, 20, T_SOLID);
    t.fillRect(800, 60, 20, 200, T_SOLID);  // tall wall
    // Well
    t.fillRect(1000, 120, 20, 160, T_SOLID); // left well wall
    t.fillRect(1100, 120, 20, 160, T_SOLID); // right well wall
    t.fillRect(1000, 270, 120, 20, T_SOLID); // well bottom
    t.fillRect(0, 285, W, 35, T_SOLID);

    e.push({ x: 100, y: 100, w: 24, h: 10 });
    x.push({ x: 1300, y: 267, w: 20, h: 18 });
  }),

  /* ── 13: We All Fall Down ────────────────────────────────────── */
  lvl({
    name: 'We All Fall Down', num: 13, category: 'FUN',
    lemmings: 10, mustSave: 10, timeSecs: 4*60, releaseRate: 50,
    skills: { digger: 10 },
    palette: 'snow',
  }, (t, e, x) => {
    // Shelves — dig through each
    t.fillRect(0, 80,  W, 15, T_SOLID);
    t.fillRect(0, 140, W, 15, T_SOLID);
    t.fillRect(0, 200, W, 15, T_SOLID);
    t.fillRect(0, 275, W, 45, T_SOLID);

    e.push({ x: 400, y: 80, w: 24, h: 10 });
    x.push({ x: 700, y: 257, w: 20, h: 18 });
  }),

  /* ── 14: Origins and Lemmings ───────────────────────────────── */
  lvl({
    name: 'Origins and Lemmings', num: 14, category: 'FUN',
    lemmings: 80, mustSave: 60, timeSecs: 8*60, releaseRate: 50,
    skills: { climber: 5, miner: 5, builder: 10, blocker: 3 },
    palette: 'dirt',
  }, (t, e, x) => {
    // Multiple pillars
    t.fillRect(0, 240, W, 80, T_SOLID);
    t.fillRect(0, 60, 300, 20, T_SOLID);
    for (let px of [300, 550, 800, 1050]) {
      t.fillRect(px, 60, 20, 190, T_SOLID);
    }

    e.push({ x: 60, y: 60, w: 24, h: 10 });
    x.push({ x: 1200, y: 222, w: 20, h: 18 });
  }),

  /* ── 15: Don't Let Your Eyes Deceive You ────────────────────── */
  lvl({
    name: "Don't Let Your Eyes Deceive You", num: 15, category: 'FUN',
    lemmings: 100, mustSave: 80, timeSecs: 11*60, releaseRate: 50,
    skills: { builder: 20, basher: 5, blocker: 2 },
    palette: 'crystal',
  }, (t, e, x) => {
    // Three pillars then gap with trap, then exit up high
    t.fillRect(0, 220, 200, 100, T_SOLID);
    t.fillRect(300, 220, 30, 100, T_SOLID);
    t.fillRect(500, 220, 30, 100, T_SOLID);
    t.fillRect(700, 220, 30, 100, T_SOLID);
    // Gap with trap
    t.fillRect(900, 270, 100, 20, T_STEEL); // trap
    t.fillRect(1050, 160, 300, 20, T_SOLID); // exit platform high up
    t.fillRect(0, 300, W, 20, T_SOLID);

    e.push({ x: 60, y: 220, w: 24, h: 10 });
    x.push({ x: 1150, y: 142, w: 20, h: 18 });
  }),

  /* ── 16: Don't Do Anything Too Hasty ───────────────────────── */
  lvl({
    name: "Don't Do Anything Too Hasty", num: 16, category: 'FUN',
    lemmings: 80, mustSave: 50, timeSecs: 11*60, releaseRate: 50,
    skills: { builder: 20, blocker: 3, bomber: 2 },
    palette: 'brick',
  }, (t, e, x) => {
    // Platform high up, long gap to exit platform
    t.fillRect(0, 80, 200, 20, T_SOLID);
    t.fillRect(0, 120, 30, 200, T_SOLID); // left wall
    t.fillRect(800, 80, 600, 20, T_SOLID); // exit side platform
    t.fillRect(0, 295, W, 25, T_SOLID);

    e.push({ x: 60, y: 80, w: 24, h: 10 });
    x.push({ x: 1200, y: 62, w: 20, h: 18 });
  }),

  /* ── 17: Easy When You Know How ────────────────────────────── */
  lvl({
    name: 'Easy When You Know How', num: 17, category: 'FUN',
    lemmings: 50, mustSave: 20, timeSecs: 7*60, releaseRate: 50,
    skills: { floater: 20, basher: 5, builder: 5 },
    palette: 'dirt',
  }, (t, e, x) => {
    // Platform, drop, pillar, crusher trap, exit
    t.fillRect(0, 60, 300, 20, T_SOLID);
    t.fillRect(400, 60, 20, 210, T_SOLID); // pillar
    t.fillRect(600, 270, 20, 30, T_STEEL); // crusher trap
    t.fillRect(650, 260, 300, 20, T_SOLID);
    t.fillRect(0, 280, W, 40, T_SOLID);

    e.push({ x: 80, y: 60, w: 24, h: 10 });
    x.push({ x: 700, y: 242, w: 20, h: 18 });
  }),

  /* ── 18: Let's Block and Blow ───────────────────────────────── */
  lvl({
    name: "Let's Block and Blow", num: 18, category: 'FUN',
    lemmings: 70, mustSave: 50, timeSecs: 7*60, releaseRate: 50,
    skills: { blocker: 4, bomber: 4 },
    palette: 'dirt',
  }, (t, e, x) => {
    // Long platform with thin floor sections to blow holes in
    t.fillRect(0, 100, W, 30, T_SOLID); // top
    t.fillRect(0, 200, W, 30, T_SOLID); // middle
    t.fillRect(0, 285, W, 35, T_SOLID); // bottom

    e.push({ x: 100, y: 100, w: 24, h: 10 });
    x.push({ x: 1300, y: 267, w: 20, h: 18 });
  }),

  /* ── 19: Take Good Care of My Lemmings ─────────────────────── */
  lvl({
    name: 'Take Good Care of My Lemmings', num: 19, category: 'FUN',
    lemmings: 100, mustSave: 70, timeSecs: 7*60, releaseRate: 50,
    skills: { builder: 15, blocker: 3, bomber: 2 },
    palette: 'snow',
  }, (t, e, x) => {
    // Arched ceiling, ramp up to exit
    t.fillRect(0, 200, W, 20, T_SOLID); // floor
    // Three arches — wide gaps
    for (let ax of [100, 400, 700]) {
      t.fillRect(ax, 100, 20, 100, T_SOLID);
      t.fillRect(ax + 100, 100, 20, 100, T_SOLID);
    }
    t.fillRect(950, 160, 400, 20, T_SOLID); // ramp platform
    t.fillRect(0, 285, W, 35, T_SOLID);

    e.push({ x: 80, y: 200, w: 24, h: 10 });
    x.push({ x: 1100, y: 142, w: 20, h: 18 });
  }),

  /* ── 20: We Are Now At LEMCON ONE ───────────────────────────── */
  lvl({
    name: 'We Are Now At LEMCON ONE', num: 20, category: 'FUN',
    lemmings: 50, mustSave: 30, timeSecs: 7*60, releaseRate: 50,
    skills: { builder: 15, basher: 5, blocker: 3, bomber: 2 },
    palette: 'brick',
  }, (t, e, x) => {
    t.fillRect(0, 120, 200, 20, T_SOLID);
    // Gap
    t.fillRect(300, 100, 20, 220, T_SOLID); // post
    // Wooden poles (thin walls)
    for (let px = 400; px < 800; px += 50) {
      t.fillRect(px, 100, 8, 120, T_SOLID);
    }
    t.fillRect(800, 100, 400, 20, T_SOLID); // exit side
    t.fillRect(0, 285, W, 35, T_SOLID);

    e.push({ x: 60, y: 120, w: 24, h: 10 });
    x.push({ x: 1000, y: 82, w: 20, h: 18 });
  }),

  /* ── 21-30: Additional Fun levels (simpler terrain) ─────────── */
  lvl({
    name: 'You Live and Lem', num: 21, category: 'FUN',
    lemmings: 100, mustSave: 60, timeSecs: 11*60, releaseRate: 50,
    skills: { basher: 5, builder: 5, blocker: 2 },
    palette: 'dirt',
  }, (t, e, x) => {
    // Dinosaur fossil silhouette — stylised
    t.fillRect(0, 280, W, 40, T_SOLID);
    t.fillRect(0, 80, 200, 20, T_SOLID);
    // Spine wall
    t.fillRect(400, 80, 30, 140, T_SOLID);
    // Snap trap
    t.fillRect(700, 258, 30, 22, T_STEEL);
    // Rib wall
    t.fillRect(900, 80, 30, 140, T_SOLID);

    e.push({ x: 80, y: 80, w: 24, h: 10 });
    x.push({ x: 1100, y: 262, w: 20, h: 18 });
  }),

  lvl({
    name: 'A Beast of a Level', num: 22, category: 'FUN',
    lemmings: 100, mustSave: 80, timeSecs: 11*60, releaseRate: 50,
    skills: { basher: 6, builder: 20, blocker: 3, bomber: 2 },
    palette: 'crystal',
  }, (t, e, x) => {
    t.fillRect(0, 200, W, 20, T_SOLID);
    // Tree stumps
    for (let tx = 200; tx < 900; tx += 100) {
      t.fillRect(tx, 120, 20, 100, T_SOLID);
    }
    // Big rock for exit
    t.fillRect(1100, 100, 200, 120, T_SOLID);
    t.fillRect(0, 290, W, 30, T_SOLID);

    e.push({ x: 60, y: 200, w: 24, h: 10 });
    x.push({ x: 1150, y: 82, w: 20, h: 18 });
  }),

  lvl({
    name: "I've Lost That Lemming Feeling", num: 23, category: 'FUN',
    lemmings: 80, mustSave: 20, timeSecs: 11*60, releaseRate: 50,
    skills: { blocker: 2, basher: 5, builder: 5 },
    palette: 'dirt',
  }, (t, e, x) => {
    t.fillRect(0, 120, 200, 20, T_SOLID);
    // Horizontal tunnel with holes
    t.fillRect(0, 100, W, 10, T_SOLID); // ceiling
    t.fillRect(0, 220, W, 10, T_SOLID); // floor
    for (let hx = 300; hx < 1400; hx += 180) {
      // leave gap in floor
    }
    t.fillRect(0, 285, W, 35, T_SOLID);

    e.push({ x: 60, y: 120, w: 24, h: 10 });
    x.push({ x: 1400, y: 267, w: 20, h: 18 });
  }),

  lvl({
    name: 'Konbanwa Lemming San', num: 24, category: 'FUN',
    lemmings: 30, mustSave: 20, timeSecs: 7*60, releaseRate: 50,
    skills: { digger: 5, basher: 5 },
    palette: 'brick',
  }, (t, e, x) => {
    t.fillRect(0, 80, 400, 20, T_SOLID);
    // One-way block
    t.fillRect(500, 60, 40, 220, T_SOLID);
    // Steps
    t.fillRect(600, 180, W-600, 20, T_SOLID);
    t.fillRect(0, 285, W, 35, T_SOLID);
    // Crusher trap
    t.fillRect(700, 160, 30, 20, T_STEEL);

    e.push({ x: 100, y: 80, w: 24, h: 10 });
    x.push({ x: 1300, y: 162, w: 20, h: 18 });
  }),

  lvl({
    name: 'Lemmings Lemmings Everywhere', num: 25, category: 'FUN',
    lemmings: 100, mustSave: 50, timeSecs: 7*60, releaseRate: 99,
    skills: { basher: 8, digger: 3 },
    palette: 'snow',
  }, (t, e, x) => {
    // Net ramp up then walls
    t.fillRect(0, 280, W, 40, T_SOLID);
    // Sloped net (simulate with steps)
    for (let s = 0; s < 20; s++) {
      t.fillRect(s * 30, 280 - s * 8, 32, 8, T_SOLID);
    }
    t.fillRect(700, 100, 30, 180, T_SOLID);
    t.fillRect(900, 100, 30, 180, T_SOLID);

    e.push({ x: 60, y: 280, w: 24, h: 10 });
    x.push({ x: 1100, y: 262, w: 20, h: 18 });
  }),

  lvl({
    name: 'Nightmare on Lem Street', num: 26, category: 'FUN',
    lemmings: 2, mustSave: 2, timeSecs: 7*60, releaseRate: 50,
    skills: { builder: 20 },
    palette: 'brick',
  }, (t, e, x) => {
    // Only 2 lemmings, must build stairs up
    t.fillRect(0, 200, 200, 20, T_SOLID);
    t.fillRect(200, 160, 200, 20, T_SOLID);
    t.fillRect(400, 120, 200, 20, T_SOLID);
    t.fillRect(600, 80, 200, 20, T_SOLID);
    t.fillRect(0, 290, W, 30, T_SOLID);

    e.push({ x: 60, y: 200, w: 24, h: 10 });
    x.push({ x: 660, y: 62, w: 20, h: 18 });
  }),

  lvl({
    name: "Let's Be Careful Out There", num: 27, category: 'FUN',
    lemmings: 50, mustSave: 25, timeSecs: 7*60, releaseRate: 1,
    skills: { floater: 20, builder: 15, blocker: 4 },
    palette: 'dirt',
  }, (t, e, x) => {
    t.fillRect(0, 100, 200, 20, T_SOLID);
    // Leaning pillar (staircase)
    for (let s = 0; s < 8; s++) {
      t.fillRect(200 + s*30, 100 + s*20, 30, 20, T_SOLID);
    }
    t.fillRect(600, 260, 400, 20, T_SOLID);
    t.fillRect(0, 285, W, 35, T_SOLID);

    e.push({ x: 60, y: 100, w: 24, h: 10 });
    x.push({ x: 800, y: 242, w: 20, h: 18 });
  }),

  lvl({
    name: 'If Only They Could Fly', num: 28, category: 'FUN',
    lemmings: 100, mustSave: 80, timeSecs: 7*60, releaseRate: 50,
    skills: { digger: 5, builder: 20, blocker: 3, bomber: 2 },
    palette: 'crystal',
  }, (t, e, x) => {
    // Ladder structure
    for (let s = 0; s < 6; s++) {
      t.fillRect(60, 60 + s*30, 200, 8, T_SOLID);
    }
    t.fillRect(60, 60, 8, 200, T_SOLID);
    t.fillRect(252, 60, 8, 200, T_SOLID);
    // Floating platform
    t.fillRect(300, 140, 300, 20, T_SOLID);
    t.fillRect(650, 80, 300, 20, T_SOLID);
    t.fillRect(0, 285, W, 35, T_SOLID);

    e.push({ x: 100, y: 60, w: 24, h: 10 });
    x.push({ x: 700, y: 62, w: 20, h: 18 });
  }),

  lvl({
    name: 'Worra Lorra Lemmings', num: 29, category: 'FUN',
    lemmings: 100, mustSave: 60, timeSecs: 11*60, releaseRate: 50,
    skills: { climber: 3, basher: 5, builder: 10, blocker: 3, bomber: 2, digger: 2 },
    palette: 'dirt',
  }, (t, e, x) => {
    t.fillRect(0, 100, 200, 20, T_SOLID);
    // Well
    t.fillRect(200, 100, 10, 180, T_SOLID);
    t.fillRect(350, 100, 10, 180, T_SOLID);
    t.fillRect(200, 270, 160, 15, T_SOLID);
    // Wooden plank
    t.fillRect(380, 180, 10, 110, T_SOLID);
    // Pyramid
    t.fillRect(400, 80, 200, 80, T_SOLID);
    t.fillRect(420, 60, 160, 80, T_SOLID);
    t.fillRect(440, 40, 120, 80, T_SOLID);
    // Exit high
    t.fillRect(700, 40, 200, 20, T_SOLID);
    t.fillRect(0, 285, W, 35, T_SOLID);

    e.push({ x: 60, y: 100, w: 24, h: 10 });
    x.push({ x: 760, y: 22, w: 20, h: 18 });
  }),

  lvl({
    name: 'Lock Up Your Lemmings', num: 30, category: 'FUN',
    lemmings: 60, mustSave: 40, timeSecs: 7*60, releaseRate: 10,
    skills: { basher: 3, digger: 2, blocker: 2 },
    palette: 'brick',
  }, (t, e, x) => {
    // Enclosed chamber
    t.fillRect(100, 100, 400, 20, T_SOLID); // top
    t.fillRect(100, 260, 400, 20, T_SOLID); // floor
    t.fillRect(100, 100, 20, 180, T_SOLID); // left
    t.fillRect(480, 100, 20, 180, T_SOLID); // right
    // Partition inside
    t.fillRect(280, 120, 20, 140, T_SOLID);
    // Metal base
    t.fillRect(150, 250, 50, 10, T_STEEL);
    t.fillRect(300, 250, 50, 10, T_STEEL);
    // Exit
    t.fillRect(0, 285, W, 35, T_SOLID);

    e.push({ x: 180, y: 100, w: 24, h: 10 });
    x.push({ x: 700, y: 267, w: 20, h: 18 });
  }),
];
