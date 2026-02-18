export class Input {
  constructor(canvas, camera) {
    this.canvas  = canvas;
    this.camera  = camera;
    this.onClick = null;   // callback(worldX, worldY)
    this.scale   = 1;

    // Pan state
    this._panStart   = null;
    this._lastPanX   = 0;
    this._lastTouchX = null;

    // Mouse
    canvas.addEventListener('mousedown', e => this._onDown(e.offsetX, e.offsetY));
    canvas.addEventListener('mousemove', e => {
      if (this._panStart !== null) {
        const dx = this._panStart - e.offsetX;
        this.camera.pan(dx / this.scale);
        this._panStart = e.offsetX;
      }
    });
    canvas.addEventListener('mouseup', e => {
      if (this._panStart !== null && Math.abs(e.offsetX - this._lastPanX) < 5) {
        // It was a click, not a drag
        this._fireClick(e.offsetX, e.offsetY);
      }
      this._panStart = null;
    });
    canvas.addEventListener('mouseleave', () => { this._panStart = null; });

    // Touch
    canvas.addEventListener('touchstart', e => {
      e.preventDefault();
      const t = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = (t.clientX - rect.left);
      const y = (t.clientY - rect.top);
      this._panStart  = x;
      this._lastPanX  = x;
      this._lastTouchX = x;
    }, { passive: false });

    canvas.addEventListener('touchmove', e => {
      e.preventDefault();
      if (e.touches.length === 1) {
        const t = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const x = (t.clientX - rect.left);
        const dx = this._panStart - x;
        this.camera.pan(dx / this.scale);
        this._panStart = x;
      }
    }, { passive: false });

    canvas.addEventListener('touchend', e => {
      e.preventDefault();
      const t = e.changedTouches[0];
      const rect = canvas.getBoundingClientRect();
      const x = (t.clientX - rect.left);
      const y = (t.clientY - rect.top);
      if (Math.abs(x - this._lastTouchX) < 8) {
        this._fireClick(x, y);
      }
      this._panStart = null;
    }, { passive: false });
  }

  setScale(s) { this.scale = s; }

  _onDown(x, y) {
    this._panStart = x;
    this._lastPanX = x;
  }

  _fireClick(sx, sy) {
    if (this.onClick) {
      const wx = this.camera.toWorldX(sx / this.scale);
      const wy = sy / this.scale;
      this.onClick(wx, wy);
    }
  }
}
