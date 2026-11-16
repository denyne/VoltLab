```javascript
/* =========================================================
   VOLTLAB V4 — APP.JS
   Hlavní aplikační logika webu
   ========================================================= */

(() => {
  "use strict";

  const CONFIG = window.VOLTLAB_CONFIG || {};

  const STORAGE = {
    articles: CONFIG.storage?.articles || "voltlab_v4_articles",
    projects: CONFIG.storage?.projects || "voltlab_v4_projects",
    theme: CONFIG.storage?.theme || "voltlab_v4_theme",
    favorites: "voltlab_v4_favorites",
    notes: "voltlab_v4_notes",
    keyboardHint: "voltlab_v4_keyboard_hint"
  };

  const DEFAULT_THEME = CONFIG.appearance?.defaultTheme || "dark";

  const DEFAULT_ARTICLES = Array.isArray(window.VOLTLAB_ARTICLES)
    ? JSON.parse(JSON.stringify(window.VOLTLAB_ARTICLES))
    : [];

  const DEFAULT_PROJECTS = Array.isArray(window.VOLTLAB_PROJECTS)
    ? JSON.parse(JSON.stringify(window.VOLTLAB_PROJECTS))
    : [];

  let articles = loadContent(STORAGE.articles, DEFAULT_ARTICLES);
  let projects = loadContent(STORAGE.projects, DEFAULT_PROJECTS);

  let favorites = readJSON(STORAGE.favorites, []);
  let activeArticleFilter = "all";
  let activeProjectFilter = "all";

  let articleSearchQuery = "";
  let projectSearchQuery = "";
  let globalSearchQuery = "";

  let currentDialogItem = null;

  /* =======================================================
     ZÁKLADNÍ POMOCNÉ FUNKCE
     ======================================================= */

  function readStorage(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn("VoltLab: Nelze číst localStorage.", error);
      return null;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn("VoltLab: Nelze uložit data.", error);
      notify("Data se nepodařilo uložit. Zkontroluj úložiště prohlížeče.", "error");
      return false;
    }
  }

  function readJSON(key, fallback) {
    const raw = readStorage(key);

    if (!raw) {
      return JSON.parse(JSON.stringify(fallback));
    }

    try {
      return JSON.parse(raw);
    } catch (error) {
      console.warn("VoltLab: Neplatná uložená data.", error);
      return JSON.parse(JSON.stringify(fallback));
    }
  }

  function loadContent(key, fallback) {
    const saved = readJSON(key, fallback);
    return Array.isArray(saved) ? saved : JSON.parse(JSON.stringify(fallback));
  }

  function saveJSON(key, value) {
    return writeStorage(key, JSON.stringify(value));
  }

  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  function $$(selector, root = document) {
    return [...root.querySelectorAll(selector)];
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[character]);
  }

  function categoryName(id) {
    const categories = CONFIG.categories || [];
    const category = categories.find(item => item.id === id);
    return category?.name || id || "Ostatní";
  }

  function getIcon(item) {
    return escapeHTML(item?.icon || "⚡");
  }

  function normalize(value) {
    return String(value ?? "")
      .toLocaleLowerCase("cs")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function formatDate(date = new Date()) {
    return new Intl.DateTimeFormat("cs-CZ", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date);
  }

  function scrollToSection(id) {
    const element = document.getElementById(id);
    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  /* =======================================================
     NOTIFIKACE
     ======================================================= */

  function notify(message, type = "success", duration = 3200) {
    const region = $("#toast-region");

    if (!region) {
      console.log("[VoltLab]", message);
      return;
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.setAttribute("role", "status");

    const icons = {
      success: "✓",
      error: "!",
      warning: "⚠",
      info: "i"
    };

    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || "i"}</span>
      <span class="toast-message">${escapeHTML(message)}</span>
      <button class="toast-close" type="button" aria-label="Zavřít">×</button>
    `;

    region.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("is-visible");
    });

    const remove = () => {
      toast.classList.remove("is-visible");
      setTimeout(() => toast.remove(), 250);
    };

    $(".toast-close", toast)?.addEventListener("click", remove);
    setTimeout(remove, duration);
  }

  /* =======================================================
     BEZPEČNÉ VYKRESLENÍ OBSAHU ČLÁNKŮ
     ======================================================= */

  function sanitizeHTML(html) {
    const template = document.createElement("template");
    template.innerHTML = String(html ?? "");

    const allowedTags = new Set([
      "P", "BR", "STRONG", "B", "EM", "I",
      "H2", "H3", "H4",
      "UL", "OL", "LI",
      "BLOCKQUOTE",
      "PRE", "CODE",
      "A",
      "TABLE", "THEAD", "TBODY", "TR", "TH", "TD",
      "HR", "SPAN", "DIV"
    ]);

    const allowedAttributes = new Set([
      "href", "target", "rel", "class", "title"
    ]);

    function cleanNode(node) {
      [...node.childNodes].forEach(child => {
        if (child.nodeType === Node.COMMENT_NODE) {
          child.remove();
          return;
        }

        if (child.nodeType !== Node.ELEMENT_NODE) return;

        if (!allowedTags.has(child.tagName)) {
          child.replaceWith(...child.childNodes);
          return;
        }

        [...child.attributes].forEach(attribute => {
          const name = attribute.name.toLowerCase();

          if (!allowedAttributes.has(name) || name.startsWith("on")) {
            child.removeAttribute(attribute.name);
          }
        });

        if (child.tagName === "A") {
          const href = child.getAttribute("href") || "";

          if (!/^(https?:|mailto:|#)/i.test(href)) {
            child.removeAttribute("href");
          } else {
            child.setAttribute("rel", "noopener noreferrer");
          }
        }

        cleanNode(child);
      });
    }

    cleanNode(template.content);
    return template.innerHTML;
  }

  /* =======================================================
     KATEGORIE
     ======================================================= */

  function renderCategories() {
    const container = $("#category-grid");
    if (!container) return;

    const categories = CONFIG.categories || [];

    container.innerHTML = categories.map(category => {
      const count = articles.filter(item => item.category === category.id).length
        + projects.filter(item => item.category === category.id).length;

      return `
        <button class="category-card" type="button"
          data-category-link="${escapeHTML(category.id)}">
          <span class="category-icon">${escapeHTML(category.icon || "⚡")}</span>
          <span class="category-title">${escapeHTML(category.name)}</span>
          <span class="category-description">${escapeHTML(category.description || "")}</span>
          <span class="category-count">${count} materiálů</span>
        </button>
      `;
    }).join("");
  }

  /* =======================================================
     FILTRY ČLÁNKŮ
     ======================================================= */

  function renderArticleFilters() {
    const container = $("#article-filters");
    if (!container) return;

    const categories = CONFIG.categories || [];

    const filters = [
      { id: "all", name: "Vše" },
      ...categories.map(category => ({
        id: category.id,
        name: category.name
      }))
    ];

    container.innerHTML = filters.map(filter => `
      <button
        class="filter-btn ${activeArticleFilter === filter.id ? "active" : ""}"
        type="button"
        data-article-filter="${escapeHTML(filter.id)}">
        ${escapeHTML(filter.name)}
      </button>
    `).join("");
  }

  function articleMatchesSearch(article, query) {
    if (!query) return true;

    const searchable = [
      article.title,
      article.excerpt,
      article.content,
      article.category,
      ...(article.tags || [])
    ].join(" ");

    return normalize(searchable).includes(normalize(query));
  }

  function renderArticles() {
    const container = $("#articles-list");
    const empty = $("#articles-empty");

    if (!container) return;

    const filtered = articles.filter(article => {
      const matchesCategory = activeArticleFilter === "all"
        || article.category === activeArticleFilter;

      return matchesCategory && articleMatchesSearch(article, articleSearchQuery);
    });

    if (!filtered.length) {
      container.innerHTML = "";
      if (empty) empty.hidden = false;
      return;
    }

    if (empty) empty.hidden = true;

    container.innerHTML = filtered.map(article => {
      const favoriteId = `article:${article.id}`;
      const isFavorite = favorites.includes(favoriteId);

      return `
        <article class="article-card content-card">
          <div class="card-topline">
            <span class="card-icon">${getIcon(article)}</span>
            <span class="card-category">${escapeHTML(categoryName(article.category))}</span>
            <button
              class="favorite-btn ${isFavorite ? "is-favorite" : ""}"
              type="button"
              data-favorite="${escapeHTML(favoriteId)}"
              aria-label="${isFavorite ? "Odebrat z oblíbených" : "Přidat do oblíbených"}">
              ${isFavorite ? "♥" : "♡"}
            </button>
          </div>

          <h3>${escapeHTML(article.title)}</h3>
          <p>${escapeHTML(article.excerpt || "")}</p>

          <div class="card-meta">
            <span>◷ ${escapeHTML(article.readTime || "5 min")}</span>
            <span>${(article.tags || []).length} štítků</span>
          </div>

          <button class="card-link" type="button"
            data-open-article="${escapeHTML(article.id)}">
            Otevřít článek <span>→</span>
          </button>
        </article>
      `;
    }).join("");
  }

  /* =======================================================
     FILTRY PROJEKTŮ
     ======================================================= */

  function renderProjectFilters() {
    const container = $("#project-filters");
    if (!container) return;

    const categories = CONFIG.categories || [];

    const filters = [
      { id: "all", name: "Vše" },
      ...categories.map(category => ({
        id: category.id,
        name: category.name
      }))
    ];

    container.innerHTML = filters.map(filter => `
      <button
        class="filter-btn ${activeProjectFilter === filter.id ? "active" : ""}"
        type="button"
        data-project-filter="${escapeHTML(filter.id)}">
        ${escapeHTML(filter.name)}
      </button>
    `).join("");
  }

  function projectMatchesSearch(project, query) {
    if (!query) return true;

    const searchable = [
      project.title,
      project.description,
      project.category,
      project.difficulty,
      project.components,
      project.steps,
      ...(project.tags || [])
    ].join(" ");

    return normalize(searchable).includes(normalize(query));
  }

  function renderProjects() {
    const container = $("#projects-list");
    const empty = $("#projects-empty");

    if (!container) return;

    const filtered = projects.filter(project => {
      const matchesCategory = activeProjectFilter === "all"
        || project.category === activeProjectFilter;

      return matchesCategory && projectMatchesSearch(project, projectSearchQuery);
    });

    if (!filtered.length) {
      container.innerHTML = "";
      if (empty) empty.hidden = false;
      return;
    }

    if (empty) empty.hidden = true;

    container.innerHTML = filtered.map(project => {
      const favoriteId = `project:${project.id}`;
      const isFavorite = favorites.includes(favoriteId);

      return `
        <article class="project-card content-card">
          <div class="card-topline">
            <span class="card-icon">${getIcon(project)}</span>
            <span class="card-category">${escapeHTML(categoryName(project.category))}</span>
            <button
              class="favorite-btn ${isFavorite ? "is-favorite" : ""}"
              type="button"
              data-favorite="${escapeHTML(favoriteId)}"
              aria-label="${isFavorite ? "Odebrat z oblíbených" : "Přidat do oblíbených"}">
              ${isFavorite ? "♥" : "♡"}
            </button>
          </div>

          <h3>${escapeHTML(project.title)}</h3>
          <p>${escapeHTML(project.description || "")}</p>

          <div class="card-meta">
            <span>◈ ${escapeHTML(project.difficulty || "Začátečník")}</span>
            <span>◷ ${escapeHTML(project.time || "30 min")}</span>
          </div>

          <button class="card-link" type="button"
            data-open-project="${escapeHTML(project.id)}">
            Zobrazit projekt <span>→</span>
          </button>
        </article>
      `;
    }).join("");
  }

  /* =======================================================
     DIALOGY A DETAILY
     ======================================================= */

  function openDialog(html) {
    const dialog = $("#content-dialog");
    const content = $("#dialog-content");

    if (!dialog || !content) return;

    content.innerHTML = html;

    if (typeof dialog.showModal === "function") {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.classList.add("is-open", "active");
      dialog.setAttribute("aria-hidden", "false");
    }

    document.body.classList.add("dialog-open");
  }

  function closeDialog() {
    const dialog = $("#content-dialog");
    if (!dialog) return;

    if (typeof dialog.close === "function" && dialog.open) {
      dialog.close();
    } else {
      dialog.classList.remove("is-open", "active");
      dialog.setAttribute("aria-hidden", "true");
    }

    document.body.classList.remove("dialog-open");
    currentDialogItem = null;
  }

  function openArticle(id) {
    const article = articles.find(item => item.id === id);
    if (!article) return;

    currentDialogItem = { type: "article", id };

    const tags = (article.tags || []).map(tag =>
      `<span class="tag">${escapeHTML(tag)}</span>`
    ).join("");

    openDialog(`
      <div class="detail-view article-detail">
        <div class="detail-header">
          <span class="detail-icon">${getIcon(article)}</span>
          <div>
            <span class="detail-category">${escapeHTML(categoryName(article.category))}</span>
            <h2>${escapeHTML(article.title)}</h2>
            <span class="detail-meta">◷ ${escapeHTML(article.readTime || "5 min čtení")}</span>
          </div>
        </div>

        <p class="detail-excerpt">${escapeHTML(article.excerpt || "")}</p>

        <div class="detail-tags">${tags}</div>

        <div class="article-content">
          ${sanitizeHTML(article.content || "<p>Obsah článku zatím není k dispozici.</p>")}
        </div>

        <div class="detail-actions">
          <button class="secondary-btn" type="button"
            data-favorite="article:${escapeHTML(article.id)}">
            ${favorites.includes(`article:${article.id}`) ? "♥ V oblíbených" : "♡ Přidat do oblíbených"}
          </button>
        </div>
      </div>
    `);
  }

  function openProject(id) {
    const project = projects.find(item => item.id === id);
    if (!project) return;

    currentDialogItem = { type: "project", id };

    const components = Array.isArray(project.components)
      ? project.components
      : String(project.components || "").split(/\n|,/).filter(Boolean);

    const steps = Array.isArray(project.steps)
      ? project.steps
      : String(project.steps || "").split(/\n/).filter(Boolean);

    const code = String(project.code || "");

    openDialog(`
      <div class="detail-view project-detail">
        <div class="detail-header">
          <span class="detail-icon">${getIcon(project)}</span>
          <div>
            <span class="detail-category">${escapeHTML(categoryName(project.category))}</span>
            <h2>${escapeHTML(project.title)}</h2>
            <span class="detail-meta">
              ◈ ${escapeHTML(project.difficulty || "Začátečník")}
              &nbsp; · &nbsp;
              ◷ ${escapeHTML(project.time || "30 min")}
            </span>
          </div>
        </div>

        <p class="detail-excerpt">${escapeHTML(project.description || "")}</p>

        <section class="detail-section">
          <h3>Potřebné součástky</h3>
          <ul class="component-list">
            ${components.map(component =>
              `<li>${escapeHTML(component)}</li>`
            ).join("")}
          </ul>
        </section>

        <section class="detail-section">
          <h3>Postup</h3>
          <ol class="project-steps">
            ${steps.map(step =>
              `<li>${escapeHTML(step)}</li>`
            ).join("")}
          </ol>
        </section>

        ${code ? `
          <section class="detail-section">
            <div class="code-heading">
              <h3>Zdrojový kód</h3>
              <button class="copy-code-btn" type="button" data-copy-code>
                Kopírovat kód
              </button>
            </div>
            <pre class="code-block"><code>${escapeHTML(code)}</code></pre>
          </section>
        ` : ""}

        ${project.note ? `
          <aside class="project-note">
            <strong>Tip:</strong> ${escapeHTML(project.note)}
          </aside>
        ` : ""}

        <div class="detail-actions">
          <button class="secondary-btn" type="button"
            data-favorite="project:${escapeHTML(project.id)}">
            ${favorites.includes(`project:${project.id}`) ? "♥ V oblíbených" : "♡ Přidat do oblíbených"}
          </button>
        </div>
      </div>
    `);
  }

  /* =======================================================
     KOPÍROVÁNÍ KÓDU
     ======================================================= */

  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();

        const success = document.execCommand("copy");
        textarea.remove();

        if (!success) throw new Error("Kopírování nebylo povoleno.");
      }

      notify("Zkopírováno do schránky.", "success");
    } catch (error) {
      notify("Kopírování se nezdařilo.", "error");
    }
  }

  /* =======================================================
     OBLÍBENÉ POLOŽKY
     ======================================================= */

  function toggleFavorite(id) {
    if (!id) return;

    if (favorites.includes(id)) {
      favorites = favorites.filter(item => item !== id);
      notify("Položka byla odebrána z oblíbených.", "info");
    } else {
      favorites.push(id);
      notify("Přidáno do oblíbených.", "success");
    }

    saveJSON(STORAGE.favorites, favorites);

    renderArticles();
    renderProjects();
    renderFavorites();

    if (currentDialogItem) {
      if (currentDialogItem.type === "article") {
        openArticle(currentDialogItem.id);
      } else {
        openProject(currentDialogItem.id);
      }
    }
  }

  function renderFavorites() {
    const container = $("#favorites-list");
    const count = $("#favorites-count");
    const description = $("#favorites-description");

    const total = favorites.length;

    if (count) count.textContent = String(total);

    if (description) {
      description.textContent = total
        ? `Máš uložených ${total} oblíbených položek.`
        : "Zatím tu nemáš žádné uložené položky.";
    }

    if (!container) return;

    const favoriteItems = favorites.map(favorite => {
      const [type, ...parts] = favorite.split(":");
      const id = parts.join(":");

      if (type === "article") {
        const item = articles.find(article => article.id === id);
        return item ? { ...item, favoriteType: type } : null;
      }

      if (type === "project") {
        const item = projects.find(project => project.id === id);
        return item ? { ...item, favoriteType: type } : null;
      }

      return null;
    }).filter(Boolean);

    if (!favoriteItems.length) {
      container.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">♡</span>
          <h3>Zatím nic uloženého</h3>
          <p>U článků a projektů klikni na srdíčko a uložíš si je sem.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = favoriteItems.map(item => `
      <article class="favorite-card content-card">
        <div class="card-topline">
          <span class="card-icon">${getIcon(item)}</span>
          <span class="card-category">
            ${item.favoriteType === "article" ? "Článek" : "Projekt"}
          </span>
          <button class="favorite-btn is-favorite" type="button"
            data-favorite="${escapeHTML(`${item.favoriteType}:${item.id}`)}"
            aria-label="Odebrat z oblíbených">♥</button>
        </div>
        <h3>${escapeHTML(item.title)}</h3>
        <p>${escapeHTML(item.excerpt || item.description || "")}</p>
        <button class="card-link" type="button"
          ${item.favoriteType === "article"
            ? `data-open-article="${escapeHTML(item.id)}"`
            : `data-open-project="${escapeHTML(item.id)}"`}>
          Otevřít <span>→</span>
        </button>
      </article>
    `).join("");
  }

  /* =======================================================
     OSOBNÍ POZNÁMKY
     ======================================================= */

  function initNotes() {
    const textarea = $("#personal-notes");
    const counter = $("#notes-character-count");
    const status = $("#notes-save-status");
    const saveButton = $("#notes-save");
    const clearButton = $("#notes-clear");

    if (!textarea) return;

    textarea.value = readStorage(STORAGE.notes) || "";

    function updateCounter() {
      if (counter) {
        counter.textContent = `${textarea.value.length} znaků`;
      }
    }

    function saveNotes() {
      const success = writeStorage(STORAGE.notes, textarea.value);

      if (success && status) {
        status.textContent = `Uloženo ${new Date().toLocaleTimeString("cs-CZ", {
          hour: "2-digit",
          minute: "2-digit"
        })}`;
      }

      return success;
    }

    updateCounter();

    textarea.addEventListener("input", () => {
      updateCounter();

      if (status) status.textContent = "Neuložené změny";
    });

    saveButton?.addEventListener("click", () => {
      if (saveNotes()) notify("Poznámky byly uloženy.", "success");
    });

    clearButton?.addEventListener("click", () => {
      if (!textarea.value) return;

      const confirmed = window.confirm("Opravdu chceš smazat všechny poznámky?");
      if (!confirmed) return;

      textarea.value = "";
      saveNotes();
      updateCounter();
      notify("Poznámky byly smazány.", "info");
    });

    textarea.addEventListener("keydown", event => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        saveNotes();
        notify("Poznámky byly uloženy.", "success");
      }
    });
  }

  /* =======================================================
     VZHLED WEBU
     ======================================================= */

  function applyTheme(theme) {
    const selectedTheme = theme === "light" ? "light" : "dark";

    document.documentElement.dataset.theme = selectedTheme;
    document.documentElement.classList.toggle("theme-light", selectedTheme === "light");
    document.documentElement.classList.toggle("theme-dark", selectedTheme === "dark");

    const icon = $("#theme-icon");
    if (icon) icon.textContent = selectedTheme === "dark" ? "☼" : "☾";

    const toggle = $("#theme-toggle");
    if (toggle) {
      toggle.setAttribute(
        "aria-label",
        selectedTheme === "dark" ? "Přepnout na světlý režim" : "Přepnout na tmavý režim"
      );
    }

    writeStorage(STORAGE.theme, selectedTheme);
  }

  function initTheme() {
    const savedTheme = readStorage(STORAGE.theme);
    applyTheme(savedTheme || DEFAULT_THEME);

    $("#theme-toggle")?.addEventListener("click", () => {
      const current = document.documentElement.dataset.theme || DEFAULT_THEME;
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }

  /* =======================================================
     MOBILNÍ MENU
     ======================================================= */

  function initMobileMenu() {
    const toggle = $("#mobile-menu-toggle");
    const nav = $("#main-nav");

    if (!toggle || !nav) return;

    function closeMenu() {
      nav.classList.remove("is-open", "active");
      toggle.classList.remove("is-active");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      nav.classList.toggle("active", isOpen);
      toggle.classList.toggle("is-active", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    $$("a, button", nav).forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", event => {
      if (!nav.contains(event.target) && !toggle.contains(event.target)) {
        closeMenu();
      }
    });
  }

  /* =======================================================
     GLOBÁLNÍ VYHLEDÁVÁNÍ
     ======================================================= */

  function getSearchResults(query) {
    const normalized = normalize(query);

    if (!normalized) return [];

    const articleResults = articles
      .filter(article => articleMatchesSearch(article, query))
      .map(article => ({
        type: "article",
        id: article.id,
        title: article.title,
        description: article.excerpt || "",
        icon: article.icon || "📘"
      }));

    const projectResults = projects
      .filter(project => projectMatchesSearch(project, query))
      .map(project => ({
        type: "project",
        id: project.id,
        title: project.title,
        description: project.description || "",
        icon: project.icon || "⚙"
      }));

    return [...articleResults, ...projectResults].slice(0, 12);
  }

  function renderGlobalSearch() {
    const container = $("#global-search-results");
    if (!container) return;

    if (!globalSearchQuery.trim()) {
      container.innerHTML = `
        <div class="search-placeholder">
          <span>⌕</span>
          <p>Začni psát název článku, projektu nebo téma.</p>
        </div>
      `;
      return;
    }

    const results = getSearchResults(globalSearchQuery);

    if (!results.length) {
      container.innerHTML = `
        <div class="search-placeholder">
          <span>∅</span>
          <p>Nic jsme nenašli. Zkus jiné klíčové slovo.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = results.map(result => `
      <button class="search-result" type="button"
        ${result.type === "article"
          ? `data-open-article="${escapeHTML(result.id)}"`
          : `data-open-project="${escapeHTML(result.id)}"`}>
        <span class="search-result-icon">${escapeHTML(result.icon)}</span>
        <span class="search-result-text">
          <strong>${escapeHTML(result.title)}</strong>
          <small>${escapeHTML(result.description)}</small>
        </span>
        <span class="search-result-type">
          ${result.type === "article" ? "Článek" : "Projekt"}
        </span>
      </button>
    `).join("");
  }

  function openSearch() {
    const overlay = $("#search-overlay");
    const input = $("#global-search-input");

    if (!overlay) return;

    overlay.classList.add("is-open", "active");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("overlay-open");

    setTimeout(() => input?.focus(), 50);
    renderGlobalSearch();
  }

  function closeSearch() {
    const overlay = $("#search-overlay");
    if (!overlay) return;

    overlay.classList.remove("is-open", "active");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("overlay-open");
  }

  function initGlobalSearch() {
    $("#global-search-toggle")?.addEventListener("click", openSearch);
    $("#global-search-close")?.addEventListener("click", closeSearch);

    $("#global-search-input")?.addEventListener("input", event => {
      globalSearchQuery = event.target.value;
      renderGlobalSearch();
    });

    $("#search-overlay")?.addEventListener("click", event => {
      if (event.target.id === "search-overlay") closeSearch();
    });
  }

  /* =======================================================
     PALETA PŘÍKAZŮ
     ======================================================= */

  function openCommandPalette() {
    const overlay = $("#command-overlay");
    if (!overlay) return;

    overlay.classList.add("is-open", "active");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("overlay-open");

    const input = $("#command-input");
    if (input) {
      input.value = "";
      setTimeout(() => input.focus(), 50);
    }

    filterCommands("");
  }

  function closeCommandPalette() {
    const overlay = $("#command-overlay");
    if (!overlay) return;

    overlay.classList.remove("is-open", "active");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("overlay-open");
  }

  function filterCommands(query) {
    const items = $$(".command-item");
    const normalized = normalize(query);

    items.forEach(item => {
      const text = normalize(item.textContent);
      item.hidden = normalized && !text.includes(normalized);
    });
  }

  function runCommand(command) {
    closeCommandPalette();

    const actions = {
      home: () => scrollToSection("home"),
      articles: () => scrollToSection("articles"),
      projects: () => scrollToSection("projects"),
      tools: () => scrollToSection("tools"),
      favorites: () => scrollToSection("favorites"),
      theme: () => {
        const current = document.documentElement.dataset.theme || DEFAULT_THEME;
        applyTheme(current === "dark" ? "light" : "dark");
      }
    };

    if (actions[command]) actions[command]();
  }

  function initCommandPalette() {
    $("#command-input")?.addEventListener("input", event => {
      filterCommands(event.target.value);
    });

    $("#command-overlay")?.addEventListener("click", event => {
      if (event.target.id === "command-overlay") {
        closeCommandPalette();
      }
    });
  }

  /* =======================================================
     KLÁVESOVÉ ZKRATKY
     ======================================================= */

  function initKeyboardShortcuts() {
    document.addEventListener("keydown", event => {
      const target = event.target;
      const typing = target instanceof HTMLElement && (
        target.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
      );

      if (event.key === "Escape") {
        closeSearch();
        closeCommandPalette();
        closeDialog();
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openCommandPalette();
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "f") {
        event.preventDefault();
        openSearch();
        return;
      }

      if (!typing && event.key === "/") {
        event.preventDefault();
        openSearch();
      }
    });
  }

  /* =======================================================
     NAVIGACE A AKTIVNÍ SEKCE
     ======================================================= */

  function initNavigation() {
    const links = $$('a[href^="#"]');

    links.forEach(link => {
      link.addEventListener("click", event => {
        const id = link.getAttribute("href")?.slice(1);
        if (!id) return;

        const target = document.getElementById(id);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    const sections = $$("main section[id], section[id]");
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const id = entry.target.id;

        $$("[data-nav-link]").forEach(link => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${id}`
          );
        });
      });
    }, {
      rootMargin: "-35% 0px -55% 0px"
    });

    sections.forEach(section => observer.observe(section));
  }

  /* =======================================================
     PRŮBĚH ČTENÍ A TLAČÍTKO NAHORU
     ======================================================= */

  function initScrollEffects() {
    const progress = $("#reading-progress-bar");
    const backToTop = $("#back-to-top");

    let scheduled = false;

    function update() {
      scheduled = false;

      const scrollTop = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      const percentage = maxScroll > 0
        ? Math.min(100, Math.max(0, scrollTop / maxScroll * 100))
        : 0;

      if (progress) {
        progress.style.width = `${percentage}%`;
      }

      if (backToTop) {
        backToTop.classList.toggle("is-visible", scrollTop > 500);
      }
    }

    window.addEventListener("scroll", () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(update);
    }, { passive: true });

    update();

    backToTop?.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* =======================================================
     HODINY A ROK
     ======================================================= */

  function initClockAndYear() {
    const clock = $("#live-clock");

    function updateClock() {
      if (!clock) return;

      clock.textContent = new Intl.DateTimeFormat("cs-CZ", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }).format(new Date());
    }

    updateClock();
    setInterval(updateClock, 1000);

    const year = String(new Date().getFullYear());

    if ($("#current-year")) $("#current-year").textContent = year;
    if ($("#footer-year")) $("#footer-year").textContent = year;
  }

  /* =======================================================
     NÁPOVĚDA KLÁVESOVÝCH ZKRATEK
     ======================================================= */

  function initKeyboardHint() {
    const hint = $("#keyboard-hint");
    const close = $("#keyboard-hint-close");

    if (!hint || readStorage(STORAGE.keyboardHint) === "hidden") {
      if (hint) hint.hidden = true;
      return;
    }

    close?.addEventListener("click", () => {
      hint.hidden = true;
      writeStorage(STORAGE.keyboardHint, "hidden");
    });
  }

  /* =======================================================
     DELEGOVÁNÍ UDÁLOSTÍ
     ======================================================= */

  function initDelegatedEvents() {
    document.addEventListener("click", event => {
      const target = event.target instanceof Element
        ? event.target
        : null;

      if (!target) return;

      const favorite = target.closest("[data-favorite]");
      if (favorite) {
        event.preventDefault();
        toggleFavorite(favorite.dataset.favorite);
        return;
      }

      const articleButton = target.closest("[data-open-article]");
      if (articleButton) {
        openArticle(articleButton.dataset.openArticle);
        closeSearch();
        return;
      }

      const projectButton = target.closest("[data-open-project]");
      if (projectButton) {
        openProject(projectButton.dataset.openProject);
        closeSearch();
        return;
      }

      const articleFilter = target.closest("[data-article-filter]");
      if (articleFilter) {
        activeArticleFilter = articleFilter.dataset.articleFilter;
        renderArticleFilters();
        renderArticles();
        return;
      }

      const projectFilter = target.closest("[data-project-filter]");
      if (projectFilter) {
        activeProjectFilter = projectFilter.dataset.projectFilter;
        renderProjectFilters();
        renderProjects();
        return;
      }

      const categoryLink = target.closest("[data-category-link]");
      if (categoryLink) {
        const category = categoryLink.dataset.categoryLink;

        activeArticleFilter = category;
        activeProjectFilter = category;

        renderArticleFilters();
        renderProjectFilters();
        renderArticles();
        renderProjects();

        scrollToSection("articles");
        return;
      }

      const commandItem = target.closest("[data-command]");
      if (commandItem) {
        runCommand(commandItem.dataset.command);
        return;
      }

      const copyButton = target.closest("[data-copy-code]");
      if (copyButton) {
        const code = $(".code-block code", copyButton.closest(".detail-view"));
        if (code) copyText(code.textContent);
      }
    });
  }

  /* =======================================================
     VSTUPY VYHLEDÁVÁNÍ
     ======================================================= */

  function initContentSearch() {
    $("#article-search")?.addEventListener("input", event => {
      articleSearchQuery = event.target.value;
      renderArticles();
    });

    $("#project-search")?.addEventListener("input", event => {
      projectSearchQuery = event.target.value;
      renderProjects();
    });
  }

  /* =======================================================
     DIALOGOVÉ OVLÁDÁNÍ
     ======================================================= */

  function initDialogs() {
    $("#dialog-close")?.addEventListener("click", closeDialog);

    const dialog = $("#content-dialog");

    dialog?.addEventListener("click", event => {
      if (event.target === dialog) {
        closeDialog();
      }
    });

    dialog?.addEventListener("close", () => {
      document.body.classList.remove("dialog-open");
      currentDialogItem = null;
    });
  }

  /* =======================================================
     RENDER VŠEHO
     ======================================================= */

  function renderAll() {
    renderCategories();
    renderArticleFilters();
    renderProjectFilters();
    renderArticles();
    renderProjects();
    renderFavorites();
  }

  /* =======================================================
     API PRO ADMIN.JS
     ======================================================= */

  window.VoltLab = {
    get articles() {
      return articles;
    },

    get projects() {
      return projects;
    },

    get favorites() {
      return [...favorites];
    },

    get storage() {
      return { ...STORAGE };
    },

    notify,

    escapeHTML,
    categoryName,

    renderArticles,
    renderProjects,
    renderFavorites,
    renderCategories,
    renderAll,

    openArticle,
    openProject,
    openDialog,
    closeDialog,

    saveArticles(nextArticles) {
      if (!Array.isArray(nextArticles)) {
        notify("Neplatný seznam článků.", "error");
        return false;
      }

      const success = saveJSON(STORAGE.articles, nextArticles);

      if (success) {
        articles = nextArticles;
        renderAll();
        notify("Články byly aktualizovány.", "success");
      }

      return success;
    },

    saveProjects(nextProjects) {
      if (!Array.isArray(nextProjects)) {
        notify("Neplatný seznam projektů.", "error");
        return false;
      }

      const success = saveJSON(STORAGE.projects, nextProjects);

      if (success) {
        projects = nextProjects;
        renderAll();
        notify("Projekty byly aktualizovány.", "success");
      }

      return success;
    },

    resetContent() {
      const confirmed = window.confirm(
        "Opravdu chceš obnovit výchozí články a projekty? Vlastní úpravy budou ztraceny."
      );

      if (!confirmed) return false;

      const articleSuccess = saveJSON(STORAGE.articles, DEFAULT_ARTICLES);
      const projectSuccess = saveJSON(STORAGE.projects, DEFAULT_PROJECTS);

      if (articleSuccess && projectSuccess) {
        articles = JSON.parse(JSON.stringify(DEFAULT_ARTICLES));
        projects = JSON.parse(JSON.stringify(DEFAULT_PROJECTS));
        renderAll();
        notify("Výchozí obsah byl obnoven.", "success");
        return true;
      }

      return false;
    }
  };

  /* =======================================================
     START APLIKACE
     ======================================================= */

  function init() {
    if (!document.body) return;

    renderAll();

    initTheme();
    initMobileMenu();
    initGlobalSearch();
    initCommandPalette();
    initKeyboardShortcuts();
    initNavigation();
    initScrollEffects();
    initClockAndYear();
    initKeyboardHint();
    initDelegatedEvents();
    initContentSearch();
    initDialogs();
    initNotes();

    console.log(
      `%c⚡ VoltLab V4`,
      "color:#9b7bff;font-size:18px;font-weight:bold;"
    );

    console.log(
      `Načteno ${articles.length} článků a ${projects.length} projektů.`
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
```
