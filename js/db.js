// Datenschicht: Firebase Realtime Database oder lokaler Demo-Modus (localStorage, mehrere Tabs)
import { firebaseConfig } from './config.js';

// ?demo=1 in der URL erzwingt den Demo-Modus (Testen mit Bots, ohne Firebase)
export const isDemo = !(firebaseConfig && firebaseConfig.databaseURL) || new URLSearchParams(location.search).has('demo');
const clean = (v) => (v === undefined ? null : JSON.parse(JSON.stringify(v)));

export async function openRoom(code) {
  return isDemo ? localRoom(code) : fbRoom(code);
}

// ---------- Firebase ----------
const FB_VERSION = '10.12.2';
let fbCache = null;
async function fb() {
  if (fbCache) return fbCache;
  const appM = await import(`https://www.gstatic.com/firebasejs/${FB_VERSION}/firebase-app.js`);
  const D = await import(`https://www.gstatic.com/firebasejs/${FB_VERSION}/firebase-database.js`);
  const app = appM.initializeApp(firebaseConfig);
  const db = D.getDatabase(app);
  let offset = 0;
  D.onValue(D.ref(db, '.info/serverTimeOffset'), (s) => { offset = s.val() || 0; });
  fbCache = { D, db, off: () => offset };
  return fbCache;
}

async function fbRoom(code) {
  const { D, db, off } = await fb();
  const r = (p) => D.ref(db, `rooms/${code}${p ? '/' + p : ''}`);
  return {
    now: () => Date.now() + off(),
    get: async (p) => (await D.get(r(p))).val(),
    set: (p, v) => D.set(r(p), clean(v)),
    update: (p, v) => D.update(r(p), clean(v)),
    remove: (p) => D.remove(r(p)),
    push: (p, v) => { const k = D.push(r(p)); D.set(k, clean(v)); return k.key; },
    on: (p, cb) => D.onValue(r(p), (s) => cb(s.val())),
  };
}

// ---------- Demo-Modus (localStorage) ----------
function localRoom(code) {
  const PFX = `mbg:${code}:`;
  const COLL = ['players', 'actions', 'draw']; // jedes Kind = eigener Schlüssel (weniger Schreibkonflikte)
  const seg = (p) => (p ? p.split('/').filter(Boolean) : []);
  const getIn = (o, s) => { for (const k of s) { if (o == null || typeof o !== 'object') return null; o = o[k]; } return o === undefined ? null : o; };
  const setIn = (o, s, v) => {
    let c = o;
    for (let i = 0; i < s.length - 1; i++) { if (c[s[i]] == null || typeof c[s[i]] !== 'object') c[s[i]] = {}; c = c[s[i]]; }
    if (v == null) delete c[s[s.length - 1]]; else c[s[s.length - 1]] = v;
  };
  const keys = () => { const out = []; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith(PFX)) out.push(k); } return out; };
  const tree = () => { const t = {}; for (const k of keys()) { try { setIn(t, k.slice(PFX.length).split('/'), JSON.parse(localStorage.getItem(k))); } catch {} } return t; };
  const removePrefix = (pre) => keys().filter((k) => k.startsWith(pre)).forEach((k) => localStorage.removeItem(k));

  function write(s, v) {
    v = clean(v);
    if (!s.length) { removePrefix(PFX); if (v) for (const k of Object.keys(v)) write([k], v[k]); return; }
    if (COLL.includes(s[0]) && s.length === 1) {
      removePrefix(PFX + s[0] + '/');
      if (v && typeof v === 'object') for (const k of Object.keys(v)) write([s[0], k], v[k]);
      return;
    }
    const kl = COLL.includes(s[0]) ? 2 : 1;
    const key = PFX + s.slice(0, kl).join('/');
    const rest = s.slice(kl);
    if (!rest.length) { if (v == null) localStorage.removeItem(key); else localStorage.setItem(key, JSON.stringify(v)); return; }
    let obj = null;
    try { obj = JSON.parse(localStorage.getItem(key)); } catch {}
    if (obj == null || typeof obj !== 'object') obj = {};
    setIn(obj, rest, v);
    localStorage.setItem(key, JSON.stringify(obj));
  }

  const subs = new Set();
  function notify() {
    const t = tree();
    for (const s of subs) {
      const j = JSON.stringify(getIn(t, seg(s.p)));
      if (j !== s.last) { s.last = j; try { s.cb(JSON.parse(j)); } catch (e) { console.error(e); } }
    }
  }
  let queued = false;
  const soon = () => { if (queued) return; queued = true; setTimeout(() => { queued = false; notify(); }, 0); };
  window.addEventListener('storage', (e) => { if (!e.key || e.key.startsWith(PFX)) soon(); });

  let ctr = 0;
  return {
    now: () => Date.now(),
    get: async (p) => clean(getIn(tree(), seg(p))),
    set: async (p, v) => { write(seg(p), v); soon(); },
    update: async (p, o) => { for (const k of Object.keys(o || {})) write([...seg(p), ...seg(k)], o[k]); soon(); },
    remove: async (p) => { write(seg(p), null); soon(); },
    push: (p, v) => {
      const k = Date.now().toString(36).padStart(9, '0') + (ctr++ % 1296).toString(36).padStart(2, '0') + Math.random().toString(36).slice(2, 6);
      write([...seg(p), k], v); soon(); return k;
    },
    on: (p, cb) => { const s = { p, cb, last: undefined }; subs.add(s); soon(); return () => subs.delete(s); },
  };
}
