// Oberfläche für alle Handys (Spieler und Spielleiter)
import { isDemo, openRoom } from './db.js';
import { Host } from './host.js';
import { ROUNDS, STOPP_TARGETS, POINTS, AVATARS, COLORS, SPEED, esc, uid, fmtNum, A, O, placesFrom } from './shared.js';
import * as C from './content.js';
import * as SFX from './sound.js';
import { confetti } from './fx.js';

const app = document.getElementById('app');
const params = new URLSearchParams(location.search);

let db = null, code = null, me = null, host = null;
let S = null, P = {}, META = null, DRAW = {};
let screen = 'home';
const L = {
  mode: 'create', joinCode: (params.get('room') || '').toUpperCase(), avatar: null, err: '', busy: false,
  taken: [], menu: false, drinks: false, jokerFor: null, sw: null, buzzed: null, passed: null, fxFinal: null, pen: '#111111',
};
let lastHtml = '';

const isHost = () => META?.host === me;
const nm = (pid) => P[pid]?.name || '?';
const send = (t, data = {}) => db && db.push('actions', { t, pid: me, at: db.now(), ...data });
const hostCmd = (c, arg) => host && host.cmd(c, arg);

// ---------------- Session ----------------
const SKEY = 'mbg_session';
function saveSession() {
  const v = JSON.stringify({ code, me });
  sessionStorage.setItem(SKEY, v);
  if (!isDemo) localStorage.setItem(SKEY, v);
}
function loadSession() {
  try { return JSON.parse(sessionStorage.getItem(SKEY) || (!isDemo && localStorage.getItem(SKEY)) || 'null'); } catch { return null; }
}
function roomLink(c) {
  const u = new URL(location.href);
  u.search = ''; u.searchParams.set('room', c);
  if (SPEED !== 1) u.searchParams.set('speed', SPEED);
  if (params.has('demo')) u.searchParams.set('demo', '1');
  return u.toString();
}

async function boot() {
  const s = loadSession();
  if (s && s.code && s.me && (!L.joinCode || L.joinCode === s.code)) {
    try {
      db = await openRoom(s.code);
      META = await db.get('meta');
      const pl = META && (await db.get('players/' + s.me));
      if (pl) return enterGame(s.code, s.me);
    } catch (e) { console.error(e); }
  }
  if (L.joinCode) { L.mode = 'join'; await goProfile(); } else { screen = 'home'; render(); }
}

async function goProfile() {
  screen = 'profile'; L.err = ''; L.taken = [];
  render();
  if (L.mode === 'join' && L.joinCode) {
    try {
      db = await openRoom(L.joinCode);
      const meta = await db.get('meta');
      if (!meta) { L.err = `Raum ${L.joinCode} gibt es nicht.`; }
      L.taken = Object.values(O(await db.get('players'))).map((p) => p.avatar);
    } catch (e) { L.err = 'Verbindung fehlgeschlagen. Firebase-Konfiguration prüfen.'; console.error(e); }
    render();
  }
}

function genCode() { const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; return Array.from({ length: 4 }, () => a[Math.floor(Math.random() * a.length)]).join(''); }

async function createRoom(name, avatar) {
  let c = genCode();
  db = await openRoom(c);
  for (let i = 0; i < 5 && (await db.get('meta')); i++) { c = genCode(); db = await openRoom(c); }
  const pid = 'p' + uid();
  await db.set('meta', { host: pid, created: db.now(), title: C.TITLE });
  await db.set('players/' + pid, { name, avatar, color: COLORS[0], joined: db.now() });
  META = await db.get('meta');
  enterGame(c, pid);
}

async function joinRoom(c, name, avatar) {
  db = await openRoom(c);
  const meta = await db.get('meta');
  if (!meta) { L.err = `Raum ${c} gibt es nicht.`; L.busy = false; return render(); }
  META = meta;
  const pls = O(await db.get('players'));
  const ex = Object.entries(pls).find(([, v]) => !v.bot && (v.name || '').trim().toLowerCase() === name.trim().toLowerCase());
  let pid;
  if (ex) pid = ex[0];
  else {
    pid = 'p' + uid();
    const used = new Set(Object.values(pls).map((p) => p.color));
    await db.set('players/' + pid, { name, avatar, color: COLORS.find((x) => !used.has(x)) || COLORS[0], joined: db.now() });
  }
  enterGame(c, pid);
}

function enterGame(c, pid) {
  code = c; me = pid; screen = 'game';
  saveSession();
  history.replaceState(null, '', roomLink(c));
  db.on('state', (v) => { const prev = S; S = v; stateFx(prev, S); render(); });
  db.on('players', (v) => { P = v || {}; render(); });
  db.on('draw', (v) => { DRAW = v || {}; drawPad(); });
  db.on('meta', (v) => { META = v; if (META?.host === me && !host) { host = new Host(db, me); host.start(); } render(); });
  wakeLock();
  render();
}
// Debug-Zugriff in der Browser-Konsole: mbg.S, mbg.host
window.mbg = { get S() { return S; }, get host() { return host; }, get P() { return P; } };

// ---------------- Wake Lock (Bildschirm bleibt an) ----------------
let wl = null;
async function wakeLock() { try { if ('wakeLock' in navigator && document.visibilityState === 'visible') wl = await navigator.wakeLock.request('screen'); } catch {} }
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && screen === 'game') wakeLock(); });

// ---------------- Bausteine ----------------
const chip = (pid, cls = '') => {
  const p = P[pid] || { name: '?', avatar: '❔', color: '#888' };
  return `<span class="pchip ${cls}" style="--c:${p.color || '#888'}"><i>${p.avatar || '❔'}</i><b>${esc(p.name)}</b>${pid === me ? '<em>du</em>' : ''}</span>`;
};
const timer = (ms, cls = '') => (ms ? `<span class="timer ${cls}" data-ends="${ms}">–</span>` : '');
const order = () => A(S?.order).filter((p) => P[p]);

const TROPHY = `<svg viewBox="0 0 120 140" class="trophy" aria-hidden="true"><defs><linearGradient id="tg" x1="0" x2="1"><stop offset="0" stop-color="#8790b5"/><stop offset=".5" stop-color="#ffffff"/><stop offset="1" stop-color="#8790b5"/></linearGradient></defs><path d="M33 22 C8 16 2 44 10 62 C16 76 30 80 40 76" fill="none" stroke="url(#tg)" stroke-width="9" stroke-linecap="round"/><path d="M87 22 C112 16 118 44 110 62 C104 76 90 80 80 76" fill="none" stroke="url(#tg)" stroke-width="9" stroke-linecap="round"/><path d="M32 12 H88 C88 58 77 84 60 88 C43 84 32 58 32 12 Z" fill="url(#tg)"/><rect x="54" y="87" width="12" height="20" fill="url(#tg)"/><path d="M38 107 H82 L87 126 H33 Z" fill="url(#tg)"/><text x="60" y="54" text-anchor="middle" font-size="24" fill="#0b1238">★</text></svg>`;

