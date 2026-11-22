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
  let animationId = null;
  let lastTime = 0;

  function targetCount() {
    if (Number.isFinite(fixedCount) && fixedCount > 0) {
      return Math.max(1, Math.min(160, Math.round(fixedCount)));
    }
    return Math.max(42, Math.min(78, Math.round((w * h) / 14500)));
  }

  // 花瓣的属性只在创建时算一次，动画里只更新位置和角度
  function createPetal(fromTop = false) {
    const r = 3.8 + Math.random() * 5.8;
    const alpha = 0.34 + Math.random() * 0.42;
    const hue = Math.random() * 12 - 6;
    const size = 22;
    return {
      x: Math.random() * w,
      y: fromTop ? -size : Math.random() * h,
      r: r,
      size: size,
      vy: (0.35 + Math.random() * 0.82) * 60 * speed,
      drift: (-0.34 + Math.random() * 0.68) * 60,
      rot: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 1.5,
      flip: Math.random() * Math.PI * 2,
      alpha: alpha,
      phase: Math.random() * Math.PI * 2,
      fade: alpha * 0.88,
      veinAlpha: alpha * 0.30,
      lightAlpha: alpha * 0.38,
      color0: `hsla(${342 + hue},78%,96%,${alpha})`,
      color1: `hsla(${340 + hue},66%,85%,${alpha})`,
      color2: `hsla(${334 + hue},58%,72%,${alpha * 0.88})`,
      veinColor: `rgba(183,103,131,${alpha * 0.30})`,
      lightColor: `rgba(255,255,255,${alpha * 0.38})`
    };
  }

  // Canvas 尺寸只在初始化和窗口变化时设置，花瓣对象不重建
  function resizeCanvas() {
    const nextDpr = Math.min(window.devicePixelRatio || 1, 2);
    const nextW = window.innerWidth;
    const nextH = window.innerHeight;

    // 手机滚动时地址栏收放会连续触发 resize，尺寸没真变就直接跳过
    if (nextW === w && nextH === h && nextDpr === dpr) return;

    dpr = nextDpr;
    w = nextW;
    h = nextH;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // 只在第一次创建花瓣；之后视口变化只把跑出边界的花瓣夹回来
    if (!petals.length) {
      petals = Array.from({ length: targetCount() }, () => createPetal(false));
      return;
    }
    for (let i = 0; i < petals.length; i++) {
      const p = petals[i];
      if (p.x > w + p.size) p.x = w * 0.5 + (Math.random() - 0.5) * w;
      else if (p.x < -p.size) p.x = Math.random() * w;
      if (p.y > h + p.size) p.y = Math.random() * h;
      else if (p.y < -p.size) p.y = -p.size;
    }
  }

  function updatePetal(p, dt) {
    p.y += p.vy * dt;
    p.x += (p.drift + Math.sin(p.y * 0.009 + p.phase) * 19.2) * dt;
    p.rot += p.spin * dt;
    p.flip += (1.08 + p.vy * 0.006) * dt;

    if (p.y > h + p.size) {
      p.y = -p.size;
      p.x = Math.random() * w;
    }
    if (p.x > w + p.size) p.x = -p.size;
    if (p.x < -p.size) p.x = w + p.size;
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);

    const squash = 0.58 + 0.42 * Math.abs(Math.cos(p.flip));
    ctx.scale(squash, 1);

    const r = p.r;
    const grad = ctx.createLinearGradient(-r * 0.7, -r, -r * 0.15, r * 1.2);
    grad.addColorStop(0, p.color0);
    grad.addColorStop(0.42, p.color1);
    grad.addColorStop(1, p.color2);

    ctx.beginPath();
    ctx.moveTo(0, r * 1.15);
    ctx.bezierCurveTo(-r * 0.16, r * 0.78, -r * 0.92, r * 0.12, -r * 0.68, -r * 0.48);
    ctx.bezierCurveTo(-r * 0.48, -r * 1.08, -r * 0.08, -r * 1.08, 0, -r * 0.82);
    ctx.bezierCurveTo(r * 0.12, -r * 1.12, r * 0.56, -r * 0.98, r * 0.72, -r * 0.48);
    ctx.bezierCurveTo(r * 0.95, r * 0.12, r * 0.18, r * 0.82, 0, r * 1.15);
    ctx.closePath();

    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, r * 0.92);
    ctx.quadraticCurveTo(r * 0.05, 0, 0, -r * 0.82);
    ctx.strokeStyle = p.veinColor;
    ctx.lineWidth = 0.55;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, r * 0.18);
    ctx.quadraticCurveTo(-r * 0.24, -r * 0.02, -r * 0.42, -r * 0.36);
    ctx.moveTo(0, r * 0.12);
    ctx.quadraticCurveTo(r * 0.25, -r * 0.05, r * 0.43, -r * 0.35);
    ctx.strokeStyle = p.lightColor;
    ctx.lineWidth = 0.45;
    ctx.stroke();

    ctx.restore();
  }

  function drawPetals() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < petals.length; i++) drawPetal(petals[i]);
  }

  function animate(timestamp) {
    if (!lastTime) lastTime = timestamp;

    // 计算两帧之间的时间差，夹住上限避免切换回来时花瓣瞬移
    const deltaTime = Math.min(timestamp - lastTime, 32) / 1000;
    lastTime = timestamp;

    for (let i = 0; i < petals.length; i++) updatePetal(petals[i], deltaTime);
    drawPetals();

    animationId = requestAnimationFrame(animate);
  }

  function startAnimation() {
    if (!animationId && running && !document.hidden && !reducedMotion) {
      lastTime = 0;
      animationId = requestAnimationFrame(animate);
    }
  }

  function stopAnimation() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
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
    if (running) startAnimation();
    else {
      stopAnimation();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
    }
  }

  button?.addEventListener("click", () => setRunning(!running));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAnimation();
    else startAnimation();
  });
  window.addEventListener("resize", resizeCanvas);

  resizeCanvas();
  if (reducedMotion) setRunning(false);
  else { setRunning(running); startAnimation(); }
})();
