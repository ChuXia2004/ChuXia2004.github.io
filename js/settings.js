(() => {
  const root = document.documentElement;
  const panel = document.getElementById('glass-settings');
  const toggle = document.getElementById('settings-toggle');
  const close = document.getElementById('settings-close');
  const defaults = { blur: 2, edge: 0.25, saturation: 1.3 };
  const controls = {
    blur: document.getElementById('glass-blur'),
    edge: document.getElementById('glass-edge'),
    saturation: document.getElementById('glass-saturation')
  };
  const outputs = {
    blur: document.getElementById('blur-value'),
    edge: document.getElementById('edge-value'),
    saturation: document.getElementById('saturation-value')
  };
  const storageKey = 'sakura-glass-settings';
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch (_) { saved = {}; }

  function apply(key, raw, persist = true) {
    const value = Number(raw);
    if (!Number.isFinite(value)) return;
    const suffix = key === 'blur' ? 'px' : '';
    const cssVar = key === 'blur' ? '--glass-blur' : key === 'edge' ? '--glass-edge' : '--glass-saturation';
    root.style.setProperty(cssVar, `${value}${suffix}`);
    if (key === 'edge') root.style.setProperty('--glass-edge-alpha', String(value));
    if (controls[key]) controls[key].value = String(value);
    if (outputs[key]) outputs[key].textContent = key === 'blur' ? `${value}px` : String(Number(value.toFixed(2)));
    if (persist) {
      const state = {};
      Object.keys(controls).forEach(k => state[k] = Number(controls[k].value));
      localStorage.setItem(storageKey, JSON.stringify(state));
    }
  }
  Object.keys(controls).forEach(key => {
    apply(key, saved[key] ?? defaults[key], false);
    controls[key]?.addEventListener('input', event => apply(key, event.target.value));
  });
  function setOpen(open) {
    panel.hidden = !open;
    toggle?.setAttribute('aria-expanded', String(open));
  }
  toggle?.addEventListener('click', () => setOpen(panel.hidden));
  close?.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') setOpen(false); });
  document.addEventListener('click', event => {
    if (!panel.hidden && !panel.contains(event.target) && !toggle.contains(event.target)) setOpen(false);
  });
  document.getElementById('settings-reset')?.addEventListener('click', () => {
    Object.keys(defaults).forEach(key => apply(key, defaults[key], false));
    localStorage.setItem(storageKey, JSON.stringify(defaults));
  });
})();
