import { CONFIG } from './config.js';

// Terrain pixel types
export const T_AIR   = 0;
export const T_SOLID = 1;   // destructible
export const T_STEEL = 2;   // indestructible

const W = CONFIG.GAME_WIDTH;
const H = CONFIG.GAME_HEIGHT;

export class Terrain {
  constructor() {
    this.data = new Uint8Array(W * H);
    // Offscreen canvas for rendering
    this.canvas = document.createElement('canvas');
    this.canvas.width  = W;
    this.canvas.height = H;
    this.ctx = this.canvas.getContext('2d');
    this.dirty = true;
  }

  idx(x, y) { return (y | 0) * W + (x | 0); }

  get(x, y) {
    if (x < 0 || x >= W || y < 0 || y >= H) return T_STEEL;
    return this.data[this.idx(x, y)];
  }

  isSolid(x, y) { return this.get(x, y) !== T_AIR; }

  /** Paint a rectangle of terrain */
  fillRect(x, y, w, h, type) {
    x = x | 0; y = y | 0; w = w | 0; h = h | 0;
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        const px = x + dx, py = y + dy;
        if (px >= 0 && px < W && py >= 0 && py < H)
          this.data[this.idx(px, py)] = type;
      }
    }
    this.dirty = true;
  }

  /** Remove (dig) a circle of terrain — skips steel */
  removeCircle(cx, cy, r) {
    const r2 = r * r;
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (dx*dx + dy*dy <= r2) {
          const px = (cx + dx) | 0, py = (cy + dy) | 0;
          if (px >= 0 && px < W && py >= 0 && py < H) {
            if (this.data[this.idx(px, py)] === T_SOLID)
              this.data[this.idx(px, py)] = T_AIR;
          }
        }
      }
    }
    this.dirty = true;
  }

  /** Remove a rectangle — skips steel */
  removeRect(x, y, w, h) {
    x = x | 0; y = y | 0;
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        const px = x + dx, py = y + dy;
        if (px >= 0 && px < W && py >= 0 && py < H) {
          if (this.data[this.idx(px, py)] === T_SOLID)
            this.data[this.idx(px, py)] = T_AIR;
        }
      }
    }
    this.dirty = true;
  }

  /** Add solid terrain (builder bricks) */
  addRect(x, y, w, h) {
    this.fillRect(x, y, w, h, T_SOLID);
  }

  /** Rebuild the offscreen canvas from data array */
  rebuildCanvas(palette) {
    const imgData = this.ctx.createImageData(W, H);
    const d = imgData.data;
    for (let i = 0; i < W * H; i++) {
      const t = this.data[i];
      if (t === T_AIR) continue;
      const col = t === T_STEEL ? palette.steel : palette.solid;
      const p = i * 4;
      d[p]   = col[0];
      d[p+1] = col[1];
      d[p+2] = col[2];
      d[p+3] = 255;
    }
    this.ctx.putImageData(imgData, 0, 0);
    this.dirty = false;
  }

  /** Draw visible portion to main canvas */
  draw(ctx, camX, palette) {
    if (this.dirty) this.rebuildCanvas(palette);
    const srcX = Math.max(0, camX | 0);
    const srcW = Math.min(W - srcX, ctx.canvas.width);
    if (srcW <= 0) return;
    ctx.drawImage(this.canvas, srcX, 0, srcW, H, 0, 0, srcW, H);
  }

  /** Find the ground Y below a point (returns H if nothing found) */
  groundBelow(x, fromY) {
    for (let y = fromY; y < H; y++) {
      if (this.isSolid(x, y)) return y;
    }
    return H;
  }

  /** True if there's solid ground at lemming's feet */
  hasGround(x, y) {
    return this.isSolid(x | 0, (y + 1) | 0);
  }

  /** Clear all data */
  clear() {
    this.data.fill(T_AIR);
    this.dirty = true;
  }
}
