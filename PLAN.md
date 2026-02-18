# Lemmings Game — Build Plan
## Branch: `claude/winnings-game-rebuild-bM9RE`

---

## 1. Tech Stack Decisions

| Concern | Choice | Reason |
|---|---|---|
| Rendering | HTML5 Canvas 2D | Native, fast, works on Safari/iOS with zero deps |
| Language | Vanilla JS (ES6 modules) | No build step, loads instantly, universal support |
| Sprites | Online fan-made sprite sheets | Search `lemmings sprite sheet PNG lemming animations` |
| Audio | Web Audio API (optional) | Simple beeps/tones if sprite sound not found |
| Layout | CSS responsive + viewport meta | Fills iPhone/iPad screen edge-to-edge |
| Touch | Touch Events API | Tap to assign skill, drag to scroll level |

---

## 2. Project File Structure

```
/Lemmings/
├── index.html              ← Entry point, loads everything
├── css/
│   └── style.css           ← Responsive layout, toolbar styling
├── js/
│   ├── config.js           ← Constants (SCALE, GRAVITY, TILE, speeds…)
│   ├── terrain.js          ← Destructible pixel bitmap (Uint8ClampedArray)
│   ├── lemming.js          ← Lemming class + full state machine
│   ├── skills.js           ← All 8 skill behaviors (separate, testable)
│   ├── renderer.js         ← Canvas drawing pipeline
│   ├── camera.js           ← Scrollable viewport (pan, clamp)
│   ├── input.js            ← Mouse + touch unified input handler
│   ├── ui.js               ← Toolbar, HUD, menus, skill selector
│   ├── audio.js            ← Web Audio API sound effects
│   ├── main.js             ← Game loop, state machine, wires all modules
│   └── levels/
│       ├── fun.js          ← 30 Fun levels (terrain functions + meta)
│       ├── tricky.js       ← 30 Tricky levels
│       ├── taxing.js       ← 30 Taxing levels (stubs OK)
│       └── mayhem.js       ← 30 Mayhem levels (stubs OK)
└── assets/
    └── sprites/            ← Downloaded sprite sheets go here
```

---

## 3. Milestones & User Stories

### MILESTONE 0 — Repo & Sprites (Parallel, ~15 min)
Run two agents simultaneously:

**Agent A — Project Scaffold**
- Create all files with skeleton structure
- `index.html` with canvas, meta viewport, script imports
- `css/style.css` responsive layout, dark toolbar at bottom
- `config.js` with all constants
- Git commit: `chore: scaffold project structure`

**Agent B — Sprite Research**
- Search web for: `lemmings sprites png sheet classic 1991`
- Search for: `lemmings lemming walk sprite sheet pixel art`
- Identify 1-2 usable sprite sheets (fan-made, open)
- If none found → generate sprites programmatically (draw with Canvas 2D shapes — green hair, blue body, ~8×10px lemmings)
- Document sprite sheet layout in `assets/sprites/README.md`

---

### MILESTONE 1 — Terrain Engine (Sequential)
**Commit after:** `feat: destructible terrain system`

**US-T1**: Terrain stored as a `Uint8Array` pixel bitmap (1 = solid, 0 = air)
**US-T2**: Terrain can be drawn to canvas using putImageData
**US-T3**: A `removeTerrain(x, y, radius)` function removes pixels from the bitmap
**US-T4**: A `terrainAt(x, y)` function returns whether pixel is solid
**US-T5**: Level 1 terrain defined (simple high platform, gap, exit at bottom)

---

### MILESTONE 2 — Core Game Loop & Camera
**Commit after:** `feat: game loop, camera, and input system`

**US-C1**: `requestAnimationFrame` loop runs at target 60fps
**US-C2**: Fixed timestep update (16.67ms), separate render step
**US-C3**: Camera object tracks scroll offset (x only for Level 1)
**US-C4**: Camera can be dragged with mouse / touch on mobile
**US-C5**: Level wider than screen scrolls smoothly
**US-C6**: Mouse click world-position = screen position + camera offset

