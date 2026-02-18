import { CONFIG } from './config.js';

export class Camera {
  constructor() {
    this.x = 0;
    this.viewW = 400;
    this.viewH = CONFIG.GAME_HEIGHT;
  }

  resize(vw, vh) {
    this.viewW = vw;
    this.viewH = vh;
    this.clamp();
  }

  pan(dx) { this.x += dx; this.clamp(); }

  centerOn(wx) {
    this.x = wx - this.viewW / 2;
    this.clamp();
  }

  clamp() {
    const maxX = Math.max(0, CONFIG.GAME_WIDTH - this.viewW);
    this.x = Math.max(0, Math.min(maxX, this.x));
  }

  toScreenX(wx) { return Math.round(wx - this.x); }
  toWorldX(sx)  { return sx + this.x; }
  toWorldY(sy)  { return sy; }

  isVisible(wx, w) {
    return wx + w > this.x && wx < this.x + this.viewW;
  }
}
