
(() => {
  "use strict";

  const config = window.VOLTLAB_CONFIG;
  if (!config || !config.admin.enabled) return;

  const $ = (id) => document.getElementById(id);
  const storage = config.storage;
  let modal;
  let activeTab = "articles";

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
    return config.categories.map(category => `
      <option value="${escapeHTML(category.id)}" ${category.id === selected ? "selected" : ""}>
        ${escapeHTML(category.name)}
      </option>
    `).join("");
  }

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
        <h2>VoltLab / Admin panel</h2>
        <button class="admin-close" type="button" aria-label="Zavřít">×</button>
      </div>
      <div id="admin-content"></div>
    `;
    document.body.appendChild(modal);

    modal.querySelector(".admin-close").addEventListener("click", closeModal);
    modal.addEventListener("click", event => {
      if (event.target === modal) closeModal();
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

    if (typeof modal.showModal === "function") modal.showModal();
    else modal.setAttribute("open", "");
  }

  function showLogin() {
    $("admin-content").innerHTML = `
      <form class="admin-form" id="admin-login-form">
        <p style="color:var(--muted);margin:0 0 8px;font-size:12px">Přihlášení do lokální správy VoltLabu.</p>
        <label>Admin heslo
          <input id="admin-password" type="password" autocomplete="current-password" placeholder="Zadej heslo" required>
        </label>
        <div class="admin-form-actions">
          <button class="button button-primary" type="submit">Přihlásit se →</button>
        </div>
        <p class="admin-warning">Demo administrace: heslo je nastavené v souboru config.js. Tato administrace není zabezpečený serverový systém.</p>
      </form>
    `;

    $("admin-login-form").addEventListener("submit", event => {
      event.preventDefault();

      if ($("admin-password").value === config.admin.demoPassword) {
        sessionStorage.setItem(storage.session, "active");
        showDashboard();
      } else {
        window.VoltLab.notify("Nesprávné heslo.");
      }
    });
  }

  function showDashboard() {
    $("admin-content").innerHTML = `
      <div class="admin-tabs">
        <button class="admin-tab ${activeTab === "articles" ? "active" : ""}" data-tab="articles">Články</button>
        <button class="admin-tab ${activeTab === "projects" ? "active" : ""}" data-tab="projects">Projekty</button>
      </div>
      <div id="admin-editor"></div>
      <div class="admin-form-actions" style="margin-top:20px">
        <button class="button button-ghost" type="button" id="admin-reset">Obnovit výchozí obsah</button>
        <button class="button button-ghost" type="button" id="admin-logout">Odhlásit se</button>
      </div>
      <p class="admin-warning">Změny se ukládají pouze v tomto prohlížeči. Na ostatních zařízeních se automaticky neprojeví.</p>
    `;

    $("admin-content").onclick = handleDashboardClick;
    renderEditor();
  }

  function handleDashboardClick(event) {
    const tab = event.target.closest("[data-tab]");
    if (tab) {
      activeTab = tab.dataset.tab;
      showDashboard();
      return;
    }

    const remove = event.target.closest("[data-remove]");
    if (remove) {
      removeItem(remove.dataset.remove);
      return;
    }

    if (event.target.closest("#admin-reset")) {
      if (confirm("Opravdu obnovit původní články a projekty?")) {
        window.VoltLab.resetContent();
        showDashboard();
      }
      return;
    }

    if (event.target.closest("#admin-logout")) {
      sessionStorage.removeItem(storage.session);
      showLogin();
    }
  }

  function renderEditor() {
    const container = $("admin-editor");
    if (!container) return;

    const items = activeTab === "articles" ? window.VoltLab.articles : window.VoltLab.projects;

    const list = items.map(item => `
      <div class="admin-list-item">
        <span>${escapeHTML(item.title)}</span>
        <button type="button" data-remove="${escapeHTML(item.id)}">Smazat</button>
      </div>
    `).join("");

    container.innerHTML = `
      <form class="admin-form" id="admin-add-form">
        <label>Název
          <input name="title" maxlength="90" required placeholder="Název obsahu">
        </label>
        <label>Kategorie
          <select name="category">${categoryOptions()}</select>
        </label>
        <label>Krátký popis
          <textarea name="description" maxlength="300" required placeholder="Krátký popis..."></textarea>
        </label>
        ${activeTab === "articles" ? `
          <label>Obsah článku
            <textarea name="content" required placeholder="Text článku..."></textarea>
          </label>
        ` : `
          <label>Komponenty (každá na nový řádek)
            <textarea name="components" placeholder="Arduino Uno&#10;LED&#10;Rezistor"></textarea>
          </label>
          <label>Postup (každý krok na nový řádek)
            <textarea name="steps" placeholder="První krok&#10;Druhý krok"></textarea>
          </label>
          <label>Ukázkový kód
            <textarea name="code" placeholder="// Tvůj kód"></textarea>
          </label>
        `}
        <div class="admin-form-actions">
          <button class="button button-primary" type="submit">Přidat ${activeTab === "articles" ? "článek" : "projekt"} +</button>
        </div>
      </form>
      <h3 style="margin-top:24px">Existující obsah (${items.length})</h3>
      <div class="admin-list">${list || "<p>Žádný obsah.</p>"}</div>
    `;

    $("admin-add-form").addEventListener("submit", event => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const title = String(form.get("title")).trim();
      const description = String(form.get("description")).trim();
      const category = String(form.get("category"));
      const id = `${activeTab === "articles" ? "article" : "project"}-${Date.now()}`;

      if (!title || !description) return;

      if (activeTab === "articles") {
        const updated = [...window.VoltLab.articles, {
          id,
          title,
          category,
          icon: "⌁",
          readTime: "Nový článek",
          excerpt: description,
          content: String(form.get("content")).trim(),
          tags: []
        }];
        window.VoltLab.saveArticles(updated);
      } else {
        const updated = [...window.VoltLab.projects, {
          id,
          title,
          category,
          icon: "⌁",
          difficulty: "Vlastní projekt",
          time: "Dle projektu",
          description,
          components: String(form.get("components") || "").split("\n").map(x => x.trim()).filter(Boolean),
          steps: String(form.get("steps") || "").split("\n").map(x => x.trim()).filter(Boolean),
          code: String(form.get("code") || ""),
          note: ""
        }];
        window.VoltLab.saveProjects(updated);
      }

      window.VoltLab.notify("Obsah byl přidán.");
      renderEditor();
    });
  }

  function removeItem(id) {
    if (!confirm("Opravdu chceš tento obsah smazat?")) return;

    if (activeTab === "articles") {
      window.VoltLab.saveArticles(window.VoltLab.articles.filter(item => item.id !== id));
    } else {
      window.VoltLab.saveProjects(window.VoltLab.projects.filter(item => item.id !== id));
    }

    window.VoltLab.notify("Obsah byl smazán.");
    renderEditor();
  }

  document.addEventListener("DOMContentLoaded", () => {
    $("admin-access")?.addEventListener("click", openModal);
  });
})();