function header() {
  const R = S && S.round >= 0 && ROUNDS[S.round];
  const showStage = R && !['lobby', 'rules', 'final'].includes(S.phase);
  const mp = P[me];
  return `<header class="top">
    <div class="brand"><span class="ball">★</span>${showStage ? '' : `<div><b>Mebongs CL</b><small>${esc(C.SUBTITLE)}</small></div>`}</div>
    ${showStage ? `<span class="stage">${esc(R.stage)}</span>` : ''}
    ${S && S.phase !== 'lobby' ? '<button class="icon" data-act="drinks" aria-label="Getränke">🍻</button>' : ''}
    <button class="icon" data-act="sound" aria-label="Ton">${SFX.isOn() ? '🔊' : '🔇'}</button>
    ${mp ? `<span class="me" style="--c:${mp.color}">${mp.avatar}</span>` : ''}
  </header>`;
}

// ---------------- Startseite / Profil ----------------
function viewHome() {
  return `<div class="hero">${TROPHY}
    <h1><small>Mebongs</small>Champions-League</h1><p class="sub">${esc(C.SUBTITLE)} · Männer-Nachmittag der Giganten</p></div>
    ${isDemo ? `<div class="banner warn">Demo-Modus: Firebase ist noch nicht eingerichtet. Spielen geht nur in mehreren Tabs desselben Browsers – oder allein mit Testspielern.</div>` : ''}
    <section class="card">
      <button class="btn primary big" data-act="goCreate">🏟️ Turnier eröffnen</button>
      <p class="hint center">Du wirst Spielleiter und spielst trotzdem mit.</p>
    </section>
    <section class="card">
      <label for="joincode">Raum-Code der Gruppe</label>
      <input id="joincode" class="codein" maxlength="4" autocomplete="off" autocapitalize="characters" placeholder="ABCD" value="${esc(L.joinCode)}">
      <button class="btn big" data-act="goJoin">⚽ Beitreten</button>
    </section>`;
}

function viewProfile() {
  const title = L.mode === 'create' ? 'Turnier eröffnen' : `Beitreten · Raum ${esc(L.joinCode)}`;
  return `<section class="card">
    <h2>${title}</h2>
    ${L.err ? `<div class="banner bad">${esc(L.err)}</div>` : ''}
    <label for="pname">Dein Spielername</label>
    <input id="pname" maxlength="16" autocomplete="nickname" placeholder="z.B. Mebong">
    <label>Dein Avatar</label>
    <div class="avgrid">${AVATARS.map((a) => `<button class="av ${L.avatar === a ? 'sel' : ''} ${L.taken.includes(a) ? 'taken' : ''}" data-act="av" data-v="${a}">${a}</button>`).join('')}</div>
    <button class="btn primary big" data-act="doProfile" ${L.busy ? 'disabled' : ''}>${L.mode === 'create' ? 'Stadion öffnen' : 'Ab aufs Feld'}</button>
    <button class="btn ghost" data-act="home">Zurück</button>
  </section>`;
}

// ---------------- Lobby & Regeln ----------------
function viewLobby() {
  const ord = order(), H = isHost();
  const link = roomLink(code);
  return `<section class="card center">
      <div class="label">Raum-Code</div><div class="code">${esc(code)}</div>
      <div id="qr" data-url="${esc(link)}"></div>
      <button class="btn small" data-act="share">📲 Einladung teilen</button>
    </section>
    <section class="card">
      <h2>Sitzordnung <small>${ord.length} Spieler</small></h2>
      <p class="hint">Setzt euch im Uhrzeigersinn in dieser Reihenfolge hin. «Links» heisst im Spiel immer: der Nächste in der Liste.</p>
      <ol class="seats">${ord.map((pid) => `<li>${chip(pid)}
        ${P[pid]?.bot ? '<span class="tag">Bot</span>' : ''}
        ${H ? `<span class="seatbtns"><button data-act="seat" data-pid="${pid}" data-dir="-1" aria-label="hoch">▲</button><button data-act="seat" data-pid="${pid}" data-dir="1" aria-label="runter">▼</button>${pid !== me ? `<button data-act="kick" data-pid="${pid}" aria-label="entfernen">✕</button>` : ''}</span>` : ''}
      </li>`).join('')}</ol>
    </section>
    ${H ? `<section class="card">
      <h3>Einstellungen Spielleiter</h3>
      <div class="row between"><span>Shot-Limit pro Person</span><span class="stepper"><button data-act="limit" data-d="-1">−</button><b>${S.settings?.shotLimit ?? 5}</b><button data-act="limit" data-d="1">+</button></span></div>
      <p class="hint">Ab diesem Wert gibt's statt Shots ein Glas Wasser.</p>
      <label>Kritzel-Kategorien</label>
      <div class="chips">${C.ZEICHNEN.map((c) => `<button class="cchip ${A(S.settings?.cats).includes(c.id) ? 'on' : ''}" data-act="cat" data-id="${c.id}">${esc(c.name)}</button>`).join('')}</div>
      <button class="btn ghost" data-act="bot">🤖 Testspieler hinzufügen</button>
    </section>` : `<p class="wait">Warte auf den Anpfiff vom Spielleiter …</p>`}`;
}

function viewRules() {
  return `<section class="card">
    <h2>Die Regeln der Königsklasse ${timer(S.endsAt)}</h2>
    <ol class="rules">
      ${ROUNDS.map((r) => `<li><b>${esc(r.stage)}:</b> ${r.icon} ${esc(r.name)}${r.double ? ' <span class="tag gold">doppelte Punkte</span>' : ''}</li>`).join('')}
    </ol>
    <h3>Punkte pro Runde</h3>
    <div class="ptsrow">${POINTS.map((p, i) => `<span><small>${i + 1}.</small>${p}</span>`).join('')}</div>
    <h3>Strafen & Belohnungen</h3>
    <ul class="plain">
      <li>🍸 Rundensieger: ${C.COCKTAILS.map(esc).join(' oder ')} – und darf einen Shot verteilen.</li>
      <li>🥃 Rundenletzter: 1 × ${esc(C.SHOT)}.</li>
      <li>🎡 Danach dreht der Letzte das Glücksrad.</li>
      <li>🃏 Jeder startet mit 1 Joker: einen Shot an jemand anderen weitergeben.</li>
      <li>🍻 Oben rechts siehst du jederzeit, wer wie viel getrunken hat.</li>
      <li>🏆 Champion: Cocktail nach Wahl + Henkelpott. 🔴 Letzter: Final-Shot und zahlt die nächste Runde.</li>
    </ul>
  </section>`;
}

function viewIntro() {
  const R = ROUNDS[S.round];
  return `<section class="intro card ${R.double ? 'final' : ''}">
    <div class="stagebig">${esc(R.stage)} · Runde ${S.round + 1}/${ROUNDS.length}</div>
    <div class="gicon">${R.icon}</div>
    <h1>${esc(R.name)}</h1>
    ${R.double ? '<div class="banner gold">Final: doppelte Punkte – jetzt wird\'s dreckig!</div>' : ''}
    <ol class="rules">${R.rules.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>
    <div class="kick">Anpfiff in ${timer(S.endsAt, 'big')}</div>
  </section>`;
}

