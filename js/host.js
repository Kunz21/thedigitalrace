// Spielleiter-Engine: läuft nur auf dem Handy, das den Raum eröffnet hat.
// Sie ist die einzige Instanz, die den Spielstand (state) schreibt.
// Alle anderen Handys schicken nur Aktionen (actions).
import { ROUNDS, ptsFor, placesFrom, uid, rnd, ri, pickOne, shuffle, gauss, COLORS, AVATARS, A, O, D, fill } from './shared.js';
import * as C from './content.js';

export class Host {
  constructor(db, me) {
    this.db = db; this.me = me;
    this.S = null; this.players = {};
    this.done = new Set(); this.botKeys = {};
    this.pending = false; this.buzzWin = null;
  }

  now() { return this.db.now(); }
  name(pid) { return this.players[pid]?.name || '?'; }

  async start() {
    const s = await this.db.get('state');
    this.S = s ? this.norm(s) : this.fresh();
    this.db.on('players', (p) => { this.players = p || {}; this.syncPlayers(); });
    this.db.on('actions', (a) => this.onActions(a || {}));
    this.iv = setInterval(() => { try { this.onTick(); } catch (e) { console.error(e); } }, 200);
    this.commit();
  }

  fresh(keep) {
    return {
      phase: 'lobby', round: -1, endsAt: null,
      order: keep?.order || [], scores: {}, stats: {}, pen: [], hist: [],
      settings: keep?.settings || { shotLimit: 5, cats: C.PANTO.map((c) => c.id) },
      g: null, res: null, wheel: null, table: null, tie: null, final: null, v: 0,
    };
  }

  norm(s) {
    const f = this.fresh();
    s = { ...f, ...s };
    s.order = A(s.order); s.scores = O(s.scores); s.stats = O(s.stats); s.pen = A(s.pen); s.hist = A(s.hist);
    s.settings = { ...f.settings, ...O(s.settings) }; s.settings.cats = A(s.settings.cats);
    return s;
  }

  commit() {
    if (this.pending) return;
    this.pending = true;
    queueMicrotask(() => {
      this.pending = false;
      this.S.v = (this.S.v || 0) + 1;
      this.db.set('state', JSON.parse(JSON.stringify(this.S)));
    });
  }

  stat(pid) {
    const S = this.S;
    if (!S.stats[pid]) S.stats[pid] = { shots: 0, cocktails: 0, jokers: 1 };
    return S.stats[pid];
  }

  syncPlayers() {
    const S = this.S; if (!S) return;
    const ids = Object.keys(this.players);
    let ch = false;
    for (const pid of ids) if (!S.order.includes(pid)) { S.order.push(pid); ch = true; }
    if (ids.length) { const f = S.order.filter((p) => this.players[p]); if (f.length !== S.order.length) { S.order = f; ch = true; } }
    for (const pid of S.order) {
      if (!S.stats[pid]) { this.stat(pid); ch = true; }
      if (S.scores[pid] == null) { S.scores[pid] = 0; ch = true; }
    }
    // Farben eindeutig halten
    const used = new Set();
    for (const pid of S.order) {
      const p = this.players[pid]; if (!p) continue;
      if (!p.color || used.has(p.color)) {
        const c = COLORS.find((c) => !used.has(c)) || '#ffffff';
        used.add(c); this.db.update('players/' + pid, { color: c });
      } else used.add(p.color);
    }
    if (ch) this.commit();
  }

  // ---------- Aktionen der Spieler ----------
  onActions(all) {
    for (const k of Object.keys(all).sort()) {
      if (this.done.has(k)) continue;
      this.done.add(k);
      const a = all[k];
      this.db.remove('actions/' + k);
      try { this.act(a); } catch (e) { console.error(e); }
    }
  }

