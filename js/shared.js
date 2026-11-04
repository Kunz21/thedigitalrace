// Gemeinsame Konstanten und Helfer

// Zeitraffer zum Testen: ?speed=10 in der URL
export const SPEED = Math.max(1, Number(new URLSearchParams(location.search).get('speed')) || 1);
export const D = (sec) => (sec * 1000) / SPEED;

export const ROUNDS = [
  { id: 'schaetz', stage: 'Gruppenphase', after: 'nach der Gruppenphase', name: 'Schätzmeister', icon: '🧮',
    rules: ['8 Schätzfragen – jeder tippt seine Zahl ins Handy.', 'Wer am nächsten dran ist, holt am meisten.', '35 Sekunden pro Frage, dann kommt die Auflösung.'] },
  { id: 'stopp', stage: 'Achtelfinal', after: 'nach dem Achtelfinal', name: 'Zeit-Stopper', icon: '⏱️',
    rules: ['3 Durchgänge: 10, 15 und 20 Sekunden – pro Durchgang hast du 3 Versuche.', 'START drücken – nach 3 Sekunden verschwindet die Uhr. STOPP drücken, wenn du glaubst, die Zeit ist um.', 'Pro Durchgang zählt dein bester Versuch. Die kleinste Gesamtabweichung gewinnt.'] },
  { id: 'buzzer', stage: 'Viertelfinal', after: 'nach dem Viertelfinal', name: 'Buzzer-Chaos', icon: '🚨',
    rules: ['Frage erscheint – du hast 30 Sekunden zum Buzzern. Wer zuerst drückt, darf antworten.', 'Richtig +1, falsch −1 und die anderen dürfen nochmals.', '16 Fragen, nur 5 Sekunden Antwortzeit.'] },
  { id: 'zeichnen', stage: 'Halbfinal', after: 'nach dem Halbfinal', name: 'Kritzel-Sprint', icon: '✏️',
    rules: ['Jeder zeichnet 55 Sekunden lang Begriffe auf seinem Handy – die anderen sehen live mit.', 'Wer es weiss, drückt ICH WEISS ES. Wer zuerst gedrückt hat, darf zuerst raten.', 'Der Zeichner entscheidet: richtig = Rater +2, Zeichner +1. Falsch = der Nächste in der Reihe darf.'] },
  { id: 'bombe', stage: 'Final', after: 'nach dem Final', name: 'Die Bombe', icon: '💣', double: true,
    rules: ['Wer die Bombe hat, nennt einen Begriff zur Kategorie und drückt WEITER.', 'Die Bombe geht nach links – niemand weiss, wann sie hochgeht.', 'Wer beim Knall dran ist, fliegt raus und trinkt. Der Letzte im Spiel holt den Final.'] },
];
export const STOPP_TARGETS = [10, 15, 20];
export const STOPP_TRIES = 3; // Versuche pro Durchgang
export const STOPP_TOTAL = STOPP_TARGETS.length * STOPP_TRIES;
export const stoppTarget = (i) => STOPP_TARGETS[Math.min(STOPP_TARGETS.length - 1, Math.floor(i / STOPP_TRIES))];
// beste Abweichung pro Durchgang (fehlende Durchgänge = volle Zielzeit daneben)
export function stoppBest(times) {
  return STOPP_TARGETS.map((t, ti) => {
    const tries = times.slice(ti * STOPP_TRIES, (ti + 1) * STOPP_TRIES);
    if (!tries.length) return { t, best: null, bi: -1, dev: t };
    let bi = 0;
    tries.forEach((x, i) => { if (Math.abs(x - t) < Math.abs(tries[bi] - t)) bi = i; });
    return { t, best: tries[bi], bi, dev: Math.abs(tries[bi] - t) };
  });
}

export const POINTS = [10, 8, 6, 4, 3, 2, 1];
export const ptsFor = (place, double) => (POINTS[place - 1] ?? 0) * (double ? 2 : 1);

export const COLORS = ['#ff4d6d', '#ffc93c', '#3ddc97', '#3fd0ff', '#b388ff', '#ff8a3d', '#f15bb5', '#a3e635', '#e2e8f0', '#14b8a6'];
export const AVATARS = ['🦁', '🐺', '🐗', '🦍', '🦅', '🐂', '🦈', '🐻', '🐯', '🦬', '🐊', '🦏', '🐙', '🦖', '🤠', '👹', '🥷', '🧔'];

export const A = (x) => (Array.isArray(x) ? x : x && typeof x === 'object' ? Object.values(x) : []);
export const O = (x) => (x && typeof x === 'object' ? x : {});
export const uid = () => Math.random().toString(36).slice(2, 9);
export const rnd = (a, b) => a + Math.random() * (b - a);
export const ri = (n) => Math.floor(Math.random() * n);
export const pickOne = (arr) => arr[ri(arr.length)];
export const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = ri(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export const gauss = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const fmtNum = (v) => (v == null || !isFinite(v) ? '–' : Number(v).toLocaleString('de-CH', { maximumFractionDigits: 2 }));
export const fill = (tpl, vars) => tpl.replace(/\{(\w)\}/g, (_, k) => vars[k] ?? '');

// Platzierungen mit Gleichstand (1, 2, 2, 4 …). Fehlende Werte = letzter Platz.
export function placesFrom(pids, values, higherBetter) {
  const ok = pids.filter((p) => typeof values[p] === 'number' && isFinite(values[p]));
  const out = {};
  for (const p of ok) {
    const v = values[p];
    out[p] = 1 + ok.filter((q) => (higherBetter ? values[q] > v : values[q] < v)).length;
  }
  for (const p of pids) if (!(p in out)) out[p] = ok.length + 1;
  return out;
}