// ---------------- Stoppuhr (Stopp bei 10.00 + Stechen) ----------------
function stopwatch(ctx, canStart) {
  const sw = L.sw && L.sw.ctx === ctx ? L.sw : null;
  if (sw?.running) return `<div class="sw" id="sw">0.00</div><button class="btn danger huge" data-fast="swstop">STOPP</button>`;
  if (sw && sw.last != null) return `<div class="sw small">${sw.last.toFixed(2)} s</div><p class="hint center">Wird gespeichert …</p>`;
  if (!canStart) return '';
  return `<button class="btn primary huge" data-act="swstart" data-ctx="${ctx}">START</button>`;
}
function swLoop() {
  if (!L.sw?.running) return;
  const el = document.getElementById('sw');
  if (el) {
    const e = (performance.now() - L.sw.start) / 1000;
    if (e < 3) el.textContent = e.toFixed(2);
    else { el.textContent = '??.??'; el.classList.add('blind'); }
  }
  requestAnimationFrame(swLoop);
}

// ---------------- Spiele ----------------
function viewSchaetz(g) {
  const q = C.SCHAETZ[A(g.qs)[g.qi]];
  const ans = O(O(g.ans)['q' + g.qi]);
  const mine = ans[me];
  const head = `<div class="qhead"><span>Frage ${g.qi + 1}/${A(g.qs).length}</span>${timer(g.until)}</div>`;
  if (g.sub === 'ask') {
    return `<section class="card game">${head}
      <h2 class="question">${esc(q.q)}</h2>
      ${mine == null ? `<div class="numrow"><input id="est" type="number" inputmode="decimal" step="any" placeholder="Deine Zahl"><span class="unit">${esc(q.u)}</span></div>
        <button class="btn primary big" data-act="est" data-q="${g.qi}">Schätzung abgeben</button>`
        : `<div class="done">✅ Deine Schätzung: <b>${fmtNum(mine)} ${esc(q.u)}</b></div>`}
      <div class="answered">${order().map((p) => `<span class="dot ${ans[p] != null ? 'on' : ''}" style="--c:${P[p]?.color}">${P[p]?.avatar}</span>`).join('')}</div>
    </section>`;
  }
  const rows = order().map((p) => ({ p, v: ans[p], d: ans[p] == null ? Infinity : Math.abs(ans[p] - q.a) })).sort((a, b) => a.d - b.d);
  return `<section class="card game">${head}
    <h2 class="question small">${esc(q.q)}</h2>
    <div class="answer"><span>Lösung</span><b>${fmtNum(q.a)} ${esc(q.u)}</b></div>
    <p class="note">${esc(q.n)}</p>
    ${g.say ? `<div class="banner gold">${esc(g.say)}</div>` : ''}
    <ol class="list">${rows.map((r, i) => `<li class="${i === 0 ? 'best' : ''}">${chip(r.p)}<span class="val">${r.v == null ? '–' : fmtNum(r.v)}</span></li>`).join('')}</ol>
  </section>`;
}

function viewStopp(g) {
  const att = A(O(g.res)[me]), n = STOPP_TARGETS.length;
  const ctx = `stopp:${att.length}`;
  const pending = L.sw && L.sw.ctx === ctx && !L.sw.running && L.sw.last != null;
  const target = STOPP_TARGETS[Math.min(att.length, n - 1)];
  return `<section class="card game center">
    <div class="qhead"><span>Durchgang ${Math.min(att.length + 1, n)}/${n}</span>${timer(g.until)}</div>
    ${att.length < n ? `<div class="target">Ziel: <b>${target.toFixed(2)}</b> Sekunden</div>` : ''}
    ${att.map((t, i) => { const d = t - STOPP_TARGETS[i]; return `<div class="attempt">${STOPP_TARGETS[i]} s: <b>${t.toFixed(2)} s</b> <span class="${Math.abs(d) < 0.3 ? 'good' : ''}">(${d >= 0 ? '+' : ''}${d.toFixed(2)})</span></div>`; }).join('')}
    ${att.length < n ? stopwatch(ctx, !pending) : '<div class="done">✅ Fertig – warte auf die anderen.</div>'}
    <div class="answered">${order().map((p) => `<span class="dot ${A(O(g.res)[p]).length >= n ? 'on' : ''}" style="--c:${P[p]?.color}">${P[p]?.avatar}</span>`).join('')}</div>
  </section>`;
}

function miniBoard(pts, label) {
  const rows = order().map((p) => ({ p, v: O(pts)[p] || 0 })).sort((a, b) => b.v - a.v);
  return `<section class="card"><h3>${label}</h3><ol class="list compact">${rows.map((r) => `<li>${chip(r.p)}<span class="val">${r.v}</span></li>`).join('')}</ol></section>`;
}

function viewBuzzer(g) {
  const q = C.BUZZER[A(g.qs)[g.qi]];
  const excl = A(g.excl);
  let body = '';
  const wrong = g.last && !g.last.ok && g.last.qi === g.qi ? `<div class="banner bad">${chip(g.last.pid)} lag falsch (−1)${g.last.say ? `<br><small>${esc(g.last.say)}</small>` : ''}</div>` : '';
  if (g.sub === 'open') {
    const bz = L.buzzed === `${g.qi}_${excl.length}`;
    body = wrong + (excl.includes(me) ? '<div class="done">Du hast falsch getippt – jetzt sind die anderen dran.</div>'
      : bz ? '<div class="done">🚨 Gebuzzert! Warte …</div>'
      : `<button class="buzz" data-fast="buzz" data-q="${g.qi}">BUZZ</button>`);
  } else if (g.sub === 'answer') {
    body = g.who === me
      ? `<div class="banner gold">Du bist dran – schnell!</div><div class="opts">${q.o.map((o, i) => `<button class="opt" data-act="ans" data-q="${g.qi}" data-opt="${i}">${esc(o)}</button>`).join('')}</div>`
      : `<div class="who">${chip(g.who, 'big')}<span>hat gebuzzert und antwortet …</span></div>`;
  } else {
    body = `${g.last?.ok ? `<div class="banner good">${chip(g.last.pid)} +1 – richtig!</div>` : wrong || '<div class="banner">Niemand hat\'s gewusst.</div>'}
      <div class="opts">${q.o.map((o, i) => `<div class="opt ${i === q.c ? 'right' : ''}">${esc(o)}</div>`).join('')}</div>`;
  }
  return `<section class="card game">
    <div class="qhead"><span>Frage ${g.qi + 1}/${A(g.qs).length}</span>${timer(g.until)}</div>
    <h2 class="question">${esc(q.q)}</h2>${body}</section>${miniBoard(g.pts, 'Punkte')}`;
}

// ---------------- Kritzel-Sprint (Zeichnen & Raten) ----------------
const PAD = document.createElement('canvas');
PAD.width = 1000; PAD.height = 1000; PAD.className = 'pad';
let padStroke = null, padFlush = 0;
const PEN_COLORS = ['#111111', '#e11d48', '#2563eb', '#16a34a'];

function drawPad() {
  const g = S?.g, c = PAD.getContext('2d');
  c.fillStyle = '#ffffff'; c.fillRect(0, 0, 1000, 1000);
  if (!g || g.id !== 'zeichnen') return;
  const line = (pts, col, w) => {
    if (pts.length < 2) return;
    c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(pts[0], pts[1]);
    if (pts.length === 2) c.lineTo(pts[0] + 0.1, pts[1]);
    for (let i = 2; i < pts.length; i += 2) c.lineTo(pts[i], pts[i + 1]);
    c.stroke();
  };
  for (const k of Object.keys(DRAW).sort()) {
    const st = DRAW[k];
    if (!st || st.tn !== g.tn) continue;
    line(String(st.p || '').split(',').map(Number), st.c || '#111', st.w || 8);
  }
  if (padStroke && padStroke.tn === g.tn) line(padStroke.pts, padStroke.c, padStroke.w);
}