  act(a) {
    const S = this.S, g = S.g, n = this.now();
    if (!a || !a.pid || !S.order.includes(a.pid)) return;
    const inGame = (id) => S.phase === 'play' && g && g.id === id;
    switch (a.t) {
      case 'est':
        if (inGame('schaetz') && g.sub === 'ask' && a.q === g.qi && isFinite(Number(a.v))) {
          const k = 'q' + g.qi; g.ans = O(g.ans); g.ans[k] = O(g.ans[k]);
          g.ans[k][a.pid] = Number(a.v);
          if (S.order.every((p) => g.ans[k][p] != null)) this.scReveal();
        }
        break;
      case 'stop':
        if (inGame('stopp')) {
          g.res = O(g.res); const r = A(g.res[a.pid]);
          if (r.length === a.att && a.att < 2 && isFinite(Number(a.time))) {
            r.push(Number(a.time)); g.res[a.pid] = r;
            if (S.order.every((p) => A(g.res[p]).length >= 2)) g.until = Math.min(g.until, n + 2500);
          }
        }
        break;
      case 'buzz':
        if (inGame('buzzer') && g.sub === 'open' && a.q === g.qi && !A(g.excl).includes(a.pid)) {
          if (!this.buzzWin) { this.buzzWin = { qi: g.qi, c: [] }; setTimeout(() => this.bzResolve(), 350); }
          if (!this.buzzWin.c.some((x) => x.pid === a.pid)) this.buzzWin.c.push({ pid: a.pid, at: a.at || n });
        }
        return;
      case 'ans':
        if (inGame('buzzer') && g.sub === 'answer' && g.who === a.pid && a.q === g.qi) this.bzAnswer(a.pid, Number(a.opt));
        break;
      case 'panto':
        if (inGame('panto') && g.sub === 'turn' && A(g.actors)[g.ai] === a.pid && a.tn === g.tn) {
          if (a.guesser && a.guesser !== a.pid && S.order.includes(a.guesser)) {
            g.pts = O(g.pts);
            g.pts[a.pid] = (g.pts[a.pid] || 0) + 1;
            g.pts[a.guesser] = (g.pts[a.guesser] || 0) + 1;
            g.lastHit = { pid: a.guesser, term: g.term, tn: g.tn };
          }
          this.ptTerm();
        }
        break;
      case 'pass':
        if (inGame('bombe') && g.sub === 'live' && g.holder === a.pid && a.n === g.n) {
          g.holder = this.nextAlive(g.holder); g.passes = (g.passes || 0) + 1;
        }
        break;
      case 'cocktail': {
        const it = S.pen.find((x) => x.id === a.id);
        if (it && it.type === 'cocktail' && it.pid === a.pid && !it.choice && C.COCKTAILS.includes(a.choice)) {
          it.choice = a.choice; this.stat(a.pid).cocktails++;
        }
        break;
      }
      case 'give': {
        const it = S.pen.find((x) => x.id === a.id);
        if (it && it.type === 'give' && it.pid === a.pid && !it.target && S.order.includes(a.target) && a.target !== a.pid) {
          it.target = a.target;
          this.addShot(a.target, `Geschenk von ${this.name(a.pid)}`, a.pid);
        }
        break;
      }
      case 'joker': {
        const it = S.pen.find((x) => x.id === a.id);
        const st = this.stat(a.pid);
        if (it && it.type === 'shot' && it.pid === a.pid && it.status !== 'jokered' && st.jokers > 0 && S.order.includes(a.target) && a.target !== a.pid) {
          st.jokers--; it.status = 'jokered'; it.to = a.target;
          if (it.counted) { st.shots = Math.max(0, st.shots - 1); it.counted = false; }
          this.addShot(a.target, `Joker von ${this.name(a.pid)} 🃏`, a.pid);
        }
        break;
      }
      case 'spin':
        if (S.phase === 'wheel' && S.wheel && !S.wheel.spinId && (a.pid === S.wheel.for || a.pid === this.me)) this.spin();
        break;
      case 'tstop':
        if (S.phase === 'tiebreak' && S.tie && A(S.tie.pids).includes(a.pid)) {
          S.tie.res = O(S.tie.res);
          if (S.tie.res[a.pid] == null && isFinite(Number(a.time))) {
            S.tie.res[a.pid] = Number(a.time);
            if (A(S.tie.pids).every((p) => S.tie.res[p] != null)) S.tie.until = Math.min(S.tie.until, n + 2500);
          }
        }
        break;
      default: return;
    }
    this.commit();
  }

