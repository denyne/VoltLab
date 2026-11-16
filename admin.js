
/* =========================================================
   VOLTLAB V4 MAX
   ADMINISTRATION MODULE
   ========================================================= */

"use strict";

window.VOLTLAB = window.VOLTLAB || {};

(() => {
  const APP = window.VOLTLAB;

  if (APP.adminInitialized) return;
  APP.adminInitialized = true;

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const escape = value =>
    APP.utils.escapeHTML(String(value ?? ""));

  /*
   * DEMO HESLO:
   * Změň ho před zveřejněním webu.
   *
   * Upozornění:
   * Jde pouze o klientské omezení přístupu.
   * Není to skutečné zabezpečení administrace.
   */

  const ADMIN_PASSWORD = "zmen-me-2026";

  const SESSION_KEY = APP.storageKeys.adminSession;

  let activeTab = "overview";
  let editingItem = null;
  let editingType = null;

  /* -------------------------------------------------------
     SESSION
  ------------------------------------------------------- */

  function isLoggedIn() {
    return sessionStorage.getItem(SESSION_KEY) === "active";
  }

  function login(password) {
    if (password !== ADMIN_PASSWORD) {
      return false;
    }

    sessionStorage.setItem(SESSION_KEY, "active");

    APP.events.emit("admin:login");

    return true;
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);

    APP.events.emit("admin:logout");

    render();

    notify("Byl jsi odhlášen.");
  }

  /* -------------------------------------------------------
     HELPERS
  ------------------------------------------------------- */

  function notify(message, type = "success") {
    APP.notify(message, type);
  }

  function getAdminContainer() {
    const page =
      document.querySelector("#page-admin") ||
      document.querySelector('[data-page="admin"]') ||
      document.querySelector("#admin");

    if (!page) return null;

    let container = page.querySelector("[data-admin-root]");

    if (!container) {
      container = document.createElement("div");
      container.dataset.adminRoot = "";
      page.appendChild(container);
    }

    return container;
  }

  function formatDate(value) {
    return APP.utils.formatDateTime(value);
  }

  function createId(prefix) {
    return APP.utils.id(prefix);
  }

  function safeArray(value) {
    return Array.isArray(value) ? value : [];
  }

  /* -------------------------------------------------------
     LOGIN SCREEN
  ------------------------------------------------------- */

  function renderLogin() {
    return `
      <div class="admin-login">
        <div class="panel admin-login-panel">
          <div class="admin-login-icon">⚙</div>

          <span class="eyebrow">VOLTLAB V4 MAX</span>

          <h1>Administrace</h1>

          <p>
            Přihlas se pro správu obsahu a nastavení webu.
          </p>

          <form id="admin-login-form">

            <label class="form-field">
              <span>Heslo administrátora</span>

              <input
                type="password"
                name="password"
                autocomplete="current-password"
                required
                autofocus
              />
            </label>

            <div
              class="admin-login-error"
              id="admin-login-error"
              hidden
            >
              Nesprávné heslo.
            </div>

            <button
              type="submit"
              class="primary-button"
            >
              Přihlásit se
            </button>

          </form>

          <small>
            Demo přihlášení není náhradou serverového zabezpečení.
          </small>
        </div>
      </div>
    `;
  }

  /* -------------------------------------------------------
     STATISTICS
  ------------------------------------------------------- */

  function getStatistics() {
    return {
      articles: APP.articles?.getAll().length || 0,
      projects: APP.projects?.getAll().length || 0,
      components: APP.components?.getAll().length || 0,
      categories: APP.data.getCategories().length || 0,
      favorites: APP.data.getFavorites().length || 0,
      notes: APP.storage.get(APP.storageKeys.journal, []).length
    };
  }

  function renderOverview() {
    const stats = getStatistics();

    return `
      <div class="admin-overview">

        <div class="stats-grid">

          ${Object.entries(stats).map(([key, value]) => `
            <div class="stat-card">
              <strong>${value}</strong>
              <span>${escape(key)}</span>
            </div>
          `).join("")}

        </div>

        <section class="panel">
          <h2>Rychlé akce</h2>

          <div class="admin-actions">
            <button
              class="primary-button"
              data-admin-action="new-article"
            >
              + Nový článek
            </button>

            <button
              class="secondary-button"
              data-admin-action="new-project"
            >
              + Nový projekt
            </button>

            <button
              class="secondary-button"
              data-admin-action="new-category"
            >
              + Nová kategorie
            </button>

            <button
              class="secondary-button"
              data-admin-action="export"
            >
              Exportovat obsah
            </button>
          </div>
        </section>

        <section class="panel">
          <h2>Informace o úložišti</h2>

          <p>
            Všechna uživatelská data jsou ukládána lokálně
            v prohlížeči.
          </p>

          <strong>
            ${APP.storage.bytes().toLocaleString("cs-CZ")} B
          </strong>
          <small>Odhadovaná velikost dat VoltLabu</small>
        </section>

      </div>
    `;
  }

  /* -------------------------------------------------------
     ARTICLES MANAGEMENT
  ------------------------------------------------------- */

  function renderArticles() {
    const articles = APP.articles?.getAll() || [];

    return `
      <div class="admin-section">

        <div class="section-heading">
          <div>
            <h2>Správa článků</h2>
            <p>Vytvářej a upravuj vzdělávací obsah.</p>
          </div>

          <button
            class="primary-button"
            data-admin-action="new-article"
          >
            + Přidat článek
          </button>
        </div>

        <div class="admin-list">

          ${articles.map(article => `
            <article class="panel admin-list-item">

              <div>
                <strong>${escape(article.title)}</strong>
                <small>
                  ${escape(article.category)} ·
                  ${escape(article.level || "Základy")}
                </small>
              </div>

              <div class="admin-item-actions">

                <button
                  class="secondary-button"
                  data-admin-action="edit-article"
                  data-id="${escape(article.id)}"
                >
                  Upravit
                </button>

                <button
                  class="danger-button"
                  data-admin-action="delete-article"
                  data-id="${escape(article.id)}"
                >
                  Smazat
                </button>

              </div>

            </article>
          `).join("") || `
            <div class="panel">
              Zatím nejsou k dispozici žádné články.
            </div>
          `}

        </div>

      </div>
    `;
  }

  function articleForm(article = {}) {
    const item = article;

    return `
      <form id="admin-article-form" class="admin-editor">

        <label class="form-field">
          <span>Název článku</span>
          <input
            name="title"
            required
            maxlength="150"
            value="${escape(item.title || "")}"
          />
        </label>

        <label class="form-field">
          <span>Kategorie</span>
          <input
            name="category"
            required
            value="${escape(item.category || "Základy")}"
          />
        </label>

        <label class="form-field">
          <span>Obtížnost</span>
          <select name="level">
            ${["Začátečník", "Mírně pokročilý", "Pokročilý", "Expert"]
              .map(level => `
                <option
                  value="${escape(level)}"
                  ${item.level === level ? "selected" : ""}
                >
                  ${escape(level)}
                </option>
              `).join("")}
          </select>
        </label>

        <label class="form-field">
          <span>Čas čtení v minutách</span>
          <input
            type="number"
            name="readingTime"
            min="1"
            max="300"
            value="${escape(item.readingTime || 5)}"
          />
        </label>

        <label class="form-field">
          <span>Krátký popis</span>
          <textarea
            name="excerpt"
            required
            rows="3"
            maxlength="500"
          >${escape(item.excerpt || "")}</textarea>
        </label>

        <label class="form-field">
          <span>Obsah článku (Markdown)</span>
          <textarea
            name="content"
            required
            rows="12"
          >${escape(item.content || "")}</textarea>
        </label>

        <label class="form-field">
          <span>Tagy oddělené čárkou</span>
          <input
            name="tags"
            value="${escape((item.tags || []).join(", "))}"
          />
        </label>

        <button type="submit" class="primary-button">
          Uložit článek
        </button>

      </form>
    `;
  }

  function saveArticle(form) {
    const data = new FormData(form);

    const article = {
      title: String(data.get("title")).trim(),
      category: String(data.get("category")).trim(),
      level: String(data.get("level")),
      readingTime: Math.max(
        1,
        Number(data.get("readingTime")) || 5
      ),
      excerpt: String(data.get("excerpt")).trim(),
      content: String(data.get("content")).trim(),
      tags: String(data.get("tags"))
        .split(",")
        .map(tag => tag.trim())
        .filter(Boolean)
    };

    if (!article.title || !article.content) {
      notify("Vyplň název a obsah článku.", "error");
      return;
    }

    if (editingItem) {
      const result = APP.articles.update(
        editingItem,
        article
      );

      if (!result) {
        notify("Článek se nepodařilo upravit.", "error");
        return;
      }

    } else {
      const result = APP.articles.add(article);

      if (!result) {
        notify("Článek se nepodařilo přidat.", "error");
        return;
      }
    }

    editingItem = null;

    notify("Článek byl uložen.");

    activeTab = "articles";
    render();
  }

  function editArticle(id) {
    const article = APP.articles.getById(id);

    if (!article) {
      notify("Článek nebyl nalezen.", "error");
      return;
    }

    editingItem = id;

    openEditor(
      "Upravit článek",
      articleForm(article)
    );
  }

  function newArticle() {
    editingItem = null;

    openEditor(
      "Nový článek",
      articleForm()
    );
  }

  function deleteArticle(id) {
    if (!confirm("Opravdu chceš tento článek odstranit?")) {
      return;
    }

    if (!APP.articles.remove(id)) {
      notify("Článek se nepodařilo odstranit.", "error");
      return;
    }

    notify("Článek byl odstraněn.");

    render();
  }

  /* -------------------------------------------------------
     PROJECT MANAGEMENT
  ------------------------------------------------------- */

  function renderProjects() {
    const projects = APP.projects?.getAll() || [];

    return `
      <div class="admin-section">

        <div class="section-heading">
          <div>
            <h2>Správa projektů</h2>
            <p>Upravuj návody a elektronické projekty.</p>
          </div>

          <button
            class="primary-button"
            data-admin-action="new-project"
          >
            + Nový projekt
          </button>
        </div>

        <div class="admin-list">

          ${projects.map(project => `
            <article class="panel admin-list-item">

              <div>
                <strong>${escape(project.title)}</strong>
                <small>${escape(project.category)}</small>
              </div>

              <div class="admin-item-actions">

                <button
                  class="secondary-button"
                  data-admin-action="edit-project"
                  data-id="${escape(project.id)}"
                >
                  Upravit
                </button>

                <button
                  class="danger-button"
                  data-admin-action="delete-project"
                  data-id="${escape(project.id)}"
                >
                  Smazat
                </button>

              </div>

            </article>
          `).join("")}

        </div>

      </div>
    `;
  }

  function projectForm(project = {}) {
    const item = project;

    return `
      <form id="admin-project-form" class="admin-editor">

        <label class="form-field">
          <span>Název projektu</span>
          <input
            name="title"
            required
            maxlength="150"
            value="${escape(item.title || "")}"
          />
        </label>

        <label class="form-field">
          <span>Kategorie</span>
          <input
            name="category"
            required
            value="${escape(item.category || "Projekty")}"
          />
        </label>

        <label class="form-field">
          <span>Obtížnost</span>
          <select name="level">
            ${["Začátečník", "Mírně pokročilý", "Pokročilý"]
              .map(level => `
                <option
                  value="${escape(level)}"
                  ${item.level === level ? "selected" : ""}
                >
                  ${escape(level)}
                </option>
              `).join("")}
          </select>
        </label>

        <label class="form-field">
          <span>Popis</span>
          <textarea
            name="description"
            required
            rows="4"
          >${escape(item.description || "")}</textarea>
        </label>

        <label class="form-field">
          <span>Odhadovaný čas</span>
          <input
            name="estimatedTime"
            value="${escape(item.estimatedTime || "")}"
          />
        </label>

        <label class="form-field">
          <span>Bezpečnostní upozornění</span>
          <textarea
            name="safety"
            rows="3"
          >${escape(item.safety || "")}</textarea>
        </label>

        <label class="form-field">
          <span>Součástky – jedna na řádek ve formátu název | množství</span>
          <textarea
            name="components"
            rows="5"
          >${escape((item.components || []).map(part =>
            `${part.name} | ${part.quantity}`
          ).join("\n"))}</textarea>
        </label>

        <label class="form-field">
          <span>Postup – jeden krok na řádek</span>
          <textarea
            name="steps"
            rows="7"
          >${escape((item.steps || []).map(step =>
            typeof step === "string" ? step : step.title
          ).join("\n"))}</textarea>
        </label>

        <button type="submit" class="primary-button">
          Uložit projekt
        </button>

      </form>
    `;
  }

  function saveProject(form) {
    const data = new FormData(form);

    const components = String(data.get("components") || "")
      .split("\n")
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        const [name, quantity] = line.split("|");

        return {
          name: (name || "").trim(),
          quantity: (quantity || "1").trim(),
          price: 0
        };
      });

    const steps = String(data.get("steps") || "")
      .split("\n")
      .map(step => step.trim())
      .filter(Boolean);

    const project = {
      title: String(data.get("title")).trim(),
      category: String(data.get("category")).trim(),
      level: String(data.get("level")),
      description: String(data.get("description")).trim(),
      estimatedTime: String(data.get("estimatedTime")).trim(),
      safety: String(data.get("safety")).trim(),
      components,
      steps,
      tags: [],
      featured: false
    };

    if (!project.title || !project.description) {
      notify("Vyplň název a popis projektu.", "error");
      return;
    }

    if (editingItem) {
      if (!APP.projects.update(editingItem, project)) {
        notify("Projekt se nepodařilo upravit.", "error");
        return;
      }
    } else {
      if (!APP.projects.add(project)) {
        notify("Projekt se nepodařilo přidat.", "error");
        return;
      }
    }

    editingItem = null;

    notify("Projekt byl uložen.");

    activeTab = "projects";
    render();
  }

  function editProject(id) {
    const project = APP.projects.getById(id);

    if (!project) {
      notify("Projekt nebyl nalezen.", "error");
      return;
    }

    editingItem = id;

    openEditor(
      "Upravit projekt",
      projectForm(project)
    );
  }

  function newProject() {
    editingItem = null;

    openEditor(
      "Nový projekt",
      projectForm()
    );
  }

  function deleteProject(id) {
    if (!confirm("Opravdu chceš tento projekt odstranit?")) {
      return;
    }

    if (!APP.projects.remove(id)) {
      notify("Projekt se nepodařilo odstranit.", "error");
      return;
    }

    notify("Projekt byl odstraněn.");

    render();
  }

  /* -------------------------------------------------------
     CATEGORIES
  ------------------------------------------------------- */

  function renderCategories() {
    const categories = APP.data.getCategories();

    return `
      <div class="admin-section">

        <div class="section-heading">
          <div>
            <h2>Kategorie</h2>
            <p>Organizuj obsah VoltLabu.</p>
          </div>

          <button
            class="primary-button"
            data-admin-action="new-category"
          >
            + Přidat kategorii
          </button>
        </div>

        <div class="admin-list">

          ${categories.map(category => `
            <article class="panel admin-list-item">

              <div>
                <strong>${escape(category.name)}</strong>
                <small>${escape(category.id)}</small>
              </div>

              <button
                class="danger-button"
                data-admin-action="delete-category"
                data-id="${escape(category.id)}"
              >
                Smazat
              </button>

            </article>
          `).join("")}

        </div>

      </div>
    `;
  }

  function newCategory() {
    openEditor("Nová kategorie", `
      <form id="admin-category-form">

        <label class="form-field">
          <span>Název kategorie</span>
          <input name="name" required maxlength="80" />
        </label>

        <label class="form-field">
          <span>Ikona (emoji)</span>
          <input name="icon" maxlength="8" value="⚡" />
        </label>

        <button class="primary-button" type="submit">
          Vytvořit kategorii
        </button>

      </form>
    `);
  }

  function saveCategory(form) {
    const data = new FormData(form);

    const name = String(data.get("name")).trim();
    const icon = String(data.get("icon")).trim() || "⚡";

    if (!name) {
      notify("Zadej název kategorie.", "error");
      return;
    }

    const categories = APP.data.getCategories();

    const id = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    if (categories.some(item => item.id === id)) {
      notify("Tato kategorie již existuje.", "error");
      return;
    }

    categories.push({
      id,
      name,
      icon
    });

    APP.data.saveCategories(categories);

    notify("Kategorie byla vytvořena.");

    activeTab = "categories";
    render();
  }

  function deleteCategory(id) {
    if (!confirm("Opravdu odstranit tuto kategorii?")) {
      return;
    }

    const categories = APP.data.getCategories()
      .filter(item => item.id !== id);

    APP.data.saveCategories(categories);

    notify("Kategorie byla odstraněna.");

    render();
  }

  /* -------------------------------------------------------
     EDITOR MODAL
  ------------------------------------------------------- */

  function openEditor(title, html) {
    let overlay = document.querySelector("#admin-editor-overlay");

    overlay?.remove();

    overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.id = "admin-editor-overlay";

    overlay.innerHTML = `
      <div class="modal-window admin-editor-window">
        <div class="modal-header">
          <h2>${escape(title)}</h2>
          <button
            type="button"
            class="modal-close"
            data-admin-action="close-editor"
            aria-label="Zavřít"
          >
            ×
          </button>
        </div>

        <div class="modal-body">
          ${html}
        </div>
      </div>
    `;

    overlay.addEventListener("click", event => {
      if (event.target === overlay) {
        overlay.remove();
      }
    });

    document.body.appendChild(overlay);
  }

  function closeEditor() {
    $("#admin-editor-overlay")?.remove();
    editingItem = null;
  }

  /* -------------------------------------------------------
     CONTENT EXPORT
  ------------------------------------------------------- */

  function exportContent() {
    const payload = {
      type: "voltlab-admin-export",
      version: APP.version || "4.0.0",
      exportedAt: new Date().toISOString(),

      articles: APP.articles.getAll(),
      projects: APP.projects.getAll(),
      components: APP.components.getAll(),
      categories: APP.data.getCategories()
    };

    APP.utils.download(
      JSON.stringify(payload, null, 2),
      "voltlab-content-backup.json",
      "application/json"
    );

    notify("Export obsahu byl vytvořen.");
  }

  /* -------------------------------------------------------
     CONTENT IMPORT
  ------------------------------------------------------- */

  function importContent(data) {
    if (
      !data ||
      data.type !== "voltlab-admin-export" ||
      !Array.isArray(data.articles) ||
      !Array.isArray(data.projects)
    ) {
      throw new Error("Soubor nemá platný formát VoltLab.");
    }

    const confirmed = confirm(
      "Import nahradí uživatelské články a projekty. Pokračovat?"
    );

    if (!confirmed) return false;

    const importedArticles = data.articles.filter(item =>
      item &&
      typeof item.title === "string" &&
      typeof item.content === "string"
    );

    const importedProjects = data.projects.filter(item =>
      item &&
      typeof item.title === "string" &&
      Array.isArray(item.steps) &&
      Array.isArray(item.components)
    );

    APP.storage.set(
      APP.storageKeys.articles,
      importedArticles
    );

    APP.storage.set(
      APP.storageKeys.projects,
      importedProjects
    );

    if (Array.isArray(data.components)) {
      APP.storage.set(
        APP.storageKeys.customComponents,
        data.components
      );
    }

    if (Array.isArray(data.categories)) {
      APP.data.saveCategories(data.categories);
    }

    notify("Obsah byl importován.");

    render();

    return true;
  }

  /* -------------------------------------------------------
     ADMIN NAVIGATION
  ------------------------------------------------------- */

  const tabs = [
    ["overview", "Přehled"],
    ["articles", "Články"],
    ["projects", "Projekty"],
    ["categories", "Kategorie"]
  ];

  function renderTabs() {
    return `
      <div class="admin-tabs">
        ${tabs.map(([id, title]) => `
          <button
            class="${activeTab === id ? "active" : ""}"
            data-admin-tab="${id}"
          >
            ${escape(title)}
          </button>
        `).join("")}
      </div>
    `;
  }

  function renderContent() {
    switch (activeTab) {
      case "articles":
        return renderArticles();

      case "projects":
        return renderProjects();

      case "categories":
        return renderCategories();

      default:
        return renderOverview();
    }
  }

  /* -------------------------------------------------------
     MAIN RENDER
  ------------------------------------------------------- */

  function render() {
    const container = getAdminContainer();

    if (!container) return;

    if (!isLoggedIn()) {
      container.innerHTML = renderLogin();
      return;
    }

    container.innerHTML = `
      <div class="admin-dashboard">

        <div class="admin-heading">
          <div>
            <span class="eyebrow">VOLTLAB V4 MAX</span>
            <h1>Administrace</h1>
            <p>Správa obsahu a webu.</p>
          </div>

          <button
            class="secondary-button"
            data-admin-action="logout"
          >
            Odhlásit se
          </button>
        </div>

        ${renderTabs()}

        <div class="admin-content">
          ${renderContent()}
        </div>

      </div>
    `;
  }

  /* -------------------------------------------------------
     EVENT HANDLERS
  ------------------------------------------------------- */

  document.addEventListener("click", event => {
    const tab = event.target.closest("[data-admin-tab]");

    if (tab) {
      activeTab = tab.dataset.adminTab;
      render();
      return;
    }

    const button = event.target.closest("[data-admin-action]");

    if (!button) return;

    const action = button.dataset.adminAction;
    const id = button.dataset.id;

    switch (action) {
      case "logout":
        logout();
        break;

      case "new-article":
        newArticle();
        break;

      case "edit-article":
        editArticle(id);
        break;

      case "delete-article":
        deleteArticle(id);
        break;

      case "new-project":
        newProject();
        break;

      case "edit-project":
        editProject(id);
        break;

      case "delete-project":
        deleteProject(id);
        break;

      case "new-category":
        newCategory();
        break;

      case "delete-category":
        deleteCategory(id);
        break;

      case "export":
        exportContent();
        break;

      case "close-editor":
        closeEditor();
        break;
    }
  });

  document.addEventListener("submit", event => {
    if (event.target.id === "admin-login-form") {
      event.preventDefault();

      const password = new FormData(event.target).get("password");

      if (login(password)) {
        notify("Přihlášení bylo úspěšné.");
        render();
      } else {
        const error = $("#admin-login-error");

        if (error) error.hidden = false;

        event.target.reset();
      }

      return;
    }

    if (event.target.id === "admin-article-form") {
      event.preventDefault();
      saveArticle(event.target);
      closeEditor();
      return;
    }

    if (event.target.id === "admin-project-form") {
      event.preventDefault();
      saveProject(event.target);
      closeEditor();
      return;
    }

    if (event.target.id === "admin-category-form") {
      event.preventDefault();
      saveCategory(event.target);
      closeEditor();
    }
  });

  /* -------------------------------------------------------
     IMPORT INPUT
  ------------------------------------------------------- */

  function addImportButton() {
    const container = getAdminContainer();

    if (!container) return;

    const section = $(".admin-overview", container);

    if (!section || $("#admin-import-content", section)) return;

    const input = document.createElement("input");

    input.type = "file";
    input.accept = ".json,application/json";
    input.id = "admin-import-content";
    input.hidden = true;

    section.appendChild(input);

    const button = document.createElement("button");

    button.type = "button";
    button.className = "secondary-button";
    button.textContent = "Importovat obsah";
    button.dataset.adminAction = "choose-import";

    section.appendChild(button);
  }

  document.addEventListener("click", event => {
    const button = event.target.closest(
      '[data-admin-action="choose-import"]'
    );

    if (button) {
      $("#admin-import-content")?.click();
    }
  });

  document.addEventListener("change", async event => {
    if (event.target.id !== "admin-import-content") return;

    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const data = JSON.parse(await file.text());

      importContent(data);

    } catch (error) {
      notify(`Import se nezdařil: ${error.message}`, "error");
    }

    event.target.value = "";
  });

  /* -------------------------------------------------------
     APP INTEGRATION
  ------------------------------------------------------- */

  APP.admin = {
    render,
    login,
    logout,
    isLoggedIn,
    exportContent,
    importContent,
    getStatistics,
    get activeTab() {
      return activeTab;
    }
  };

  APP.events.on("page:rendered", event => {
    if (event?.page === "admin") {
      render();
      addImportButton();
    }
  });

  APP.events.on("admin:login", render);

  console.info("[VoltLab] Administration module initialized.");

})();