---

### MILESTONE 3 — Lemming Entity & Physics
**Commit after:** `feat: lemming entity, physics, and state machine`

**US-L1**: Lemming class: `x, y, vx, vy, dir, state, skills[]`
**US-L2**: Gravity applied each tick, lemming falls if no terrain below
**US-L3**: Walking: advance by 2px/tick, check 3px ahead for wall (turn if wall ≤ 4px high), step up ≤ 8px slopes
**US-L4**: Falling: track fall distance; if > SPLAT_HEIGHT → die; if ≤ → land, continue walking
**US-L5**: Lemmings spawn from entrance hatch at `releaseRate` interval
**US-L6**: Lemmings reaching exit tile are removed and counted as saved
**US-L7**: Lemming sprite animates through walk/fall frames

---

### MILESTONE 4 — All 8 Skills
**Commit after:** `feat: all 8 lemming skills implemented`

Each skill implemented in `skills.js` as a separate update function called by the lemming's state machine:

| Skill | Behaviour |
|---|---|
| **Digger** | Each tick: remove terrain 5px wide below lemming, move down; stop when no terrain below to remove |
| **Basher** | Each tick: remove terrain 9px tall × 3px deep in direction faced; stop if no wall ahead |
| **Miner** | Each tick: remove terrain in diagonal arc (~20°), advance diagonally |
| **Builder** | Place one brick (6×2px terrain) every 4 ticks, advance 2px; after 12 bricks stop and walk; flash warning at brick 10 |
| **Climber** | Permanent: when walking into wall, enter climb state; move up 2px/tick; if overhang → fall |
| **Floater** | Permanent: when falling > 16px, open umbrella; terminal velocity capped at 1px/tick |
| **Blocker** | Stand still; any lemming colliding with blocker reverses direction |
| **Bomber** | Countdown 5 seconds shown above head; on 0: remove circular terrain chunk (radius ~8px), kill lemming |

**US-S1**: Each skill has a count shown in UI; decrements on assign
**US-S2**: Climber + Floater are permanent (shown with coloured hair/umbrella)
**US-S3**: Cannot assign skill if count = 0
**US-S4**: Builder flashes "CHINK" warning at step 10

---

### MILESTONE 5 — UI Toolbar & HUD
**Commit after:** `feat: game UI toolbar and HUD`

**US-U1**: Bottom toolbar: 8 skill icons in a row, each showing count
**US-U2**: Tapping a skill selects it (highlighted border)
**US-U3**: Selected skill cursor shown when hovering over lemmings
**US-U4**: Tapping a lemming while a skill selected → assigns if count > 0
**US-U5**: HUD top bar: `OUT: n  IN: n  SAVED: n / NEEDED: n  TIME: mm:ss`
**US-U6**: Release rate display with `+` / `-` buttons (min = level default, max = 99)
**US-U7**: Nuke button (kill all, restart level)
**US-U8**: Pause button (pause/resume)
**US-U9**: Win screen: show % saved, "Next Level" button
**US-U10**: Fail screen: show result, "Retry" button

---

### MILESTONE 6 — Level 1: "Just Dig!"
**Commit after:** `feat: Level 1 Just Dig playable end-to-end`

**Level Data:**
```
Name:          Just Dig!
Category:      Fun
Lemmings:      10
Must Save:     10 (100%)  ← guide says "10 must save" of 10 total
Time:          7 minutes
Release Rate:  50
Skills:        Digger x5, (rest x0)
```

**Terrain Design (Just Dig!):**
- Wide solid platform at y=80 (entrance trap door drops here)
- Small ledge gaps below, staggered
- Exit door at ground level y=300
- Lemmings must be assigned Digger to tunnel through platforms

