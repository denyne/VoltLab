
/* =========================================================
   VOLTLAB — ADMIN PANEL
   Dashboard · Articles · Projects · Search · Backup
   ========================================================= */

(() => {
  "use strict";

  const config = window.VOLTLAB_CONFIG;

  if (!config || !config.admin || !config.admin.enabled) return;

  const $ = (id) => document.getElementById(id);
  const storage = config.storage;

  let modal = null;
  let activeTab = "overview";
  let searchQuery = "";

  // ---------- Helpers ----------

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
    if (window.VoltLab?.notify) {
      window.VoltLab.notify(message);
    } else {
      alert(message);
    }
  }

  function getArticles() {
    return Array.isArray(window.VoltLab?.articles)
      ? window.VoltLab.articles
      : [];
  }

  function getProjects() {
    return Array.isArray(window.VoltLab?.projects)
      ? window.VoltLab.projects
      : [];
  }

  function categoryOptions(selected = "") {
    return (config.categories || []).map(category => `
      <option value="${escapeHTML(category.id)}"
        ${category.id === selected ? "selected" : ""}>
        ${escapeHTML(category.name)}
      </option>
    `).join("");
  }

  function saveCurrentItems(type, items) {
    if (type === "articles") {
      window.VoltLab.saveArticles(items);
    } else {
      window.VoltLab.saveProjects(items);
    }
  }

  // ---------- Modal ----------

  function createModal() {
    if ($("admin-modal")) {
      modal = $("admin-modal");
      return;
    }

    modal = document.createElement("dialog");
    modal.id = "admin-modal";
    modal.className = "admin-modal";

    modal.innerHTML = `
      <div class="admin-header">
        <div>
          <span class="admin-kicker">VOLTLAB CONTROL CENTER</span>
          <h2>Admin panel <span>⚡</span></h2>
        </div>
        <button class="admin-close" type="button"
          aria-label="Zavřít">×</button>
      </div>
      <div id="admin-content"></div>
    `;

    document.body.appendChild(modal);

    modal.querySelector(".admin-close")
      .addEventListener("click", closeModal);

    modal.addEventListener("click", event => {
      if (event.target === modal) closeModal();
    });

    modal.addEventListener("cancel", event => {
      event.preventDefault();
      closeModal();
    });
  }

  function closeModal() {
    if (modal?.open) modal.close();
  }

  function openModal() {
    createModal();

    if (sessionStorage.getItem(storage.session) === "active") {
      showDashboard();
    } else {
      showLogin();
    }

    if (typeof modal.showModal === "function") {
      modal.showModal();
    } else {
      modal.setAttribute("open", "");
    }
  }

  // ---------- Login ----------

  function showLogin() {
    $("admin-content").innerHTML = `
      <form class="admin-form" id="admin-login-form">
        <p class="admin-description">
          Přihlášení do lokální správy VoltLabu.
        </p>

        <label>Admin heslo
          <input id="admin-password" type="password"
            autocomplete="current-password"
            placeholder="Zadej heslo" required>
        </label>

        <div class="admin-form-actions">
          <button class="button button-primary" type="submit">
            Přihlásit se →
          </button>
        </div>

        <p class="admin-warning">
          Upozornění: Toto je lokální administrace.
          Heslo v souboru config.js není skutečné zabezpečení
          veřejného webu.
        </p>
      </form>
    `;

    $("admin-login-form").addEventListener("submit", event => {
      event.preventDefault();

      const password = $("admin-password").value;

      if (password === config.admin.demoPassword) {
        sessionStorage.setItem(storage.session, "active");
        activeTab = "overview";
        showDashboard();
      } else {
        notify("Nesprávné heslo.");
        $("admin-password").value = "";
        $("admin-password").focus();
      }
    });
  }

  // ---------- Dashboard ----------

  function showDashboard() {
    $("admin-content").innerHTML = `
      <div class="admin-dashboard">

        <div class="admin-tabs">
          <button class="admin-tab ${activeTab === "overview" ? "active" : ""}"
            data-tab="overview">Přehled</button>

          <button class="admin-tab ${activeTab === "articles" ? "active" : ""}"
            data-tab="articles">Články</button>

          <button class="admin-tab ${activeTab === "projects" ? "active" : ""}"
            data-tab="projects">Projekty</button>

          <button class="admin-tab ${activeTab === "backup" ? "active" : ""}"
            data-tab="backup">Zálohy</button>
        </div>

        <div id="admin-editor"></div>

        <div class="admin-form-actions admin-bottom-actions">
          <button class="button button-ghost" type="button"
            id="admin-reset">Obnovit výchozí obsah</button>

          <button class="button button-ghost" type="button"
            id="admin-logout">Odhlásit se</button>
        </div>

        <p class="admin-warning">
          Obsah se ukládá v tomto prohlížeči.
          Pro zveřejnění změn na všech zařízeních je potřeba
          upravit zdrojová data webu.
        </p>
      </div>
    `;

    const content = $("admin-content");

    content.onclick = handleDashboardClick;
    content.onsubmit = handleDashboardSubmit;
    content.oninput = handleDashboardInput;
    content.onchange = handleDashboardChange;

    renderActiveTab();
  }

  function renderActiveTab() {
    if (activeTab === "overview") renderOverview();
    if (activeTab === "articles") renderEditor("articles");
    if (activeTab === "projects") renderEditor("projects");
    if (activeTab === "backup") renderBackup();
  }

  // ---------- Overview ----------

  function renderOverview() {
    const articles = getArticles();
    const projects = getProjects();

    $("admin-editor").innerHTML = `
      <div class="admin-section-heading">
        <span class="admin-kicker">SYSTEM OVERVIEW</span>
        <h3>Přehled VoltLabu</h3>
        <p>Rychlý pohled na obsah tvého webu.</p>
      </div>

      <div class="admin-stats">
        <div class="admin-stat">
          <span>Články</span>
          <strong>${articles.length}</strong>
          <small>Publikovaný obsah</small>
        </div>

        <div class="admin-stat">
          <span>Projekty</span>
          <strong>${projects.length}</strong>
          <small>Projektové návody</small>
        </div>

        <div class="admin-stat">
          <span>Celkem</span>
          <strong>${articles.length + projects.length}</strong>
          <small>Obsahových položek</small>
        </div>
      </div>

      <div class="admin-overview-panel">
        <h3>Rychlé akce</h3>
        <div class="admin-quick-actions">
          <button class="button button-primary" data-tab="articles">
            + Přidat článek
          </button>

          <button class="button button-ghost" data-tab="projects">
            + Přidat projekt
          </button>

          <button class="button button-ghost" data-tab="backup">
            Spravovat zálohy →
          </button>
        </div>
      </div>

      <div class="admin-overview-panel">
        <h3>Stav administrace</h3>
        <p class="admin-description">
          Administrace je aktivní. Změny obsahu se ukládají
          prostřednictvím lokálního úložiště prohlížeče.
        </p>
      </div>
    `;
  }

  // ---------- Article and project editor ----------

  function renderEditor(type) {
    const container = $("admin-editor");
    if (!container) return;

    const items = type === "articles" ? getArticles() : getProjects();
    const isArticle = type === "articles";

    const filteredItems = items.filter(item => {
      const text = [
        item.title,
        item.description,
        item.excerpt,
        item.category
      ].join(" ").toLowerCase();

      return text.includes(searchQuery.toLowerCase());
    });

    const editingId = container.dataset.editingId || "";
    const editingItem = editingId
      ? items.find(item => item.id === editingId)
      : null;

    const formItem = editingItem || {};

    const list = filteredItems.map(item => `
      <div class="admin-list-item">
        <div class="admin-list-copy">
          <strong>${escapeHTML(item.title)}</strong>
          <small>${escapeHTML(item.category || "Bez kategorie")}</small>
        </div>

        <div class="admin-item-actions">
          <button type="button" data-edit="${escapeHTML(item.id)}">
            Upravit
          </button>

          <button type="button" data-remove="${escapeHTML(item.id)}">
            Smazat
          </button>
        </div>
      </div>
    `).join("");

    container.innerHTML = `
      <div class="admin-section-heading">
        <span class="admin-kicker">${isArticle ? "CONTENT MANAGER" : "PROJECT MANAGER"}</span>
        <h3>${isArticle ? "Správa článků" : "Správa projektů"}</h3>
        <p>
          ${isArticle
            ? "Přidávej nové články nebo upravuj stávající."
            : "Vytvářej projekty a upravuj jejich návody."}
        </p>
      </div>

      <form class="admin-form" id="admin-add-form" data-type="${type}">
        <input type="hidden" name="editId"
          value="${escapeHTML(editingItem?.id || "")}">

        <label>Název
          <input name="title" maxlength="90" required
            value="${escapeHTML(formItem.title || "")}"
            placeholder="Název obsahu">
        </label>

        <label>Kategorie
          <select name="category">
            ${categoryOptions(formItem.category || "")}
          </select>
        </label>

        <label>Krátký popis
          <textarea name="description" maxlength="300"
            required placeholder="Krátký popis...">${escapeHTML(
              formItem.description || formItem.excerpt || ""
            )}</textarea>
        </label>

        ${isArticle ? `
          <label>Obsah článku
            <textarea name="content" required
              placeholder="Text článku...">${escapeHTML(formItem.content || "")}</textarea>
          </label>
        ` : `
          <label>Komponenty (každá na nový řádek)
            <textarea name="components"
              placeholder="Arduino Uno&#10;LED&#10;Rezistor">${escapeHTML(
                (formItem.components || []).join("\n")
              )}</textarea>
          </label>

          <label>Postup (každý krok na nový řádek)
            <textarea name="steps"
              placeholder="První krok&#10;Druhý krok">${escapeHTML(
                (formItem.steps || []).join("\n")
              )}</textarea>
          </label>

          <label>Ukázkový kód
            <textarea name="code"
              placeholder="// Tvůj kód">${escapeHTML(formItem.code || "")}</textarea>
          </label>
        `}

        <div class="admin-form-actions">
          <button class="button button-primary" type="submit">
            ${editingItem ? "Uložit změny ✓" : `Přidat ${isArticle ? "článek" : "projekt"} +`}
          </button>

          ${editingItem ? `
            <button class="button button-ghost" type="button"
              data-cancel-edit="true">Zrušit úpravy</button>
          ` : ""}
        </div>
      </form>

      <div class="admin-list-heading">
        <h3>Existující obsah (${items.length})</h3>
        <input type="search" id="admin-search"
          value="${escapeHTML(searchQuery)}"
          placeholder="Hledat v obsahu...">
      </div>

      <div class="admin-list">
        ${list || `<p class="admin-description">${
          searchQuery ? "Nic jsme nenašli." : "Zatím zde není žádný obsah."
        }</p>`}
      </div>
    `;

    // Keep edit state outside innerHTML replacement.
    container.dataset.editingId = editingItem?.id || "";
  }

  // ---------- Form submission ----------

  function handleDashboardSubmit(event) {
    if (event.target.id !== "admin-add-form") return;

    event.preventDefault();

    const formElement = event.target;
    const form = new FormData(formElement);
    const type = formElement.dataset.type;
    const isArticle = type === "articles";

    const title = String(form.get("title") || "").trim();
    const description = String(form.get("description") || "").trim();
    const category = String(form.get("category") || "");

    if (!title || !description) {
      notify("Vyplň název a krátký popis.");
      return;
    }

    if (isArticle && !String(form.get("content") || "").trim()) {
      notify("Doplň obsah článku.");
      return;
    }

    const editId = String(form.get("editId") || "");
    const items = isArticle ? getArticles() : getProjects();
    const existing = editId ? items.find(item => item.id === editId) : null;

    const id = existing?.id ||
      `${isArticle ? "article" : "project"}-${Date.now()}`;

    let updatedItem;

    if (isArticle) {
      updatedItem = {
        ...(existing || {}),
        id,
        title,
        category,
        icon: existing?.icon || "⌁",
        readTime: existing?.readTime || "Nový článek",
        excerpt: description,
        content: String(form.get("content") || "").trim(),
        tags: existing?.tags || []
      };
    } else {
      updatedItem = {
        ...(existing || {}),
        id,
        title,
        category,
        icon: existing?.icon || "⌁",
        difficulty: existing?.difficulty || "Vlastní projekt",
        time: existing?.time || "Dle projektu",
        description,
        components: String(form.get("components") || "")
          .split("\n").map(x => x.trim()).filter(Boolean),
        steps: String(form.get("steps") || "")
          .split("\n").map(x => x.trim()).filter(Boolean),
        code: String(form.get("code") || ""),
        note: existing?.note || ""
      };
    }

    let updatedItems;

    if (existing) {
      updatedItems = items.map(item =>
        item.id === editId ? updatedItem : item
      );
    } else {
      updatedItems = [...items, updatedItem];
    }

    saveCurrentItems(type, updatedItems);

    searchQuery = "";
    $("admin-editor").dataset.editingId = "";

    notify(existing ? "Změny byly uloženy." : "Nový obsah byl přidán.");

    renderEditor(type);
  }

  // ---------- Click handling ----------

  function handleDashboardClick(event) {
    const tab = event.target.closest("[data-tab]");

    if (tab) {
      activeTab = tab.dataset.tab;
      searchQuery = "";
      showDashboard();
      return;
    }

    const edit = event.target.closest("[data-edit]");

    if (edit) {
      const type = activeTab;
      const container = $("admin-editor");

      container.dataset.editingId = edit.dataset.edit;
      renderEditor(type);

      $("admin-editor").scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
      return;
    }

    const remove = event.target.closest("[data-remove]");

    if (remove) {
      removeItem(remove.dataset.remove);
      return;
    }

    if (event.target.closest("[data-cancel-edit]")) {
      $("admin-editor").dataset.editingId = "";
      renderEditor(activeTab);
      return;
    }

    if (event.target.closest("#admin-reset")) {
      if (confirm("Opravdu obnovit původní články a projekty? Tato akce přepíše lokální změny.")) {
        window.VoltLab.resetContent();
        searchQuery = "";
        activeTab = "overview";
        showDashboard();
        notify("Výchozí obsah byl obnoven.");
      }
      return;
    }

    if (event.target.closest("#admin-logout")) {
      sessionStorage.removeItem(storage.session);
      showLogin();
    }

    if (event.target.closest("#admin-export")) {
      exportBackup();
    }
  }

  function handleDashboardInput(event) {
    if (event.target.id === "admin-search") {
      searchQuery = event.target.value;
      const cursor = event.target.selectionStart;

      renderEditor(activeTab);

      const newSearch = $("admin-search");
      if (newSearch) {
        newSearch.focus();
        newSearch.setSelectionRange(cursor, cursor);
      }
    }
  }

  function handleDashboardChange(event) {
    if (event.target.id === "admin-import-file") {
      importBackup(event.target.files?.[0]);
    }
  }

  // ---------- Delete ----------

  function removeItem(id) {
    if (!confirm("Opravdu chceš tento obsah smazat?")) return;

    if (activeTab === "articles") {
      window.VoltLab.saveArticles(
        getArticles().filter(item => item.id !== id)
      );
    } else {
      window.VoltLab.saveProjects(
        getProjects().filter(item => item.id !== id)
      );
    }

    notify("Obsah byl smazán.");
    renderEditor(activeTab);
  }

  // ---------- Backup / export ----------

  function exportBackup() {
    const backup = {
      app: "VoltLab",
      formatVersion: 1,
      exportedAt: new Date().toISOString(),
      articles: getArticles(),
      projects: getProjects()
    };

    const blob = new Blob(
      [JSON.stringify(backup, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `voltlab-backup-${new Date()
      .toISOString().slice(0, 10)}.json`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);

    notify("Záloha byla připravena.");
  }

  // ---------- Backup / import ----------

  function validateItems(items, type) {
    if (!Array.isArray(items)) {
      throw new Error(`V záloze chybí seznam ${type}.`);
    }

    const ids = new Set();

    return items.map((item, index) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        throw new Error(`Neplatná položka ${index + 1} v ${type}.`);
      }

      const title = String(item.title || "").trim();
      const id = String(item.id || "").trim();

      if (!title || !id) {
        throw new Error(`Položka ${index + 1} v ${type} nemá název nebo ID.`);
      }

      if (ids.has(id)) {
        throw new Error(`Duplicitní ID "${id}" v ${type}.`);
      }

      ids.add(id);

      return {
        ...item,
        id,
        title,
        category: String(item.category || ""),
        description: String(item.description || item.excerpt || "")
      };
    });
  }

  async function importBackup(file) {
    if (!file) return;

    try {
      if (!file.name.toLowerCase().endsWith(".json")) {
        throw new Error("Vyber soubor ve formátu JSON.");
      }

      const text = await file.text();
      const backup = JSON.parse(text);

      if (!backup || backup.app !== "VoltLab") {
        throw new Error("Tento soubor není platná záloha VoltLabu.");
      }

      const articles = validateItems(backup.articles, "článků");
      const projects = validateItems(backup.projects, "projektů");

      if (!confirm(
        `Importovat ${articles.length} článků a ${projects.length} projektů? ` +
        "Aktuální lokální obsah bude nahrazen."
      )) {
        return;
      }

      window.VoltLab.saveArticles(articles);
      window.VoltLab.saveProjects(projects);

      activeTab = "overview";
      showDashboard();
      notify("Záloha byla úspěšně importována.");
    } catch (error) {
      notify(error.message || "Zálohu se nepodařilo načíst.");
    }
  }

  function renderBackup() {
    $("admin-editor").innerHTML = `
      <div class="admin-section-heading">
        <span class="admin-kicker">DATA MANAGEMENT</span>
        <h3>Zálohy a data</h3>
        <p>Udržuj svůj obsah v bezpečí a přenášej ho mezi prohlížeči.</p>
      </div>

      <div class="admin-overview-panel">
        <h3>Export obsahu</h3>
        <p class="admin-description">
          Stáhne soubor JSON obsahující všechny články a projekty.
          Doporučuji vytvořit zálohu před většími úpravami.
        </p>

        <button class="button button-primary" type="button"
          id="admin-export">
          Stáhnout zálohu ↓
        </button>
      </div>

      <div class="admin-overview-panel">
        <h3>Import zálohy</h3>
        <p class="admin-description">
          Nahraj dříve vytvořenou zálohu VoltLabu.
          Import nahradí současný lokální obsah.
        </p>

        <label class="admin-file-label">
          Vybrat JSON soubor
          <input type="file" id="admin-import-file"
            accept=".json,application/json">
        </label>
      </div>

      <div class="admin-warning">
        Import a export pracují s lokálním obsahem tohoto webu.
        Před importem si vždy stáhni aktuální zálohu.
      </div>
    `;
  }

  // ---------- Start ----------

  function init() {
    $("admin-access")?.addEventListener("click", openModal);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
