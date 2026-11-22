(() => {
  const canvas = document.getElementById("sakura-canvas");
  const button = document.getElementById("sakura-toggle");
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return;

  const config = window.SITE_CONFIG?.settings || {};
  let width = 0, height = 0, petals = [], running = config.sakuraEnabled !== false;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const count = Math.max(0, Math.min(100, Number(config.sakuraCount) || 34));
  const speed = Number(config.sakuraSpeed) || 1;

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth; height = window.innerHeight;
    canvas.width = width * ratio; canvas.height = height * ratio;
    canvas.style.width = width + "px"; canvas.style.height = height + "px";
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    petals = Array.from({ length: count }, () => makePetal(true));
  }
  function makePetal(randomY = false) {
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : -20,
      size: 4 + Math.random() * 7,
      fall: (0.55 + Math.random() * 1.1) * speed,
      drift: (Math.random() - .5) * .8,
      swing: Math.random() * Math.PI * 2,
      spin: (Math.random() - .5) * .035,
      rotation: Math.random() * Math.PI * 2,
      alpha: .38 + Math.random() * .45
    };
  }
  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = Math.random() > 1 ? "#fff" : (document.documentElement.dataset.theme === "dark" ? "#f2b7d0" : "#e9a9b9");
    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.bezierCurveTo(p.size * 1.1, -p.size * .8, p.size * 1.2, p.size * .4, 0, p.size);
    ctx.bezierCurveTo(-p.size * 1.2, p.size * .4, -p.size * 1.1, -p.size * .8, 0, -p.size);
    ctx.fill();
    ctx.restore();
  }
  function frame() {
    if (!running || document.hidden || reducedMotion) return;
    ctx.clearRect(0, 0, width, height);
    for (const p of petals) {
      p.swing += .012;
      p.x += p.drift + Math.sin(p.swing) * .55;
      p.y += p.fall;
      p.rotation += p.spin;
      if (p.y > height + 25 || p.x < -30 || p.x > width + 30) Object.assign(p, makePetal());
      drawPetal(p);
    }
    requestAnimationFrame(frame);
  }
  function setRunning(value) {
    running = value;
    canvas.style.display = running ? "block" : "none";
    if (button) {
      button.textContent = running ? "🌸" : "✿";
      button.setAttribute("aria-label", running ? "关闭樱花效果" : "开启樱花效果");
      button.title = running ? "关闭樱花效果" : "开启樱花效果";
    }
    if (running) requestAnimationFrame(frame);
  }
  button?.addEventListener("click", () => setRunning(!running));
  document.addEventListener("visibilitychange", () => { if (!document.hidden && running) requestAnimationFrame(frame); });
  window.addEventListener("resize", resize);
  resize();
  if (reducedMotion) setRunning(false); else setRunning(running);
})();