  // ---------- Befehle vom Spielleiter-Handy ----------
  cmd(c, arg = {}) {
    const S = this.S, n = this.now();
    switch (c) {
      case 'next': return this.next();
      case 'step': return this.step();
      case 'plus':
        if (S.endsAt) S.endsAt += 60000;
        if (S.g?.until) S.g.until += 60000;
        if (S.tie?.until) S.tie.until += 60000;
        break;
      case 'seat': {
        const i = S.order.indexOf(arg.pid), j = i + Number(arg.dir);
        if (i >= 0 && j >= 0 && j < S.order.length) [S.order[i], S.order[j]] = [S.order[j], S.order[i]];
        break;
      }
      case 'kick':
        if (arg.pid !== this.me) { this.db.remove('players/' + arg.pid); S.order = S.order.filter((p) => p !== arg.pid); }
        break;
      case 'addBot': {
        const used = new Set(Object.values(this.players).map((p) => p.name));
        const nm = C.BOT_NAMES.find((x) => !used.has(x)) || 'Bot ' + uid().slice(0, 3);
        const pid = 'b' + uid();
        this.db.set('players/' + pid, { name: nm, avatar: pickOne(AVATARS), color: '', bot: true, joined: n });
        return;
      }
      case 'adjust':
        S.scores[arg.pid] = (S.scores[arg.pid] || 0) + Number(arg.d);
        break;
      case 'shotLimit':
        S.settings.shotLimit = Math.max(1, Math.min(20, (S.settings.shotLimit || 5) + Number(arg.d)));
        break;
      case 'cat': {
        const cats = new Set(S.settings.cats);
        cats.has(arg.id) ? cats.delete(arg.id) : cats.add(arg.id);
        S.settings.cats = [...cats];
        break;
      }
      case 'spin': if (S.phase === 'wheel') this.spin(); return;
      case 'restart': {
        this.S = this.fresh(S);
        for (const pid of this.S.order) { this.S.scores[pid] = 0; this.stat(pid); }
        this.botKeys = {};
        break;
      }
      default: return;
    }
    this.commit();
  }

  next() {
    const S = this.S, n = this.now();
    switch (S.phase) {
      case 'lobby':
        if (S.order.length < 2) return;
        S.phase = 'rules'; S.endsAt = n + D(300);
        S.hist = []; S.scores = {}; S.stats = {};
        for (const pid of S.order) { S.scores[pid] = 0; this.stat(pid); }
        break;
      case 'rules': return this.intro(0);
      case 'intro': return this.startGame();
      case 'play': return this.finishGame();
      case 'result': return this.enterPenalty();
      case 'penalty': return this.enterWheel();
      case 'wheel': if (!S.wheel?.spinId) return this.spin(); return this.enterTable();
      case 'table': return S.round < ROUNDS.length - 1 ? this.intro(S.round + 1) : this.finalize(false);
      case 'tiebreak': return this.finalize(true);
      default: return;
    }
    this.commit();
  }

  // Unterschritt innerhalb eines Spiels («Weiter»)
  step() {
    const S = this.S, g = S.g;
    if (S.phase !== 'play' || !g) return;
    switch (g.id) {
      case 'schaetz': g.sub === 'ask' ? this.scReveal() : this.scNext(); break;
      case 'stopp': return this.finishGame();
      case 'buzzer': if (g.sub === 'open') this.bzReveal(); else if (g.sub === 'reveal') this.bzNext(); break;
      case 'panto': g.sub === 'ready' ? this.ptTurn() : this.ptNext(); break;
      case 'bombe': if (g.sub === 'ready') this.boLive(); else if (g.sub === 'boom') this.boAfter(); break;
    }
    this.commit();
  }

  onTick() {
    const S = this.S, n = this.now();
    if (!S) return;
    this.bots();
    switch (S.phase) {
      case 'rules': if (S.endsAt && n >= S.endsAt) this.intro(0); break;
      case 'intro': if (S.endsAt && n >= S.endsAt) this.startGame(); break;
      case 'play':
        this.gameTick(n);
        if (S.phase === 'play' && S.endsAt && n >= S.endsAt) this.finishGame();
        break;
      case 'tiebreak': if (S.tie && n >= S.tie.until) this.finalize(true); break;
    }
  }

