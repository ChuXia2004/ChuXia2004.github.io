(() => {
  const canvas = document.getElementById("sakura-canvas");
  const button = document.getElementById("sakura-toggle");
  const ctx = canvas?.getContext("2d", { alpha: true, desynchronized: true });
  if (!canvas || !ctx) return;

  const config = window.SITE_CONFIG?.settings || {};
  const speed = Math.max(0.2, Math.min(3, Number(config.sakuraSpeed) || 1));
  const fixedCount = Number(config.sakuraCount);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const SPRITE_R = 10;
  const SPRITE_PAD = 14;
  const SPRITE_SIZE = (SPRITE_R + SPRITE_PAD) * 2;
  const SPRITE_SCALE = 2;
  const HUES = [-6, -3, 0, 3, 6];

  let dpr = 1, w = 0, h = 0;
  let petals = [];
  let sprites = [];
  let running = config.sakuraEnabled !== false;
  let rafId = 0;
  let lastTime = 0;
  let fps = 60;
  let quality = 1;

  function makeSprite(hue) {
    const c = document.createElement("canvas");
    c.width = SPRITE_SIZE * SPRITE_SCALE;
    c.height = SPRITE_SIZE * SPRITE_SCALE;
    const g = c.getContext("2d");
    g.scale(SPRITE_SCALE, SPRITE_SCALE);
    g.translate(SPRITE_SIZE / 2, SPRITE_SIZE / 2);

    const r = SPRITE_R;
    const grad = g.createLinearGradient(-r * 0.7, -r, -r * 0.15, r * 1.2);
    grad.addColorStop(0, `hsla(${342 + hue},78%,96%,1)`);
    grad.addColorStop(0.42, `hsla(${340 + hue},66%,85%,1)`);
    grad.addColorStop(1, `hsla(${334 + hue},58%,72%,1)`);

    g.beginPath();
    g.moveTo(0, r * 1.15);
    g.bezierCurveTo(-r * 0.16, r * 0.78, -r * 0.92, r * 0.12, -r * 0.68, -r * 0.48);
    g.bezierCurveTo(-r * 0.48, -r * 1.08, -r * 0.08, -r * 1.08, 0, -r * 0.82);
    g.bezierCurveTo(r * 0.12, -r * 1.12, r * 0.56, -r * 0.98, r * 0.72, -r * 0.48);
    g.bezierCurveTo(r * 0.95, r * 0.12, r * 0.18, r * 0.82, 0, r * 1.15);
    g.closePath();

    g.fillStyle = grad;
    g.shadowColor = "rgba(197,111,139,0.16)";
    g.shadowBlur = 3;
    g.fill();
    g.shadowBlur = 0;

    g.beginPath();
    g.moveTo(0, r * 0.92);
    g.quadraticCurveTo(r * 0.05, 0, 0, -r * 0.82);
    g.strokeStyle = "rgba(183,103,131,0.30)";
    g.lineWidth = 0.55;
    g.stroke();

    g.beginPath();
    g.moveTo(0, r * 0.18);
    g.quadraticCurveTo(-r * 0.24, -r * 0.02, -r * 0.42, -r * 0.36);
    g.moveTo(0, r * 0.12);
    g.quadraticCurveTo(r * 0.25, -r * 0.05, r * 0.43, -r * 0.35);
    g.strokeStyle = "rgba(255,255,255,0.38)";
    g.lineWidth = 0.45;
    g.stroke();

    return c;
  }

  function buildSprites() {
    if (!sprites.length) sprites = HUES.map(makeSprite);
  }

  function targetCount() {
    const base = (Number.isFinite(fixedCount) && fixedCount > 0)
      ? Math.max(1, Math.min(160, Math.round(fixedCount)))
      : Math.max(42, Math.min(78, Math.round((w * h) / 14500)));
    return Math.max(8, Math.round(base * quality));
  }

  function createPetal(fromTop = false) {
    return {
      x: Math.random() * w,
      y: fromTop ? -SPRITE_SIZE : Math.random() * h,
      r: 3.8 + Math.random() * 5.8,
      vy: (21 + Math.random() * 49) * speed,
      drift: (-0.34 + Math.random() * 0.68) * 60,
      rot: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.75,
      alpha: 0.34 + Math.random() * 0.42,
      phase: Math.random() * Math.PI * 2,
      flip: Math.random() * Math.PI * 2,
      sprite: Math.floor(Math.random() * HUES.length)
    };
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    petals = Array.from({ length: targetCount() }, () => createPetal(false));
    drawFrame(0);
  }

  function updatePetal(p, dt) {
    p.y += p.vy * dt;
    p.x += (p.drift + Math.sin(p.y * 0.009 + p.phase) * 19.2) * dt;
    p.rot += p.spin * dt;
    p.flip += (1.08 + p.vy * 0.006) * dt;

    if (p.y > h + SPRITE_SIZE) {
      p.y = -SPRITE_SIZE;
      p.x = Math.random() * w;
    }
    if (p.x > w + SPRITE_SIZE) p.x = -SPRITE_SIZE;
    if (p.x < -SPRITE_SIZE) p.x = w + SPRITE_SIZE;
  }

  function drawPetal(p) {
    const squash = 0.58 + 0.42 * Math.abs(Math.cos(p.flip));
    const k = p.r / SPRITE_R;
    const dw = SPRITE_SIZE * k * squash;
    const dh = SPRITE_SIZE * k;
    const cs = Math.cos(p.rot), sn = Math.sin(p.rot);

    ctx.setTransform(
      cs * dpr * (dw / SPRITE_SIZE), sn * dpr * (dw / SPRITE_SIZE),
      -sn * dpr * (dh / SPRITE_SIZE), cs * dpr * (dh / SPRITE_SIZE),
      p.x * dpr, p.y * dpr
    );
    ctx.globalAlpha = p.alpha;
    ctx.drawImage(sprites[p.sprite], -SPRITE_SIZE / 2, -SPRITE_SIZE / 2, SPRITE_SIZE, SPRITE_SIZE);
  }

  function drawFrame(dt) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    for (let i = 0; i < petals.length; i++) {
      const p = petals[i];
      if (dt > 0) updatePetal(p, dt);
      drawPetal(p);
    }
    ctx.globalAlpha = 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function adapt(dt) {
    const inst = 1 / Math.max(dt, 0.001);
    fps = fps * 0.9 + inst * 0.1;
    if (fps < 45 && quality > 0.5) {
      quality = 0.5;
      petals = petals.slice(0, targetCount());
    } else if (fps > 57 && quality < 1) {
      quality = 1;
      while (petals.length < targetCount()) petals.push(createPetal(false));
    }
  }

  function frame(timestamp) {
    rafId = requestAnimationFrame(frame);
    if (document.hidden) return;
    if (!lastTime) lastTime = timestamp;
    let dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    if (dt > 0.05) dt = 0.05;
    if (dt > 0) adapt(dt);
    drawFrame(dt);
  }

  function start() {
    if (!rafId && running && !document.hidden && !reducedMotion) {
      lastTime = 0;
      rafId = requestAnimationFrame(frame);
    }
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
    else if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  button?.addEventListener("click", () => setRunning(!running));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    } else {
      start();
    }
  });
  window.addEventListener("resize", resize);

  buildSprites();
  resize();
  if (reducedMotion) setRunning(false);
  else { setRunning(running); start(); }
})();
