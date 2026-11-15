
(() => {
  const $ = id => document.getElementById(id);
  const config = window.VOLTLAB_CONFIG;
  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);

  function load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : structuredClone(fallback);
    } catch {
      return structuredClone(fallback);
    }
  }

  let articles = load(config.storage.articles, window.VOLTLAB_DEFAULT_ARTICLES);
  let projects = load(config.storage.projects, window.VOLTLAB_DEFAULT_PROJECTS);
  let articleCategory = "all";
  let projectCategory = "all";

  function saveArticles(data) {
    articles = data;
    localStorage.setItem(config.storage.articles, JSON.stringify(data));
    renderArticles();
  }
  function saveProjects(data) {
    projects = data;
    localStorage.setItem(config.storage.projects, JSON.stringify(data));
    renderProjects();
  }

  function notify(message) {
    const region = $("toast-region");
    if (!region) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    region.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("visible"));
    setTimeout(() => {
      toast.classList.remove("visible");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function renderCategories() {
    $("category-grid").innerHTML = config.categories.map(cat => `
      <button class="category-card" data-category="${cat.id}">
        <span class="category-icon">${cat.icon}</span>
        <strong>${escapeHTML(cat.name)}</strong>
        <span>${escapeHTML(cat.description)}</span>
        <span class="category-arrow">↗</span>
      </button>`).join("");
  }

  function renderFilters(type) {
    const target = $(type + "-filters");
    const current = type === "article" ? articleCategory : projectCategory;
    target.innerHTML = `<button class="filter-button ${current === "all" ? "active" : ""}" data-filter="all">Vše</button>` +
      config.categories.map(c => `<button class="filter-button ${current === c.id ? "active" : ""}" data-filter="${c.id}">${escapeHTML(c.name)}</button>`).join("");
    target.querySelectorAll("[data-filter]").forEach(button => {
      button.addEventListener("click", () => {
        if (type === "article") articleCategory = button.dataset.filter;
        else projectCategory = button.dataset.filter;
        renderFilters(type);
        type === "article" ? renderArticles() : renderProjects();
      });
    });
  }

  function categoryName(id) {
    return config.categories.find(c => c.id === id)?.name || "Ostatní";
  }

  function renderArticles() {
    const search = $("article-search").value.toLocaleLowerCase("cs");
    const filtered = articles.filter(a =>
      (articleCategory === "all" || a.category === articleCategory) &&
      [a.title, a.excerpt, ...(a.tags || [])].join(" ").toLocaleLowerCase("cs").includes(search)
    );
    $("articles-list").innerHTML = filtered.map(a => `
      <article class="content-card">
        <div class="card-icon">${escapeHTML(a.icon || "✦")}</div>
        <div class="card-meta">${escapeHTML(categoryName(a.category))} · ${escapeHTML(a.readTime || "")}</div>
        <h3>${escapeHTML(a.title)}</h3>
        <p>${escapeHTML(a.excerpt)}</p>
        <button class="text-link" data-open-article="${escapeHTML(a.id)}">Číst článek ↗</button>
      </article>`).join("");
    $("articles-empty").hidden = filtered.length > 0;
  }

  function renderProjects() {
    const search = $("project-search").value.toLocaleLowerCase("cs");
    const filtered = projects.filter(p =>
      (projectCategory === "all" || p.category === projectCategory) &&
      [p.title, p.description, ...(p.components || [])].join(" ").toLocaleLowerCase("cs").includes(search)
    );
    $("projects-list").innerHTML = filtered.map(p => `
      <article class="content-card project-card">
        <div class="card-icon">${escapeHTML(p.icon || "◈")}</div>
        <div class="card-meta">${escapeHTML(categoryName(p.category))} · ${escapeHTML(p.difficulty || "")}</div>
        <h3>${escapeHTML(p.title)}</h3>
        <p>${escapeHTML(p.description)}</p>
        <div class="project-time">◷ ${escapeHTML(p.time || "")}</div>
        <button class="text-link" data-open-project="${escapeHTML(p.id)}">Zobrazit projekt ↗</button>
      </article>`).join("");
    $("projects-empty").hidden = filtered.length > 0;
  }

  function openDialog(html) {
    const dialog = $("content-dialog");
    $("dialog-content").innerHTML = html;
    dialog.showModal();
    requestAnimationFrame(() => dialog.classList.add("is-visible"));
  }

  function closeDialog() {
    const dialog = $("content-dialog");
    dialog.classList.remove("is-visible");
    setTimeout(() => {
      if (dialog.open) dialog.close();
    }, 220);
  }

  function openArticle(article) {
    openDialog(`
      <div class="eyebrow">${escapeHTML(categoryName(article.category))} · ${escapeHTML(article.readTime || "")}</div>
      <h2>${escapeHTML(article.title)}</h2>
      <p class="dialog-lead">${escapeHTML(article.excerpt)}</p>
      <div class="article-body">${article.content || ""}</div>
      <div class="tag-list">${(article.tags || []).map(t => `<span>${escapeHTML(t)}</span>`).join("")}</div>
    `);
  }

  function openProject(project) {
    openDialog(`
      <div class="eyebrow">${escapeHTML(categoryName(project.category))} · ${escapeHTML(project.difficulty || "")}</div>
      <h2>${escapeHTML(project.title)}</h2>
      <p class="dialog-lead">${escapeHTML(project.description)}</p>
      <h3>Potřebné součástky</h3>
      <ul>${(project.components || []).map(c => `<li>${escapeHTML(c)}</li>`).join("")}</ul>
      <h3>Postup</h3>
      <ol>${(project.steps || []).map(s => `<li>${escapeHTML(s)}</li>`).join("")}</ol>
      <h3>Ukázkový kód</h3>
      <pre><code>${escapeHTML(project.code || "")}</code></pre>
      <p class="note-box">${escapeHTML(project.note || "")}</p>
    `);
  }

  function initEvents() {
    $("article-search").addEventListener("input", renderArticles);
    $("project-search").addEventListener("input", renderProjects);

    $("category-grid").addEventListener("click", event => {
      const card = event.target.closest("[data-category]");
      if (!card) return;
      articleCategory = projectCategory = card.dataset.category;
      renderFilters("article");
      renderFilters("project");
      renderArticles();
      renderProjects();
      document.getElementById("articles").scrollIntoView({ behavior: "smooth" });
    });

    $("articles-list").addEventListener("click", event => {
      const button = event.target.closest("[data-open-article]");
      if (!button) return;
      const article = articles.find(a => a.id === button.dataset.openArticle);
      if (article) openArticle(article);
    });

    $("projects-list").addEventListener("click", event => {
      const button = event.target.closest("[data-open-project]");
      if (!button) return;
      const project = projects.find(p => p.id === button.dataset.openProject);
      if (project) openProject(project);
    });

    $("dialog-close").addEventListener("click", closeDialog);
    $("content-dialog").addEventListener("click", event => {
      if (event.target === $("content-dialog")) closeDialog();
    });
    $("content-dialog").addEventListener("cancel", event => {
      event.preventDefault();
      closeDialog();
    });

    $("mobile-menu-toggle").addEventListener("click", () => {
      const nav = $("main-nav");
      const open = nav.classList.toggle("open");
      $("mobile-menu-toggle").setAttribute("aria-expanded", String(open));
    });
    $("main-nav").querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      $("main-nav").classList.remove("open");
      $("mobile-menu-toggle").setAttribute("aria-expanded", "false");
    }));

    $("theme-toggle").addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      localStorage.setItem(config.storage.theme, next);
      $("theme-icon").textContent = next === "dark" ? "☀" : "☾";
    });
  }

  function init() {
    const savedTheme = localStorage.getItem(config.storage.theme) || config.appearance.defaultTheme;
    document.documentElement.dataset.theme = savedTheme;
    $("theme-icon").textContent = savedTheme === "dark" ? "☀" : "☾";
    $("current-year").textContent = new Date().getFullYear();
    renderCategories();
    renderFilters("article");
    renderFilters("project");
    renderArticles();
    renderProjects();
    initEvents();
  }

  window.VoltLab = {
    get articles() { return articles; },
    get projects() { return projects; },
    saveArticles,
    saveProjects,
    resetContent() {
      if (!confirm("Opravdu chceš obnovit výchozí obsah?")) return;
      saveArticles(structuredClone(window.VOLTLAB_DEFAULT_ARTICLES));
      saveProjects(structuredClone(window.VOLTLAB_DEFAULT_PROJECTS));
      notify("Výchozí obsah byl obnoven.");
    },
    notify
  };

  document.addEventListener("DOMContentLoaded", init);
})();