  // ---------- Ablauf ----------
  intro(r) {
    const S = this.S;
    Object.assign(S, { phase: 'intro', round: r, endsAt: this.now() + D(60), g: null, res: null, pen: [], wheel: null, table: null });
    this.commit();
  }

  startGame() {
    const S = this.S, n = this.now(), R = ROUNDS[S.round];
    S.phase = 'play'; S.endsAt = null;
    switch (R.id) {
      case 'schaetz':
        S.g = { id: 'schaetz', qs: shuffle(C.SCHAETZ.map((_, i) => i)).slice(0, 3), qi: 0, sub: 'ask', until: n + D(60), ans: {} };
        break;
      case 'stopp':
        S.g = { id: 'stopp', until: n + D(150), res: {} };
        break;
      case 'buzzer':
        S.endsAt = n + D(360);
        S.g = { id: 'buzzer', qs: shuffle(C.BUZZER.map((_, i) => i)).slice(0, 10), qi: 0, sub: 'open', until: n + D(20), excl: [], who: null, last: null, pts: {} };
        break;
      case 'panto':
        S.g = { id: 'panto', actors: S.order.slice(), ai: 0, sub: 'ready', until: n + D(6), term: null, cat: null, tn: 0, pts: {}, used: [], lastHit: null };
        break;
      case 'bombe':
        S.g = { id: 'bombe', alive: S.order.slice(), out: [], n: 0, sub: 'ready', until: n + D(6), holder: pickOne(S.order), cat: null, usedCats: [], passes: 0, boom: null };
        break;
    }
    this.commit();
  }

  gameTick(n) {
    const g = this.S.g; if (!g) return;
    const due = g.until && n >= g.until;
    switch (g.id) {
      case 'schaetz': if (due) { g.sub === 'ask' ? this.scReveal() : this.scNext(); this.commit(); } break;
      case 'stopp': if (due) this.finishGame(); break;
      case 'buzzer':
        if (!due) break;
        if (g.sub === 'open') this.bzReveal();
        else if (g.sub === 'answer') this.bzAnswer(g.who, -1);
        else if (g.sub === 'reveal') this.bzNext();
        this.commit(); break;
      case 'panto': if (due) { g.sub === 'ready' ? this.ptTurn() : this.ptNext(); this.commit(); } break;
      case 'bombe':
        if (g.sub === 'ready' && due) { this.boLive(); this.commit(); }
        else if (g.sub === 'live' && g.fuse && n >= g.fuse) { this.boExplode(); this.commit(); }
        else if (g.sub === 'boom' && due) { this.boAfter(); this.commit(); }
        break;
    }
  }

  // Schätzmeister
  scReveal() { const g = this.S.g; g.sub = 'reveal'; g.until = this.now() + D(20); }
  scNext() {
    const g = this.S.g; g.qi++;
    if (g.qi >= A(g.qs).length) return this.finishGame();
    g.sub = 'ask'; g.until = this.now() + D(60);
  }

  // Buzzer
  bzResolve() {
    const w = this.buzzWin; this.buzzWin = null;
    const S = this.S, g = S.g;
    if (!w || !(S.phase === 'play' && g?.id === 'buzzer' && g.sub === 'open' && g.qi === w.qi)) return;
    w.c.sort((x, y) => x.at - y.at);
    g.sub = 'answer'; g.who = w.c[0].pid; g.until = this.now() + D(8);
    this.commit();
  }
  bzAnswer(pid, opt) {
    const S = this.S, g = S.g, q = C.BUZZER[g.qs[g.qi]];
    const ok = opt === q.c;
    g.pts = O(g.pts); g.pts[pid] = (g.pts[pid] || 0) + (ok ? 1 : -1);
    g.last = { pid, ok, opt, qi: g.qi, k: uid() }; g.who = null;
    if (ok) return this.bzReveal();
    g.excl = [...A(g.excl), pid];
    if (S.order.every((p) => g.excl.includes(p))) return this.bzReveal();
    g.sub = 'open'; g.until = this.now() + D(15);
  }
  bzReveal() { const g = this.S.g; g.sub = 'reveal'; g.who = null; g.until = this.now() + D(4); }
  bzNext() {
    const g = this.S.g; g.qi++;
    if (g.qi >= A(g.qs).length) return this.finishGame();
    Object.assign(g, { sub: 'open', until: this.now() + D(20), excl: [], who: null, last: null });
  }