**US-1**: Player can complete Level 1 by assigning diggers to lemmings
**US-2**: Timer counts down from 7:00
**US-3**: Win triggers when ≥10 lemmings saved before timer
**US-4**: Fail triggers if timer reaches 0 with too few saved, or all die

---

### MILESTONE 7 — Mobile Polish
**Commit after:** `feat: mobile touch controls and responsive layout`

**US-M1**: `<meta name="viewport" content="width=device-width, initial-scale=1">` prevents zoom issues
**US-M2**: Canvas fills full screen; letterboxed if needed
**US-M3**: Toolbar icons are ≥ 44px (Apple HIG minimum touch target)
**US-M4**: Two-finger drag scrolls the level (single finger taps lemmings/skills)
**US-M5**: Pinch gesture does NOT zoom page (preventDefault on touchmove)
**US-M6**: Works in Safari iOS, Chrome iOS, Chrome Android

---

### MILESTONE 8 — Level Select & Fun Category Stubs
**Commit after:** `feat: level select screen and Fun levels 1-10`

**US-LS1**: Main menu with "Play", level category selector
**US-LS2**: Level select grid (30 levels, locked until previous completed)
**US-LS3**: Levels 1-5 fully designed (based on walkthrough descriptions)
**US-LS4**: Levels 6-30 stubbed with correct meta + simple terrain
**US-LS5**: After completing Level 1, Level 2 unlocks

---

## 4. Parallel Agent Execution Plan

Once approved, work proceeds in **waves**:

```
WAVE 1 (Parallel — 2 agents):
  Agent A → Milestone 0A (scaffold) + Milestone 1 (terrain)
  Agent B → Milestone 0B (sprites) + Milestone 2 (game loop)

WAVE 2 (Sequential — main agent):
  Milestone 3 (lemmings) — depends on terrain + loop being done

WAVE 3 (Parallel — 2 agents):
  Agent A → Milestone 4 (skills)
  Agent B → Milestone 5 (UI)

WAVE 4 (Sequential — main agent):
  Milestone 6 (Level 1 wired end-to-end)
  Milestone 7 (mobile polish)
  Milestone 8 (level select + more levels)
```

---

## 5. Stop Conditions (ask for user feedback if):

1. Sprite sheets can't be found online after 2 searches → use procedural sprites
2. Any agent fails the same task twice → stop, report, ask for direction
3. A lemming physics bug can't be resolved in 2 debug passes → simplify the problematic mechanic and flag it
4. File conflicts between parallel agents → main agent resolves manually
5. Token budget concern → complete current milestone, commit/push, report progress

---

## 6. Commit Strategy

| After | Commit message |
|---|---|
| Scaffold | `chore: scaffold project structure` |
| Terrain | `feat: destructible terrain bitmap system` |
| Game loop | `feat: game loop, camera, and input handling` |
| Lemmings | `feat: lemming entity physics and state machine` |
| Skills | `feat: all 8 lemming skills` |
| UI | `feat: toolbar, HUD, win/lose screens` |
| Level 1 | `feat: Level 1 Just Dig — fully playable` |
| Mobile | `feat: mobile touch controls and responsive scaling` |
| Levels | `feat: level select and Fun levels 1-10` |

All pushes → `git push -u origin claude/winnings-game-rebuild-bM9RE`

---

## 7. Scope for THIS Session (MVP)

Focus: **Level 1 fully playable in browser/iOS**

- ✅ Destructible terrain
- ✅ Walking, falling, splat lemmings
- ✅ Digger skill (the only one needed for Level 1)
- ✅ Entrance hatch + exit door
- ✅ Timer + HUD
- ✅ Win/Lose screen
- ✅ Mobile touch support
- ✅ Committed and pushed

Stretch (if time allows):
- ⬜ Builder + Blocker (needed for Level 3, 7)
- ⬜ All 8 skills
- ⬜ Levels 2-5

---

## 8. Questions Before Starting

None — all requirements are clear. Awaiting your approval to begin.
