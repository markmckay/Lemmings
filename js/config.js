// Game-wide constants
export const CONFIG = {
  GAME_WIDTH:  1600,
  GAME_HEIGHT: 320,

  GRAVITY:       0.3,
  MAX_FALL:      7,
  WALK_SPEED:    1,
  CLIMB_SPEED:   1,
  FLOAT_SPEED:   1.5,
  SPLAT_HEIGHT:  66,   // fall distance that kills

  LEM_W:  8,
  LEM_H: 10,
  STEP_UP_MAX:  6,     // max pixels lemming can step up over

  // Skills
  BOMB_FUSE:    5000,
  BOMB_RADIUS:  12,
  BUILD_STEPS:  12,
  BUILD_STEP_W: 6,
  BUILD_STEP_H: 2,
  BUILD_TICKS:  4,
  BASH_W:       4,
  BASH_H:       9,
  DIG_W:        9,
  MINE_RADIUS:  6,

  // Spawn: ms per lemming at release rate 1; actual = BASE_SPAWN / rate * 100
  BASE_SPAWN: 4000,
};