  // Pantomime
  ptTurn() { const g = this.S.g; g.sub = 'turn'; g.until = this.now() + D(45); g.lastHit = null; this.ptTerm(); }
  ptTerm() {
    const g = this.S.g;
    const sel = C.PANTO.filter((c) => this.S.settings.cats.includes(c.id));
    const pool = sel.length ? sel : C.PANTO;
    let used = A(g.used); const opts = [];
    const collect = () => pool.forEach((c) => c.terms.forEach((t, i) => { const k = c.id + ':' + i; if (!used.includes(k)) opts.push({ c, t, k }); }));
    collect();
    if (!opts.length) { used = []; collect(); }
    const o = pickOne(opts);
    g.used = [...used, o.k]; g.term = o.t; g.cat = o.c.name; g.tn = (g.tn || 0) + 1;
  }
  ptNext() {
    const g = this.S.g; g.ai++; g.term = null; g.lastHit = null;
    if (g.ai >= A(g.actors).length) return this.finishGame();
    g.sub = 'ready'; g.until = this.now() + D(6);
  }

  // Bombe
  nextAlive(pid) {
    const g = this.S.g, alive = A(g.alive);
    const ord = this.S.order.filter((p) => alive.includes(p) || p === pid);
    const i = ord.indexOf(pid);
    for (let k = 1; k <= ord.length; k++) { const q = ord[(i + k) % ord.length]; if (alive.includes(q) && q !== pid) return q; }
    return alive[0] || pid;
  }
  boLive() {
    const g = this.S.g, n = this.now();
    const free = C.BOMB.filter((c) => !A(g.usedCats).includes(c));
    g.cat = pickOne(free.length ? free : C.BOMB);
    g.usedCats = [...A(g.usedCats), g.cat];
    if (!A(g.alive).includes(g.holder)) g.holder = pickOne(A(g.alive));
    Object.assign(g, { sub: 'live', started: n, fuse: n + D(rnd(15, 45)), passes: 0, until: null });
  }
  boExplode() {
    const g = this.S.g, v = g.holder;
    g.alive = A(g.alive).filter((p) => p !== v);
    g.out = [...A(g.out), v];
    const it = this.addShot(v, 'Bombe explodiert 💥');
    g.boom = { pid: v, at: this.now(), pen: it.id, place: g.alive.length + 1 };
    g.sub = 'boom'; g.until = this.now() + D(9); g.fuse = null;
    g.holder = this.nextAlive(v);
  }
  boAfter() {
    const g = this.S.g;
    if (A(g.alive).length <= 1) { g.sub = 'done'; return this.finishGame(); }
    g.n++; g.sub = 'ready'; g.until = this.now() + D(5);
  }

  // ---------- Auswertung ----------
  score() {
    const S = this.S, g = S.g, P = S.order;
    const vals = {}, det = {};
    switch (g.id) {
      case 'schaetz': {
        const plc = {}; P.forEach((p) => { vals[p] = 0; plc[p] = []; });
        A(g.qs).forEach((qidx, i) => {
          if (i > g.qi) return;
          const q = C.SCHAETZ[qidx], ans = O(O(g.ans)['q' + i]), diffs = {};
          P.forEach((p) => { if (ans[p] != null) diffs[p] = Math.abs(ans[p] - q.a); });
          const pl = placesFrom(P, diffs, false);
          P.forEach((p) => { vals[p] += pl[p]; plc[p].push(pl[p]); });
        });
        P.forEach((p) => { det[p] = 'Plätze ' + plc[p].join(' · '); });
        return { vals, hi: false, det };
      }
      case 'stopp':
        P.forEach((p) => {
          const r = A(O(g.res)[p]);
          if (r.length) { const best = r.reduce((b, t) => (Math.abs(t - 10) < Math.abs(b - 10) ? t : b)); vals[p] = Math.abs(best - 10); det[p] = best.toFixed(2) + ' s'; }
          else det[p] = 'nicht gestoppt';
        });
        return { vals, hi: false, det };
      case 'buzzer':
      case 'panto':
        P.forEach((p) => { vals[p] = O(g.pts)[p] || 0; det[p] = vals[p] + (g.id === 'panto' ? ' erraten' : Math.abs(vals[p]) === 1 ? ' Punkt' : ' Punkte'); });
        return { vals, hi: true, det };
      case 'bombe': {
        const out = A(g.out);
        P.forEach((p) => { const i = out.indexOf(p); vals[p] = i >= 0 ? i : out.length; det[p] = i >= 0 ? `${i + 1}. Explosion` : 'überlebt 🏆'; });
        return { vals, hi: true, det };
      }
    }
    return { vals, hi: true, det };
  }

