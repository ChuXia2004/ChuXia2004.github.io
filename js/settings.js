(() => {
  const button = document.getElementById("settings-toggle");
  const panel = document.getElementById("settings-panel");
  if (!button || !panel) return;
  button.addEventListener("click", () => {
    const opening = panel.hidden; panel.hidden = !opening;
    button.setAttribute("aria-expanded", String(opening));
  });
  const bind = (id, variable, output, suffix = "") => {
    const input = document.getElementById(id); const value = document.getElementById(output);
    if (!input || !value) return;
    const update = () => {
      const n = Number(input.value);
      document.documentElement.style.setProperty(variable, `${n}${suffix}`);
      value.textContent = `${n}${suffix}`;
    };
    input.addEventListener("input", update); update();
  };
  bind("glass-blur", "--glass-blur", "blur-value", "px");
  bind("glass-reflection", "--glass-reflection", "reflection-value");
  bind("glass-saturation", "--glass-saturation", "saturation-value");
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !panel.hidden) { panel.hidden = true; button.setAttribute("aria-expanded", "false"); }
  });
})();
