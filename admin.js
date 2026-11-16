/**
 * VoltLab V5 — Administrace a správa obsahu
 */

export class AdminController {
  constructor(store, showToast) {
    this.store = store;
    this.showToast = showToast;
    this.activeTab = 'articles';
    this.editingArticleId = null;
    this.editingProjectId = null;
  }

  init() {
    this.bindEvents();
    this.store.subscribe(() => this.render());
    this.render();
  }

  bindEvents() {
    document.querySelectorAll('[data-admin-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.activeTab = btn.dataset.adminTab;
        this.render();
      });
    });

    // Supabase Auth přihlášení
    const authForm = document.getElementById('admin-auth-form');
    if (authForm) {
      authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('admin-email').value.trim();
        const password = document.getElementById('admin-password').value;
        try {
          await this.store.loginWithSupabase(email, password);
          authForm.reset();
          this.showToast('Úspěšně ověřeno přes Supabase Auth.');
        } catch (err) {
          this.showToast(`Chyba přihlášení: ${err.message}`);
        }
      });
    }

    // Odhlášení
    const logoutBtn = document.getElementById('admin-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        await this.store.logoutSupabase();
        this.showToast('Administrátor byl odhlášen.');
      });
    }

    // Uložení konfigurace Supabase
    const cfgForm = document.getElementById('supabase-config-form');
    if (cfgForm) {
      cfgForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const url = document.getElementById('sb-url').value;
        const key = document.getElementById('sb-anon-key').value;
        this.store.saveSupabaseConfig(url, key);
        this.showToast('Konfigurace Supabase byla aktualizována.');
      });
    }

    // Formulář článku
    const articleForm = document.getElementById('admin-article-form');
    if (articleForm) {
      articleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('art-title').value.trim();
        const category = document.getElementById('art-category').value;
        const author = document.getElementById('art-author').value.trim() || 'Redakce VoltLab';
        const readTime = document.getElementById('art-readtime').value.trim() || '6 min';
        const summary = document.getElementById('art-summary').value.trim();
        const rawBody = document.getElementById('art-content').value.trim();
        const tagsRaw = document.getElementById('art-tags').value.trim();

        if (!title || !summary || !rawBody) {
          this.showToast('Vyplňte název, perex i text článku.');
          return;
        }

        const article = {
          id: this.editingArticleId || `art-${Date.now()}`,
          title,
          category,
          date: new Date().toISOString().slice(0, 10),
          readTime,
          author,
          featured: false,
          summary,
          content: rawBody.split(/\n+/).map((p) => p.trim()).filter(Boolean),
          tags: tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : ['VoltLab']
        };

        try {
          await this.store.upsertArticle(article);
          this.resetArticleForm();
          this.showToast('Článek byl uložen.');
        } catch (err) {
          this.showToast(err.message);
        }
      });
    }

    document.getElementById('art-cancel-edit')?.addEventListener('click', () => {
      this.resetArticleForm();
    });

    // Formulář projektu
    const projectForm = document.getElementById('admin-project-form');
    if (projectForm) {
      projectForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('proj-title').value.trim();
        const category = document.getElementById('proj-category').value;
        const status = document.getElementById('proj-status').value;
        const difficulty = document.getElementById('proj-difficulty').value;
        const progress = Math.min(100, Math.max(0, Number(document.getElementById('proj-progress').value) || 0));
        const summary = document.getElementById('proj-summary').value.trim();
        const specsRaw = document.getElementById('proj-specs').value.trim();
        const repo = document.getElementById('proj-repo').value.trim();

        if (!title || !summary) {
          this.showToast('Vyplňte název a popis projektu.');
          return;
        }

        const project = {
          id: this.editingProjectId || `proj-${Date.now()}`,
          title,
          category,
          status,
          difficulty,
          progress,
          date: new Date().toISOString().slice(0, 10),
          summary,
          specs: specsRaw ? specsRaw.split(/\n+/).map((s) => s.trim()).filter(Boolean) : [],
          repo: repo || 'https://github.com/voltlab-dev'
        };

        try {
          await this.store.upsertProject(project);
          this.resetProjectForm();
          this.showToast('Projekt byl uložen.');
        } catch (err) {
          this.showToast(err.message);
        }
      });
    }

    document.getElementById('proj-cancel-edit')?.addEventListener('click', () => {
      this.resetProjectForm();
    });

    // Formulář kategorie
    const catForm = document.getElementById('admin-category-form');
    if (catForm) {
      catForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('cat-name').value.trim();
        const description = document.getElementById('cat-desc').value.trim();
        if (!name) return;
        const id = name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-');
        this.store.upsertCategory({ id, name, icon: 'cpu', description: description || 'Technická kategorie VoltLab.' });
        catForm.reset();
        this.showToast(`Kategorie „${name}“ byla přidána.`);
      });
    }

    // Export / Import / Reset
    document.getElementById('admin-export-btn')?.addEventListener('click', () => {
      const blob = new Blob([this.store.exportJSON()], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `voltlab-v5-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      this.showToast('Export dat do JSON dokončen.');
    });

    document.getElementById('admin-import-input')?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          this.store.importJSON(String(reader.result));
          this.showToast('Data byla úspěšně importována.');
        } catch (err) {
          this.showToast(`Chyba importu: ${err.message}`);
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    });

    document.getElementById('admin-reset-btn')?.addEventListener('click', async () => {
      if (window.confirm('Opravdu chcete obnovit výchozí data VoltLab V5? Lokální změny budou přepsány.')) {
        await this.store.resetToSeed();
        this.showToast('Výchozí data byla obnovena.');
      }
    });
  }

  resetArticleForm() {
    this.editingArticleId = null;
    document.getElementById('admin-article-form')?.reset();
    const submitBtn = document.getElementById('art-submit-btn');
    if (submitBtn) submitBtn.textContent = 'Publikovat článek';
  }

  resetProjectForm() {
    this.editingProjectId = null;
    document.getElementById('admin-project-form')?.reset();
    const submitBtn = document.getElementById('proj-submit-btn');
    if (submitBtn) submitBtn.textContent = 'Uložit projekt';
  }

  render() {
    const banner = document.getElementById('admin-security-banner');
    const authBox = document.getElementById('admin-auth-box');
    const logoutBtn = document.getElementById('admin-logout-btn');

    if (banner) {
      if (this.store.isServerAuthenticated()) {
        banner.className = 'security-notice authenticated';
        banner.innerHTML = `<strong>Produkční režim (Supabase Auth aktivní):</strong> Přihlášen jako <code>${this.store.authSession.user?.email || 'Administrátor'}</code>. Zápis je chráněn serverovým Row Level Security (RLS).`;
        if (authBox) authBox.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'inline-flex';
      } else if (this.store.isSupabaseConfigured()) {
        banner.className = 'security-notice';
        banner.innerHTML = `<strong>Backend připojen, čeká na přihlášení:</strong> Pro zápis na server se přihlaste účtem Supabase Auth. Neověřené úpravy zůstanou pouze v lokálním prohlížeči.`;
        if (authBox) authBox.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none';
      } else {
        banner.className = 'security-notice';
        banner.innerHTML = `<strong>Nedokončené produkční zabezpečení (Lokální Sandbox režim):</strong> Backend Supabase není nakonfigurován. Na statickém hostingu GitHub Pages se změny ukládají výhradně do <code>localStorage</code> vašeho prohlížeče a nemění veřejný obsah pro ostatní návštěvníky.`;
        if (authBox) authBox.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';
      }
    }

    const sbUrlInput = document.getElementById('sb-url');
    const sbKeyInput = document.getElementById('sb-anon-key');
    if (sbUrlInput && this.store.supabaseConfig && !sbUrlInput.value) {
      sbUrlInput.value = this.store.supabaseConfig.url;
    }
    if (sbKeyInput && this.store.supabaseConfig && !sbKeyInput.value) {
      sbKeyInput.value = this.store.supabaseConfig.anonKey;
    }

    document.querySelectorAll('[data-admin-tab]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.adminTab === this.activeTab);
    });
    document.querySelectorAll('[data-admin-panel]').forEach((panel) => {
      panel.style.display = panel.dataset.adminPanel === this.activeTab ? 'block' : 'none';
    });

    const catOptions = this.store.data.categories
      .map((c) => `<option value="${c.id}">${c.name}</option>`)
      .join('');
    const artCatSelect = document.getElementById('art-category');
    const projCatSelect = document.getElementById('proj-category');
    if (artCatSelect) artCatSelect.innerHTML = catOptions;
    if (projCatSelect) projCatSelect.innerHTML = catOptions;

    this.renderArticlesTable();
    this.renderProjectsTable();
    this.renderCategoriesTable();
  }

  renderArticlesTable() {
    const tbody = document.getElementById('admin-articles-tbody');
    if (!tbody) return;
    tbody.innerHTML = this.store.data.articles
      .map(
        (art) => `
      <tr>
        <td><strong>${art.title}</strong></td>
        <td><span class="badge">${art.category}</span></td>
        <td>${art.date}</td>
        <td>
          <div style="display:flex;gap:0.4rem;">
            <button type="button" class="btn btn-secondary btn-sm" data-edit-art="${art.id}">Upravit</button>
            <button type="button" class="btn btn-danger btn-sm" data-del-art="${art.id}">Smazat</button>
          </div>
        </td>
      </tr>`
      )
      .join('');

    tbody.querySelectorAll('[data-edit-art]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const art = this.store.data.articles.find((a) => a.id === btn.dataset.editArt);
        if (!art) return;
        this.editingArticleId = art.id;
        document.getElementById('art-title').value = art.title;
        document.getElementById('art-category').value = art.category;
        document.getElementById('art-author').value = art.author;
        document.getElementById('art-readtime').value = art.readTime;
        document.getElementById('art-summary').value = art.summary;
        document.getElementById('art-content').value = art.content.join('\n\n');
        document.getElementById('art-tags').value = (art.tags || []).join(', ');
        document.getElementById('art-submit-btn').textContent = 'Uložit změny článku';
        document.getElementById('admin-article-form').scrollIntoView({ behavior: 'smooth' });
      });
    });

    tbody.querySelectorAll('[data-del-art]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (window.confirm('Opravdu chcete odstranit tento článek?')) {
          try {
            await this.store.deleteArticle(btn.dataset.delArt);
            this.showToast('Článek byl odstraněn.');
          } catch (err) {
            this.showToast(err.message);
          }
        }
      });
    });
  }

  renderProjectsTable() {
    const tbody = document.getElementById('admin-projects-tbody');
    if (!tbody) return;
    tbody.innerHTML = this.store.data.projects
      .map(
        (proj) => `
      <tr>
        <td><strong>${proj.title}</strong></td>
        <td><span class="badge badge-lime">${proj.status}</span></td>
        <td>${proj.progress} %</td>
        <td>
          <div style="display:flex;gap:0.4rem;">
            <button type="button" class="btn btn-secondary btn-sm" data-edit-proj="${proj.id}">Upravit</button>
            <button type="button" class="btn btn-danger btn-sm" data-del-proj="${proj.id}">Smazat</button>
          </div>
        </td>
      </tr>`
      )
      .join('');

    tbody.querySelectorAll('[data-edit-proj]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const proj = this.store.data.projects.find((p) => p.id === btn.dataset.editProj);
        if (!proj) return;
        this.editingProjectId = proj.id;
        document.getElementById('proj-title').value = proj.title;
        document.getElementById('proj-category').value = proj.category;
        document.getElementById('proj-status').value = proj.status;
        document.getElementById('proj-difficulty').value = proj.difficulty;
        document.getElementById('proj-progress').value = proj.progress;
        document.getElementById('proj-summary').value = proj.summary;
        document.getElementById('proj-specs').value = (proj.specs || []).join('\n');
        document.getElementById('proj-repo').value = proj.repo || '';
        document.getElementById('proj-submit-btn').textContent = 'Uložit změny projektu';
        document.getElementById('admin-project-form').scrollIntoView({ behavior: 'smooth' });
      });
    });

    tbody.querySelectorAll('[data-del-proj]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (window.confirm('Opravdu chcete odstranit tento projekt?')) {
          try {
            await this.store.deleteProject(btn.dataset.delProj);
            this.showToast('Projekt byl odstraněn.');
          } catch (err) {
            this.showToast(err.message);
          }
        }
      });
    });
  }

  renderCategoriesTable() {
    const tbody = document.getElementById('admin-categories-tbody');
    if (!tbody) return;
    tbody.innerHTML = this.store.data.categories
      .map(
        (cat) => `
      <tr>
        <td><strong>${cat.name}</strong></td>
        <td><code>${cat.id}</code></td>
        <td>${cat.description}</td>
        <td>
          <button type="button" class="btn btn-danger btn-sm" data-del-cat="${cat.id}">Smazat</button>
        </td>
      </tr>`
      )
      .join('');

    tbody.querySelectorAll('[data-del-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (window.confirm('Smazat tuto kategorii?')) {
          this.store.deleteCategory(btn.dataset.delCat);
          this.showToast('Kategorie odstraněna.');
        }
      });
    });
  }
}