  rankMap() { return placesFrom(this.S.order, this.S.scores, true); }

  finishGame() {
    const S = this.S, R = ROUNDS[S.round], P = S.order;
    if (S.phase !== 'play') return;
    const { vals, hi, det } = this.score();
    const places = placesFrom(P, vals, hi);
    S.prevRank = this.rankMap();
    const pts = {};
    P.forEach((p) => { pts[p] = ptsFor(places[p], R.double); S.scores[p] = (S.scores[p] || 0) + pts[p]; });
    S.hist.push({ r: S.round, places, pts });
    const rows = P.slice().sort((a, b) => places[a] - places[b]).map((p) => ({ pid: p, place: places[p], pts: pts[p], det: det[p] || '' }));
    const winners = rows.filter((r) => r.place === rows[0].place).map((r) => r.pid);
    S.res = { rows, say: fill(pickOne(C.SAY.roundWin), { n: winners.map((p) => this.name(p)).join(' & ') }) };
    S.phase = 'result'; S.endsAt = null; this.buzzWin = null;
    this.commit();
  }

  addShot(pid, reason, by = null) {
    const S = this.S, st = this.stat(pid), p = this.players[pid] || {};
    const it = { id: uid(), type: 'shot', pid, reason, by, counted: false, status: 'open' };
    if (p.alcFree) it.text = C.ALC_FREE_SHOT;
    else if (st.shots >= (S.settings.shotLimit || 5)) { it.type = 'water'; it.text = 'Shot-Limit erreicht → ein Glas Wasser 💧'; }
    else { it.text = `1 × ${C.SHOT} 🥃`; st.shots++; it.counted = true; }
    S.pen.push(it);
    return it;
  }

  enterPenalty() {
    const S = this.S, R = ROUNDS[S.round], rows = A(S.res?.rows);
    const best = Math.min(...rows.map((r) => r.place)), worst = Math.max(...rows.map((r) => r.place));
    const win = rows.filter((r) => r.place === best).map((r) => r.pid);
    const lose = rows.filter((r) => r.place === worst).map((r) => r.pid);
    S.pen = [];
    win.forEach((p) => {
      S.pen.push({ id: uid(), type: 'cocktail', pid: p, choice: null });
      S.pen.push({ id: uid(), type: 'give', pid: p, target: null });
    });
    if (R.id !== 'bombe' && worst !== best) lose.forEach((p) => this.addShot(p, 'Rundenletzter'));
    S.winners = win; S.losers = lose;
    S.phase = 'penalty';
    this.commit();
  }

  enterWheel() {
    const S = this.S;
    S.phase = 'wheel';
    S.wheel = { for: A(S.losers)[0] || S.order[S.order.length - 1], spinId: null };
    this.commit();
  }

  spin() {
    const S = this.S;
    if (!S.wheel || S.wheel.spinId) return;
    const idx = ri(C.WHEEL.length), L = S.wheel.for, base = S.pen.length;
    let text = C.WHEEL[idx].t;
    switch (idx) {
      case 0: S.order.forEach((p) => this.addShot(p, 'Glücksrad: Shotrunde')); break;
      case 1: { const nb = S.order[(S.order.indexOf(L) + 1) % S.order.length]; this.addShot(nb, `Glücksrad: links von ${this.name(L)}`); text = `${this.name(nb)} sitzt links von ${this.name(L)} und trinkt`; break; }
      case 2: S.scores[L] = (S.scores[L] || 0) + 2; text = `+2 Punkte für ${this.name(L)}`; break;
      case 3: {
        const max = Math.max(...S.order.map((p) => S.scores[p] || 0));
        const lead = S.order.filter((p) => (S.scores[p] || 0) === max);
        lead.forEach((p) => { S.scores[p] -= 2; });
        text = `−2 Punkte für ${lead.map((p) => this.name(p)).join(' & ')}`; break;
      }
      case 4: this.stat(L).jokers++; text = `${this.name(L)} bekommt einen Joker 🃏`; break;
      case 5: S.pen.push({ id: uid(), type: 'exen', pid: L }); text = `${this.name(L)} ext sein Hauptgetränk 🍺`; break;
    }
    S.wheel = { ...S.wheel, spinId: uid(), idx, at: this.now(), jit: Math.round(rnd(-20, 20)), text, penFrom: base };
    this.commit();
  }

