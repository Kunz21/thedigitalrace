// Sounds – alles synthetisch per Web Audio, keine Dateien nötig.
let ctx = null;
let on = localStorage.getItem('mbg_sound') !== '0';

export const isOn = () => on;
export const getCtx = () => ctx;
export function toggle() { on = !on; localStorage.setItem('mbg_sound', on ? '1' : '0'); if (on) unlock(); }
export function unlock() {
  try {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
  } catch {}
}

function tone(freq, dur, type = 'sine', vol = 0.2, when = 0, slide = null) {
  if (!on || !ctx) return;
  const t = ctx.currentTime + when;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g).connect(ctx.destination);
  o.start(t); o.stop(t + dur + 0.05);
}

export const tick = (v = 0.5) => tone(1700, 0.04, 'square', 0.03 + 0.09 * v);
export const click = () => tone(900, 0.03, 'square', 0.06);
export const buzz = () => { tone(140, 0.5, 'sawtooth', 0.25); tone(147, 0.5, 'square', 0.1); };
export const ding = () => { tone(880, 0.15, 'triangle', 0.25); tone(1320, 0.35, 'triangle', 0.2, 0.12); };
export const honk = () => tone(240, 0.5, 'sawtooth', 0.22, 0, 110);
export const whistle = () => { tone(2900, 0.22, 'sine', 0.16, 0, 2700); tone(2900, 0.55, 'sine', 0.16, 0.3, 2750); };
export const jingle = () => [660, 880, 1100].forEach((f, i) => tone(f, 0.16, 'triangle', 0.16, i * 0.11));
export function fanfare() {
  [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => tone(f, i === 6 ? 1.0 : 0.17, 'triangle', 0.22, i * 0.15));
  [262, 330, 392].forEach((f) => tone(f, 1.2, 'sawtooth', 0.05, 0.9));
}
export function spin() { for (let i = 0; i < 30; i++) tone(1300, 0.025, 'square', 0.05, 4.4 * Math.pow(i / 30, 1.9)); }
export function boom() {
  if (!on || !ctx) return;
  const len = Math.floor(ctx.sampleRate * 1.3);
  const b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5);
  const s = ctx.createBufferSource(); s.buffer = b;
  const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 900;
  const g = ctx.createGain(); g.gain.value = 0.9;
  s.connect(f).connect(g).connect(ctx.destination); s.start();
  tone(80, 1.0, 'sine', 0.5, 0, 28);
}
