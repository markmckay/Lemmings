// UI: toolbar skill buttons, HUD updates, overlays

const SKILLS = [
  { id: 'climber', label: 'CLIMB' },
  { id: 'floater', label: 'FLOAT' },
  { id: 'bomber',  label: 'BOMB'  },
  { id: 'blocker', label: 'BLOCK' },
  { id: 'builder', label: 'BUILD' },
  { id: 'basher',  label: 'BASH'  },
  { id: 'miner',   label: 'MINE'  },
  { id: 'digger',  label: 'DIG'   },
];

// Draw each skill as a mini canvas icon
function drawSkillIcon(canvas, skillId) {
  const ctx = canvas.getContext('2d');
  canvas.width = 30; canvas.height = 30;
  ctx.clearRect(0, 0, 30, 30);
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, 30, 30);

  // Simple pixel icons for each skill
  const icons = {
    climber: () => {
      // Lemming hugging wall
      ctx.fillStyle = '#4488ff'; ctx.fillRect(8, 10, 6, 10);
      ctx.fillStyle = '#ffcc88'; ctx.fillRect(8, 6, 6, 5);
      ctx.fillStyle = '#ff8800'; ctx.fillRect(8, 4, 6, 3);
      ctx.fillStyle = '#888';    ctx.fillRect(16, 4, 4, 20);
      ctx.fillStyle = '#ffcc88'; ctx.fillRect(14, 10, 3, 2);
    },
    floater: () => {
      // Umbrella
      ctx.fillStyle = '#ff4488';
      ctx.beginPath(); ctx.arc(15, 10, 9, Math.PI, 2*Math.PI); ctx.fill();
      ctx.strokeStyle = '#ccc'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(7,10); ctx.lineTo(15,18); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(23,10); ctx.lineTo(15,18); ctx.stroke();
      ctx.fillStyle = '#4488ff'; ctx.fillRect(12, 18, 6, 8);
    },
    bomber: () => {
      ctx.fillStyle = '#333'; ctx.beginPath(); ctx.arc(15,16,8,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = '#f44'; ctx.fillRect(14,6,3,5);
      ctx.strokeStyle = '#ff8'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(15,6); ctx.lineTo(20,2); ctx.stroke();
      ctx.fillStyle = '#ff8'; ctx.beginPath(); ctx.arc(20,2,2,0,Math.PI*2); ctx.fill();
    },
    blocker: () => {
      ctx.fillStyle = '#4488ff'; ctx.fillRect(9, 8, 12, 14);
      ctx.fillStyle = '#ffcc88'; ctx.fillRect(10, 4, 10, 6);
      ctx.fillStyle = '#00cc00'; ctx.fillRect(10, 2, 10, 3);
      ctx.fillStyle = 'rgba(255,255,0,0.7)';
      ctx.fillRect(5, 6, 4, 18); ctx.fillRect(21, 6, 4, 18);
    },
    builder: () => {
      // Staircase
      ctx.fillStyle = '#8B6914';
      ctx.fillRect(4,24,6,2); ctx.fillRect(10,22,6,2); ctx.fillRect(16,20,6,2);
      ctx.fillStyle = '#4488ff'; ctx.fillRect(14,10,6,10);
      ctx.fillStyle = '#ffcc88'; ctx.fillRect(14,6,6,5);
      ctx.fillStyle = '#ffcc00'; ctx.fillRect(12,10,3,6);
    },
    basher: () => {
      ctx.fillStyle = '#4488ff'; ctx.fillRect(4,8,8,12);
      ctx.fillStyle = '#ffcc88'; ctx.fillRect(4,4,8,5);
      ctx.fillStyle = '#00cc00'; ctx.fillRect(4,2,8,3);
      // Arm punch
      ctx.fillStyle = '#ffcc88'; ctx.fillRect(12,10,10,3);
      ctx.fillStyle = '#888';    ctx.fillRect(20,8,4,6);
      // Rock breaking
      ctx.fillStyle = '#7a5c3a'; ctx.fillRect(22,4,6,18);
    },
    miner: () => {
      ctx.fillStyle = '#4488ff'; ctx.fillRect(8,10,8,12);
      ctx.fillStyle = '#ffcc88'; ctx.fillRect(8,6,8,5);
      ctx.fillStyle = '#ffdd00'; ctx.fillRect(7,4,10,3);
      // Pickaxe
      ctx.strokeStyle = '#ccc'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(16,10); ctx.lineTo(24,18); ctx.stroke();
      ctx.fillStyle = '#aaa'; ctx.fillRect(21,15,6,6);
    },
    digger: () => {
      ctx.fillStyle = '#4488ff'; ctx.fillRect(9,4,12,10);
      ctx.fillStyle = '#ffcc88'; ctx.fillRect(10,0,10,5);
      ctx.fillStyle = '#00cc00'; ctx.fillRect(10,-2,10,3);
      // Spade going down
      ctx.fillStyle = '#aaa';
      ctx.fillRect(13,14,4,10);
      ctx.fillRect(10,20,10,4);
      // Dirt flying
      ctx.fillStyle = '#7a5c3a';
      ctx.fillRect(4,22,4,4); ctx.fillRect(22,20,4,4);
    },
  };

  if (icons[skillId]) icons[skillId]();
}