  enterTable() {
    const S = this.S, now = this.rankMap(), prev = O(S.prevRank), P = S.order;
    const lines = [];
    const sorted = P.slice().sort((a, b) => now[a] - now[b]);
    const first = sorted[0], last = sorted[sorted.length - 1];
    if (first) lines.push(fill(pickOne(C.SAY.leader), { n: this.name(first) }));
    let up = null, down = null;
    P.forEach((p) => {
      const d = (prev[p] || now[p]) - now[p];
      if (d >= 2 && (!up || d > up.d)) up = { p, d };
      if (d <= -2 && (!down || d < down.d)) down = { p, d };
    });
    if (S.round > 0 && up) lines.push(fill(pickOne(C.SAY.climb), { n: this.name(up.p), d: up.d }));
    if (S.round > 0 && down && down.p !== last) lines.push(fill(pickOne(C.SAY.fall), { n: this.name(down.p), d: -down.d }));
    if (last && last !== first) lines.push(fill(pickOne(C.SAY.last), { n: this.name(last), p: now[last] }));
    S.table = { prev, lines };
    S.phase = 'table';
    this.commit();
  }

  finalize(afterTie) {
    const S = this.S, P = S.order, n = this.now();
    const lastR = ROUNDS.length - 1;
    const wins = (p) => A(S.hist).filter((h) => O(h.places)[p] === 1).length;
    const fin = (p) => O(A(S.hist).find((h) => h.r === lastR)?.pts)[p] || 0;
    const key = (p) => [S.scores[p] || 0, wins(p), fin(p)];
    const cmp = (a, b) => { const x = key(a), y = key(b); for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return y[i] - x[i]; return 0; };
    let sorted = P.slice().sort(cmp);
    const same = (a, b) => cmp(a, b) === 0;

    if (!afterTie && !S.tie && sorted.length > 1) {
      const top = sorted.filter((p) => same(p, sorted[0]));
      const bot = sorted.filter((p) => same(p, sorted[sorted.length - 1]));
      const groups = [];
      if (top.length > 1) groups.push(top);
      if (bot.length > 1 && !same(sorted[0], sorted[sorted.length - 1])) groups.push(bot);
      if (groups.length) {
        S.tie = { groups: groups.map((g) => g.join(',')), pids: [...new Set(groups.flat())], res: {}, until: n + D(75) };
        S.phase = 'tiebreak';
        return this.commit();
      }
    }
    const tieP = A(S.tie?.pids), tr = O(S.tie?.res);
    const tv = (p) => (tr[p] != null ? Math.abs(tr[p] - 5) : 999);
    const tied = (a, b) => tieP.includes(a) && tieP.includes(b) && tv(a) !== tv(b);
    sorted.sort((a, b) => cmp(a, b) || (tied(a, b) ? tv(a) - tv(b) : 0));
    const places = [];
    sorted.forEach((p, i) => {
      const shareable = i > 1 && i < sorted.length - 1 && same(p, sorted[i - 1]) && !tied(p, sorted[i - 1]);
      places.push(shareable ? places[i - 1] : i + 1);
    });
    const champ = sorted[0], loser = sorted[sorted.length - 1];
    S.pen = [];
    S.pen.push({ id: uid(), type: 'cocktail', pid: champ, choice: null });
    if (loser !== champ) {
      this.addShot(loser, 'Final-Strafe');
      S.pen.push({ id: uid(), type: 'task', pid: loser, text: 'zahlt die nächste Runde 💸' });
    }
    S.final = {
      rows: sorted.map((p, i) => ({ pid: p, place: places[i], score: S.scores[p] || 0 })),
      at: n,
      champ: fill(C.SAY.champion, { n: this.name(champ) }),
      loser: fill(C.SAY.loser, { n: this.name(loser) }),
    };
    S.phase = 'final'; S.endsAt = null;
    this.commit();
  }

