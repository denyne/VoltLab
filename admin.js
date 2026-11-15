
(() => {
  "use strict";

  const CONFIG = window.VOLTLAB_CONFIG || {};
  const ADMIN = CONFIG.admin || {};
  const STORAGE = CONFIG.storage || {};

  const $ = id => document.getElementById(id);

  const sessionKey = STORAGE.session || "voltlab_admin_session";

  let isLoggedIn = false;
  let activeTab = "articles";

  function notify(message) {
    if (window.VoltLab?.notify) {
      window.VoltLab.notify(message);
    } else {
      alert(message);
    }
  }

  function createModal() {
    if ($("admin-modal")) return;

    const modal = document.createElement("dialog");
    modal.id = "admin-modal";
    modal.className = "admin-modal";

    modal.innerHTML = `
      <button type="button"
        class="dialog-close"
        id="admin-close"
        aria-label="Zavřít">✕</button>

      <div id="admin-content"></div>
    `;

    document.body.appendChild(modal);

    $("admin-close").addEventListener("click", closeModal);

    modal.addEventListener("click", event => {
      if (event.target === modal) closeModal();
    });
  }

  function openModal() {
    const modal = $("admin-modal");
    if (!modal) return;

    if (typeof modal.showModal === "function") {
      modal.showModal();
    } else {
      modal.setAttribute("open", "");
    }
  }

  function closeModal() {
    const modal = $("admin-modal");
    if (!modal) return;

    if (typeof modal.close === "function") {
      modal.close();
    } else {
      modal.removeAttribute("open");
    }
  }

  function getSession() {
    try {
      return sessionStorage.getItem(sessionKey) === "active";
    } catch {
      return false;
    }
  }

  function setSession(active) {
    try {
      if (active) {
        sessionStorage.setItem(sessionKey, "active");
      } else {
        sessionStorage.removeItem(sessionKey);
      }
    } catch {
      notify("Prohlížeč nedovolil uložit přihlášení.");
    }
  }

  // --------------------------------------------------
  // PŘIHLÁŠENÍ
  // --------------------------------------------------

  function showLogin() {
    $("admin-content").innerHTML = `
      <h2>Administrace VoltLab</h2>
      <p>Pro pokračování zadej administrační heslo.</p>

      <form id="admin-login-form">
        <label for="admin-password">Heslo</label>
        <input
          id="admin-password"
          type="password"
          autocomplete="current-password"
          placeholder="Zadej heslo"
          required
        >

        <button class="button full-button" type="submit">
          Přihlásit se
        </button>
      </form>

      <p class="admin-warning">
        Demo administrace ukládá změny pouze do tohoto prohlížeče.
      </p>
    `;

    $("admin-login-form").addEventListener("submit", event => {
      event.preventDefault();

      const password = $("admin-password").value;

      if (password === ADMIN.demoPassword) {
        isLoggedIn = true;
        setSession(true);
        showDashboard();
        notify("Přihlášení bylo úspěšné.");
      } else {
        notify("Nesprávné heslo.");
        $("admin-password").value = "";
        $("admin-password").focus();
      }
    });
  }

  // --------------------------------------------------
  // HLAVNÍ ADMINISTRACE
  // --------------------------------------------------

  function showDashboard() {
    if (!isLoggedIn) {
      showLogin();
      return;
    }

    $("admin-content").innerHTML = `
      <h2>Administrace VoltLab</h2>

      <div class="admin-actions">
        <button class="button secondary"
          data-admin-tab="articles">
          Články
        </button>

        <button class="button secondary"
          data-admin-tab="projects">
          Projekty
        </button>

        <button class="button secondary"
          id="admin-reset">
          Obnovit obsah
        </button>

        <button class="button secondary"
          id="admin-logout">
          Odhlásit
        </button>
      </div>

      <div id="admin-panel"></div>
    `;

    $("admin-content").addEventListener("click", handleDashboardClick);

    renderAdminTab();
  }

  function handleDashboardClick(event) {
    const tabButton = event.target.closest("[data-admin-tab]");

    if (tabButton) {
      activeTab = tabButton.dataset.adminTab;
      renderAdminTab();
      return;
    }

    if (event.target.closest("#admin-logout")) {
      isLoggedIn = false;
      setSession(false);
      showLogin();
      notify("Byl jsi odhlášen.");
      return;
    }

    if (event.target.closest("#admin-reset")) {
      if (confirm("Opravdu chceš obnovit výchozí obsah?")) {
        window.VoltLab?.resetContent();
        renderAdminTab();
      }
    }
  }

  // --------------------------------------------------
  // SPRÁVA ČLÁNKŮ
  // --------------------------------------------------

  function renderAdminTab() {
    const panel = $("admin-panel");
    if (!panel || !window.VoltLab) return;

    if (activeTab === "articles") {
      renderArticlesAdmin(panel);
    } else {
      renderProjectsAdmin(panel);
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

  function categoryOptions(selected = "") {
    return (CONFIG.categories || []).map(category => `
      <option
        value="${escapeHTML(category.id)}"
        ${category.id === selected ? "selected" : ""}>
        ${escapeHTML(category.name)}
      </option>
    `).join("");
  }

  function renderArticlesAdmin(panel) {
    const articles = window.VoltLab.articles;

    panel.innerHTML = `
      <h3>Články (${articles.length})</h3>

      <form id="admin-article-form">
        <label for="new-article-title">Název článku</label>
        <input id="new-article-title" required>

        <label for="new-article-category">Kategorie</label>
        <select id="new-article-category">
          ${categoryOptions()}
        </select>

        <label for="new-article-excerpt">Krátký popis</label>
        <textarea id="new-article-excerpt" required></textarea>

        <label for="new-article-content">Obsah článku</label>
        <textarea id="new-article-content" required></textarea>

        <button class="button full-button" type="submit">
          Přidat článek
        </button>
      </form>

      <h3>Existující články</h3>

      <div class="admin-list">
        ${articles.map(article => `
          <div class="admin-list-item">
            <span>${escapeHTML(article.title)}</span>
            <button class="button secondary"
              data-delete-article="${escapeHTML(article.id)}">
              Smazat
            </button>
          </div>
        `).join("")}
      </div>
    `;

    $("admin-article-form").addEventListener("submit", event => {
      event.preventDefault();

      const title = $("new-article-title").value.trim();
      const excerpt = $("new-article-excerpt").value.trim();
      const content = $("new-article-content").value.trim();
      const category = $("new-article-category").value;

      if (!title || !excerpt || !content) {
        notify("Vyplň všechna pole.");
        return;
      }

      const newArticle = {
        id: "article-" + Date.now(),
        title,
        category,
        icon: "📘",
        readTime: "Nový článek",
        excerpt,
        content,
        tags: []
      };

      window.VoltLab.saveArticles([
        ...window.VoltLab.articles,
        newArticle
      ]);

      notify("Článek byl přidán.");
      renderAdminTab();
    });

    panel.querySelectorAll("[data-delete-article]").forEach(button => {
      button.addEventListener("click", () => {
        const id = button.dataset.deleteArticle;

        if (!confirm("Opravdu chceš smazat tento článek?")) return;

        window.VoltLab.saveArticles(
          window.VoltLab.articles.filter(item => item.id !== id)
        );

        notify("Článek byl smazán.");
        renderAdminTab();
      });
    });
  }

  // --------------------------------------------------
  // SPRÁVA PROJEKTŮ
  // --------------------------------------------------

  function renderProjectsAdmin(panel) {
    const projects = window.VoltLab.projects;

    panel.innerHTML = `
      <h3>Projekty (${projects.length})</h3>

      <form id="admin-project-form">
        <label for="new-project-title">Název projektu</label>
        <input id="new-project-title" required>

        <label for="new-project-category">Kategorie</label>
        <select id="new-project-category">
          ${categoryOptions()}
        </select>

        <label for="new-project-description">Popis</label>
        <textarea id="new-project-description" required></textarea>

        <label for="new-project-components">
          Součástky (každou napiš na nový řádek)
        </label>
        <textarea id="new-project-components"></textarea>

        <label for="new-project-steps">
          Postup (každý krok na nový řádek)
        </label>
        <textarea id="new-project-steps"></textarea>

        <label for="new-project-code">Arduino kód (nepovinné)</label>
        <textarea id="new-project-code"></textarea>

        <button class="button full-button" type="submit">
          Přidat projekt
        </button>
      </form>

      <h3>Existující projekty</h3>

      <div class="admin-list">
        ${projects.map(project => `
          <div class="admin-list-item">
            <span>${escapeHTML(project.title)}</span>
            <button class="button secondary"
              data-delete-project="${escapeHTML(project.id)}">
              Smazat
            </button>
          </div>
        `).join("")}
      </div>
    `;

    $("admin-project-form").addEventListener("submit", event => {
      event.preventDefault();

      const title = $("new-project-title").value.trim();
      const description = $("new-project-description").value.trim();

      if (!title || !description) {
        notify("Vyplň název a popis projektu.");
        return;
      }

      const components = $("new-project-components")
        .value.split("\n")
        .map(item => item.trim())
        .filter(Boolean);

      const steps = $("new-project-steps")
        .value.split("\n")
        .map(item => item.trim())
        .filter(Boolean);

      const newProject = {
        id: "project-" + Date.now(),
        title,
        category: $("new-project-category").value,
        icon: "🔧",
        difficulty: "Neurčeno",
        time: "",
        description,
        components,
        steps,
        code: $("new-project-code").value.trim(),
        note: ""
      };

      window.VoltLab.saveProjects([
        ...window.VoltLab.projects,
        newProject
      ]);

      notify("Projekt byl přidán.");
      renderAdminTab();
    });

    panel.querySelectorAll("[data-delete-project]").forEach(button => {
      button.addEventListener("click", () => {
        const id = button.dataset.deleteProject;

        if (!confirm("Opravdu chceš smazat tento projekt?")) return;

        window.VoltLab.saveProjects(
          window.VoltLab.projects.filter(item => item.id !== id)
        );

        notify("Projekt byl smazán.");
        renderAdminTab();
      });
    });
  }

  // --------------------------------------------------
  // START
  // --------------------------------------------------

  function init() {
    if (ADMIN.enabled === false) return;

    createModal();

    const accessButton = $("admin-access");

    if (!accessButton) {
      console.warn("VoltLab: Tlačítko #admin-access nebylo nalezeno.");
      return;
    }

    accessButton.addEventListener("click", () => {
      isLoggedIn = getSession();

      if (isLoggedIn) {
        showDashboard();
      } else {
        showLogin();
      }

      openModal();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
