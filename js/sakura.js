(() => {
  const canvas = document.getElementById("sakura-canvas");
  const button = document.getElementById("sakura-toggle");
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return;

  const config = window.SITE_CONFIG?.settings || {};
  const speed = Math.max(0.2, Math.min(3, Number(config.sakuraSpeed) || 1));
  const fixedCount = Number(config.sakuraCount);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let dpr = 1, w = 0, h = 0;
  let petals = [];
  let running = config.sakuraEnabled !== false;
  let rafId = 0;

  function targetCount() {
    if (Number.isFinite(fixedCount) && fixedCount > 0) {
      return Math.max(1, Math.min(160, Math.round(fixedCount)));
    }
    return Math.max(42, Math.min(78, Math.round((w * h) / 14500)));
  }

  function createPetal(fromTop = false) {
    return {
      x: Math.random() * w,
      y: fromTop ? -22 : Math.random() * h,
      r: 3.8 + Math.random() * 5.8,
      v: (0.35 + Math.random() * 0.82) * speed,
      drift: -0.34 + Math.random() * 0.68,
      rot: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.025,
      alpha: 0.34 + Math.random() * 0.42,
      phase: Math.random() * Math.PI * 2,
      flip: Math.random() * Math.PI * 2,
      hue: Math.random() * 12 - 6
    };
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    petals = Array.from({ length: targetCount() }, () => createPetal(false));
  }

  function updatePetal(p) {
    p.y += p.v;
    p.x += p.drift + Math.sin(p.y * 0.009 + p.phase) * 0.32;
    p.rot += p.spin;
    p.flip += 0.018 + p.v * 0.006;

    if (p.y > h + 22) {
      p.y = -22;
      p.x = Math.random() * w;
    }
    if (p.x > w + 22) p.x = -22;
    if (p.x < -22) p.x = w + 22;
  }

  function drawPetal(p) {
    ctx.save();

    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);

    const squash = 0.58 + 0.42 * Math.abs(Math.cos(p.flip));
    ctx.scale(squash, 1);

    const r = p.r;
    const grad = ctx.createLinearGradient(-r * 0.7, -r, -r * 0.15, r * 1.2);

    grad.addColorStop(0, `hsla(${342 + p.hue},78%,96%,${p.alpha})`);
    grad.addColorStop(0.42, `hsla(${340 + p.hue},66%,85%,${p.alpha})`);
    grad.addColorStop(1, `hsla(${334 + p.hue},58%,72%,${p.alpha * 0.88})`);

    ctx.beginPath();
    ctx.moveTo(0, r * 1.15);
    ctx.bezierCurveTo(-r * 0.16, r * 0.78, -r * 0.92, r * 0.12, -r * 0.68, -r * 0.48);
    ctx.bezierCurveTo(-r * 0.48, -r * 1.08, -r * 0.08, -r * 1.08, 0, -r * 0.82);
    ctx.bezierCurveTo(r * 0.12, -r * 1.12, r * 0.56, -r * 0.98, r * 0.72, -r * 0.48);
    ctx.bezierCurveTo(r * 0.95, r * 0.12, r * 0.18, r * 0.82, 0, r * 1.15);
    ctx.closePath();

    ctx.fillStyle = grad;
    ctx.shadowColor = "rgba(197,111,139,0.16)";
    ctx.shadowBlur = 3;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.moveTo(0, r * 0.92);
    ctx.quadraticCurveTo(r * 0.05, 0, 0, -r * 0.82);
    ctx.strokeStyle = `rgba(183,103,131,${p.alpha * 0.30})`;
    ctx.lineWidth = 0.55;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, r * 0.18);
    ctx.quadraticCurveTo(-r * 0.24, -r * 0.02, -r * 0.42, -r * 0.36);
    ctx.moveTo(0, r * 0.12);
    ctx.quadraticCurveTo(r * 0.25, -r * 0.05, r * 0.43, -r * 0.35);
    ctx.strokeStyle = `rgba(255,255,255,${p.alpha * 0.38})`;
    ctx.lineWidth = 0.45;
    ctx.stroke();

    ctx.restore();
  }

  function frame() {
    rafId = 0;
    if (!running || document.hidden || reducedMotion) return;
    ctx.clearRect(0, 0, w, h);
    for (const p of petals) {
      updatePetal(p);
      drawPetal(p);
    }
    rafId = requestAnimationFrame(frame);
  }

  function start() {
    if (!rafId && running && !document.hidden && !reducedMotion) rafId = requestAnimationFrame(frame);
  }

  function setRunning(value) {
    running = value;
    canvas.style.display = running ? "block" : "none";
    if (button) {
      button.textContent = running ? "🌸" : "✿";
      button.setAttribute("aria-label", running ? "关闭樱花效果" : "开启樱花效果");
      button.title = running ? "关闭樱花效果" : "开启樱花效果";
    }
    if (running) start();
    else if (rafId) { cancelAnimationFrame(rafId); rafId = 0; ctx.clearRect(0, 0, w, h); }
  }

  button?.addEventListener("click", () => setRunning(!running));
  document.addEventListener("visibilitychange", () => { if (!document.hidden) start(); });
  window.addEventListener("resize", resize);

  resize();
  if (reducedMotion) setRunning(false);
  else { setRunning(running); start(); }
})();
