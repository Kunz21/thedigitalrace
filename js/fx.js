// Konfetti ohne Bibliothek
export function confetti(ms = 4500) {
  const cv = document.createElement('canvas');
  cv.className = 'confetti';
  document.body.appendChild(cv);
  const c = cv.getContext('2d');
  const resize = () => { cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio; };
  resize();
  const cols = ['#f5c542', '#3fd0ff', '#ff3d81', '#3ddc97', '#ffffff', '#b388ff'];
  const parts = Array.from({ length: 170 }, () => ({
    x: Math.random() * cv.width, y: -Math.random() * cv.height * 0.6,
    w: (6 + Math.random() * 8) * devicePixelRatio, h: (8 + Math.random() * 10) * devicePixelRatio,
    vy: (2 + Math.random() * 4) * devicePixelRatio, vx: (Math.random() - 0.5) * 3 * devicePixelRatio,
    r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, col: cols[Math.floor(Math.random() * cols.length)],
  }));
  const t0 = performance.now();
  (function frame(t) {
    c.clearRect(0, 0, cv.width, cv.height);
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy; p.r += p.vr;
      c.save(); c.translate(p.x, p.y); c.rotate(p.r); c.fillStyle = p.col; c.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); c.restore();
    }
    if (t - t0 < ms) requestAnimationFrame(frame); else cv.remove();
  })(t0);
}
