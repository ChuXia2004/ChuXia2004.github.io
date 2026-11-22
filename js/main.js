(() => {
  const cfg = window.SITE_CONFIG || {};
  const get = path => path.split(".").reduce((obj, key) => obj?.[key], cfg);
  document.querySelectorAll("[data-config]").forEach(el => {
    const value = get(el.dataset.config);
    if (typeof value === "string") el.textContent = value;
  });

  const avatar = cfg.profile?.avatar || "./assets/images/avatar-placeholder.svg";
  ["profile-avatar", "about-avatar"].forEach(id => {
    const img = document.getElementById(id);
    if (img) img.src = avatar;
  });
  const heroGithub = document.getElementById("hero-github-link");
  if (heroGithub && cfg.profile?.github) heroGithub.href = cfg.profile.github;

  const hobbies = document.getElementById("hobby-list");
  (cfg.about?.hobbies || []).forEach(item => {
    const span = document.createElement("span");
    span.textContent = item;
    hobbies?.appendChild(span);
  });

  const projectGrid = document.getElementById("project-grid");
  (cfg.projects?.items || []).forEach((project, index) => {
    const card = document.createElement("article");
    card.className = "project-card reveal";
    card.style.animationDelay = `${index * 90}ms`;
    const icon = document.createElement("div");
    icon.className = "project-icon"; icon.textContent = project.icon || "✿";
    const title = document.createElement("h3"); title.textContent = project.name || "未命名项目";
    const desc = document.createElement("p"); desc.textContent = project.description || "";
    const tags = document.createElement("div"); tags.className = "project-tags";
    (project.tags || []).forEach(tag => { const el = document.createElement("span"); el.className = "tag"; el.textContent = tag; tags.appendChild(el); });
    const a = document.createElement("a"); a.className = "project-link"; a.href = project.url || "#"; a.target = "_blank"; a.rel = "noopener noreferrer"; a.textContent = "查看项目 ↗";
    card.append(icon, title, desc, tags, a);
    projectGrid?.appendChild(card);
  });

  const skills = document.getElementById("skills-list");
  const skillRows = cfg.skills?.rows || [cfg.skills?.items || []];
  skillRows.forEach((row, rowIndex) => {
    const rowEl = document.createElement("div");
    rowEl.className = `skill-row skill-row-${rowIndex + 1}`;
    row.forEach(skill => {
      const span = document.createElement("span");
      span.className = "skill-chip";
      span.textContent = skill;
      rowEl.appendChild(span);
    });
    skills?.appendChild(rowEl);
  });

  const copyright = document.getElementById("copyright");
  if (copyright) copyright.textContent = `© ${new Date().getFullYear()} ${cfg.footer?.copyrightName || cfg.profile?.name || ""} · Made with love`;
  document.title = cfg.site?.title || document.title;
  const description = document.querySelector('meta[name="description"]');
  if (description && cfg.site?.description) description.content = cfg.site.description;

  // 项目卡片在动态生成后也启用滚动显现。
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
      });
    }, { threshold: .1 });
    document.querySelectorAll(".project-card").forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("is-visible"));
  }
})();
