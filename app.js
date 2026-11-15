
(() => {
  "use strict";

  const config = window.VOLTLAB_CONFIG;
  if (!config) {
    console.error("VoltLab: config.js nebyl načten.");
    return;
  }

  const $ = (id) => document.getElementById(id);
  const storage = config.storage;

  function readStorage(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      notify("Uložení se nezdařilo. Zkontroluj nastavení prohlížeče.");
      return false;
    }
  }

  let articles = readStorage(storage.articles, window.VOLTLAB_DEFAULT_ARTICLES || []);
  let projects = readStorage(storage.projects, window.VOLTLAB_DEFAULT_PROJECTS || []);

  let articleCategory = "all";
  let projectCategory = "all";

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[char]);
  }

  function categoryName(id) {
    const category = config.categories.find(item => item.id === id);
    return category ? category.name : "Ostatní";
  }

  function notify(message) {
    const region = $("toast-region");
    if (!region) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    region.appendChild(toast);

    window.setTimeout(() => toast.remove(), 3200);
  }

  function renderCategories() {
    const container = $("category-grid");
    if (!container) return;

    container.innerHTML = config.categories.map(category => `
      <button class="category-card" type="button" data-category="${escapeHTML(category.id)}">
        <span class="category-arrow">↗</span>
        <span class="category-icon">${escapeHTML(category.icon)}</span>
        <h3>${escapeHTML(category.name)}</h3>
        <p>${escapeHTML(category.description)}</p>
      </button>
    `).join("");

    container.querySelectorAll("[data-category]").forEach(button => {
      button.addEventListener("click", () => {
        const category = button.dataset.category;
        articleCategory = category;
        projectCategory = category;
        renderFilters();
        renderArticles();
        renderProjects();
        $("articles").scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  function renderFilters() {
    const articleFilters = $("article-filters");
    const projectFilters = $("project-filters");

    if (articleFilters) {
      articleFilters.innerHTML = `
        <button class="filter-button ${articleCategory === "all" ? "active" : ""}" data-category="all">Vše</button>
        ${config.categories.map(category => `
          <button class="filter-button ${articleCategory === category.id ? "active" : ""}" data-category="${escapeHTML(category.id)}">${escapeHTML(category.name)}</button>
        `).join("")}
      `;
      articleFilters.querySelectorAll("[data-category]").forEach(button => {
        button.addEventListener("click", () => {
          articleCategory = button.dataset.category;
          renderFilters();
          renderArticles();
        });
      });
    }

    if (projectFilters) {
      projectFilters.innerHTML = `
        <button class="filter-button ${projectCategory === "all" ? "active" : ""}" data-category="all">Vše</button>
        ${config.categories.map(category => `
          <button class="filter-button ${projectCategory === category.id ? "active" : ""}" data-category="${escapeHTML(category.id)}">${escapeHTML(category.name)}</button>
        `).join("")}
      `;
      projectFilters.querySelectorAll("[data-category]").forEach(button => {
        button.addEventListener("click", () => {
          projectCategory = button.dataset.category;
          renderFilters();
          renderProjects();
        });
      });
    }
  }

  function renderArticles() {
    const container = $("articles-list");
    const empty = $("articles-empty");
    if (!container) return;

    const search = ($("article-search")?.value || "").trim().toLowerCase();

    const filtered = articles.filter(article => {
      const categoryMatch = articleCategory === "all" || article.category === articleCategory;
      const text = `${article.title} ${article.excerpt} ${(article.tags || []).join(" ")}`.toLowerCase();
      return categoryMatch && text.includes(search);
    });

    container.innerHTML = filtered.map(article => `
      <article class="content-card">
        <div class="card-meta">
          <span class="card-category">${escapeHTML(categoryName(article.category))}</span>
          <span>${escapeHTML(article.readTime || "Článek")}</span>
        </div>
        <span class="card-icon">${escapeHTML(article.icon || "⌁")}</span>
        <h3>${escapeHTML(article.title)}</h3>
        <p>${escapeHTML(article.excerpt)}</p>
        <div class="card-bottom">
          <span>KNOWLEDGE BASE</span>
          <button class="card-open" type="button" data-open-article="${escapeHTML(article.id)}" aria-label="Otevřít článek">↗</button>
        </div>
      </article>
    `).join("");

    if (empty) empty.hidden = filtered.length !== 0;

    container.querySelectorAll("[data-open-article]").forEach(button => {
      button.addEventListener("click", () => openArticle(button.dataset.openArticle));
    });

    container.querySelectorAll(".content-card").forEach((card, index) => {
      card.addEventListener("click", event => {
        if (event.target.closest("button")) return;
        const article = filtered[index];
        if (article) openArticle(article.id);
      });
    });
  }

  function renderProjects() {
    const container = $("projects-list");
    const empty = $("projects-empty");
    if (!container) return;

    const search = ($("project-search")?.value || "").trim().toLowerCase();

    const filtered = projects.filter(project => {
      const categoryMatch = projectCategory === "all" || project.category === projectCategory;
      const text = `${project.title} ${project.description} ${project.difficulty || ""}`.toLowerCase();
      return categoryMatch && text.includes(search);
    });

    container.innerHTML = filtered.map(project => `
      <article class="content-card">
        <div class="card-meta">
          <span class="card-category">${escapeHTML(categoryName(project.category))}</span>
          <span>${escapeHTML(project.difficulty || "Projekt")}</span>
        </div>
        <span class="card-icon">${escapeHTML(project.icon || "⌁")}</span>
        <h3>${escapeHTML(project.title)}</h3>
        <p>${escapeHTML(project.description)}</p>
        <div class="card-bottom">
          <span>${escapeHTML(project.time || "DIY PROJECT")}</span>
          <button class="card-open" type="button" data-open-project="${escapeHTML(project.id)}" aria-label="Otevřít projekt">↗</button>
        </div>
      </article>
    `).join("");

    if (empty) empty.hidden = filtered.length !== 0;

    container.querySelectorAll("[data-open-project]").forEach(button => {
      button.addEventListener("click", () => openProject(button.dataset.openProject));
    });

    container.querySelectorAll(".content-card").forEach((card, index) => {
      card.addEventListener("click", event => {
        if (event.target.closest("button")) return;
        const project = filtered[index];
        if (project) openProject(project.id);
      });
    });
  }

  function openDialog(html) {
    const dialog = $("content-dialog");
    const content = $("dialog-content");
    if (!dialog || !content) return;

    content.innerHTML = html;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");

    content.querySelectorAll("[data-copy-code]").forEach(button => {
      button.addEventListener("click", async () => {
        const code = content.querySelector("pre")?.textContent || "";
        try {
          await navigator.clipboard.writeText(code);
          notify("Kód zkopírován.");
        } catch {
          notify("Kopírování není v tomto prohlížeči dostupné.");
        }
      });
    });
  }

  function openArticle(id) {
    const article = articles.find(item => item.id === id);
    if (!article) return;

    const paragraphs = String(article.content || "")
      .split(/\n\s*\n/)
      .map(paragraph => `<p>${escapeHTML(paragraph).replace(/\n/g, "<br>")}</p>`)
      .join("");

    openDialog(`
      <div class="eyebrow">${escapeHTML(categoryName(article.category))} / ARTICLE</div>
      <h2>${escapeHTML(article.title)}</h2>
      <p>${escapeHTML(article.excerpt)}</p>
      <div class="dialog-article">${paragraphs}</div>
    `);
  }

  function openProject(id) {
    const project = projects.find(item => item.id === id);
    if (!project) return;

    const components = (project.components || []).map(item => `<li>${escapeHTML(item)}</li>`).join("");
    const steps = (project.steps || []).map(item => `<li>${escapeHTML(item)}</li>`).join("");

    openDialog(`
      <div class="eyebrow">${escapeHTML(categoryName(project.category))} / PROJECT</div>
      <h2>${escapeHTML(project.title)}</h2>
      <p>${escapeHTML(project.description)}</p>
      <h3>Potřebné komponenty</h3>
      <ul>${components}</ul>
      <h3>Postup</h3>
      <ol>${steps}</ol>
      ${project.code ? `
        <h3>Ukázkový kód</h3>
        <div class="dialog-code">
          <button class="copy-code" type="button" data-copy-code>Kopírovat kód</button>
          <pre>${escapeHTML(project.code)}</pre>
        </div>
      ` : ""}
      ${project.note ? `<h3>Poznámka</h3><p>${escapeHTML(project.note)}</p>` : ""}
    `);
  }

  function initDialog() {
    const dialog = $("content-dialog");
    const close = $("dialog-close");
    if (!dialog || !close) return;

    close.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", event => {
      if (event.target === dialog) dialog.close();
    });
  }

  function initTheme() {
    const button = $("theme-toggle");
    const icon = $("theme-icon");
    if (!button) return;

    let theme = localStorage.getItem(storage.theme) || config.appearance.defaultTheme || "dark";

    function applyTheme() {
      document.documentElement.dataset.theme = theme;
      if (icon) icon.textContent = theme === "dark" ? "☼" : "☾";
      document.querySelector('meta[name="theme-color"]')?.setAttribute(
        "content",
        theme === "dark" ? "#0b0f0e" : "#f3f6f2"
      );
    }

    button.addEventListener("click", () => {
      theme = theme === "dark" ? "light" : "dark";
      localStorage.setItem(storage.theme, theme);
      applyTheme();
    });

    applyTheme();
  }

  function initMobileMenu() {
    const button = $("mobile-menu-toggle");
    const nav = $("main-nav");
    if (!button || !nav) return;

    button.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(open));
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        button.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initNavigationHighlight() {
    const links = [...document.querySelectorAll(".nav-link")];
    const sections = links.map(link => document.querySelector(link.getAttribute("href"))).filter(Boolean);

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: "-35% 0px -55% 0px" });

    sections.forEach(section => observer.observe(section));
  }

  function initSearch() {
    $("article-search")?.addEventListener("input", renderArticles);
    $("project-search")?.addEventListener("input", renderProjects);
  }

  function init() {
    $("current-year").textContent = new Date().getFullYear();

    renderCategories();
    renderFilters();
    renderArticles();
    renderProjects();

    initDialog();
    initTheme();
    initMobileMenu();
    initNavigationHighlight();
    initSearch();
  }

  window.VoltLab = {
    get articles() { return articles; },
    get projects() { return projects; },

    saveArticles(items) {
      articles = items;
      writeStorage(storage.articles, articles);
      renderArticles();
    },

    saveProjects(items) {
      projects = items;
      writeStorage(storage.projects, projects);
      renderProjects();
    },

    resetContent() {
      articles = window.VOLTLAB_DEFAULT_ARTICLES || [];
      projects = window.VOLTLAB_DEFAULT_PROJECTS || [];
      localStorage.removeItem(storage.articles);
      localStorage.removeItem(storage.projects);
      renderArticles();
      renderProjects();
      notify("Výchozí obsah byl obnoven.");
    },

    notify
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