function padPos(e) {
  const r = PAD.getBoundingClientRect();
  return [Math.round(((e.clientX - r.left) / r.width) * 1000), Math.round(((e.clientY - r.top) / r.height) * 1000)];
}
function iDraw() { const g = S?.g; return g && g.id === 'zeichnen' && g.sub === 'turn' && A(g.actors)[g.ai] === me; }
function flushStroke(end) {
  if (!padStroke || padStroke.pts.length < 2) { if (end) padStroke = null; return; }
  db.push('draw', { tn: padStroke.tn, c: padStroke.c, w: padStroke.w, p: padStroke.pts.join(',') });
  const last = padStroke.pts.slice(-2);
  padStroke = end ? null : { ...padStroke, pts: last };
  padFlush = performance.now();
}
PAD.addEventListener('pointerdown', (e) => {
  if (!iDraw()) return;
  e.preventDefault();
  try { PAD.setPointerCapture(e.pointerId); } catch {}
  padStroke = { tn: S.g.tn, c: L.pen, w: L.pen === '#ffffff' ? 40 : 9, pts: padPos(e) };
  padFlush = performance.now(); drawPad();
});
PAD.addEventListener('pointermove', (e) => {
  if (!padStroke) return;
  e.preventDefault();
  padStroke.pts.push(...padPos(e));
  drawPad();
  if (performance.now() - padFlush > 150) flushStroke(false);
});
['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => PAD.addEventListener(ev, () => flushStroke(true)));

function viewZeichnen(g) {
  const actors = A(g.actors), actor = actors[g.ai], q = A(g.queue), wrong = A(g.wrong);
  const queueList = q.length
    ? `<ol class="queue">${q.map((p, i) => `<li class="${i === 0 ? 'now' : ''}">${chip(p)}${i === 0 ? '<span>rät jetzt</span>' : ''}</li>`).join('')}</ol>`
    : '<p class="hint center">Noch niemand hat gedrückt.</p>';
  const hit = g.lastHit && g.lastHit.tn === g.tn - 1 ? `<div class="banner good">${esc(g.lastHit.say || '')}</div>` : '';
  let body = '';
  if (g.sub === 'ready') {
    body = `<div class="who">${chip(actor, 'big')}<span>zeichnet als Nächstes</span></div>
      ${actor === me ? '<div class="banner gold">Gleich erscheint dein Begriff. Niemandem zeigen!</div>' : '<p class="hint center">Gleich wird geraten.</p>'}
      <div class="kick">Start in ${timer(g.until, 'big')}</div>`;
  } else if (actor === me) {
    body = `<div class="secret small"><small>${esc(g.cat)}</small><b>${esc(g.term)}</b></div>
      <div id="padslot" class="padwrap"></div>
      <div class="pens">${PEN_COLORS.map((c) => `<button class="pencol ${L.pen === c ? 'sel' : ''}" style="--pc:${c}" data-act="pen" data-c="${c}" aria-label="Farbe"></button>`).join('')}
        <button class="pencol eraser ${L.pen === '#ffffff' ? 'sel' : ''}" data-act="pen" data-c="#ffffff" aria-label="Radierer">🧽</button>
        <button class="btn ghost small" data-act="padClear">🗑️ Alles löschen</button></div>
      <h3>Wer hat gedrückt?</h3>${queueList}
      ${q.length ? `<div class="row judge"><button class="btn gold" data-act="djudge" data-ok="1" data-tn="${g.tn}">✅ Richtig</button><button class="btn danger" data-act="djudge" data-ok="0" data-tn="${g.tn}">❌ Falsch</button></div>` : ''}
      ${hit}
      <button class="btn ghost" data-act="dskip" data-tn="${g.tn}">⏭️ Begriff überspringen</button>`;
  } else {
    const myPos = q.indexOf(me);
    body = `<div class="who row center">${chip(actor)}<span>zeichnet · Kategorie: <b>${esc(g.cat)}</b></span></div>
      <div id="padslot" class="padwrap"></div>
      ${hit}
      ${g.lastWrong && wrong.includes(g.lastWrong.pid) ? `<div class="banner bad">${chip(g.lastWrong.pid)} lag falsch</div>` : ''}
      ${wrong.includes(me) ? '<div class="done">Falsch geraten – bei diesem Begriff bist du raus.</div>'
        : myPos === 0 ? '<div class="banner gold big">Du bist dran – sag laut, was es ist!</div>'
        : myPos > 0 ? `<div class="done">Du bist Nr. ${myPos + 1} in der Reihe.</div>`
        : `<button class="buzz small" data-fast="dbuzz" data-tn="${g.tn}">ICH WEISS ES!</button>`}
      <h3>Reihenfolge</h3>${queueList}`;
  }
  return `<section class="card game">
    <div class="qhead"><span>Zeichner ${g.ai + 1}/${actors.length}</span>${g.sub === 'turn' ? timer(g.until) : ''}</div>${body}</section>${miniBoard(g.pts, 'Punkte')}`;
}

function nextAliveClient(g, pid) {
  const alive = A(g.alive), ord = order().filter((p) => alive.includes(p) || p === pid);
  const i = ord.indexOf(pid);
  for (let k = 1; k <= ord.length; k++) { const q = ord[(i + k) % ord.length]; if (alive.includes(q) && q !== pid) return q; }
  return pid;
}

function viewBombe(g) {
  const alive = A(g.alive), out = A(g.out);
  let body = '';
  if (g.sub === 'ready') {
    body = `<div class="bombwait">💣</div><div class="who">${chip(g.holder, 'big')}<span>bekommt die Bombe zuerst</span></div><div class="kick">Zündung in ${timer(g.until, 'big')}</div>`;
  } else if (g.sub === 'live') {
    const mine = g.holder === me, nx = nextAliveClient(g, g.holder);
    const passed = L.passed === `${g.n}_${g.passes}`;
    body = `<div class="secret"><small>Kategorie</small><b>${esc(g.cat)}</b></div>
      ${mine ? `<div class="holder"><div class="bombbig">💣</div><p>Du hast die Bombe! Begriff nennen, dann:</p>
        <button class="btn danger huge" data-fast="pass" data-n="${g.n}" ${passed ? 'disabled' : ''}>WEITER ➜ ${esc(nm(nx))}</button></div>`
        : `<div class="who">${chip(g.holder, 'big')}<span>hat die Bombe 💣</span></div><p class="hint center">Als Nächstes: ${esc(nm(nx))}</p>`}`;
  } else if (g.sub === 'boom' && g.boom) {
    const it = A(S.pen).find((x) => x.id === g.boom.pen);
    body = `<div class="boom">💥 BOOM!</div><div class="who">${chip(g.boom.pid, 'big')}<span>fliegt raus auf Platz ${g.boom.place}</span></div>${g.boom.say ? `<div class="banner bad">${esc(g.boom.say)}</div>` : ''}${it ? `<ul class="pen">${penItem(it)}</ul>` : ''}`;
  } else {
    body = `<div class="boom">🏆</div>`;
  }
  return `<section class="card game ${g.sub === 'live' && g.holder === me ? 'shaky' : ''}">
    <div class="qhead"><span>Bombe ${(g.n || 0) + 1} · noch ${alive.length} im Spiel</span></div>${body}</section>
    <section class="card"><h3>Im Spiel</h3><div class="chips">${order().filter((p) => alive.includes(p)).map((p) => chip(p, g.holder === p && g.sub === 'live' ? 'hot' : '')).join('')}</div>
    ${out.length ? `<h3>Raus</h3><div class="chips">${out.map((p) => chip(p, 'out')).join('')}</div>` : ''}</section>`;
}

function viewPlay() {
  const g = S.g; if (!g) return '';
  switch (g.id) {
    case 'schaetz': return viewSchaetz(g);
    case 'stopp': return viewStopp(g);
    case 'buzzer': return viewBuzzer(g);
    case 'zeichnen': return viewZeichnen(g);
    case 'bombe': return viewBombe(g);
  }
  return '';
}

// ---------------- Ergebnis, Strafen, Rad, Tabelle ----------------
function viewResult() {
  const R = ROUNDS[S.round], rows = A(S.res?.rows);
  return `<section class="card">
    <div class="stagebig">${esc(R.stage)} · ${esc(R.name)}</div>
    <h2>Ergebnis der Runde</h2>
    ${S.res?.say ? `<div class="banner gold">${esc(S.res.say)}</div>` : ''}
    <ol class="table">${rows.map((r) => `<li class="${r.place === 1 ? 'first' : ''} ${r.place === rows[rows.length - 1].place && rows.length > 1 ? 'last' : ''}">
      <span class="pl">${r.place}.</span><span class="mid">${chip(r.pid)}<small class="det">${esc(r.det)}</small></span><span class="pts">+${r.pts}</span></li>`).join('')}</ol>
    ${R.double ? '<p class="hint center">Final: doppelte Punkte!</p>' : ''}
  </section>`;
}

function penItem(it) {
  const mine = it.pid === me;
  const jok = O(O(S.stats)[me]).jokers || 0;
  const others = order().filter((p) => p !== me);
  const picker = (act, id) => `<div class="pickgrid small">${others.map((p) => `<button class="pick" data-act="${act}" data-id="${id}" data-target="${p}" style="--c:${P[p]?.color}">${P[p]?.avatar}<span>${esc(nm(p))}</span></button>`).join('')}</div>`;
  switch (it.type) {
    case 'shot':
      if (it.status === 'jokered') return `<li class="pi jok"><s>${chip(it.pid)} ${esc(it.text)}</s><span class="why">🃏 Joker → ${esc(nm(it.to))}</span></li>`;
      return `<li class="pi shot">${chip(it.pid)}<span class="what">${esc(it.text)}</span><span class="why">${esc(it.reason || '')}</span>
        ${mine && jok > 0 ? (L.jokerFor === it.id ? `<label>Joker: An wen geht der Shot?</label>${picker('joker', it.id)}<button class="btn ghost small" data-act="jokerCancel">Abbrechen</button>`
          : `<button class="btn small" data-act="jokerOpen" data-id="${it.id}">🃏 Joker einsetzen (${jok})</button>`) : ''}</li>`;
    case 'water': return `<li class="pi">${chip(it.pid)}<span class="what">${esc(it.text)}</span></li>`;
    case 'cocktail':
      if (it.choice) return `<li class="pi cocktail">${chip(it.pid)}<span class="what">🍸 gönnt sich: <b>${esc(it.choice)}</b></span></li>`;
      return `<li class="pi cocktail">${chip(it.pid)}<span class="what">🍸 darf einen Cocktail wählen</span>
        ${mine ? `<div class="row">${C.COCKTAILS.map((c) => `<button class="btn gold small" data-act="cocktail" data-id="${it.id}" data-v="${esc(c)}">${esc(c)}</button>`).join('')}</div>` : ''}</li>`;
    case 'give':
      if (it.target) return `<li class="pi">${chip(it.pid)}<span class="what">🎯 schenkt ${esc(nm(it.target))} einen Shot</span></li>`;
      return `<li class="pi">${chip(it.pid)}<span class="what">🎯 darf einen Shot verteilen</span>${mine ? `<label>Wer bekommt ihn?</label>${picker('give', it.id)}` : ''}</li>`;
    case 'exen': return `<li class="pi shot">${chip(it.pid)}<span class="what">🍺 Hauptgetränk exen!</span></li>`;
    case 'task': return `<li class="pi shot">${chip(it.pid)}<span class="what">${esc(it.text)}</span></li>`;
  }
  return '';
}

function viewPenalty() {
  return `<section class="card"><h2>Strafen & Belohnungen</h2>
    <ul class="pen">${A(S.pen).map(penItem).join('') || '<li class="pi">Keine Strafen – unglaublich.</li>'}</ul>
    <p class="hint">Prost! Wer einen Joker hat, kann einen Shot weitergeben.</p></section>`;
}

const WCOL = ['#f5c542', '#3fd0ff', '#ff3d81', '#3ddc97', '#b388ff', '#ff8a3d'];
function wheelSvg() {
  const n = C.WHEEL.length, r = 140, cx = 150, cy = 150;
  let s = '';
  C.WHEEL.forEach((w, i) => {
    const a0 = ((i * 360) / n - 90) * Math.PI / 180, a1 = (((i + 1) * 360) / n - 90) * Math.PI / 180;
    s += `<path d="M${cx},${cy} L${cx + r * Math.cos(a0)},${cy + r * Math.sin(a0)} A${r},${r} 0 0 1 ${cx + r * Math.cos(a1)},${cy + r * Math.sin(a1)} Z" fill="${WCOL[i % WCOL.length]}" stroke="#0b1238" stroke-width="3"/>`;
    const am = ((i + 0.5) * 360) / n - 90, rad = am * Math.PI / 180;
    s += `<g transform="translate(${cx + r * 0.63 * Math.cos(rad)},${cy + r * 0.63 * Math.sin(rad)}) rotate(${am + 90})"><text y="-4" text-anchor="middle" font-size="26">${w.e}</text><text y="18" text-anchor="middle" font-size="14" font-weight="800" fill="#0b1238">${esc(w.s)}</text></g>`;
  });
  return `<div class="wheel"><div class="pointer">▼</div><svg viewBox="0 0 300 300" id="wsvg">${s}<circle cx="150" cy="150" r="24" fill="#0b1238" stroke="#f5c542" stroke-width="4"/><text x="150" y="158" text-anchor="middle" font-size="22">⚽</text></svg></div>`;
}
const SPIN_MS = 4600;
function viewWheel() {
  const w = O(S.wheel);
  const done = w.spinId && db.now() - w.at >= SPIN_MS;
  const canSpin = !w.spinId && (w.for === me || isHost());
  return `<section class="card center"><h2>Glücksrad</h2>
    <div class="who">${chip(w.for, 'big')}<span>ist Letzter und dreht</span></div>
    ${wheelSvg()}
    ${canSpin ? '<button class="btn primary huge" data-act="spin">DREHEN 🎡</button>' : ''}
    ${!w.spinId && !canSpin ? '<p class="hint">Warte, bis gedreht wird …</p>' : ''}
    ${done ? `<div class="banner gold big">${C.WHEEL[w.idx]?.e} ${esc(w.text)}</div>` : ''}
  </section>
  ${done ? `<section class="card"><ul class="pen">${A(S.pen).slice(w.penFrom || 0).map(penItem).join('')}</ul></section>` : ''}`;
}

function viewTable() {
  const ord = order(), sc = O(S.scores);
  const pl = placesFrom(ord, sc, true), prev = O(S.table?.prev);
  const rows = ord.slice().sort((a, b) => pl[a] - pl[b]);
  const R = ROUNDS[S.round];
  return `<section class="card"><h2>Tabelle <small>${esc(R.after)}</small></h2>
    <ol class="table">${rows.map((p, i) => {
      const d = S.round > 0 ? (prev[p] || pl[p]) - pl[p] : 0;
      const arrow = d > 0 ? `<span class="up">▲${d}</span>` : d < 0 ? `<span class="down">▼${-d}</span>` : '<span class="same">•</span>';
      return `<li class="${i === 0 ? 'first' : ''} ${i === rows.length - 1 && rows.length > 1 ? 'last' : ''}"><span class="pl">${pl[p]}.</span>${arrow}${chip(p)}<span class="pts">${sc[p] || 0}</span></li>`;
    }).join('')}</ol>
    <ul class="say">${A(S.table?.lines).map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
  </section>`;
}

function viewTiebreak() {
  const T = O(S.tie), pids = A(T.pids), res = O(T.res);
  const inIt = pids.includes(me), ctx = 'tie';
  return `<section class="card game center"><h2>Stechen! ${timer(T.until)}</h2>
    <p>Gleichstand bei ${pids.map((p) => esc(nm(p))).join(', ')}. Wer näher an <b>5.00 Sekunden</b> stoppt, gewinnt.</p>
    ${inIt ? (res[me] != null ? `<div class="done">Deine Zeit: <b>${Number(res[me]).toFixed(2)} s</b></div>` : stopwatch(ctx, true)) : '<p class="hint">Du schaust zu. Druck machen erlaubt.</p>'}
    <ol class="list">${pids.map((p) => `<li>${chip(p)}<span class="val">${res[p] != null ? Number(res[p]).toFixed(2) + ' s' : '…'}</span></li>`).join('')}</ol>
  </section>`;
}

const REVEAL_MS = 1300;
function viewFinal() {
  const F = O(S.final), rows = A(F.rows), n = rows.length;
  const shown = Math.min(n, Math.floor((db.now() - F.at) / REVEAL_MS) + 1);
  const all = shown >= n;
  const st = O(S.stats);
  const shotKing = order().slice().sort((a, b) => (O(st[b]).shots || 0) - (O(st[a]).shots || 0))[0];
  const podium = all && n >= 2 ? `<div class="podium">${[1, 0, 2].filter((i) => rows[i]).map((i) => `<div class="pod p${i + 1}"><div class="pav" style="--c:${P[rows[i].pid]?.color}">${P[rows[i].pid]?.avatar}</div><b>${esc(nm(rows[i].pid))}</b><div class="block">${rows[i].place}</div></div>`).join('')}</div>` : '';
  return `<section class="card center finalcard">
    ${TROPHY}
    <h1>Siegerehrung</h1>
    ${all ? `<div class="banner gold big">${esc(F.champ)}</div>` : '<p class="hint">Die Tabelle wird von hinten aufgedeckt …</p>'}
    ${podium}
  </section>
  <section class="card"><h2>Schlusstabelle</h2>
    <ol class="table">${rows.map((r, i) => {
      const vis = i >= n - shown;
      return vis ? `<li class="${i === 0 ? 'first' : ''} ${i === n - 1 ? 'last' : ''} reveal"><span class="pl">${r.place}.</span>${chip(r.pid)}<span class="pts">${r.score}</span></li>`
        : `<li class="hidden"><span class="pl">${r.place}.</span><span class="pchip"><i>❔</i><b>???</b></span><span class="pts">?</span></li>`;
    }).join('')}</ol>
  </section>
  ${all ? `<section class="card"><h2>Belohnung & Strafe</h2>
    <p class="banner bad">${esc(F.loser)}</p>
    <ul class="pen">${A(S.pen).map(penItem).join('')}</ul>
    ${shotKing && O(st[shotKing]).shots ? `<p class="hint">🥃 Shot-König: <b>${esc(nm(shotKing))}</b> mit ${O(st[shotKing]).shots} Shots.</p>` : ''}
  </section>` : ''}`;
}

// ---------------- Spielleiter-Leiste ----------------
function hostBar() {
  if (!isHost() || !S) return '';
  const ph = S.phase, g = S.g;
  let b = '';
  const btn = (act, label, cls = 'primary', extra = '') => `<button class="btn ${cls}" data-act="${act}" ${extra}>${label}</button>`;
  switch (ph) {
    case 'lobby': b = btn('next', `Anpfiff ▶ (${order().length})`, 'primary', order().length < 2 ? 'disabled' : ''); break;
    case 'rules': b = btn('next', 'Los geht\'s ▶'); break;
    case 'intro': b = btn('plus', '+1 Min', 'ghost') + btn('next', 'Anpfiff ▶'); break;
    case 'play': {
      const canStep = g && (g.id === 'schaetz' || (g.id === 'buzzer' && g.sub !== 'answer') || g.id === 'zeichnen' || (g.id === 'bombe' && g.sub !== 'live'));
      b = btn('plus', '+1 Min', 'ghost') + (canStep ? btn('step', 'Weiter ⏭', 'ghost') : '') + btn('endRound', 'Runde beenden ⏹', 'danger');
      break;
    }
    case 'result': b = btn('next', 'Strafen ▶'); break;
    case 'penalty': b = btn('next', 'Glücksrad ▶'); break;
    case 'wheel': b = S.wheel?.spinId ? btn('next', 'Tabelle ▶') : btn('spin', 'Drehen 🎡'); break;
    case 'table': b = btn('next', S.round < ROUNDS.length - 1 ? 'Nächste Runde ▶' : 'Siegerehrung 🏆'); break;
    case 'tiebreak': b = btn('next', 'Auswerten ▶'); break;
    case 'final': b = btn('restart', 'Neues Turnier', 'ghost'); break;
  }
  return `<nav class="hostbar"><button class="btn ghost icononly" data-act="menu" aria-label="Menü">☰</button>${b}</nav>`;
}

const DRINK_LABEL = { shot: '🥃 Shot', water: '💧 Wasser', cocktail: '🍸 Cocktail', exen: '🍺 Exen' };
function drinksSheet() {
  if (!L.drinks || !S) return '';
  const st = O(S.stats), log = A(S.log).slice().reverse();
  const rows = order().slice().sort((a, b) => (O(st[b]).shots || 0) - (O(st[a]).shots || 0));
  const mine = log.filter((x) => x.pid === me);
  const line = (x) => `<li class="${x.j ? 'jok' : ''}">${chip(x.pid)}<span class="what">${DRINK_LABEL[x.k] || x.k}${x.k === 'cocktail' ? ': ' + esc(x.why) : ''}</span>
    <span class="why">${x.k === 'cocktail' ? '' : esc(x.why || '')}${x.j ? ` · 🃏 an ${esc(nm(x.j))} weitergegeben` : ''}${x.r >= 0 && ROUNDS[x.r] ? ` · ${esc(ROUNDS[x.r].stage)}` : ''}</span></li>`;
  return `<div class="overlay" data-act="drinksClose"><div class="sheet" data-stop="1">
    <h2>🍻 Getränke-Bilanz</h2>
    <div class="menu-drinks">
      <div><b>🥃 Shot</b><span>${esc(C.SHOT)}</span></div>
      <div><b>🍸 Cocktails</b><span>${C.COCKTAILS.map(esc).join(' · ')}</span></div>
      <div><b>🍺 Exen</b><span>Hauptgetränk in einem Zug</span></div>
      <div><b>⛔ Limit</b><span>${S.settings?.shotLimit ?? 5} Shots pro Person, danach Wasser</span></div>
    </div>
    <table class="drinktab"><thead><tr><th></th><th>🥃</th><th>🍸</th><th>🍺</th><th>🃏</th></tr></thead><tbody>
      ${rows.map((p) => { const x = O(st[p]); return `<tr class="${p === me ? 'mine' : ''}"><td>${chip(p)}</td><td>${x.shots || 0}</td><td>${x.cocktails || 0}</td><td>${x.exen || 0}</td><td>${x.jokers ?? 0}</td></tr>`; }).join('')}
    </tbody></table>
    <p class="hint">🥃 Shots · 🍸 Cocktails · 🍺 Exen · 🃏 übrige Joker</p>
    <h3>Deine Getränke (${mine.length})</h3>
    <ul class="drinklog">${mine.map(line).join('') || '<li class="hint">Noch nichts – das ändert sich gleich.</li>'}</ul>
    <h3>Protokoll aller Getränke (${log.length})</h3>
    <ul class="drinklog">${log.map(line).join('') || '<li class="hint">Noch nichts getrunken.</li>'}</ul>
    <button class="btn" data-act="drinksClose">Schliessen</button>
  </div></div>`;
}

function hostMenu() {
  if (!L.menu || !isHost()) return '';
  const sc = O(S.scores);
  return `<div class="overlay" data-act="menuClose"><div class="sheet" data-stop="1">
    <h2>Spielleiter-Menü</h2>
    <h3>Punkte korrigieren</h3>
    <ul class="list compact">${order().map((p) => `<li>${chip(p)}<span class="stepper"><button data-act="adj" data-pid="${p}" data-d="-1">−</button><b>${sc[p] || 0}</b><button data-act="adj" data-pid="${p}" data-d="1">+</button></span></li>`).join('')}</ul>
    <p class="hint">Raum-Code: <b>${esc(code)}</b> · Spieler können jederzeit mit demselben Namen wieder beitreten.</p>
    <button class="btn danger" data-act="restart">Turnier neu starten</button>
    <button class="btn" data-act="menuClose">Schliessen</button>
  </div></div>`;
}

// ---------------- Rendering ----------------
function view() {
  if (screen === 'home') return viewHome();
  if (screen === 'profile') return viewProfile();
  if (!S || !P[me]) return header() + '<p class="wait">Verbinde mit dem Stadion …</p>';
  let body = '';
  switch (S.phase) {
    case 'lobby': body = viewLobby(); break;
    case 'rules': body = viewRules(); break;
    case 'intro': body = viewIntro(); break;
    case 'play': body = viewPlay(); break;
    case 'result': body = viewResult(); break;
    case 'penalty': body = viewPenalty(); break;
    case 'wheel': body = viewWheel(); break;
    case 'table': body = viewTable(); break;
    case 'tiebreak': body = viewTiebreak(); break;
    case 'final': body = viewFinal(); break;
  }
  return header() + `<main class="ph-${S.phase}">${body}</main>` + hostBar() + hostMenu() + drinksSheet();
}

function render() {
  const html = view();
  if (html === lastHtml) return;
  const keep = {};
  app.querySelectorAll('input[id]').forEach((el) => { keep[el.id] = el.value; });
  const focus = document.activeElement?.id;
  app.innerHTML = html;
  lastHtml = html;
  for (const [id, v] of Object.entries(keep)) { const el = document.getElementById(id); if (el && !el.value) el.value = v; }
  if (focus) document.getElementById(focus)?.focus();
  afterRender();
  updateTimers();
}

let qrLib = null;
function afterRender() {
  const slot = document.getElementById('padslot');
  if (slot) { slot.appendChild(PAD); PAD.classList.toggle('live', iDraw()); drawPad(); }
  const q = document.getElementById('qr');
  if (q && q.dataset.url) {
    const draw = () => { try { q.innerHTML = ''; new window.QRCode(q, { text: q.dataset.url, width: 168, height: 168, colorDark: '#0b1238', colorLight: '#ffffff' }); } catch {} };
    if (window.QRCode) draw();
    else if (!qrLib) {
      qrLib = document.createElement('script');
      qrLib.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
      qrLib.onload = () => { const el = document.getElementById('qr'); if (el) { lastHtml = ''; render(); } };
      document.head.appendChild(qrLib);
    }
  }
  const w = document.getElementById('wsvg');
  if (w && S?.wheel?.spinId) {
    const R = 360 * 6 - (S.wheel.idx + 0.5) * (360 / C.WHEEL.length) + (S.wheel.jit || 0);
    const el = db.now() - S.wheel.at;
    if (el >= SPIN_MS) w.style.transform = `rotate(${R}deg)`;
    else {
      w.style.transition = 'none'; w.style.transform = 'rotate(0deg)';
      void w.getBoundingClientRect();
      w.style.transition = `transform ${SPIN_MS - el}ms cubic-bezier(.12,.72,.15,1)`;
      w.style.transform = `rotate(${R}deg)`;
    }
  }
  if (S?.phase === 'final' && S.final && L.fxFinal !== S.final.at && db.now() - S.final.at >= A(S.final.rows).length * REVEAL_MS - REVEAL_MS) {
    L.fxFinal = S.final.at; confetti(); SFX.fanfare();
  }
}

// ---------------- Timer & Ticks ----------------
let lastSec = null, lastBombTick = 0;
function updateTimers() {
  const now = db ? db.now() : Date.now();
  let minLeft = Infinity;
  document.querySelectorAll('[data-ends]').forEach((el) => {
    const left = Math.max(0, Number(el.dataset.ends) - now);
    const s = Math.ceil(left / 1000);
    el.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    el.classList.toggle('hot', s <= 10);
    minLeft = Math.min(minLeft, s);
  });
  const bombLive = S?.phase === 'play' && S.g?.id === 'bombe' && S.g.sub === 'live';
  if (!bombLive && minLeft <= 5 && minLeft > 0 && minLeft !== lastSec) { lastSec = minLeft; SFX.tick(0.6); }
  if (bombLive) {
    const el = now - (S.g.started || now);
    const iv = Math.max(110, 900 - el / 45);
    if (now - lastBombTick > iv) { lastBombTick = now; SFX.tick(S.g.holder === me ? 1 : 0.3); }
  }
}
setInterval(updateTimers, 100);
setInterval(() => { if (screen === 'game') render(); }, 400);

// ---------------- Sound- und Vibrations-Effekte ----------------
const vib = (p) => { try { navigator.vibrate && navigator.vibrate(p); } catch {} };
function stateFx(a, b) {
  if (!a || !b) return;
  if (a.phase !== b.phase) {
    if (b.phase === 'intro') SFX.whistle();
    if (b.phase === 'result') SFX.jingle();
    L.jokerFor = null; L.menu = L.menu && b.phase === a.phase;
  }
  const ga = O(a.g), gb = O(b.g);
  if (gb.id === 'buzzer') {
    if (gb.who && gb.who !== ga.who) { SFX.buzz(); vib(80); }
    if (gb.last?.k && gb.last.k !== ga.last?.k) (gb.last.ok ? SFX.ding : SFX.honk)();
  }
  if (gb.id === 'zeichnen') {
    if (gb.lastHit?.tn && gb.lastHit.tn !== ga.lastHit?.tn) SFX.ding();
    if (gb.lastWrong?.k && gb.lastWrong.k !== ga.lastWrong?.k) SFX.honk();
    if (A(gb.queue).length > A(ga.queue).length) { SFX.buzz(); vib(60); }
    if (gb.tn !== ga.tn) padStroke = null;
  }
  if (gb.id === 'schaetz' && gb.sub === 'reveal' && ga.sub !== 'reveal') SFX.jingle();
  if (gb.id === 'bombe' && gb.boom?.at && gb.boom.at !== ga.boom?.at) {
    SFX.boom(); vib([250, 80, 400]);
    document.body.classList.add('shake'); setTimeout(() => document.body.classList.remove('shake'), 700);
  }
  if (b.wheel?.spinId && b.wheel.spinId !== a.wheel?.spinId) SFX.spin();
}

// ---------------- Eingaben ----------------
const handlers = {
  sound: () => { SFX.toggle(); lastHtml = ''; render(); },
  home: () => { screen = 'home'; L.err = ''; render(); },
  goCreate: () => { L.mode = 'create'; goProfile(); },
  goJoin: () => {
    const v = (document.getElementById('joincode')?.value || '').trim().toUpperCase();
    if (v.length !== 4) { alert('Bitte den 4-stelligen Raum-Code eingeben.'); return; }
    L.joinCode = v; L.mode = 'join'; goProfile();
  },
  av: (d) => { L.avatar = d.v; render(); },
  doProfile: async () => {
    const name = (document.getElementById('pname')?.value || '').trim();
    if (!name) { L.err = 'Bitte einen Namen eingeben.'; return render(); }
    if (!L.avatar) { L.err = 'Bitte einen Avatar wählen.'; return render(); }
    L.busy = true; L.err = ''; render();
    try { L.mode === 'create' ? await createRoom(name, L.avatar) : await joinRoom(L.joinCode, name, L.avatar); }
    catch (e) { console.error(e); L.busy = false; L.err = 'Das hat nicht geklappt. Internet und Firebase-Konfiguration prüfen.'; render(); }
  },
  share: async () => {
    const url = roomLink(code), text = `${C.TITLE} – ${C.SUBTITLE}. Raum-Code ${code}`;
    try { if (navigator.share) await navigator.share({ title: C.TITLE, text, url }); else { await navigator.clipboard.writeText(url); alert('Link kopiert!'); } } catch {}
  },
  seat: (d) => hostCmd('seat', { pid: d.pid, dir: d.dir }),
  kick: (d) => { if (confirm(`${nm(d.pid)} entfernen?`)) hostCmd('kick', { pid: d.pid }); },
  limit: (d) => hostCmd('shotLimit', { d: d.d }),
  cat: (d) => hostCmd('cat', { id: d.id }),
  bot: () => hostCmd('addBot'),
  next: () => hostCmd('next'),
  step: () => hostCmd('step'),
  plus: () => hostCmd('plus'),
  endRound: () => { if (confirm('Runde jetzt beenden und auswerten?')) hostCmd('next'); },
  restart: () => { if (confirm('Wirklich ein neues Turnier starten? Alle Punkte werden gelöscht.')) { L.menu = false; hostCmd('restart'); } },
  menu: () => { L.menu = true; render(); },
  menuClose: () => { L.menu = false; render(); },
  adj: (d) => hostCmd('adjust', { pid: d.pid, d: d.d }),
  est: (d) => {
    const el = document.getElementById('est');
    const v = Number(String(el?.value || '').replace(',', '.'));
    if (!el?.value || !isFinite(v)) { el?.focus(); return; }
    send('est', { q: Number(d.q), v }); el.value = '';
  },
  swstart: (d) => { SFX.click(); L.sw = { ctx: d.ctx, running: true, start: performance.now() }; render(); requestAnimationFrame(swLoop); },
  ans: (d) => send('ans', { q: Number(d.q), opt: Number(d.opt) }),
  djudge: (d) => send('djudge', { tn: Number(d.tn), ok: d.ok === '1' }),
  dskip: (d) => send('dskip', { tn: Number(d.tn) }),
  pen: (d) => { L.pen = d.c; render(); },
  padClear: () => { if (confirm('Ganze Zeichnung löschen?')) db.remove('draw'); },
  drinks: () => { L.drinks = true; render(); },
  drinksClose: () => { L.drinks = false; render(); },
  cocktail: (d) => send('cocktail', { id: d.id, choice: d.v }),
  give: (d) => send('give', { id: d.id, target: d.target }),
  jokerOpen: (d) => { L.jokerFor = d.id; render(); },
  jokerCancel: () => { L.jokerFor = null; render(); },
  joker: (d) => { send('joker', { id: d.id, target: d.target }); L.jokerFor = null; render(); },
  spin: () => { if (isHost()) hostCmd('spin'); else send('spin'); },
};

// Schnelle Knöpfe (Stoppuhr, Buzzer, Bombe) reagieren schon beim Antippen
const fast = {
  swstop: () => {
    if (!L.sw?.running) return;
    const t = (performance.now() - L.sw.start) / 1000, ctx = L.sw.ctx;
    L.sw = { ctx, running: false, last: t };
    if (ctx.startsWith('stopp:')) send('stop', { att: Number(ctx.split(':')[1]), time: +t.toFixed(3) });
    else send('tstop', { time: +t.toFixed(3) });
    SFX.click(); render();
  },
  buzz: (d) => { const g = S.g; L.buzzed = `${g.qi}_${A(g.excl).length}`; send('buzz', { q: Number(d.q) }); SFX.click(); vib(40); render(); },
  dbuzz: (d) => { if (L.dbuzzed === d.tn) return; L.dbuzzed = d.tn; send('dbuzz', { tn: Number(d.tn) }); SFX.click(); vib(40); },
  pass: (d) => { const g = S.g; if (L.passed === `${g.n}_${g.passes}`) return; L.passed = `${g.n}_${g.passes}`; send('pass', { n: Number(d.n) }); SFX.click(); render(); },
};

app.addEventListener('pointerdown', (e) => {
  SFX.unlock();
  const el = e.target.closest('[data-fast]');
  if (el && !el.disabled) { e.preventDefault(); fast[el.dataset.fast]?.(el.dataset); }
});
app.addEventListener('click', (e) => {
  if (e.target.closest('[data-stop]') && !e.target.closest('[data-act]')) return;
  const el = e.target.closest('[data-act]');
  if (!el || el.disabled) return;
  if (el.classList.contains('overlay') && e.target !== el) return;
  handlers[el.dataset.act]?.(el.dataset);
});
app.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  if (e.target.id === 'est') document.querySelector('[data-act="est"]')?.click();
  if (e.target.id === 'joincode') handlers.goJoin();
  if (e.target.id === 'pname') handlers.doProfile();
});

boot();
