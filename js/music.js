// Hintergrundmusik: Pixel-Derby und Hüttengaudi laufen abwechselnd in Endlosschlaufe.
// Standard: Musik nur auf dem Spielleiter-Handy (damit nicht 7 Handys durcheinander spielen).
// Jeder kann sie über 🎵 oben rechts für sein Handy ein- oder ausschalten.
import * as SFX from './sound.js';

const TRACKS = [
  { src: 'assets/music/pixel-derby.mp3', name: 'Pixel-Derby' },
  { src: 'assets/music/huettengaudi.mp3', name: 'Hüttengaudi' },
];
const KEY = 'mbg_music';
const BASE = 0.4; // Grundlautstärke im Verhältnis zu den Effekten

let wanted = null;
try { const v = localStorage.getItem(KEY); if (v !== null) wanted = v === '1'; } catch {}
let el = null, gain = null, idx = 0, duckT = null;

export const isOn = () => !!wanted;
export const current = () => TRACKS[idx].name;

// Wird gesetzt, sobald klar ist, ob dieses Handy der Spielleiter ist – nur falls noch nichts gewählt wurde.
export function setDefault(isHost) { if (wanted === null) wanted = !!isHost; }

function ensure() {
  if (el) return;
  el = new Audio();
  el.preload = 'auto';
  el.src = TRACKS[idx].src;
  el.addEventListener('ended', () => {
    idx = (idx + 1) % TRACKS.length;
    el.src = TRACKS[idx].src;
    el.play().catch(() => {});
  });
  // Über Web Audio leiten, damit die Lautstärke auch auf dem iPhone regelbar ist
  const ctx = SFX.getCtx();
  if (ctx) {
    try {
      const src = ctx.createMediaElementSource(el);
      gain = ctx.createGain(); gain.gain.value = BASE;
      src.connect(gain).connect(ctx.destination);
    } catch { gain = null; }
  }
  if (!gain) el.volume = BASE;
}

function setLevel(v) {
  if (!el) return;
  const ctx = SFX.getCtx();
  if (gain && ctx) gain.gain.setTargetAtTime(v, ctx.currentTime, 0.12);
  else el.volume = Math.max(0, Math.min(1, v));
}

// Bei jeder Berührung aufrufen: Browser erlauben Musik erst nach einer Interaktion.
export function kick() {
  if (!wanted) return;
  SFX.unlock();
  ensure();
  if (el.paused) el.play().catch(() => {});
}

export function toggle() {
  wanted = !wanted;
  try { localStorage.setItem(KEY, wanted ? '1' : '0'); } catch {}
  if (wanted) kick(); else if (el) el.pause();
}

// Musik kurz leiser machen, damit Effekte (Buzzer, Bombe, Glücksrad, Fanfare) durchkommen
export function duck(ms = 2000, level = 0.3) {
  if (!el || el.paused) return;
  setLevel(BASE * level);
  clearTimeout(duckT);
  duckT = setTimeout(() => setLevel(BASE), ms);
}

export const debug = () => ({ on: !!wanted, paused: el ? el.paused : null, src: el ? el.src : null, t: el ? el.currentTime : 0, dur: el ? el.duration : 0, routed: !!gain });
