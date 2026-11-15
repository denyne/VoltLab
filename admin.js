
/* =====================================================
   VOLTLAB V3 – ADMIN.JS
   Administrace webu
   ===================================================== */

(() => {
  "use strict";

  const CONFIG = window.VOLTLAB_CONFIG || {};
  const ADMIN = CONFIG.admin || {};
  const SESSION_KEY = ADMIN.sessionKey || "voltLabAdminSession";

  const getApp = () => window.VoltLab || {};

  const getData = (method) => {
    const result = getApp()[method]?.();
    return Array.isArray(result) ? result : [];
  };

  const saveData = (method, data) => {
    if (typeof getApp()[method] !== "function") {
      showMessage("Funkce ukládání není dostupná.");
      return false;
    }

    getApp()[method](data);
    return true;
  };

  const escapeHTML = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  function showMessage(message) {
    if (typeof getApp().toast === "function") {
      getApp().toast(message);
    } else {
      alert(message);
    }
  }

  function isLoggedIn() {
    return sessionStorage.getItem(SESSION_KEY) === "true";
  }

  function openAdmin() {
    const modal = document.getElementById("admin-modal");

    if (!modal) {
      showMessage("V HTML chybí prvek #admin-modal.");
      return;
    }

    modal.classList.add("is-open", "active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    if (isLoggedIn()) {
      renderDashboard();
    } else {
      renderLogin();
    }
  }

  function closeAdmin() {
    const modal = document.getElementById("admin-modal");
    if (!modal) return;

    modal.classList.remove("is-open", "active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  function renderLogin(error = "") {
    const modal = document.getElementById("admin-modal");
    if (!modal) return;

    modal.innerHTML = `
      <div class="admin-login">
        <button class="admin-close"
          data-admin-action="close" type="button">×</button>

        <div class="admin-login-icon">⚡</div>

        <h2>VoltLab Admin</h2>
        <p>Přihlášení do administrace</p>

        <form id="admin-login-form">
          <label class="admin-field">
            Heslo
            <input
              type="password"
              name="password"
              placeholder="Zadej heslo"
              autocomplete="current-password"
              required
            >
          </label>

          ${error ? `<p class="admin-error">${escapeHTML(error)}</p>` : ""}

          <button class="button button-primary" type="submit">
            Přihlásit se
          </button>
        </form>

        <small>
          Demonstrační administrace VoltLab V3.
        </small>
      </div>
    `;
  }

  function login(password) {
    if (!ADMIN.demoPassword) {
      renderLogin("V config.js není nastavené demo heslo.");
      return;
    }

    if (password !== ADMIN.demoPassword) {
      renderLogin("Nesprávné heslo.");
      return;
    }

    sessionStorage.setItem(SESSION_KEY, "true");
    renderDashboard();
    showMessage("Úspěšně přihlášeno.");
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    renderLogin();
    showMessage("Byl(a) jsi odhlášen(a).");
  }

  function renderDashboard(section = "overview") {
    if (!isLoggedIn()) {
      renderLogin();
      return;
    }

    const modal = document.getElementById("admin-modal");
    if (!modal) return;

    modal.innerHTML = `
      <div class="admin-panel">

        <header class="admin-header">
          <div>
            <small>VOLTLAB V3</small>
            <h2>Administrace</h2>
          </div>

          <div class="admin-header-actions">
            <button class="button button-secondary"
              data-admin-action="logout">
              Odhlásit
            </button>

            <button class="admin-close"
              data-admin-action="close">×</button>
          </div>
        </header>

        <div class="admin-layout">

          <nav class="admin-sidebar">
            ${nav("overview", "📊", "Přehled", section)}
            ${nav("articles", "📝", "Články", section)}
            ${nav("projects", "🔧", "Projekty", section)}
            ${nav("gallery", "🖼️", "Galerie", section)}
            ${nav("categories", "📁", "Kategorie", section)}
            ${nav("widgets", "🧮", "Widgety", section)}
            ${nav("homepage", "🏠", "Úvodní stránka", section)}
            ${nav("backup", "💾", "Záloha dat", section)}
          </nav>

          <main class="admin-content">
            ${renderSection(section)}
          </main>

        </div>
      </div>
    `;

    modal.classList.add("is-open", "active");
    modal.setAttribute("aria-hidden", "false");
  }

  function nav(id, icon, label, active) {
    return `
      <button
        class="admin-nav-item ${active === id ? "active" : ""}"
        data-admin-section="${id}"
        type="button">
        ${icon} ${label}
      </button>
    `;
  }

  function renderSection(section) {
    const sections = {
      overview: renderOverview,
      articles: renderArticles,
      projects: renderProjects,
      gallery: renderGallery,
      categories: renderCategories,
      widgets: renderWidgets,
      homepage: renderHomepage,
      backup: renderBackup
    };

    return (sections[section] || renderOverview)();
  }

  function renderOverview() {
    const articles = getData("getArticles");
    const projects = getData("getProjects");
    const gallery = getData("getGallery");
    const stats = getApp().getStatistics?.() || {};

    return `
      <h2>Přehled webu</h2>

      <div class="admin-stat-grid">
        ${stat("📝", "Články", articles.length)}
        ${stat("🔧", "Projekty", projects.length)}
        ${stat("🖼️", "Obrázky", gallery.length)}
        ${stat("👁️", "Zobrazení", stats.pageViews || 0)}
      </div>

      <div class="admin-panel-card">
        <h3>Vítej v administraci VoltLab!</h3>
        <p>Zde můžeš spravovat obsah svého technického webu.</p>
        <p>Nezapomeň pravidelně zálohovat svá data.</p>
      </div>
    `;
  }

  function stat(icon, label, value) {
    return `
      <div class="admin-stat-card">
        <span>${icon}</span>
        <strong>${escapeHTML(value)}</strong>
        <small>${escapeHTML(label)}</small>
      </div>
    `;
  }

  function renderArticles() {
    const items = getData("getArticles");

    return `
      <div class="admin-section-heading">
        <h2>Články</h2>
        <button class="button button-primary"
          data-admin-action="add-article">
          + Přidat článek
        </button>
      </div>

      ${items.map((item, index) => `
        <div class="admin-list-item">
          <div>
            <strong>${escapeHTML(item.title)}</strong>
            <small>${escapeHTML(item.category)}</small>
          </div>

          <div class="admin-actions">
            <button class="button button-secondary"
              data-admin-action="edit-article"
              data-index="${index}">Upravit</button>

            <button class="button button-danger"
              data-admin-action="delete-article"
              data-index="${index}">Smazat</button>
          </div>
        </div>
      `).join("") || "<p>Žádné články.</p>"}
    `;
  }

  function renderProjects() {
    const items = getData("getProjects");

    return `
      <div class="admin-section-heading">
        <h2>Projekty</h2>
        <button class="button button-primary"
          data-admin-action="add-project">
          + Přidat projekt
        </button>
      </div>

      ${items.map((item, index) => `
        <div class="admin-list-item">
          <div>
            <strong>${escapeHTML(item.title)}</strong>
            <small>${escapeHTML(item.category)}</small>
          </div>

          <div class="admin-actions">
            <button class="button button-secondary"
              data-admin-action="edit-project"
              data-index="${index}">Upravit</button>

            <button class="button button-danger"
              data-admin-action="delete-project"
              data-index="${index}">Smazat</button>
          </div>
        </div>
      `).join("") || "<p>Žádné projekty.</p>"}
    `;
  }

  function editContent(type, index = -1) {
    const article = type === "article";
    const getter = article ? "getArticles" : "getProjects";
    const saver = article ? "saveArticles" : "saveProjects";
    const items = getData(getter);
    const old = index >= 0 ? items[index] : {};

    const title = prompt("Název:", old.title || "");
    if (title === null || !title.trim()) return;

    const category = prompt("Kategorie:", old.category || "arduino");
    if (category === null) return;

    const description = prompt(
      "Krátký popis:",
      old.excerpt || old.description || ""
    );
    if (description === null) return;

    const content = prompt(
      "Obsah nebo postup:",
      old.content || old.instructions?.join("\n") || ""
    );
    if (content === null) return;

    const updated = {
      ...old,
      id: old.id || `${type}-${Date.now()}`,
      title: title.trim(),
      category: category.trim(),
      date: old.date || new Date().toISOString().slice(0, 10)
    };

    if (article) {
      updated.excerpt = description;
      updated.content = content;
    } else {
      updated.description = description;
      updated.instructions = content.split("\n").filter(Boolean);
    }

    if (index >= 0) items[index] = updated;
    else items.unshift(updated);

    if (saveData(saver, items)) {
      renderDashboard(article ? "articles" : "projects");
      showMessage("Změny byly uloženy.");
    }
  }

  function deleteContent(type, index) {
    const article = type === "article";
    const getter = article ? "getArticles" : "getProjects";
    const saver = article ? "saveArticles" : "saveProjects";
    const items = getData(getter);

    if (!items[index]) return;
    if (!confirm("Opravdu chceš položku smazat?")) return;

    items.splice(index, 1);
    saveData(saver, items);
    renderDashboard(article ? "articles" : "projects");
    showMessage("Položka byla smazána.");
  }

  function renderGallery() {
    const items = getData("getGallery");

    return `
      <div class="admin-section-heading">
        <h2>Galerie</h2>
        <button class="button button-primary"
          data-admin-action="add-gallery">
          + Přidat obrázek
        </button>
      </div>

      ${items.map((item, index) => `
        <div class="admin-list-item">
          <div>
            <strong>${escapeHTML(item.title || "Obrázek")}</strong>
            <small>${escapeHTML(item.url || item.image || "")}</small>
          </div>
          <button class="button button-danger"
            data-admin-action="delete-gallery"
            data-index="${index}">Smazat</button>
        </div>
      `).join("") || "<p>Galerie je prázdná.</p>"}
    `;
  }

  function addGallery() {
    const title = prompt("Název obrázku:");
    if (title === null || !title.trim()) return;

    const url = prompt("URL nebo cesta k obrázku:");
    if (url === null || !url.trim()) return;

    const items = getData("getGallery");
    items.push({
      id: `image-${Date.now()}`,
      title: title.trim(),
      url: url.trim(),
      image: url.trim()
    });

    saveData("saveGallery", items);
    renderDashboard("gallery");
  }

  function deleteGallery(index) {
    const items = getData("getGallery");
    if (!items[index]) return;
    if (!confirm("Smazat obrázek?")) return;

    items.splice(index, 1);
    saveData("saveGallery", items);
    renderDashboard("gallery");
  }

  function renderCategories() {
    const items = getData("getCategories");

    return `
      <div class="admin-section-heading">
        <h2>Kategorie</h2>
        <button class="button button-primary"
          data-admin-action="add-category">
          + Přidat kategorii
        </button>
      </div>

      ${items.map((item, index) => `
        <div class="admin-list-item">
          <div>
            <strong>${escapeHTML(item.name || item.title || item.id)}</strong>
            <small>${escapeHTML(item.id)}</small>
          </div>
          <div class="admin-actions">
            <button class="button button-secondary"
              data-admin-action="edit-category"
              data-index="${index}">Upravit</button>
            <button class="button button-danger"
              data-admin-action="delete-category"
              data-index="${index}">Smazat</button>
          </div>
        </div>
      `).join("")}
    `;
  }

  function editCategory(index = -1) {
    const items = getData("getCategories");
    const old = index >= 0 ? items[index] : {};

    const name = prompt("Název kategorie:", old.name || old.title || "");
    if (name === null || !name.trim()) return;

    const id = prompt("ID kategorie:", old.id || name.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, ""));

    if (id === null || !id.trim()) return;

    const item = { ...old, id: id.trim(), name: name.trim() };

    if (index >= 0) items[index] = item;
    else items.push(item);

    saveData("saveCategories", items);
    renderDashboard("categories");
  }

  function deleteCategory(index) {
    const items = getData("getCategories");
    if (!items[index]) return;
    if (!confirm("Smazat kategorii?")) return;

    items.splice(index, 1);
    saveData("saveCategories", items);
    renderDashboard("categories");
  }

  function renderWidgets() {
    const items = getData("getWidgets");

    return `
      <h2>Widgety</h2>
      <p>Zapínej a vypínej nástroje webu.</p>

      ${items.map((item, index) => `
        <div class="admin-list-item">
          <div>
            <strong>${escapeHTML(item.title || item.name || item.id)}</strong>
            <small>${escapeHTML(item.description || "")}</small>
          </div>

          <label class="admin-checkbox">
            <input type="checkbox"
              data-admin-action="toggle-widget"
              data-index="${index}"
              ${item.enabled !== false ? "checked" : ""}>
            Zapnuto
          </label>
        </div>
      `).join("")}
    `;
  }

  function renderHomepage() {
    const settings = getApp().getSettings?.() || {};
    const home = settings.homepage || settings;

    return `
      <h2>Úvodní stránka</h2>

      <form id="admin-homepage-form" class="admin-form">
        <label class="admin-field">
          Nadpis
          <input name="title" value="${escapeHTML(home.title || "")}">
        </label>

        <label class="admin-field">
          Podnadpis
          <input name="subtitle" value="${escapeHTML(home.subtitle || "")}">
        </label>

        <label class="admin-field">
          Popis
          <textarea name="description" rows="5">${escapeHTML(home.description || "")}</textarea>
        </label>

        <button class="button button-primary" type="submit">
          Uložit
        </button>
      </form>
    `;
  }

  function saveHomepage(form) {
    const data = new FormData(form);
    const settings = getApp().getSettings?.() || {};

    settings.homepage = {
      ...(settings.homepage || {}),
      title: String(data.get("title") || ""),
      subtitle: String(data.get("subtitle") || ""),
      description: String(data.get("description") || "")
    };

    getApp().saveSettings?.(settings);
    showMessage("Úvodní stránka byla uložena.");
  }

  function renderBackup() {
    return `
      <h2>Záloha dat</h2>

      <div class="admin-panel-card">
        <h3>Export</h3>
        <p>Stáhne obsah webu jako JSON soubor.</p>
        <button class="button button-primary"
          data-admin-action="export">
          Stáhnout zálohu
        </button>
      </div>

      <div class="admin-panel-card">
        <h3>Import</h3>
        <input type="file" id="admin-import-file" accept=".json,application/json">
        <button class="button button-secondary"
          data-admin-action="import">
          Obnovit zálohu
        </button>
      </div>

      <div class="admin-panel-card">
        <h3>Widgety</h3>
        <button class="button button-danger"
          data-admin-action="reset-widgets">
          Obnovit výchozí widgety
        </button>
      </div>
    `;
  }

  function exportBackup() {
    const data = {
      version: CONFIG.version || "3.0.0",
      exportedAt: new Date().toISOString(),
      articles: getData("getArticles"),
      projects: getData("getProjects"),
      gallery: getData("getGallery"),
      categories: getData("getCategories"),
      widgets: getData("getWidgets"),
      settings: getApp().getSettings?.() || {}
    };

    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "voltlab-zaloha.json";
    link.click();

    URL.revokeObjectURL(url);
    showMessage("Záloha byla vytvořena.");
  }

  async function importBackup() {
    const input = document.getElementById("admin-import-file");
    const file = input?.files?.[0];

    if (!file) {
      showMessage("Vyber nejprve JSON soubor.");
      return;
    }

    try {
      const data = JSON.parse(await file.text());

      if (!data || typeof data !== "object") {
        throw new Error("Neplatný soubor.");
      }

      if (!confirm("Import může přepsat současná data. Pokračovat?")) return;

      const mappings = [
        ["articles", "saveArticles"],
        ["projects", "saveProjects"],
        ["gallery", "saveGallery"],
        ["categories", "saveCategories"],
        ["widgets", "saveWidgets"]
      ];

      mappings.forEach(([key, method]) => {
        if (Array.isArray(data[key])) {
          getApp()[method]?.(data[key]);
        }
      });

      if (data.settings && typeof data.settings === "object") {
        getApp().saveSettings?.(data.settings);
      }

      renderDashboard("overview");
      showMessage("Záloha byla obnovena.");
    } catch (error) {
      showMessage(`Chyba importu: ${error.message}`);
    }
  }

  function toggleWidget(index, enabled) {
    const items = getData("getWidgets");
    if (!items[index]) return;

    items[index].enabled = enabled;
    saveData("saveWidgets", items);

    window.VOLTLAB_toggleWidget?.(items[index].id, enabled);
    renderDashboard("widgets");
  }

  function handleAction(action, target) {
    const index = Number(target.dataset.index);

    switch (action) {
      case "close":
        closeAdmin();
        break;
      case "logout":
        logout();
        break;
      case "add-article":
        editContent("article");
        break;
      case "edit-article":
        editContent("article", index);
        break;
      case "delete-article":
        deleteContent("article", index);
        break;
      case "add-project":
        editContent("project");
        break;
      case "edit-project":
        editContent("project", index);
        break;
      case "delete-project":
        deleteContent("project", index);
        break;
      case "add-gallery":
        addGallery();
        break;
      case "delete-gallery":
        deleteGallery(index);
        break;
      case "add-category":
        editCategory();
        break;
      case "edit-category":
        editCategory(index);
        break;
      case "delete-category":
        deleteCategory(index);
        break;
      case "export":
        exportBackup();
        break;
      case "import":
        importBackup();
        break;
      case "reset-widgets":
        if (confirm("Obnovit výchozí widgety?")) {
          window.VOLTLAB_resetWidgets?.();
          renderDashboard("widgets");
        }
        break;
    }
  }

  document.addEventListener("click", (event) => {
    const access = event.target.closest("#admin-access, [data-open-admin]");

    if (access) {
      event.preventDefault();
      openAdmin();
      return;
    }

    const section = event.target.closest("[data-admin-section]");
    if (section) {
      renderDashboard(section.dataset.adminSection);
      return;
    }

    const action = event.target.closest("[data-admin-action]");
    if (action && action.type !== "checkbox") {
      handleAction(action.dataset.adminAction, action);
    }
  });

  document.addEventListener("change", (event) => {
    const target = event.target;

    if (target.matches('[data-admin-action="toggle-widget"]')) {
      toggleWidget(Number(target.dataset.index), target.checked);
    }
  });

  document.addEventListener("submit", (event) => {
    if (event.target.id === "admin-login-form") {
      event.preventDefault();
      const password = new FormData(event.target).get("password");
      login(String(password || ""));
    }

    if (event.target.id === "admin-homepage-form") {
      event.preventDefault();
      saveHomepage(event.target);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAdmin();
  });

  window.VoltLabAdmin = {
    open: openAdmin,
    close: closeAdmin,
    logout,
    render: renderDashboard,
    exportBackup
  };

  window.VOLTLAB_openAdmin = openAdmin;
  window.VOLTLAB_closeAdmin = closeAdmin;

})();