  // ---------- Testspieler (Bots) ----------
  bots() {
    const S = this.S;
    for (const pid of S.order) {
      if (!this.players[pid]?.bot) continue;
      const plan = this.botPlan(pid);
      if (!plan || this.botKeys[pid] === plan.key) continue;
      this.botKeys[pid] = plan.key;
      setTimeout(() => { const a = plan.fn(); if (a) this.db.push('actions', { ...a, pid, at: this.now() }); }, D(plan.d));
    }
  }

  botPlan(pid) {
    const S = this.S, g = S.g, others = S.order.filter((p) => p !== pid), r = S.round;
    if (S.phase === 'play' && g) {
      switch (g.id) {
        case 'schaetz':
          if (g.sub === 'ask' && O(O(g.ans)['q' + g.qi])[pid] == null) {
            const qi = g.qi, q = C.SCHAETZ[g.qs[qi]];
            return { key: `r${r}s${qi}`, d: rnd(3, 12), fn: () => ({ t: 'est', q: qi, v: +(q.a * rnd(0.3, 2.2)).toFixed(1) }) };
          }
          break;
        case 'stopp': {
          const k = A(O(g.res)[pid]).length;
          if (k < 2) return { key: `r${r}st${k}`, d: rnd(4, 11), fn: () => ({ t: 'stop', att: k, time: +(10 + gauss() * 1.1).toFixed(2) }) };
          break;
        }
        case 'buzzer': {
          const qi = g.qi, x = A(g.excl).length;
          if (g.sub === 'open' && !A(g.excl).includes(pid)) return { key: `r${r}b${qi}x${x}`, d: rnd(2, 12), fn: () => (Math.random() < 0.45 ? { t: 'buzz', q: qi } : null) };
          if (g.sub === 'answer' && g.who === pid) {
            const q = C.BUZZER[g.qs[qi]];
            return { key: `r${r}ba${qi}x${x}`, d: rnd(1.5, 4), fn: () => ({ t: 'ans', q: qi, opt: Math.random() < 0.55 ? q.c : ri(q.o.length) }) };
          }
          break;
        }
        case 'panto':
          if (g.sub === 'turn' && A(g.actors)[g.ai] === pid) {
            const tn = g.tn;
            return { key: `r${r}p${tn}`, d: rnd(5, 13), fn: () => ({ t: 'panto', tn, guesser: Math.random() < 0.8 ? pickOne(others) : null }) };
          }
          break;
        case 'bombe':
          if (g.sub === 'live' && g.holder === pid) { const nn = g.n; return { key: `r${r}bo${nn}_${g.passes}`, d: rnd(1.5, 5), fn: () => ({ t: 'pass', n: nn }) }; }
          break;
      }
    }
    if (S.phase === 'penalty' || S.phase === 'final') {
      const it = S.pen.find((x) => x.pid === pid && ((x.type === 'cocktail' && !x.choice) || (x.type === 'give' && !x.target)));
      if (it) return { key: 'pen' + it.id, d: rnd(2, 4), fn: () => (it.type === 'cocktail' ? { t: 'cocktail', id: it.id, choice: pickOne(C.COCKTAILS) } : { t: 'give', id: it.id, target: pickOne(others) }) };
    }
    if (S.phase === 'wheel' && S.wheel && !S.wheel.spinId && S.wheel.for === pid) return { key: 'w' + r, d: 3, fn: () => ({ t: 'spin' }) };
    if (S.phase === 'tiebreak' && A(S.tie?.pids).includes(pid) && O(S.tie?.res)[pid] == null) return { key: 'tb', d: rnd(3, 6), fn: () => ({ t: 'tstop', time: +(5 + gauss() * 0.8).toFixed(2) }) };
    return null;
  }
}
