```javascript
/* =========================================================
   VOLTLAB V4 — ADMIN.JS
   Administrační panel a správa obsahu
   ========================================================= */

(() => {
  "use strict";

  const CONFIG = window.VOLTLAB_CONFIG || {};
  const ADMIN_CONFIG = CONFIG.admin || {};
  const STORAGE = CONFIG.storage || {};

  const SESSION_KEY = STORAGE.session || "voltlab_v4_admin_session";

  const app = window.VoltLab;

  if (!app) {
    console.error("VoltLab: Nejprve musí být načten app.js.");
    return;
  }

  let activeTab = "articles";
  let editingId = null;
  let editingType = null;
  let adminSearch = "";

  /* =======================================================
     POMOCNÉ FUNKCE
     ======================================================= */

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const escapeHTML = value =>
    app.escapeHTML(value ?? "");

  const notify = (message, type = "success") =>
    app.notify(message, type);

  function createId(prefix = "item") {
    return `${prefix}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 7)}`;
  }

  function isLoggedIn() {
    try {
      return sessionStorage.getItem(SESSION_KEY) === "authenticated";
    } catch {
      return false;
    }
  }

  function setLoggedIn(value) {
    try {
      if (value) {
        sessionStorage.setItem(SESSION_KEY, "authenticated");
      } else {
        sessionStorage.removeItem(SESSION_KEY);
      }
    } catch {
      notify("Session storage není dostupné.", "error");
    }
  }

  function downloadFile(filename, content, type = "application/json") {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function getItems(type) {
    return type === "articles" ? app.articles : app.projects;
  }

  function saveItems(type, items) {
    return type === "articles"
      ? app.saveArticles(items)
      : app.saveProjects(items);
  }

  function categoryOptions(selected = "") {
    const categories = CONFIG.categories || [];

    return categories.map(category => `
      <option value="${escapeHTML(category.id)}"
        ${selected === category.id ? "selected" : ""}>
        ${escapeHTML(category.name)}
      </option>
    `).join("");
  }

  function safeArray(value) {
    if (Array.isArray(value)) return value;
    return String(value || "")
      .split("\n")
      .map(item => item.trim())
      .filter(Boolean);
  }

  /* =======================================================
     VYTVOŘENÍ ADMIN MODALU
     ======================================================= */

  function createAdminModal() {
    if ($("#voltlab-admin-modal")) return;

    const modal = document.createElement("div");

    modal.id = "voltlab-admin-modal";
    modal.className = "admin-overlay";
    modal.setAttribute("aria-hidden", "true");

    modal.innerHTML = `
      <div class="admin-window" role="dialog"
        aria-modal="true" aria-labelledby="admin-title">

        <header class="admin-header">
          <div class="admin-brand">
            <span class="admin-brand-icon">⚡</span>
            <div>
              <h2 id="admin-title">VoltLab Admin</h2>
              <span>Správa webu · V4</span>
            </div>
          </div>

          <button class="admin-close" type="button"
            data-admin-close aria-label="Zavřít">×</button>
        </header>

        <div class="admin-login" id="admin-login">
          <div class="admin-login-icon">🔐</div>
          <h3>Administrátorské přihlášení</h3>
          <p>Pro pokračování zadej administrátorské heslo.</p>

          <form id="admin-login-form">
            <label for="admin-password">Heslo</label>
            <input id="admin-password" type="password"
              autocomplete="current-password"
              placeholder="Zadej heslo" required>

            <p class="admin-error" id="admin-login-error"
              aria-live="polite"></p>

            <button class="admin-primary" type="submit">
              Přihlásit se →
            </button>
          </form>
        </div>

        <div class="admin-dashboard" id="admin-dashboard" hidden>
          <div class="admin-toolbar">
            <div class="admin-status">
              <span class="admin-status-dot"></span>
              Přihlášený administrátor
            </div>

            <button class="admin-secondary" type="button"
              data-admin-logout>
              Odhlásit se
            </button>
          </div>

          <div class="admin-stats" id="admin-stats"></div>

          <nav class="admin-tabs" aria-label="Administrace">
            <button type="button" data-admin-tab="articles"
              class="active">Články</button>
            <button type="button" data-admin-tab="projects">
              Projekty</button>
            <button type="button" data-admin-tab="backup">
              Zálohování</button>
          </nav>

          <div id="admin-content"></div>
        </div>

      </div>
    `;

    document.body.appendChild(modal);
  }

  /* =======================================================
     OTEVŘENÍ A ZAVŘENÍ
     ======================================================= */

  function openAdmin() {
    createAdminModal();

    const modal = $("#voltlab-admin-modal");
    if (!modal) return;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("admin-open");

    if (isLoggedIn()) {
      showDashboard();
    } else {
      showLogin();
    }
  }

  function closeAdmin() {
    const modal = $("#voltlab-admin-modal");
    if (!modal) return;

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("admin-open");
  }

  function showLogin() {
    $("#admin-login").hidden = false;
    $("#admin-dashboard").hidden = true;

    const input = $("#admin-password");
    if (input) {
      input.value = "";
      setTimeout(() => input.focus(), 100);
    }
  }

  function showDashboard() {
    $("#admin-login").hidden = true;
    $("#admin-dashboard").hidden = false;

    renderStats();
    renderAdminContent();
  }

  /* =======================================================
     PŘIHLÁŠENÍ
     ======================================================= */

  function login(password) {
    const configuredPassword = ADMIN_CONFIG.demoPassword;

    if (!ADMIN_CONFIG.enabled) {
      showLoginError("Administrace je vypnutá.");
      return false;
    }

    if (!configuredPassword) {
      showLoginError("V config.js není nastavené heslo.");
      return false;
    }

    if (password !== configuredPassword) {
      showLoginError("Nesprávné heslo. Zkus to znovu.");
      return false;
    }

    setLoggedIn(true);
    showDashboard();
    notify("Přihlášení proběhlo úspěšně.", "success");

    return true;
  }

  function showLoginError(message) {
    const error = $("#admin-login-error");
    if (error) error.textContent = message;
  }

  function logout() {
    setLoggedIn(false);
    editingId = null;
    editingType = null;
    showLogin();
    notify("Byl jsi odhlášen.", "info");
  }

  /* =======================================================
     STATISTIKY
     ======================================================= */

  function renderStats() {
    const container = $("#admin-stats");
    if (!container) return;

    const articleCount = app.articles.length;
    const projectCount = app.projects.length;
    const favoriteCount = app.favorites.length;

    container.innerHTML = `
      <div class="admin-stat">
        <span>📚</span>
        <strong>${articleCount}</strong>
        <small>Článků</small>
      </div>

      <div class="admin-stat">
        <span>⚙️</span>
        <strong>${projectCount}</strong>
        <small>Projektů</small>
      </div>

      <div class="admin-stat">
        <span>♥</span>
        <strong>${favoriteCount}</strong>
        <small>Oblíbených</small>
      </div>
    `;
  }

  /* =======================================================
     PŘEPÍNÁNÍ KARET
     ======================================================= */

  function switchTab(tab) {
    activeTab = tab;
    editingId = null;
    editingType = null;

    $$("[data-admin-tab]").forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.adminTab === tab
      );
    });

    renderAdminContent();
  }

  /* =======================================================
     HLAVNÍ OBSAH ADMINISTRACE
     ======================================================= */

  function renderAdminContent() {
    const container = $("#admin-content");
    if (!container) return;

    if (activeTab === "backup") {
      renderBackup(container);
      return;
    }

    renderContentManager(container);
  }

  function renderContentManager(container) {
    const isArticles = activeTab === "articles";
    const type = isArticles ? "articles" : "projects";
    const items = getItems(type);

    const filtered = items.filter(item => {
      const query = normalize(adminSearch);

      if (!query) return true;

      return normalize([
        item.title,
        item.description,
        item.excerpt,
        item.category
      ].join(" ")).includes(query);
    });

    container.innerHTML = `
      <div class="admin-section-heading">
        <div>
          <h3>${isArticles ? "Správa článků" : "Správa projektů"}</h3>
          <p>
            ${isArticles
              ? "Přidávej, upravuj a maž vzdělávací články."
              : "Spravuj návody, elektronické projekty a konstrukce."}
          </p>
        </div>

        <button class="admin-primary" type="button"
          data-admin-add>
          + Přidat ${isArticles ? "článek" : "projekt"}
        </button>
      </div>

      <div class="admin-search">
        <input id="admin-search" type="search"
          placeholder="Hledat podle názvu nebo kategorie..."
          value="${escapeHTML(adminSearch)}">
      </div>

      <div class="admin-item-list">
        ${filtered.length ? filtered.map(item => `
          <div class="admin-item">
            <div class="admin-item-icon">
              ${escapeHTML(item.icon || "⚡")}
            </div>

            <div class="admin-item-info">
              <strong>${escapeHTML(item.title)}</strong>
              <small>
                ${escapeHTML(categoryName(item.category))}
                · ${escapeHTML(item.id)}
              </small>
            </div>

            <div class="admin-item-actions">
              <button type="button" data-admin-edit="${escapeHTML(item.id)}"
                aria-label="Upravit">✎</button>

              <button type="button" class="danger"
                data-admin-delete="${escapeHTML(item.id)}"
                aria-label="Smazat">×</button>
            </div>
          </div>
        `).join("") : `
          <div class="admin-empty">
            <span>∅</span>
            <p>Žádné položky nebyly nalezeny.</p>
          </div>
        `}
      </div>
    `;

    $("#admin-search")?.addEventListener("input", event => {
      adminSearch = event.target.value;
      const position = event.target.selectionStart;
      renderContentManager(container);

      const nextInput = $("#admin-search");
      if (nextInput) {
        nextInput.focus();
        nextInput.setSelectionRange(position, position);
      }
    });
  }

  /* =======================================================
     FORMULÁŘ ČLÁNKU / PROJEKTU
     ======================================================= */

  function renderEditor(type, item = null) {
    editingType = type;
    editingId = item?.id || null;

    const isArticle = type === "articles";
    const container = $("#admin-content");

    const title = item?.title || "";
    const icon = item?.icon || "⚡";
    const category = item?.category || "electronics";
    const description = item?.description || item?.excerpt || "";

    const commonFields = `
      <div class="admin-form-grid">
        <label>
          Název
          <input name="title" required maxlength="120"
            value="${escapeHTML(title)}">
        </label>

        <label>
          Ikona / emoji
          <input name="icon" maxlength="12"
            value="${escapeHTML(icon)}">
        </label>

        <label>
          Kategorie
          <select name="category" required>
            ${categoryOptions(category)}
          </select>
        </label>

        <label class="full-width">
          ${isArticle ? "Krátký popis" : "Popis projektu"}
          <textarea name="${isArticle ? "excerpt" : "description"}"
            rows="3" required>${escapeHTML(description)}</textarea>
        </label>
      </div>
    `;

    const articleFields = `
      <label>
        Doba čtení
        <input name="readTime" maxlength="30"
          value="${escapeHTML(item?.readTime || "5 min")}">
      </label>

      <label>
        Štítky (odděluj čárkou)
        <input name="tags"
          value="${escapeHTML((item?.tags || []).join(", "))}">
      </label>

      <label class="full-width">
        Obsah článku (HTML)
        <textarea name="content" rows="12"
          placeholder="<h2>Úvod</h2><p>Obsah článku...</p>"
          required>${escapeHTML(item?.content || "")}</textarea>
        <small>
          Podporované značky zahrnují nadpisy, odstavce, seznamy,
          odkazy a bloky kódu. Obsah se při zobrazení filtruje.
        </small>
      </label>
    `;

    const projectFields = `
      <label>
        Obtížnost
        <select name="difficulty">
          ${["Začátečník", "Mírně pokročilý", "Pokročilý", "Expert"]
            .map(level => `
              <option value="${level}"
                ${item?.difficulty === level ? "selected" : ""}>
                ${level}
              </option>
            `).join("")}
        </select>
      </label>

      <label>
        Doba realizace
        <input name="time" maxlength="30"
          value="${escapeHTML(item?.time || "30 min")}">
      </label>

      <label class="full-width">
        Potřebné součástky (každá na samostatný řádek)
        <textarea name="components" rows="4">${escapeHTML(
          safeArray(item?.components).join("\n")
        )}</textarea>
      </label>

      <label class="full-width">
        Postup (každý krok na samostatný řádek)
        <textarea name="steps" rows="7" required>${escapeHTML(
          safeArray(item?.steps).join("\n")
        )}</textarea>
      </label>

      <label class="full-width">
        Zdrojový kód
        <textarea name="code" rows="12"
          spellcheck="false">${escapeHTML(item?.code || "")}</textarea>
      </label>

      <label class="full-width">
        Poznámka / bezpečnostní upozornění
        <textarea name="note" rows="3">${escapeHTML(item?.note || "")}</textarea>
      </label>
    `;

    container.innerHTML = `
      <div class="admin-editor">
        <div class="admin-section-heading">
          <div>
            <h3>${item ? "Upravit" : "Nový"} ${isArticle ? "článek" : "projekt"}</h3>
            <p>Vyplň informace a ulož změny.</p>
          </div>
        </div>

        <form id="admin-editor-form">
          ${commonFields}
          <div class="admin-form-grid">
            ${isArticle ? articleFields : projectFields}
          </div>

          <div class="admin-editor-actions">
            <button class="admin-secondary" type="button"
              data-admin-cancel>
              Zrušit
            </button>

            <button class="admin-primary" type="submit">
              Uložit ${isArticle ? "článek" : "projekt"}
            </button>
          </div>
        </form>
      </div>
    `;

    $("#admin-editor-form")?.addEventListener("submit", event => {
      event.preventDefault();
      saveEditor(type, item?.id || null);
    });
  }

  /* =======================================================
     ULOŽENÍ FORMULÁŘE
     ======================================================= */

  function saveEditor(type, existingId) {
    const form = $("#admin-editor-form");
    if (!form) return;

    const data = new FormData(form);
    const isArticle = type === "articles";

    const title = String(data.get("title") || "").trim();
    if (!title) {
      notify("Vyplň název položky.", "error");
      return;
    }

    const item = {
      id: existingId || createId(isArticle ? "article" : "project"),
      title,
      icon: String(data.get("icon") || "⚡").trim(),
      category: String(data.get("category") || "electronics"),
      ...(isArticle ? {
        excerpt: String(data.get("excerpt") || "").trim(),
        readTime: String(data.get("readTime") || "5 min").trim(),
        tags: String(data.get("tags") || "")
          .split(",")
          .map(tag => tag.trim())
          .filter(Boolean),
        content: String(data.get("content") || "")
      } : {
        description: String(data.get("description") || "").trim(),
        difficulty: String(data.get("difficulty") || "Začátečník"),
        time: String(data.get("time") || "30 min").trim(),
        components: String(data.get("components") || "")
          .split("\n").map(line => line.trim()).filter(Boolean),
        steps: String(data.get("steps") || "")
          .split("\n").map(line => line.trim()).filter(Boolean),
        code: String(data.get("code") || ""),
        note: String(data.get("note") || "").trim()
      })
    };

    const items = [...getItems(type)];
    const index = items.findIndex(existing => existing.id === item.id);

    if (index >= 0) {
      items[index] = item;
    } else {
      items.unshift(item);
    }

    if (saveItems(type, items)) {
      adminSearch = "";
      renderStats();
      renderAdminContent();
    }
  }

  /* =======================================================
     SMAZÁNÍ POLOŽKY
     ======================================================= */

  function deleteItem(type, id) {
    const item = getItems(type).find(entry => entry.id === id);
    if (!item) return;

    const confirmed = window.confirm(
      `Opravdu chceš smazat položku "${item.title}"?`
    );

    if (!confirmed) return;

    const nextItems = getItems(type).filter(entry => entry.id !== id);

    if (saveItems(type, nextItems)) {
      renderStats();
      renderAdminContent();
    }
  }

  /* =======================================================
     ZÁLOHOVÁNÍ
     ======================================================= */

  function renderBackup(container) {
    container.innerHTML = `
      <div class="admin-backup">
        <div class="admin-section-heading">
          <div>
            <h3>Zálohování VoltLab</h3>
            <p>Ulož si obsah webu nebo obnov data ze zálohy.</p>
          </div>
        </div>

        <div class="admin-backup-card">
          <span class="admin-backup-icon">⬇</span>
          <div>
            <h4>Exportovat zálohu</h4>
            <p>Stáhne JSON soubor se všemi články a projekty.</p>
          </div>
          <button class="admin-primary" type="button"
            data-admin-export>
            Stáhnout zálohu
          </button>
        </div>

        <div class="admin-backup-card">
          <span class="admin-backup-icon">⬆</span>
          <div>
            <h4>Importovat zálohu</h4>
            <p>Obnov obsah z dříve vytvořeného JSON souboru.</p>
          </div>
          <label class="admin-primary admin-file-button">
            Vybrat soubor
            <input type="file" id="admin-import-file"
              accept=".json,application/json" hidden>
          </label>
        </div>

        <div class="admin-backup-card danger-card">
          <span class="admin-backup-icon">↻</span>
          <div>
            <h4>Obnovit výchozí obsah</h4>
            <p>Nahradí články a projekty původními daty.</p>
          </div>
          <button class="admin-danger" type="button"
            data-admin-reset>
            Obnovit výchozí data
          </button>
        </div>

        <p class="admin-warning">
          ⚠ Před importem nebo obnovením si vždy stáhni aktuální zálohu.
        </p>
      </div>
    `;
  }

  function exportBackup() {
    const backup = {
      application: "VoltLab",
      version: "4.0",
      exportedAt: new Date().toISOString(),
      articles: app.articles,
      projects: app.projects
    };

    downloadFile(
      `voltlab-backup-${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(backup, null, 2)
    );

    notify("Záloha byla připravena.", "success");
  }

  async function importBackup(file) {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      notify("Soubor je příliš velký. Maximální velikost je 10 MB.", "error");
      return;
    }

    try {
      const text = await file.text();
      const backup = JSON.parse(text);

      if (
        !backup ||
        !Array.isArray(backup.articles) ||
        !Array.isArray(backup.projects)
      ) {
        throw new Error("Neplatná struktura zálohy.");
      }

      const validateItems = items => {
        const ids = new Set();

        return items.every(item => {
          if (
            !item ||
            typeof item !== "object" ||
            typeof item.id !== "string" ||
            !item.id.trim() ||
            typeof item.title !== "string" ||
            !item.title.trim() ||
            ids.has(item.id)
          ) {
            return false;
          }

          ids.add(item.id);
          return true;
        });
      };

      if (!validateItems(backup.articles) || !validateItems(backup.projects)) {
        throw new Error("Záloha obsahuje neplatné nebo duplicitní položky.");
      }

      const confirmed = window.confirm(
        `Importovat ${backup.articles.length} článků a ` +
        `${backup.projects.length} projektů? Stávající obsah bude nahrazen.`
      );

      if (!confirmed) return;

      const articlesSaved = app.saveArticles(backup.articles);
      const projectsSaved = app.saveProjects(backup.projects);

      if (articlesSaved && projectsSaved) {
        renderStats();
        switchTab("articles");
        notify("Záloha byla úspěšně importována.", "success");
      } else {
        notify("Import se nepodařilo kompletně uložit.", "error");
      }
    } catch (error) {
      console.error("VoltLab import error:", error);
      notify("Soubor zálohy není platný.", "error");
    }
  }

  /* =======================================================
     UDÁLOSTI ADMIN PANELU
     ======================================================= */

  function initAdminEvents() {
    document.addEventListener("click", event => {
      const target = event.target instanceof Element
        ? event.target
        : null;

      if (!target) return;

      if (target.closest("[data-admin-close]")) {
        closeAdmin();
        return;
      }

      if (target.closest("[data-admin-logout]")) {
        logout();
        return;
      }

      const tab = target.closest("[data-admin-tab]");
      if (tab) {
        switchTab(tab.dataset.adminTab);
        return;
      }

      if (target.closest("[data-admin-add]")) {
        renderEditor(activeTab);
        return;
      }

      if (target.closest("[data-admin-cancel]")) {
        renderAdminContent();
        return;
      }

      const editButton = target.closest("[data-admin-edit]");
      if (editButton) {
        const item = getItems(activeTab).find(
          entry => entry.id === editButton.dataset.adminEdit
        );

        if (item) renderEditor(activeTab, item);
        return;
      }

      const deleteButton = target.closest("[data-admin-delete]");
      if (deleteButton) {
        deleteItem(activeTab, deleteButton.dataset.adminDelete);
        return;
      }

      if (target.closest("[data-admin-export]")) {
        exportBackup();
        return;
      }

      if (target.closest("[data-admin-reset]")) {
        const confirmed = window.confirm(
          "Obnovit původní obsah VoltLabu? Vlastní změny budou ztraceny."
        );

        if (confirmed) {
          const success = app.resetContent();

          if (success) {
            renderStats();
            switchTab("articles");
          }
        }

        return;
      }
    });

    document.addEventListener("change", event => {
      if (event.target.id === "admin-import-file") {
        const file = event.target.files?.[0];
        if (file) importBackup(file);

        event.target.value = "";
      }
    });

    document.addEventListener("submit", event => {
      if (event.target.id === "admin-login-form") {
        event.preventDefault();

        const password = $("#admin-password")?.value || "";
        login(password);
      }
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        closeAdmin();
      }
    });

    $("#voltlab-admin-modal")?.addEventListener("click", event => {
      if (event.target.id === "voltlab-admin-modal") {
        closeAdmin();
      }
    });
  }

  /* =======================================================
     VLASTNÍ STYLY ADMINISTRACE
     ======================================================= */

  function injectAdminStyles() {
    if ($("#voltlab-admin-styles")) return;

    const style = document.createElement("style");
    style.id = "voltlab-admin-styles";

    style.textContent = `
      .admin-overlay {
        position: fixed;
        inset: 0;
        z-index: 10000;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 20px;
        background: rgba(4, 5, 12, .82);
        backdrop-filter: blur(12px);
        overflow-y: auto;
      }

      .admin-overlay.is-open {
        display: flex;
      }

      .admin-window {
        width: min(100%, 920px);
        max-height: min(90vh, 950px);
        overflow-y: auto;
        border: 1px solid rgba(150, 130, 255, .25);
        border-radius: 22px;
        background: #11121b;
        color: #f4f2ff;
        box-shadow: 0 30px 100px rgba(0, 0, 0, .55);
      }

      .admin-header {
        position: sticky;
        top: 0;
        z-index: 5;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 24px;
        border-bottom: 1px solid rgba(255,255,255,.09);
        background: #11121b;
      }

      .admin-brand {
        display: flex;
        gap: 12px;
        align-items: center;
      }

      .admin-brand-icon {
        display: grid;
        place-items: center;
        width: 42px;
        height: 42px;
        border-radius: 13px;
        background: rgba(151, 115, 255, .16);
        font-size: 22px;
      }

      .admin-brand h2,
      .admin-brand span {
        display: block;
        margin: 0;
      }

      .admin-brand h2 {
        font-size: 17px;
      }

      .admin-brand div > span {
        margin-top: 3px;
        color: #9290a8;
        font-size: 12px;
      }

      .admin-close {
        width: 38px;
        height: 38px;
        border: 1px solid rgba(255,255,255,.12);
        border-radius: 11px;
        background: transparent;
        color: white;
        font-size: 25px;
        cursor: pointer;
      }

      .admin-login {
        width: min(100% - 40px, 390px);
        margin: 65px auto;
        text-align: center;
      }

      .admin-login-icon {
        margin-bottom: 15px;
        font-size: 42px;
      }

      .admin-login h3 {
        margin: 0 0 9px;
        font-size: 23px;
      }

      .admin-login p {
        color: #aaa7bd;
        font-size: 14px;
        line-height: 1.6;
      }

      .admin-login form {
        display: grid;
        gap: 12px;
        margin-top: 25px;
        text-align: left;
      }

      .admin-login label,
      .admin-editor label {
        display: grid;
        gap: 8px;
        color: #d9d6e8;
        font-size: 13px;
        font-weight: 600;
      }

      .admin-login input,
      .admin-editor input,
      .admin-editor select,
      .admin-editor textarea,
      .admin-search input {
        width: 100%;
        min-width: 0;
        padding: 12px 14px;
        border: 1px solid rgba(255,255,255,.13);
        border-radius: 10px;
        outline: none;
        background: #1a1b28;
        color: #fff;
        font: inherit;
      }

      .admin-editor textarea {
        resize: vertical;
        line-height: 1.6;
      }

      .admin-login input:focus,
      .admin-editor input:focus,
      .admin-editor select:focus,
      .admin-editor textarea:focus,
      .admin-search input:focus {
        border-color: #9a7bff;
        box-shadow: 0 0 0 3px rgba(154,123,255,.12);
      }

      .admin-primary,
      .admin-secondary,
      .admin-danger {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        min-height: 42px;
        padding: 10px 15px;
        border: 0;
        border-radius: 10px;
        font: inherit;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        text-decoration: none;
      }

      .admin-primary {
        background: #9675ff;
        color: #fff;
      }

      .admin-primary:hover {
        background: #805cf0;
      }

      .admin-secondary {
        border: 1px solid rgba(255,255,255,.14);
        background: #222332;
        color: #eee;
      }

      .admin-danger {
        background: rgba(255,75,90,.14);
        color: #ff8994;
      }

      .admin-error {
        min-height: 18px;
        margin: 0 !important;
        color: #ff7d8a !important;
      }

      .admin-dashboard {
        padding: 22px 24px 28px;
      }

      .admin-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        margin-bottom: 22px;
      }

      .admin-status {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #b8b4ca;
        font-size: 12px;
      }

      .admin-status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #5bd69a;
        box-shadow: 0 0 10px #5bd69a;
      }

      .admin-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        margin-bottom: 22px;
      }

      .admin-stat {
        display: grid;
        gap: 5px;
        padding: 16px;
        border: 1px solid rgba(255,255,255,.09);
        border-radius: 13px;
        background: #191a27;
      }

      .admin-stat > span {
        font-size: 19px;
      }

      .admin-stat strong {
        font-size: 25px;
      }

      .admin-stat small {
        color: #a19eb3;
      }

      .admin-tabs {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding-bottom: 17px;
        border-bottom: 1px solid rgba(255,255,255,.1);
      }

      .admin-tabs button {
        padding: 10px 15px;
        border: 1px solid transparent;
        border-radius: 9px;
        background: #1b1c29;
        color: #c4c1d2;
        font: inherit;
        font-size: 13px;
        cursor: pointer;
      }

      .admin-tabs button.active {
        border-color: rgba(154,123,255,.35);
        background: rgba(154,123,255,.15);
        color: #cbbaff;
      }

      .admin-section-heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        margin: 23px 0 18px;
      }

      .admin-section-heading h3 {
        margin: 0 0 6px;
        font-size: 19px;
      }

      .admin-section-heading p {
        margin: 0;
        color: #a5a2b6;
        font-size: 12px;
        line-height: 1.6;
      }

      .admin-search {
        margin-bottom: 13px;
      }

      .admin-item-list {
        display: grid;
        gap: 8px;
      }

      .admin-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 12px;
        background: #191a27;
      }

      .admin-item-icon {
        display: grid;
        place-items: center;
        flex: 0 0 38px;
        width: 38px;
        height: 38px;
        border-radius: 10px;
        background: rgba(151,115,255,.12);
        font-size: 19px;
      }

      .admin-item-info {
        display: grid;
        flex: 1;
        gap: 4px;
        min-width: 0;
      }

      .admin-item-info strong {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 13px;
      }

      .admin-item-info small {
        overflow: hidden;
        color: #9692aa;
        text-overflow: ellipsis;
        font-size: 11px;
      }

      .admin-item-actions {
        display: flex;
        gap: 6px;
      }

      .admin-item-actions button {
        width: 34px;
        height: 34px;
        border: 1px solid rgba(255,255,255,.1);
        border-radius: 9px;
        background: #252637;
        color: #ddd8f0;
        font-size: 17px;
        cursor: pointer;
      }

      .admin-item-actions button.danger {
        color: #ff8793;
      }

      .admin-empty {
        padding: 35px 15px;
        color: #aaa6bb;
        text-align: center;
      }

      .admin-empty span {
        font-size: 28px;
      }

      .admin-form-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
        margin-bottom: 17px;
      }

      .admin-form-grid .full-width {
        grid-column: 1 / -1;
      }

      .admin-editor label small {
        color: #9f9bb2;
        font-size: 11px;
        font-weight: 400;
        line-height: 1.5;
      }

      .admin-editor-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        padding-top: 18px;
        border-top: 1px solid rgba(255,255,255,.1);
      }

      .admin-backup {
        display: grid;
        gap: 13px;
      }

      .admin-backup-card {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 17px;
        border: 1px solid rgba(255,255,255,.1);
        border-radius: 13px;
        background: #191a27;
      }

      .admin-backup-icon {
        font-size: 25px;
      }

      .admin-backup-card > div {
        flex: 1;
      }

      .admin-backup-card h4 {
        margin: 0 0 5px;
        font-size: 14px;
      }

      .admin-backup-card p {
        margin: 0;
        color: #a6a2b7;
        font-size: 11px;
        line-height: 1.6;
      }

      .admin-warning {
        padding: 12px;
        border-radius: 10px;
        background: rgba(255,180,65,.09);
        color: #ffc879;
        font-size: 12px;
        line-height: 1.6;
      }

      .admin-file-button {
        cursor: pointer;
      }

      body.admin-open {
        overflow: hidden;
      }

      @media (max-width: 620px) {
        .admin-overlay {
          padding: 8px;
          align-items: flex-start;
        }

        .admin-window {
          max-height: 96vh;
          margin: auto 0;
          border-radius: 15px;
        }

        .admin-header {
          padding: 15px;
        }

        .admin-dashboard {
          padding: 15px;
        }

        .admin-section-heading {
          align-items: flex-start;
          flex-direction: column;
        }

        .admin-form-grid {
          grid-template-columns: 1fr;
        }

        .admin-form-grid .full-width {
          grid-column: auto;
        }

        .admin-backup-card {
          flex-wrap: wrap;
        }

        .admin-backup-card > div {
          min-width: 65%;
        }

        .admin-backup-card button,
        .admin-backup-card label {
          width: 100%;
        }

        .admin-item {
          gap: 8px;
          padding: 9px;
        }

        .admin-item-info strong {
          font-size: 12px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* =======================================================
     SPUŠTĚNÍ ADMINISTRACE
     ======================================================= */

  function init() {
    createAdminModal();
    injectAdminStyles();
    initAdminEvents();

    const accessButton = $("#admin-access");

    accessButton?.addEventListener("click", event => {
      event.preventDefault();
      openAdmin();
    });

    console.log("%cVoltLab Admin V4 načten.", "color:#9b7bff;font-weight:bold;");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
```
