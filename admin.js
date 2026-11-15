
(() => {
  const $ = id => document.getElementById(id);
  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);

  let activeTab = "articles";
  let search = "";
  let editingId = null;

  function createModal() {
    if ($("admin-modal")) return;
    document.body.insertAdjacentHTML("beforeend", `
      <dialog id="admin-modal" class="admin-modal">
        <div class="admin-shell">
          <div class="admin-header">
            <div><div class="eyebrow">VOLTLAB CONTROL PANEL</div><h2>Administrace</h2></div>
            <button class="dialog-close" id="admin-close">×</button>
          </div>
          <div id="admin-content"></div>
        </div>
      </dialog>`);
    $("admin-close").addEventListener("click", closeAdmin);
    $("admin-modal").addEventListener("click", e => {
      if (e.target === $("admin-modal")) closeAdmin();
    });
  }

  function closeAdmin() {
    const modal = $("admin-modal");
    if (!modal) return;
    if (hasUnsavedChanges() && !confirm("Máš neuložené změny. Opravdu chceš zavřít administraci?")) return;
    modal.close();
  }

  function hasUnsavedChanges() {
    const form = $("admin-form");
    return !!form && form.dataset.dirty === "true";
  }

  function openAdmin() {
    createModal();
    if (sessionStorage.getItem(window.VOLTLAB_CONFIG.storage.adminSession) === "yes") {
      showDashboard();
    } else {
      showLogin();
    }
    $("admin-modal").showModal();
  }

  function showLogin() {
    $("admin-content").innerHTML = `
      <div class="login-panel">
        <div class="admin-lock">⌑</div>
        <h3>Vstup do administrace</h3>
        <p>Přihlas se pro správu obsahu VoltLabu.</p>
        <form id="admin-login">
          <label>Heslo<input type="password" id="admin-password" required autocomplete="current-password" placeholder="Zadej heslo"></label>
          <button class="button button-primary" type="submit">Přihlásit se</button>
          <p class="admin-error" id="admin-error"></p>
        </form>
      </div>`;
    $("admin-login").addEventListener("submit", e => {
      e.preventDefault();
      if ($("admin-password").value === window.VOLTLAB_CONFIG.admin.demoPassword) {
        sessionStorage.setItem(window.VOLTLAB_CONFIG.storage.adminSession, "yes");
        showDashboard();
      } else {
        $("admin-error").textContent = "Nesprávné heslo. Zkus to znovu.";
      }
    });
  }

  function showDashboard() {
    $("admin-content").innerHTML = `
      <div class="admin-stats">
        <div class="admin-stat"><span>Články</span><strong>${window.VoltLab.articles.length}</strong></div>
        <div class="admin-stat"><span>Projekty</span><strong>${window.VoltLab.projects.length}</strong></div>
        <div class="admin-stat"><span>Kategorie</span><strong>${window.VOLTLAB_CONFIG.categories.length}</strong></div>
      </div>
      <div class="admin-toolbar">
        <div class="admin-tabs">
          <button class="admin-tab ${activeTab === "articles" ? "active" : ""}" data-tab="articles">Články</button>
          <button class="admin-tab ${activeTab === "projects" ? "active" : ""}" data-tab="projects">Projekty</button>
          <button class="admin-tab ${activeTab === "categories" ? "active" : ""}" data-tab="categories">Kategorie</button>
        </div>
        <button class="button button-primary" data-action="add">+ Přidat</button>
      </div>
      <input class="search-input admin-search" id="admin-search" type="search" placeholder="Hledat v administraci…" value="${escapeHTML(search)}">
      <div id="admin-list"></div>
      <div class="admin-footer">
        <button class="button button-ghost" data-action="reset">Obnovit výchozí obsah</button>
        <button class="button button-ghost" data-action="logout">Odhlásit se</button>
      </div>
      <p class="admin-warning">Pozor: tato administrace ukládá obsah do místního úložiště prohlížeče. Změny se automaticky nepublikují ostatním návštěvníkům webu. Přihlašovací heslo uložené v JavaScriptu je pouze demonstrační ochrana.</p>
    `;
    $("admin-content").onclick = handleDashboardClick;
    $("admin-search").addEventListener("input", e => {
      search = e.target.value;
      renderList();
    });
    renderList();
  }

  function currentItems() {
    if (activeTab === "articles") return window.VoltLab.articles;
    if (activeTab === "projects") return window.VoltLab.projects;
    return window.VOLTLAB_CONFIG.categories;
  }

  function renderList() {
    const items = currentItems().filter(item =>
      (item.title || item.name || "").toLocaleLowerCase("cs").includes(search.toLocaleLowerCase("cs"))
    );
    $("admin-list").innerHTML = items.length ? items.map(item => `
      <div class="admin-list-item">
        <div><strong>${escapeHTML(item.title || item.name)}</strong><small>${escapeHTML(item.category || item.id)}</small></div>
        <div class="admin-item-actions">
          <button class="button button-small button-secondary" data-action="edit" data-id="${escapeHTML(item.id)}">Upravit</button>
          ${activeTab !== "categories" ? `<button class="button button-small button-danger" data-action="delete" data-id="${escapeHTML(item.id)}">Smazat</button>` : ""}
        </div>
      </div>`).join("") : `<p class="empty-state">Nic jsme nenašli.</p>`;
  }

  function handleDashboardClick(event) {
    const button = event.target.closest("[data-action], [data-tab]");
    if (!button) return;
    if (button.dataset.tab) {
      activeTab = button.dataset.tab;
      showDashboard();
      return;
    }
    const action = button.dataset.action;
    if (action === "add") showEditor(null);
    if (action === "edit") showEditor(button.dataset.id);
    if (action === "delete") deleteItem(button.dataset.id);
    if (action === "logout") {
      if (hasUnsavedChanges() && !confirm("Zahodit neuložené změny?")) return;
      sessionStorage.removeItem(window.VOLTLAB_CONFIG.storage.adminSession);
      showLogin();
    }
    if (action === "reset") {
      if (confirm("Obnovit všechny články a projekty na výchozí obsah?")) {
        window.VoltLab.resetContent();
        showDashboard();
      }
    }
  }

  function deleteItem(id) {
    if (!confirm("Opravdu chceš tuto položku smazat?")) return;
    if (activeTab === "articles") {
      window.VoltLab.saveArticles(window.VoltLab.articles.filter(x => x.id !== id));
    } else if (activeTab === "projects") {
      window.VoltLab.saveProjects(window.VoltLab.projects.filter(x => x.id !== id));
    }
    showDashboard();
    window.VoltLab.notify("Položka byla smazána.");
  }

  function showEditor(id) {
    editingId = id;
    const items = currentItems();
    const item = id ? items.find(x => x.id === id) : {};
    if (activeTab === "categories") {
      $("admin-list").innerHTML = `
        <form id="admin-form" class="admin-editor" data-dirty="false">
          <h3>${id ? "Upravit kategorii" : "Nová kategorie"}</h3>
          <label>ID kategorie<input name="id" required value="${escapeHTML(item?.id || "")}" ${id ? "readonly" : ""}></label>
          <label>Název<input name="name" required value="${escapeHTML(item?.name || "")}"></label>
          <label>Ikona<input name="icon" value="${escapeHTML(item?.icon || "✦")}"></label>
          <label>Popis<textarea name="description">${escapeHTML(item?.description || "")}</textarea></label>
          <div class="calc-actions"><button class="button button-primary" type="submit">Uložit</button><button class="button button-ghost" type="button" data-cancel>Zpět</button></div>
        </form>`;
    } else {
      const isArticle = activeTab === "articles";
      $("admin-list").innerHTML = `
        <form id="admin-form" class="admin-editor" data-dirty="false">
          <h3>${id ? "Upravit položku" : "Nová položka"}</h3>
          <label>Název<input name="title" required value="${escapeHTML(item?.title || "")}"></label>
          <label>ID<input name="id" required value="${escapeHTML(item?.id || "")}" ${id ? "readonly" : ""}></label>
          <label>Kategorie<select name="category">${window.VOLTLAB_CONFIG.categories.map(c => `<option value="${escapeHTML(c.id)}" ${item?.category === c.id ? "selected" : ""}>${escapeHTML(c.name)}</option>`).join("")}</select></label>
          <label>Ikona<input name="icon" value="${escapeHTML(item?.icon || "✦")}"></label>
          <label>Krátký popis<textarea name="${isArticle ? "excerpt" : "description"}" required>${escapeHTML(item?.[isArticle ? "excerpt" : "description"] || "")}</textarea></label>
          ${isArticle ? `
            <label>Doba čtení<input name="readTime" value="${escapeHTML(item?.readTime || "5 min")}"></label>
            <label>Obsah článku (HTML)<textarea name="content" rows="10">${escapeHTML(item?.content || "")}</textarea></label>
            <label>Štítky – odděluj čárkou<input name="tags" value="${escapeHTML((item?.tags || []).join(", "))}"></label>
          ` : `
            <label>Obtížnost<input name="difficulty" value="${escapeHTML(item?.difficulty || "Začátečník")}"></label>
            <label>Doba projektu<input name="time" value="${escapeHTML(item?.time || "")}"></label>
            <label>Součástky – každou na nový řádek<textarea name="components">${escapeHTML((item?.components || []).join("\n"))}</textarea></label>
            <label>Postup – každý krok na nový řádek<textarea name="steps">${escapeHTML((item?.steps || []).join("\n"))}</textarea></label>
            <label>Ukázkový kód<textarea name="code" rows="8">${escapeHTML(item?.code || "")}</textarea></label>
            <label>Poznámka<textarea name="note">${escapeHTML(item?.note || "")}</textarea></label>
          `}
          <div class="calc-actions"><button class="button button-primary" type="submit">Uložit</button><button class="button button-ghost" type="button" data-cancel>Zpět</button></div>
        </form>`;
    }

    const form = $("admin-form");
    form.addEventListener("input", () => form.dataset.dirty = "true");
    form.addEventListener("change", () => form.dataset.dirty = "true");
    form.addEventListener("submit", saveEditor);
    form.querySelector("[data-cancel]").addEventListener("click", () => {
      if (!hasUnsavedChanges() || confirm("Zahodit neuložené změny?")) showDashboard();
    });
  }

  function saveEditor(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    let items = currentItems();
    if (activeTab === "categories") {
      const next = {
        id: data.id.trim(),
        name: data.name.trim(),
        icon: data.icon.trim(),
        description: data.description.trim()
      };
      const updated = editingId
        ? window.VOLTLAB_CONFIG.categories.map(x => x.id === editingId ? next : x)
        : [...window.VOLTLAB_CONFIG.categories, next];
      window.VOLTLAB_CONFIG.categories = updated;
    } else {
      const isArticle = activeTab === "articles";
      const item = isArticle ? {
        id: data.id.trim(), title: data.title.trim(), category: data.category,
        icon: data.icon, excerpt: data.excerpt, readTime: data.readTime,
        content: data.content, tags: data.tags.split(",").map(x => x.trim()).filter(Boolean)
      } : {
        id: data.id.trim(), title: data.title.trim(), category: data.category,
        icon: data.icon, description: data.description, difficulty: data.difficulty,
        time: data.time, components: data.components.split("\n").map(x => x.trim()).filter(Boolean),
        steps: data.steps.split("\n").map(x => x.trim()).filter(Boolean),
        code: data.code, note: data.note
      };
      if (!item.id || !item.title) return;
      const next = editingId ? items.map(x => x.id === editingId ? item : x) : [...items, item];
      if (isArticle) window.VoltLab.saveArticles(next);
      else window.VoltLab.saveProjects(next);
    }
    window.VoltLab.notify("Změny byly uloženy.");
    showDashboard();
  }

  document.addEventListener("DOMContentLoaded", () => {
    $("admin-access")?.addEventListener("click", openAdmin);
  });
})();
