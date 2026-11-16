
/* =========================================================
   VOLTLAB V4 MAX
   MAIN APPLICATION
   ========================================================= */

"use strict";

window.VOLTLAB = window.VOLTLAB || {};

(() => {
  const APP = window.VOLTLAB;

  if (APP.mainInitialized) return;
  APP.mainInitialized = true;

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];

  const escape = value =>
    APP.utils.escapeHTML(String(value ?? ""));

  const main = $(".main-content") || $("main") || document.body;

  let activePage = "dashboard";
  let searchQuery = "";
  let modalElement = null;

  /* -------------------------------------------------------
     PAGE DEFINITIONS
  ------------------------------------------------------- */

  const pageDefinitions = [
    { id: "dashboard", title: "Přehled", icon: "⌂" },
    { id: "academy", title: "Akademie", icon: "🎓" },
    { id: "articles", title: "Články", icon: "▤" },
    { id: "wiki", title: "Elektronická wiki", icon: "📚" },
    { id: "formulas", title: "Vzorce", icon: "ƒ" },
    { id: "calculators", title: "Kalkulačky", icon: "⌗" },
    { id: "components", title: "Součástky", icon: "▦" },
    { id: "circuit-studio", title: "Circuit Studio", icon: "⌁" },
    { id: "pcb-studio", title: "PCB Studio", icon: "▧" },
    { id: "signal-lab", title: "Signal Lab", icon: "∿" },
    { id: "logic-lab", title: "Logic Lab", icon: "⊙" },
    { id: "code-lab", title: "Code Lab", icon: "⌘" },
    { id: "projects", title: "Projekty", icon: "⚡" },
    { id: "journal", title: "Zápisník", icon: "✎" },
    { id: "settings", title: "Nastavení", icon: "⚙" },
    { id: "admin", title: "Administrace", icon: "♙" }
  ];

  /* -------------------------------------------------------
     HTML HELPERS
  ------------------------------------------------------- */

  function create(tag, className, content = "") {
    const element = document.createElement(tag);

    if (className) element.className = className;

    if (content !== "") element.textContent = content;

    return element;
  }

  function getPageElement(id) {
    return $(`#page-${id}`) ||
      $(`[data-page="${id}"]`) ||
      $(`#${id}.page`);
  }

  function getPageContent(id) {
    const page = getPageElement(id);

    if (!page) return null;

    let content = $("[data-page-content]", page) ||
      $(".page-content", page) ||
      $(".page-inner", page);

    if (!content) {
      content = create("div", "page-content");
      content.dataset.pageContent = "";
      page.appendChild(content);
    }

    return content;
  }

  function pageExists(id) {
    return Boolean(getPageElement(id));
  }

  function ensurePage(id, title) {
    let page = getPageElement(id);

    if (page) return page;

    page = create("section", "page");
    page.id = `page-${id}`;
    page.dataset.page = id;
    page.setAttribute("aria-label", title);

    main.appendChild(page);

    return page;
  }

  function renderPageHeader(title, description = "") {
    return `
      <div class="page-heading">
        <div>
          <h1>${escape(title)}</h1>
          ${description
            ? `<p>${escape(description)}</p>`
            : ""}
        </div>
      </div>
    `;
  }

  function renderEmpty(title, description) {
    return `
      <div class="panel empty-state">
        <h3>${escape(title)}</h3>
        <p>${escape(description)}</p>
      </div>
    `;
  }

  function renderButton(text, action, className = "secondary-button") {
    return `
      <button
        type="button"
        class="${escape(className)}"
        data-action="${escape(action)}"
      >
        ${escape(text)}
      </button>
    `;
  }

  function formatDate(date) {
    return APP.utils.formatDate(date);
  }

  /* -------------------------------------------------------
     NAVIGATION
  ------------------------------------------------------- */

  function setActiveNavigation(id) {
    $$(".nav-link, [data-nav]").forEach(link => {
      const target =
        link.dataset.page ||
        link.dataset.nav ||
        link.getAttribute("href")?.replace("#", "");

      const active = target === id;

      link.classList.toggle("active", active);

      if (active) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function showPage(id, options = {}) {
    const definition = pageDefinitions.find(item => item.id === id);

    if (!definition) {
      notify("Stránka nebyla nalezena.", "error");
      return false;
    }

    if (!pageExists(id)) {
      ensurePage(id, definition.title);
    }

    $$(".page").forEach(page => {
      const active =
        page.id === `page-${id}` ||
        page.dataset.page === id ||
        page.id === id;

      page.classList.toggle("active", active);
      page.hidden = !active;
    });

    activePage = id;

    setActiveNavigation(id);

    if (options.updateHash !== false) {
      history.replaceState(null, "", `#${id}`);
    }

    APP.storage.set(
      "voltlab_v4_last_page",
      id
    );

    renderPage(id);

    APP.events.emit("navigation:changed", { page: id });

    window.scrollTo({
      top: 0,
      behavior: APP.data.settings.reduceMotion ? "auto" : "smooth"
    });

    return true;
  }

  function bindNavigation() {
    document.addEventListener("click", event => {
      const link = event.target.closest(
        "[data-page], [data-nav], .nav-link"
      );

      if (!link) return;

      const id =
        link.dataset.page ||
        link.dataset.nav ||
        link.getAttribute("href")?.replace("#", "");

      if (!pageDefinitions.some(item => item.id === id)) return;

      event.preventDefault();
      showPage(id);
    });
  }

  /* -------------------------------------------------------
     NOTIFICATIONS
  ------------------------------------------------------- */

  function notify(message, type = "success") {
    if (typeof APP.notify === "function") {
      APP.notify(message, type);
      return;
    }

    let container = $(".toast-container");

    if (!container) {
      container = create("div", "toast-container");
      document.body.appendChild(container);
    }

    const toast = create("div", `toast toast-${type}`);
    toast.textContent = message;

    container.appendChild(toast);

    window.setTimeout(() => toast.remove(), 3500);
  }

  /* -------------------------------------------------------
     MODALS
  ------------------------------------------------------- */

  function closeModal() {
    if (!modalElement) return;

    modalElement.remove();
    modalElement = null;

    document.removeEventListener("keydown", handleModalKeydown);
  }

  function handleModalKeydown(event) {
    if (event.key === "Escape") closeModal();
  }

  function openModal(title, content, options = {}) {
    closeModal();

    const overlay = create("div", "modal-overlay");
    overlay.dataset.modalOverlay = "";

    const modal = create("div", "modal-window");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", title);

    const header = create("div", "modal-header");
    const heading = create("h2");
    heading.textContent = title;

    const close = create("button", "modal-close", "×");
    close.type = "button";
    close.setAttribute("aria-label", "Zavřít");

    close.addEventListener("click", closeModal);

    header.append(heading, close);

    const body = create("div", "modal-body");

    if (typeof content === "string") {
      body.innerHTML = content;
    } else if (content instanceof Node) {
      body.appendChild(content);
    }

    modal.append(header, body);
    overlay.appendChild(modal);

    overlay.addEventListener("click", event => {
      if (event.target === overlay && options.locked !== true) {
        closeModal();
      }
    });

    document.body.appendChild(overlay);

    modalElement = overlay;

    document.addEventListener("keydown", handleModalKeydown);

    close.focus();

    return modal;
  }

  /* -------------------------------------------------------
     DASHBOARD
  ------------------------------------------------------- */

  function renderDashboard() {
    const articles = APP.articles?.getAll() || [];
    const projects = APP.projects?.getAll() || [];
    const components = APP.components?.getAll() || [];
    const history = APP.calculators?.getHistory() || [];

    const progress = APP.data.getProgress();

    const completedArticles =
      Object.values(progress.articles || {})
        .filter(Boolean).length;

    const recentArticles = articles.slice(0, 3);
    const recentProjects = projects.slice(0, 3);

    return `
      <div class="welcome-banner">
        <div class="welcome-content">
          <span class="eyebrow">VOLTLAB V4 MAX</span>
          <h1>Vítej ve světě elektroniky.</h1>
          <p>
            Uč se, experimentuj, počítej a vytvářej vlastní
            elektronické projekty.
          </p>
          <div class="welcome-actions">
            <button class="primary-button" data-page="academy">
              Začít se učit
            </button>
            <button class="secondary-button" data-page="calculators">
              Otevřít kalkulačky
            </button>
          </div>
        </div>
        <div class="welcome-visual" aria-hidden="true">
          <span>⚡</span>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-icon">▤</span>
          <strong>${articles.length}</strong>
          <span>Článků</span>
        </div>

        <div class="stat-card">
          <span class="stat-icon">⚡</span>
          <strong>${projects.length}</strong>
          <span>Projektů</span>
        </div>

        <div class="stat-card">
          <span class="stat-icon">▦</span>
          <strong>${components.length}</strong>
          <span>Součástek</span>
        </div>

        <div class="stat-card">
          <span class="stat-icon">⌗</span>
          <strong>${history.length}</strong>
          <span>Výpočtů</span>
        </div>
      </div>

      <section class="content-section">
        <div class="section-heading">
          <div>
            <h2>Rychlý přístup</h2>
            <p>Vyber si, co chceš právě dělat.</p>
          </div>
        </div>

        <div class="quick-access-grid">
          ${[
            ["articles", "📚", "Články", "Elektronika od základů"],
            ["components", "🔌", "Součástky", "Prozkoumej komponenty"],
            ["calculators", "🧮", "Kalkulačky", "Počítej elektrické obvody"],
            ["projects", "⚡", "Projekty", "Vytvářej vlastní zařízení"],
            ["circuit-studio", "🔧", "Circuit Studio", "Navrhuj obvody"],
            ["signal-lab", "〰️", "Signal Lab", "Experimentuj se signály"]
          ].map(item => `
            <button class="quick-card" data-page="${item[0]}">
              <span>${item[1]}</span>
              <strong>${item[2]}</strong>
              <small>${item[3]}</small>
            </button>
          `).join("")}
        </div>
      </section>

      <section class="content-section">
        <div class="section-heading">
          <h2>Poslední články</h2>
          <button class="text-button" data-page="articles">
            Všechny články →
          </button>
        </div>

        <div class="card-grid">
          ${recentArticles.map(article => `
            <article class="panel content-card">
              <span class="category-label">
                ${escape(article.category)}
              </span>
              <h3>${escape(article.title)}</h3>
              <p>${escape(article.excerpt)}</p>
              <button
                class="secondary-button"
                data-action="open-article"
                data-id="${escape(article.id)}"
              >
                Otevřít článek
              </button>
            </article>
          `).join("") || renderEmpty("Zatím žádné články", "Databáze článků je prázdná.")}
        </div>
      </section>

      <section class="content-section">
        <div class="section-heading">
          <h2>Rozpracované projekty</h2>
          <button class="text-button" data-page="projects">
            Všechny projekty →
          </button>
        </div>

        <div class="card-grid">
          ${recentProjects.map(project => `
            <article class="panel content-card">
              <span class="category-label">
                ${escape(project.category)}
              </span>
              <h3>${escape(project.title)}</h3>
              <p>${escape(project.description)}</p>
              <button
                class="secondary-button"
                data-action="open-project"
                data-id="${escape(project.id)}"
              >
                Zobrazit projekt
              </button>
            </article>
          `).join("") || renderEmpty("Žádné projekty", "Přidej si první projekt.")}
        </div>
      </section>

      <section class="content-section">
        <div class="panel progress-panel">
          <h2>Tvůj postup</h2>
          <p>Dokončené články: ${completedArticles}</p>
        </div>
      </section>
    `;
  }

  /* -------------------------------------------------------
     ARTICLES
  ------------------------------------------------------- */

  function renderArticles() {
    const articles = APP.articles?.getAll() || [];

    const filtered = APP.articles
      ? APP.articles.search(searchQuery)
      : articles;

    return `
      ${renderPageHeader(
        "Elektronické články",
        "Uč se elektroniku od základů až po pokročilé obvody."
      )}

      <div class="search-toolbar">
        <input
          type="search"
          id="article-search"
          placeholder="Hledat články..."
          value="${escape(searchQuery)}"
          aria-label="Hledat články"
        />
      </div>

      <div class="article-grid">
        ${filtered.map(article => `
          <article class="panel article-card">
            <span class="category-label">
              ${escape(article.category)}
            </span>
            <h3>${escape(article.title)}</h3>
            <p>${escape(article.excerpt)}</p>
            <div class="card-meta">
              <span>${escape(article.level || "Základy")}</span>
              <span>${escape(article.readingTime || "5")} min</span>
            </div>
            <button
              class="secondary-button"
              data-action="open-article"
              data-id="${escape(article.id)}"
            >
              Číst článek
            </button>
          </article>
        `).join("") || renderEmpty(
          "Nic jsme nenašli",
          "Zkus jiné hledané slovo."
        )}
      </div>
    `;
  }

  function openArticle(id) {
    const article = APP.articles?.getById(id);

    if (!article) {
      notify("Článek nebyl nalezen.", "error");
      return;
    }

    APP.articles.markRead(id);

    const content = `
      <div class="article-detail">
        <span class="category-label">${escape(article.category)}</span>
        <h1>${escape(article.title)}</h1>
        <p>${escape(article.excerpt)}</p>
        <div class="article-body">
          ${markdownToHTML(article.content || "")}
        </div>
      </div>
    `;

    openModal(article.title, content);
  }

  /* -------------------------------------------------------
     BASIC MARKDOWN RENDERER
     Escapes source before applying simple formatting.
  ------------------------------------------------------- */

  function markdownToHTML(source) {
    let html = escape(source);

    html = html.replace(
      /^### (.+)$/gm,
      "<h3>$1</h3>"
    );

    html = html.replace(
      /^## (.+)$/gm,
      "<h2>$1</h2>"
    );

    html = html.replace(
      /^# (.+)$/gm,
      "<h1>$1</h1>"
    );

    html = html.replace(
      /\*\*(.+?)\*\*/g,
      "<strong>$1</strong>"
    );

    html = html.replace(
      /\*(.+?)\*/g,
      "<em>$1</em>"
    );

    html = html.replace(
      /`(.+?)`/g,
      "<code>$1</code>"
    );

    html = html.replace(/\n/g, "<br>");

    return html;
  }

  /* -------------------------------------------------------
     PROJECTS
  ------------------------------------------------------- */

  function renderProjects() {
    const projects = APP.projects?.search(searchQuery) || [];

    return `
      ${renderPageHeader(
        "Elektronické projekty",
        "Inspirace, návody a praktické experimenty."
      )}

      <div class="search-toolbar">
        <input
          type="search"
          id="project-search"
          placeholder="Hledat projekty..."
          value="${escape(searchQuery)}"
        />
      </div>

      <div class="card-grid">
        ${projects.map(project => `
          <article class="panel project-card">
            <span class="category-label">${escape(project.category)}</span>
            <h3>${escape(project.title)}</h3>
            <p>${escape(project.description)}</p>
            <div class="card-meta">
              <span>${escape(project.level)}</span>
              <span>${escape(project.estimatedTime || "")}</span>
            </div>
            <button
              class="secondary-button"
              data-action="open-project"
              data-id="${escape(project.id)}"
            >
              Otevřít projekt
            </button>
          </article>
        `).join("") || renderEmpty(
          "Žádné projekty",
          "Zkus upravit hledání."
        )}
      </div>
    `;
  }

  function openProject(id) {
    const project = APP.projects?.getById(id);

    if (!project) {
      notify("Projekt nebyl nalezen.", "error");
      return;
    }

    const steps = project.steps || [];

    const content = `
      <div class="project-detail">
        <h2>${escape(project.title)}</h2>
        <p>${escape(project.description)}</p>

        <h3>Potřebné součástky</h3>

        <ul>
          ${(project.components || []).map(item => `
            <li>
              ${escape(item.name)} – ${escape(item.quantity)}
            </li>
          `).join("")}
        </ul>

        <h3>Postup stavby</h3>

        <div class="project-steps">
          ${steps.map((step, index) => `
            <label class="project-step">
              <input
                type="checkbox"
                data-project-step="${index}"
                data-project-id="${escape(id)}"
                ${APP.projects.getProgress(id)?.includes(index) ? "checked" : ""}
              />
              <span>${escape(
                typeof step === "string" ? step : step.title
              )}</span>
            </label>
          `).join("")}
        </div>

        <p class="safety-note">
          Bezpečnost: ${escape(project.safety || "Před zapojením zkontroluj polaritu a napájecí napětí.")}
        </p>
      </div>
    `;

    openModal(project.title, content);
  }

  /* -------------------------------------------------------
     COMPONENTS
  ------------------------------------------------------- */

  function renderComponents() {
    const components = APP.components?.search(searchQuery) || [];

    return `
      ${renderPageHeader(
        "Databáze součástek",
        "Technické informace, parametry a použití elektronických komponent."
      )}

      <div class="search-toolbar">
        <input
          type="search"
          id="component-search"
          placeholder="Hledat součástky..."
          value="${escape(searchQuery)}"
        />
      </div>

      <div class="category-grid">
        ${(APP.components?.categories || []).map(category => `
          <button
            class="category-card"
            data-action="filter-component"
            data-category="${escape(category.id)}"
          >
            <span>${escape(category.icon)}</span>
            <strong>${escape(category.name)}</strong>
          </button>
        `).join("")}
      </div>

      <div class="component-grid">
        ${components.map(component => `
          <article class="panel component-card">
            <span class="category-label">
              ${escape(component.category)}
            </span>
            <h3>${escape(component.name)}</h3>
            <p>${escape(component.description)}</p>
            <strong>${escape(component.value || "")}</strong>
            <button
              class="secondary-button"
              data-action="open-component"
              data-id="${escape(component.id)}"
            >
              Detail součástky
            </button>
          </article>
        `).join("") || renderEmpty(
          "Žádné součástky",
          "Zkus jiné hledání nebo kategorii."
        )}
      </div>
    `;
  }

  function openComponent(id) {
    const item = APP.components?.getById(id);

    if (!item) return;

    const parameters = Object.entries(item.parameters || {});

    openModal(item.name, `
      <div class="component-detail">
        <p>${escape(item.description)}</p>

        <h3>Technické parametry</h3>

        <div class="measurement-grid">
          ${parameters.map(([key, value]) => `
            <div class="measurement-item">
              <small>${escape(key)}</small>
              <strong>${escape(value)}</strong>
            </div>
          `).join("")}
        </div>

        <h3>Typické použití</h3>

        <ul>
          ${(item.applications || []).map(app => `
            <li>${escape(app)}</li>
          `).join("")}
        </ul>

        <button
          class="secondary-button"
          data-action="toggle-component-favorite"
          data-id="${escape(id)}"
        >
          ${APP.components.isFavorite(id)
            ? "Odebrat z oblíbených"
            : "Přidat do oblíbených"}
        </button>
      </div>
    `);
  }

  /* -------------------------------------------------------
     CALCULATORS
  ------------------------------------------------------- */

  function renderCalculators() {
    const definitions = APP.calculators?.definitions || [];

    const filtered = APP.calculators.search(searchQuery);

    return `
      ${renderPageHeader(
        "Elektrotechnické kalkulačky",
        "Rychlé výpočty pro elektroniku, obvody a napájení."
      )}

      <div class="search-toolbar">
        <input
          type="search"
          id="calculator-search"
          placeholder="Hledat kalkulačku..."
          value="${escape(searchQuery)}"
        />
      </div>

      <div class="calculator-grid">
        ${filtered.map(item => `
          <article class="panel calculator-card">
            <span class="category-label">${escape(item.category)}</span>
            <h3>${escape(item.name)}</h3>
            <p>${escape(item.description)}</p>
            <div class="formula-preview">
              ${escape(item.formula)}
            </div>
            <button
              class="primary-button"
              data-action="open-calculator"
              data-id="${escape(item.id)}"
            >
              Otevřít kalkulačku
            </button>
          </article>
        `).join("")}
      </div>

      <section class="content-section">
        <h2>Historie výpočtů</h2>
        ${renderCalculatorHistory()}
      </section>
    `;
  }

  function renderCalculatorHistory() {
    const history = APP.calculators.getHistory(10);

    if (!history.length) {
      return renderEmpty(
        "Zatím žádné výpočty",
        "Po prvním výpočtu se zde zobrazí historie."
      );
    }

    return `
      <div class="panel">
        ${history.map(item => `
          <div class="history-item">
            <div>
              <strong>${escape(item.calculation)}</strong>
              <small>${formatDate(item.timestamp)}</small>
            </div>
            <button
              class="text-button"
              data-action="remove-calculation"
              data-id="${escape(item.id)}"
            >
              Odebrat
            </button>
          </div>
        `).join("")}

        <button
          class="danger-button"
          data-action="clear-calculator-history"
        >
          Vymazat historii
        </button>
      </div>
    `;
  }

  function openCalculator(id) {
    const definition = APP.calculators.getById(id);

    if (!definition) return;

    const fields = {
      "ohms-law": [
        ["voltage", "Napětí (V)", "number"],
        ["current", "Proud (A)", "number"],
        ["resistance", "Odpor (Ω)", "number"]
      ],
      "power": [
        ["voltage", "Napětí (V)", "number"],
        ["current", "Proud (A)", "number"]
      ],
      "led-resistor": [
        ["supplyVoltage", "Napájecí napětí (V)", "number"],
        ["ledVoltage", "Napětí LED (V)", "number"],
        ["currentMa", "Proud LED (mA)", "number"]
      ],
      "voltage-divider": [
        ["inputVoltage", "Vstupní napětí (V)", "number"],
        ["r1", "Rezistor R1 (Ω)", "number"],
        ["r2", "Rezistor R2 (Ω)", "number"]
      ],
      "rc-time-constant": [
        ["resistance", "Odpor (Ω)", "number"],
        ["capacitance", "Kapacita (F)", "number"]
      ],
      "capacitor-energy": [
        ["capacitance", "Kapacita (F)", "number"],
        ["voltage", "Napětí (V)", "number"]
      ],
      "inductor-energy": [
        ["inductance", "Indukčnost (H)", "number"],
        ["current", "Proud (A)", "number"]
      ],
      "battery-runtime": [
        ["capacityAh", "Kapacita baterie (Ah)", "number"],
        ["currentA", "Odběr (A)", "number"],
        ["efficiency", "Účinnost (%) – nepovinné", "number"]
      ],
      "cable-voltage-drop": [
        ["length", "Délka vedení (m)", "number"],
        ["current", "Proud (A)", "number"],
        ["area", "Průřez (mm²)", "number"],
        ["voltage", "Napájecí napětí (V)", "number"]
      ],
      "inductive-reactance": [
        ["frequency", "Frekvence (Hz)", "number"],
        ["inductance", "Indukčnost (H)", "number"]
      ],
      "capacitive-reactance": [
        ["frequency", "Frekvence (Hz)", "number"],
        ["capacitance", "Kapacita (F)", "number"]
      ]
    };

    const selectedFields = fields[id];

    if (!selectedFields) {
      notify(
        "Tato kalkulačka zatím nemá připravený formulář.",
        "warning"
      );
      return;
    }

    const form = document.createElement("form");
    form.className = "calculator-form";

    form.innerHTML = selectedFields.map(field => `
      <label class="form-field">
        <span>${escape(field[1])}</span>
        <input
          name="${escape(field[0])}"
          type="${field[2]}"
          step="any"
          ${field[0] === "efficiency" ? "" : "required"}
        />
      </label>
    `).join("") + `
      <button class="primary-button" type="submit">
        Vypočítat
      </button>
      <div class="calculation-result" data-calculation-result hidden></div>
    `;

    form.addEventListener("submit", event => {
      event.preventDefault();

      const values = Object.fromEntries(
        new FormData(form).entries()
      );

      for (const key in values) {
        if (values[key] === "") {
          delete values[key];
        } else {
          values[key] = Number(values[key]);
        }
      }

      try {
        const calculation = APP.calculators[id](values);

        const output = $("[data-calculation-result]", form);

        output.hidden = false;

        output.innerHTML = `
          <h3>Výsledek</h3>
          ${Object.entries(calculation).map(([key, value]) => {
            if (!value || typeof value !== "object" ||
                !("formatted" in value)) return "";

            return `
              <div class="result-row">
                <span>${escape(value.label)}</span>
                <strong>${escape(value.formatted)}</strong>
              </div>
            `;
          }).join("")}
        `;

        APP.events.emit("calculator:displayed", {
          id,
          calculation
        });

      } catch (error) {
        notify(error.message, "error");
      }
    });

    openModal(definition.name, form);
  }

  /* -------------------------------------------------------
     ACADEMY
  ------------------------------------------------------- */

  function renderAcademy() {
    const articles = APP.articles?.getAll() || [];
    const progress = APP.data.getProgress();

    const read = Object.values(progress.articles || {})
      .filter(Boolean).length;

    const percentage = articles.length
      ? Math.min(100, Math.round(read / articles.length * 100))
      : 0;

    return `
      ${renderPageHeader(
        "VoltLab Academy",
        "Tvoje místo pro systematické studium elektroniky."
      )}

      <div class="panel progress-panel">
        <h2>Studijní postup</h2>
        <p>${read} z ${articles.length} článků dokončeno</p>
        <div class="progress-track">
          <div class="progress-fill" style="width:${percentage}%"></div>
        </div>
        <strong>${percentage} %</strong>
      </div>

      <div class="card-grid">
        ${[
          ["Základy elektřiny", "Napětí, proud, odpor a výkon.", "basics"],
          ["Elektrické obvody", "Sériové a paralelní zapojení.", "circuits"],
          ["Elektronické součástky", "Rezistory, diody a tranzistory.", "components"],
          ["Digitální technika", "Logické obvody a binární systém.", "digital"],
          ["Měření", "Multimetry a osciloskopy.", "measurement"],
          ["Praktické projekty", "Vyzkoušej si znalosti v praxi.", "projects"]
        ].map(item => `
          <article class="panel academy-card">
            <h3>${escape(item[0])}</h3>
            <p>${escape(item[1])}</p>
            <button
              class="secondary-button"
              data-action="academy-category"
              data-category="${escape(item[2])}"
            >
              Začít studovat
            </button>
          </article>
        `).join("")}
      </div>
    `;
  }

  /* -------------------------------------------------------
     WIKI
  ------------------------------------------------------- */

  function renderWiki() {
    const components = APP.components?.getAll() || [];

    return `
      ${renderPageHeader(
        "Elektronická wiki",
        "Rychlá orientace v elektronických součástkách a pojmech."
      )}

      <div class="wiki-grid">
        ${components.map(item => `
          <button
            class="panel wiki-card"
            data-action="open-component"
            data-id="${escape(item.id)}"
          >
            <strong>${escape(item.name)}</strong>
            <small>${escape(item.type)}</small>
          </button>
        `).join("")}
      </div>
    `;
  }

  /* -------------------------------------------------------
     FORMULAS
  ------------------------------------------------------- */

  function renderFormulas() {
    const formulas = [
      ["Ohmův zákon", "U = R × I"],
      ["Elektrický výkon", "P = U × I"],
      ["Elektrická energie", "E = P × t"],
      ["Sériový odpor", "R = R₁ + R₂"],
      ["Paralelní odpor", "1/R = 1/R₁ + 1/R₂"],
      ["Dělič napětí", "Uout = Uin × R₂ / (R₁ + R₂)"],
      ["RC časová konstanta", "τ = R × C"],
      ["Energie kondenzátoru", "E = ½ × C × U²"],
      ["Energie cívky", "E = ½ × L × I²"],
      ["Induktivní reaktance", "XL = 2πfL"],
      ["Kapacitní reaktance", "XC = 1 / (2πfC)"],
      ["Frekvence", "f = 1 / T"]
    ];

    return `
      ${renderPageHeader(
        "Vzorcovník",
        "Přehled základních vztahů používaných v elektronice."
      )}

      <div class="wiki-grid">
        ${formulas.map(item => `
          <article class="panel formula-card">
            <h3>${escape(item[0])}</h3>
            <div class="formula-preview">${escape(item[1])}</div>
          </article>
        `).join("")}
      </div>
    `;
  }

  /* -------------------------------------------------------
     JOURNAL
  ------------------------------------------------------- */

  function getJournal() {
    return APP.storage.get(APP.storageKeys.journal, []);
  }

  function renderJournal() {
    const entries = getJournal();

    return `
      ${renderPageHeader(
        "Můj elektronický zápisník",
        "Ukládej si poznámky, nápady a výsledky experimentů."
      )}

      <div class="panel journal-editor">
        <h2>Nová poznámka</h2>

        <form id="journal-form">
          <label class="form-field">
            <span>Nadpis</span>
            <input name="title" required maxlength="120" />
          </label>

          <label class="form-field">
            <span>Text poznámky</span>
            <textarea name="content" rows="5" required></textarea>
          </label>

          <button type="submit" class="primary-button">
            Uložit poznámku
          </button>
        </form>
      </div>

      <div class="journal-list">
        ${entries.map(entry => `
          <article class="panel journal-entry">
            <div class="section-heading">
              <h3>${escape(entry.title)}</h3>
              <button
                class="text-button"
                data-action="delete-journal"
                data-id="${escape(entry.id)}"
              >
                Smazat
              </button>
            </div>
            <small>${formatDate(entry.createdAt)}</small>
            <p>${escape(entry.content)}</p>
          </article>
        `).join("") || renderEmpty(
          "Zápisník je prázdný",
          "Vytvoř si první poznámku."
        )}
      </div>
    `;
  }

  function saveJournalEntry(form) {
    const data = new FormData(form);

    const title = String(data.get("title") || "").trim();
    const content = String(data.get("content") || "").trim();

    if (!title || !content) {
      notify("Vyplň nadpis i obsah.", "error");
      return;
    }

    const entries = getJournal();

    entries.unshift({
      id: APP.utils.id("note"),
      title,
      content,
      createdAt: Date.now()
    });

    APP.storage.set(APP.storageKeys.journal, entries);

    notify("Poznámka byla uložena.");

    renderPage("journal");
  }

  function deleteJournalEntry(id) {
    const entries = getJournal().filter(item => item.id !== id);

    APP.storage.set(APP.storageKeys.journal, entries);

    notify("Poznámka byla odstraněna.");

    renderPage("journal");
  }

  /* -------------------------------------------------------
     SETTINGS
  ------------------------------------------------------- */

  function renderSettings() {
    const settings = APP.data.settings;

    return `
      ${renderPageHeader(
        "Nastavení VoltLabu",
        "Přizpůsob si prostředí podle svých potřeb."
      )}

      <div class="settings-grid">

        <section class="panel settings-card">
          <h2>Vzhled</h2>

          <label class="form-field">
            <span>Motiv</span>
            <select id="setting-theme">
              <option value="dark" ${settings.theme === "dark" ? "selected" : ""}>Tmavý</option>
              <option value="light" ${settings.theme === "light" ? "selected" : ""}>Světlý</option>
            </select>
          </label>

          <label class="form-field">
            <span>Akcentní barva</span>
            <select id="setting-accent">
              <option value="green">Zelená</option>
              <option value="teal">Tyrkysová</option>
              <option value="blue">Modrá</option>
              <option value="purple">Fialová</option>
            </select>
          </label>

          <label class="form-field">
            <span>Velikost písma</span>
            <select id="setting-font">
              <option value="small">Malá</option>
              <option value="normal">Normální</option>
              <option value="large">Velká</option>
            </select>
          </label>

          <label class="checkbox-row">
            <input
              type="checkbox"
              id="setting-motion"
              ${settings.reduceMotion ? "checked" : ""}
            />
            Omezit animace
          </label>

          <button class="primary-button" data-action="save-settings">
            Uložit nastavení
          </button>
        </section>

        <section class="panel settings-card">
          <h2>Data a zálohování</h2>
          <p>Vytvoř si zálohu svých dat nebo ji obnov.</p>

          <button
            class="secondary-button"
            data-action="export-backup"
          >
            Exportovat zálohu
          </button>

          <label class="secondary-button file-button">
            Importovat zálohu
            <input
              type="file"
              id="backup-import"
              accept=".json,application/json"
              hidden
            />
          </label>

          <button
            class="danger-button"
            data-action="reset-data"
          >
            Vymazat data VoltLabu
          </button>
        </section>

        <section class="panel settings-card">
          <h2>Informace</h2>
          <p>VoltLab V4 MAX</p>
          <p>Verze ${escape(APP.version || "4.0.0")}</p>
          <p>Data jsou ukládána v tomto prohlížeči.</p>
        </section>

      </div>
    `;
  }

  function saveSettings() {
    const current = APP.data.settings;

    const updated = {
      ...current,
      theme: $("#setting-theme")?.value || current.theme,
      accent: $("#setting-accent")?.value || current.accent,
      fontSize: $("#setting-font")?.value || current.fontSize,
      reduceMotion: $("#setting-motion")?.checked ?? current.reduceMotion
    };

    APP.data.saveSettings(updated);
    APP.applySettings();

    notify("Nastavení bylo uloženo.");

    renderPage("settings");
  }

  /* -------------------------------------------------------
     OTHER WORKSPACES
  ------------------------------------------------------- */

  function renderWorkspace(id, title, description, icon) {
    return `
      ${renderPageHeader(title, description)}

      <div class="panel workspace-placeholder">
        <div class="workspace-icon">${escape(icon)}</div>
        <h2>${escape(title)}</h2>
        <p>${escape(description)}</p>
        <p>
          Toto pracovní prostředí má vlastní stránku a připravené
          místo pro jeho specializované nástroje.
        </p>
      </div>
    `;
  }

  /* -------------------------------------------------------
     PAGE RENDERER
  ------------------------------------------------------- */

  function renderPage(id) {
    const content = getPageContent(id);

    if (!content) return;

    const renderers = {
      dashboard: renderDashboard,
      academy: renderAcademy,
      articles: renderArticles,
      wiki: renderWiki,
      formulas: renderFormulas,
      calculators: renderCalculators,
      components: renderComponents,
      projects: renderProjects,
      journal: renderJournal,
      settings: renderSettings,

      "circuit-studio": () => renderWorkspace(
        id,
        "Circuit Studio",
        "Pracovní prostor pro návrh a experimentování s obvody.",
        "🔧"
      ),

      "pcb-studio": () => renderWorkspace(
        id,
        "PCB Studio",
        "Pracovní prostor pro návrh plošných spojů.",
        "▧"
      ),

      "signal-lab": () => renderWorkspace(
        id,
        "Signal Lab",
        "Experimentuj s frekvencí, amplitudou a průběhy signálů.",
        "〰️"
      ),

      "logic-lab": () => renderWorkspace(
        id,
        "Logic Lab",
        "Prozkoumej logické hradla a digitální obvody.",
        "⊙"
      ),

      "code-lab": () => renderWorkspace(
        id,
        "Code Lab",
        "Pracovní prostor pro elektronické programování.",
        "⌘"
      ),

      admin: () => renderWorkspace(
        id,
        "Administrace",
        "Správa obsahu a vlastních dat.",
        "⚙"
      )
    };

    const renderer = renderers[id];

    if (renderer) {
      content.innerHTML = renderer();
    }

    APP.events.emit("page:rendered", { page: id });
  }

  /* -------------------------------------------------------
     GLOBAL SEARCH
  ------------------------------------------------------- */

  function globalSearch(query) {
    const q = String(query).trim();

    if (!q) return [];

    const results = [];

    (APP.articles?.search(q) || []).forEach(item => {
      results.push({
        type: "Článek",
        title: item.title,
        description: item.excerpt,
        action: "open-article",
        id: item.id
      });
    });

    (APP.projects?.search(q) || []).forEach(item => {
      results.push({
        type: "Projekt",
        title: item.title,
        description: item.description,
        action: "open-project",
        id: item.id
      });
    });

    (APP.components?.search(q) || []).forEach(item => {
      results.push({
        type: "Součástka",
        title: item.name,
        description: item.description,
        action: "open-component",
        id: item.id
      });
    });

    (APP.calculators?.search(q) || []).forEach(item => {
      results.push({
        type: "Kalkulačka",
        title: item.name,
        description: item.description,
        action: "open-calculator",
        id: item.id
      });
    });

    return results;
  }

  function renderSearchResults(query) {
    const results = globalSearch(query);

    const content = results.map(item => `
      <button
        class="search-result"
        data-action="${escape(item.action)}"
        data-id="${escape(item.id)}"
      >
        <span class="category-label">${escape(item.type)}</span>
        <strong>${escape(item.title)}</strong>
        <small>${escape(item.description)}</small>
      </button>
    `).join("");

    openModal(
      `Výsledky hledání: ${query}`,
      content || renderEmpty(
        "Nic jsme nenašli",
        "Zkus jiné hledané slovo."
      )
    );
  }

  /* -------------------------------------------------------
     FAVORITES
  ------------------------------------------------------- */

  function renderFavorites() {
    const favorites = APP.data.getFavorites();

    return favorites;
  }

  /* -------------------------------------------------------
     EVENT DELEGATION
  ------------------------------------------------------- */

  document.addEventListener("click", event => {
    const button = event.target.closest("[data-action]");

    if (!button) return;

    const action = button.dataset.action;
    const id = button.dataset.id;

    switch (action) {
      case "open-article":
        openArticle(id);
        break;

      case "open-project":
        openProject(id);
        break;

      case "open-component":
        openComponent(id);
        break;

      case "open-calculator":
        openCalculator(id);
        break;

      case "save-settings":
        saveSettings();
        break;

      case "delete-journal":
        deleteJournalEntry(id);
        break;

      case "clear-calculator-history":
        if (confirm("Opravdu vymazat historii výpočtů?")) {
          APP.calculators.clearHistory();
          renderPage("calculators");
          notify("Historie byla vymazána.");
        }
        break;

      case "remove-calculation":
        APP.calculators.removeHistoryItem(id);
        renderPage("calculators");
        break;

      case "toggle-component-favorite":
        APP.components.toggleFavorite(id);
        openComponent(id);
        break;

      case "filter-component":
        searchQuery = "";
        showPage("components");

        const selected = APP.components.getByCategory(
          button.dataset.category
        );

        const page = getPageContent("components");

        if (page) {
          const grid = $(".component-grid", page);

          if (grid) {
            grid.innerHTML = selected.map(item => `
              <article class="panel component-card">
                <h3>${escape(item.name)}</h3>
                <p>${escape(item.description)}</p>
                <button
                  class="secondary-button"
                  data-action="open-component"
                  data-id="${escape(item.id)}"
                >
                  Detail součástky
                </button>
              </article>
            `).join("");
          }
        }
        break;

      case "academy-category":
        searchQuery = button.dataset.category;
        showPage("articles");
        break;

      case "export-backup":
        APP.backup.export();
        notify("Záloha byla připravena.");
        break;

      case "reset-data":
        if (confirm(
          "Opravdu vymazat všechna lokální data VoltLabu? Tato akce je nevratná."
        )) {
          APP.storage.clearVoltLabData();
          location.reload();
        }
        break;
    }
  });

  /* -------------------------------------------------------
     FORM EVENTS
  ------------------------------------------------------- */

  document.addEventListener("submit", event => {
    if (event.target.id === "journal-form") {
      event.preventDefault();
      saveJournalEntry(event.target);
    }
  });

  /* -------------------------------------------------------
     INPUT EVENTS
  ------------------------------------------------------- */

  document.addEventListener("input", event => {
    const input = event.target;

    if (
      input.id === "article-search" ||
      input.id === "project-search" ||
      input.id === "component-search" ||
      input.id === "calculator-search"
    ) {
      searchQuery = input.value;

      const page = activePage;
      const position = input.selectionStart;

      renderPage(page);

      const refreshed = $(`#${input.id}`);

      if (refreshed) {
        refreshed.focus();
        refreshed.setSelectionRange(position, position);
      }
    }
  });

  /* -------------------------------------------------------
     GLOBAL SEARCH FORM
  ------------------------------------------------------- */

  function bindGlobalSearch() {
    const search = $(
      "#global-search, #header-search, .header-search input"
    );

    if (!search) return;

    search.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        event.preventDefault();
        renderSearchResults(search.value);
      }
    });
  }

  /* -------------------------------------------------------
     BACKUP IMPORT
  ------------------------------------------------------- */

  document.addEventListener("change", async event => {
    if (event.target.id !== "backup-import") return;

    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      APP.backup.restore(data);

      notify("Záloha byla obnovena.");

      location.reload();

    } catch (error) {
      notify(
        `Import se nezdařil: ${error.message}`,
        "error"
      );
    } finally {
      event.target.value = "";
    }
  });

  /* -------------------------------------------------------
     KEYBOARD SHORTCUTS
  ------------------------------------------------------- */

  document.addEventListener("keydown", event => {
    const target = event.target;

    const typing =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement ||
      target.isContentEditable;

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();

      const search = $(
        "#global-search, #header-search, .header-search input"
      );

      if (search) {
        search.focus();
      } else {
        openModal(
          "Rychlé hledání",
          `
            <input
              type="search"
              id="command-search"
              placeholder="Hledat v celém VoltLabu..."
              autofocus
            />
            <div id="command-results"></div>
          `
        );

        const input = $("#command-search");

        input?.addEventListener("input", () => {
          const results = globalSearch(input.value);

          $("#command-results").innerHTML = results.map(item => `
            <button
              class="search-result"
              data-action="${escape(item.action)}"
              data-id="${escape(item.id)}"
            >
              <strong>${escape(item.title)}</strong>
              <small>${escape(item.type)}</small>
            </button>
          `).join("");
        });
      }

      return;
    }

    if (typing) return;

    if (event.key === "Escape") {
      closeModal();
      return;
    }

    const shortcuts = {
      "1": "dashboard",
      "2": "articles",
      "3": "calculators",
      "4": "components",
      "5": "projects"
    };

    if (shortcuts[event.key]) {
      showPage(shortcuts[event.key]);
    }
  });

  /* -------------------------------------------------------
     SETTINGS EVENTS
  ------------------------------------------------------- */

  document.addEventListener("click", event => {
    const target = event.target;

    if (target.id === "save-settings") {
      saveSettings();
    }
  });

  /* -------------------------------------------------------
     APPLICATION INITIALIZATION
  ------------------------------------------------------- */

  function init() {
    bindNavigation();
    bindGlobalSearch();

    const storedPage = APP.storage.get(
      "voltlab_v4_last_page",
      APP.data.settings.startPage || "dashboard"
    );

    const hashPage = location.hash.replace("#", "");

    const initialPage = pageExists(hashPage)
      ? hashPage
      : pageExists(storedPage)
        ? storedPage
        : "dashboard";

    showPage(initialPage, { updateHash: false });

    APP.events.emit("main:ready");

    console.info("[VoltLab] Main application initialized.");
  }

  APP.main = {
    init,
    showPage,
    renderPage,
    notify,
    openModal,
    closeModal,
    globalSearch,
    renderFavorites,
    get activePage() {
      return activePage;
    },
    get pages() {
      return pageDefinitions;
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

})();