export class UI {
  constructor(game) {
    this.game = game;
    this.selectedSkill = null;

    this._buildToolbar();
    this._bindHudButtons();
  }

  _buildToolbar() {
    const container = document.getElementById('skill-buttons');
    container.innerHTML = '';
    this.skillBtns = {};

    for (const s of SKILLS) {
      const btn = document.createElement('div');
      btn.className = 'skill-btn';
      btn.dataset.skill = s.id;

      const icon = document.createElement('canvas');
      icon.className = 'skill-icon';
      drawSkillIcon(icon, s.id);

      const count = document.createElement('div');
      count.className = 'skill-count';
      count.textContent = '0';

      const label = document.createElement('div');
      label.className = 'skill-label';
      label.textContent = s.label;

      btn.appendChild(icon);
      btn.appendChild(count);
      btn.appendChild(label);

      btn.addEventListener('click', () => this._selectSkill(s.id));
      btn.addEventListener('touchend', e => { e.preventDefault(); this._selectSkill(s.id); });

      container.appendChild(btn);
      this.skillBtns[s.id] = { btn, count };
    }
  }

  _selectSkill(id) {
    if (this.skillBtns[id].btn.classList.contains('disabled')) return;
    this.selectedSkill = (this.selectedSkill === id) ? null : id;
    this._refreshSelection();
    this.game.onSkillSelected(this.selectedSkill);
  }

  _refreshSelection() {
    for (const [id, { btn }] of Object.entries(this.skillBtns)) {
      btn.classList.toggle('selected', id === this.selectedSkill);
    }
  }

  _bindHudButtons() {
    document.getElementById('rate-minus').addEventListener('click', () => this.game.changeRate(-5));
    document.getElementById('rate-plus').addEventListener('click',  () => this.game.changeRate(+5));
    document.getElementById('pause-btn').addEventListener('click',  () => this.game.togglePause());
    document.getElementById('nuke-btn').addEventListener('click',   () => this.game.nuke());
    document.getElementById('btn-levels').addEventListener('click', () => this.game.showLevelSelect());
    document.getElementById('btn-next').addEventListener('click',   () => this.game.nextLevel());
    document.getElementById('btn-retry').addEventListener('click',  () => this.game.retryLevel());
    document.getElementById('btn-menu').addEventListener('click',   () => this.game.showMenu());
  }

  /** Called whenever skill counts change */
  updateSkills(skillCounts) {
    for (const [id, { btn, count }] of Object.entries(this.skillBtns)) {
      const n = skillCounts[id] ?? 0;
      count.textContent = n > 99 ? '∞' : n;
      btn.classList.toggle('disabled', n <= 0);
      if (n <= 0 && this.selectedSkill === id) {
        this.selectedSkill = null;
        this._refreshSelection();
        this.game.onSkillSelected(null);
      }
    }
  }

  updateHUD({ out, saved, needed, timeLeft, paused }) {
    document.getElementById('hud-out').textContent   = `OUT: ${out}`;
    document.getElementById('hud-saved').textContent = `SAVED: ${saved}/${needed}`;
    const m = Math.floor(timeLeft / 60);
    const s = Math.floor(timeLeft % 60);
    document.getElementById('hud-time').textContent =
      `${paused ? '⏸ ' : ''}${m}:${String(s).padStart(2,'0')}`;
  }

  updateRate(rate) {
    document.getElementById('rate-display').textContent = rate;
  }

  showOverlay(title, msg, stat, buttons) {
    document.getElementById('overlay-title').textContent = title;
    document.getElementById('overlay-msg').textContent   = msg;
    document.getElementById('overlay-stat').textContent  = stat;

    const next  = document.getElementById('btn-next');
    const retry = document.getElementById('btn-retry');
    next.style.display  = buttons.next  ? '' : 'none';
    retry.style.display = buttons.retry ? '' : 'none';

    document.getElementById('overlay').classList.add('visible');
  }

  hideOverlay() {
    document.getElementById('overlay').classList.remove('visible');
  }

  deselectSkill() {
    this.selectedSkill = null;
    this._refreshSelection();
  }
}
