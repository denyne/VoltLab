
(() => {
  "use strict";

  const CONFIG = window.VOLTLAB_CONFIG || {};
  const STORAGE = CONFIG.storage || {};

  const $ = (id) => document.getElementById(id);

  const state = {
    articleCategory: "all",
    projectCategory: "all",
    articleSearch: "",
    projectSearch: "",
    articles: [],
    projects: []
  };

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
    } catch (error) {
      console.warn("VoltLab: Uložení se nezdařilo.", error);
    }
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[char]);
  }

  function notify(message) {
    const toast = $("toast-region");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("visible");

    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => {
      toast.classList.remove("visible");
    }, 2800);
  }

  function getCategories() {
    return CONFIG.categories || [];
  }

  function categoryName(id) {
    const category = getCategories().find(item => item.id === id);
    return category ? category.name : "Ostatní";
  }

  function initializeContent() {
    const defaultArticles = window.VOLTLAB_DEFAULT_ARTICLES || [];
    const defaultProjects = window.VOLTLAB_DEFAULT_PROJECTS || [];

    const savedArticles = readStorage(STORAGE.articles, null);
    const savedProjects = readStorage(STORAGE.projects, null);

    state.articles = Array.isArray(savedArticles)
      ? savedArticles
      : defaultArticles;

    state.projects = Array.isArray(savedProjects)
      ? savedProjects
      : defaultProjects;

    if (!Array.isArray(savedArticles)) {
      writeStorage(STORAGE.articles, state.articles);
    }

    if (!Array.isArray(savedProjects)) {
      writeStorage(STORAGE.projects, state.projects);
    }
  }

  // --------------------------------------------------
  // KATEGORIE
  // --------------------------------------------------

  function createCategoryButtons(containerId, type) {
    const container = $(containerId);
    if (!container) return;

    const categories = getCategories();

    container.innerHTML = `
      <button class="filter-button active" data-category="all">
        Vše
      </button>
      ${categories.map(category => `
        <button class="filter-button"
          data-category="${escapeHTML(category.id)}">
          ${escapeHTML(category.icon || "")}
          ${escapeHTML(category.name)}
        </button>
      `).join("")}
    `;

    container.addEventListener("click", event => {
      const button = event.target.closest("[data-category]");
      if (!button) return;

      if (type === "article") {
        state.articleCategory = button.dataset.category;
        renderArticles();
      } else {
        state.projectCategory = button.dataset.category;
        renderProjects();
      }

      container.querySelectorAll(".filter-button").forEach(item => {
        item.classList.toggle("active", item === button);
      });
    });
  }

  function renderCategoryCards() {
    const container = $("category-grid");
    if (!container) return;

    container.innerHTML = getCategories().map(category => `
      <button class="category-card"
        data-open-category="${escapeHTML(category.id)}">
        <span class="category-icon">
          ${escapeHTML(category.icon || "⚡")}
        </span>
        <span class="category-name">
          ${escapeHTML(category.name)}
        </span>
        <span class="category-description">
          ${escapeHTML(category.description || "")}
        </span>
      </button>
    `).join("");

    container.addEventListener("click", event => {
      const card = event.target.closest("[data-open-category]");
      if (!card) return;

      const category = card.dataset.openCategory;

      state.articleCategory = category;
      state.projectCategory = category;

      updateFilterButtons("article-filters", category);
      updateFilterButtons("project-filters", category);

      renderArticles();
      renderProjects();

      $("articles-list")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  }

  function updateFilterButtons(containerId, category) {
    const container = $(containerId);
    if (!container) return;

    container.querySelectorAll("[data-category]").forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.category === category
      );
    });
  }

  // --------------------------------------------------
  // ČLÁNKY
  // --------------------------------------------------

  function renderArticles() {
    const container = $("articles-list");
    const empty = $("articles-empty");

    if (!container) return;

    const search = state.articleSearch.toLowerCase().trim();

    const filtered = state.articles.filter(article => {
      const categoryMatch =
        state.articleCategory === "all" ||
        article.category === state.articleCategory;

      const text = [
        article.title,
        article.excerpt,
        article.content,
        ...(article.tags || [])
      ].join(" ").toLowerCase();

      return categoryMatch && text.includes(search);
    });

    container.innerHTML = filtered.map(article => `
      <article class="content-card">
        <div class="content-card-icon">
          ${escapeHTML(article.icon || "📘")}
        </div>

        <div class="content-card-meta">
          ${escapeHTML(categoryName(article.category))}
          ${article.readTime
            ? ` · ${escapeHTML(article.readTime)}`
            : ""}
        </div>

        <h3>${escapeHTML(article.title)}</h3>

        <p>${escapeHTML(article.excerpt || "")}</p>

        <button class="text-button"
          data-open-article="${escapeHTML(article.id)}">
          Přečíst článek →
        </button>
      </article>
    `).join("");

    if (empty) {
      empty.hidden = filtered.length > 0;
    }
  }

  // --------------------------------------------------
  // PROJEKTY
  // --------------------------------------------------

  function renderProjects() {
    const container = $("projects-list");
    const empty = $("projects-empty");

    if (!container) return;

    const search = state.projectSearch.toLowerCase().trim();

    const filtered = state.projects.filter(project => {
      const categoryMatch =
        state.projectCategory === "all" ||
        project.category === state.projectCategory;

      const text = [
        project.title,
        project.description,
        project.difficulty,
        ...(project.components || []),
        ...(project.tags || [])
      ].join(" ").toLowerCase();

      return categoryMatch && text.includes(search);
    });

    container.innerHTML = filtered.map(project => `
      <article class="content-card">
        <div class="content-card-icon">
          ${escapeHTML(project.icon || "🔧")}
        </div>

        <div class="content-card-meta">
          ${escapeHTML(categoryName(project.category))}
          ${project.difficulty
            ? ` · ${escapeHTML(project.difficulty)}`
            : ""}
        </div>

        <h3>${escapeHTML(project.title)}</h3>

        <p>${escapeHTML(project.description || "")}</p>

        <button class="text-button"
          data-open-project="${escapeHTML(project.id)}">
          Zobrazit projekt →
        </button>
      </article>
    `).join("");

    if (empty) {
      empty.hidden = filtered.length > 0;
    }
  }

  // --------------------------------------------------
  // DETAIL ČLÁNKU A PROJEKTU
  // --------------------------------------------------

  function openDialog(content) {
    const dialog = $("content-dialog");
    const target = $("dialog-content");

    if (!dialog || !target) return;

    target.innerHTML = content;

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  }

  function closeDialog() {
    const dialog = $("content-dialog");
    if (!dialog) return;

    if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
  }

  function openArticle(id) {
    const article = state.articles.find(item => item.id === id);
    if (!article) return;

    openDialog(`
      <div class="dialog-meta">
        ${escapeHTML(categoryName(article.category))}
        ${article.readTime
          ? ` · ${escapeHTML(article.readTime)}`
          : ""}
      </div>

      <h2>${escapeHTML(article.icon || "📘")}
        ${escapeHTML(article.title)}</h2>

      <p class="dialog-excerpt">
        ${escapeHTML(article.excerpt || "")}
      </p>

      <div class="dialog-body">
        ${escapeHTML(article.content || "")
          .split(/\n{2,}/)
          .map(paragraph => `<p>${paragraph.replace(/\n/g, "<br>")}</p>`)
          .join("")}
      </div>
    `);
  }

  function openProject(id) {
    const project = state.projects.find(item => item.id === id);
    if (!project) return;

    const list = (items) => `
      <ul>
        ${(items || []).map(item =>
          `<li>${escapeHTML(item)}</li>`
        ).join("")}
      </ul>
    `;

    openDialog(`
      <div class="dialog-meta">
        ${escapeHTML(categoryName(project.category))}
        ${project.difficulty
          ? ` · ${escapeHTML(project.difficulty)}`
          : ""}
        ${project.time
          ? ` · ${escapeHTML(project.time)}`
          : ""}
      </div>

      <h2>${escapeHTML(project.icon || "🔧")}
        ${escapeHTML(project.title)}</h2>

      <p>${escapeHTML(project.description || "")}</p>

      <h3>Potřebné součástky</h3>
      ${list(project.components)}

      <h3>Postup</h3>
      ${list(project.steps)}

      ${project.code ? `
        <h3>Ukázkový kód</h3>
        <pre><code>${escapeHTML(project.code)}</code></pre>
        <button class="button secondary"
          id="copy-project-code">
          Kopírovat kód
        </button>
      ` : ""}

      ${project.note ? `
        <div class="safety-note">
          ${escapeHTML(project.note)}
        </div>
      ` : ""}
    `);

    const copyButton = $("copy-project-code");

    if (copyButton && project.code) {
      copyButton.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(project.code);
          notify("Kód byl zkopírován.");
        } catch {
          notify("Kopírování není v tomto prohlížeči dostupné.");
        }
      });
    }
  }

  function initDialog() {
    $("dialog-close")?.addEventListener("click", closeDialog);

    $("content-dialog")?.addEventListener("click", event => {
      if (event.target === $("content-dialog")) {
        closeDialog();
      }
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeDialog();
    });

    $("articles-list")?.addEventListener("click", event => {
      const button = event.target.closest("[data-open-article]");
      if (button) openArticle(button.dataset.openArticle);
    });

    $("projects-list")?.addEventListener("click", event => {
      const button = event.target.closest("[data-open-project]");
      if (button) openProject(button.dataset.openProject);
    });
  }

  // --------------------------------------------------
  // VYHLEDÁVÁNÍ
  // --------------------------------------------------

  function initSearch() {
    $("article-search")?.addEventListener("input", event => {
      state.articleSearch = event.target.value;
      renderArticles();
    });

    $("project-search")?.addEventListener("input", event => {
      state.projectSearch = event.target.value;
      renderProjects();
    });
  }

  // --------------------------------------------------
  // SVĚTLÝ A TMAVÝ REŽIM
  // --------------------------------------------------

  function applyTheme(theme) {
    const selected = theme === "light" ? "light" : "dark";

    document.documentElement.dataset.theme = selected;

    try {
      localStorage.setItem(STORAGE.theme || "voltlab_theme", selected);
    } catch (error) {
      console.warn("VoltLab: Motiv se nepodařilo uložit.", error);
    }

    const icon = $("theme-icon");
    const button = $("theme-toggle");

    if (icon) {
      icon.textContent = selected === "dark" ? "☀️" : "🌙";
    }

    if (button) {
      button.setAttribute(
        "aria-label",
        selected === "dark"
          ? "Přepnout na světlý režim"
          : "Přepnout na tmavý režim"
      );
    }
  }

  function initTheme() {
    let savedTheme = null;

    try {
      savedTheme = localStorage.getItem(
        STORAGE.theme || "voltlab_theme"
      );
    } catch {
      savedTheme = null;
    }

    applyTheme(
      savedTheme ||
      CONFIG.appearance?.defaultTheme ||
      "dark"
    );

    $("theme-toggle")?.addEventListener("click", () => {
      const current = document.documentElement.dataset.theme;
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }

  // --------------------------------------------------
  // MOBILNÍ MENU
  // --------------------------------------------------

  function initMobileMenu() {
    const button = $("mobile-menu-toggle");
    const nav = $("main-nav");

    if (!button || !nav) return;

    button.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");

      button.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        button.setAttribute("aria-expanded", "false");
      });
    });
  }

  // --------------------------------------------------
  // ROK V PATIČCE
  // --------------------------------------------------

  function initYear() {
    const year = $("current-year");
    if (year) year.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------
  // VEŘEJNÉ API PRO ADMINISTRACI
  // --------------------------------------------------

  window.VoltLab = {
    get articles() {
      return state.articles;
    },

    get projects() {
      return state.projects;
    },

    saveArticles(items) {
      state.articles = items;
      writeStorage(STORAGE.articles, items);
      renderArticles();
    },

    saveProjects(items) {
      state.projects = items;
      writeStorage(STORAGE.projects, items);
      renderProjects();
    },

    resetContent() {
      state.articles = window.VOLTLAB_DEFAULT_ARTICLES || [];
      state.projects = window.VOLTLAB_DEFAULT_PROJECTS || [];

      writeStorage(STORAGE.articles, state.articles);
      writeStorage(STORAGE.projects, state.projects);

      renderArticles();
      renderProjects();

      notify("Obsah byl obnoven do výchozího stavu.");
    },

    notify
  };

  // --------------------------------------------------
  // START
  // --------------------------------------------------

  function init() {
    initializeContent();

    initTheme();
    initMobileMenu();
    initDialog();
    initSearch();
    initYear();

    createCategoryButtons("article-filters", "article");
    createCategoryButtons("project-filters", "project");

    renderCategoryCards();
    renderArticles();
    renderProjects();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
