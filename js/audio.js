let ctx = null;
function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}
function beep(freq, dur, type='square', vol=0.12) {
  try {
    const c = getCtx();
    const o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    o.start(); o.stop(c.currentTime + dur);
  } catch(e) {}
}
export const Audio = {
  assign:  () => beep(800, 0.07),
  saved:   () => beep(1100, 0.12, 'sine'),
  die:     () => beep(180, 0.18, 'sawtooth'),
  explode: () => beep(80,  0.35, 'sawtooth', 0.28),
  win:     () => { beep(523,.1,'sine'); setTimeout(()=>beep(659,.1,'sine'),130); setTimeout(()=>beep(784,.25,'sine'),260); },
  lose:    () => { beep(350,.15,'sawtooth'); setTimeout(()=>beep(250,.15,'sawtooth'),180); setTimeout(()=>beep(150,.3,'sawtooth'),360); },
  spawn:   () => beep(600, 0.04, 'sine', 0.06),
};
