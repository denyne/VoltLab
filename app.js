/**
 * VoltLab V5 — Main Application Controller
 */

import { VoltLabStore } from './store.js';
import { initEngineeringTools } from './tools.js';
import { AdminController } from './admin.js';

const store = new VoltLabStore();

const uiState = {
  articleCategory: 'all',
  articleSort: 'newest',
  onlyBookmarkedArticles: false,
  projectCategory: 'all',
  projectDifficulty: 'all',
  globalQuery: ''
};

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    setTimeout(() => toast.remove(), 220);
  }, 3200);
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function getCategoryName(catId) {
  const found = store.data.categories.find((c) => c.id === catId);
  return found ? found.name : catId;
}

function renderStats() {
  const artCount = document.getElementById('stat-articles');
  const projCount = document.getElementById('stat-projects');
  const catCount = document.getElementById('stat-categories');
  const favCount = document.getElementById('stat-bookmarks');

  if (artCount) artCount.textContent = store.data.articles.length;
  if (projCount) projCount.textContent = store.data.projects.length;
  if (catCount) catCount.textContent = store.data.categories.length;
  if (favCount) favCount.textContent = store.bookmarks.size;
}

function renderCategories() {
  const grid = document.getElementById('categories-grid');
  if (!grid) return;

  grid.innerHTML = store.data.categories
    .map((cat) => {
      const count =
        store.data.articles.filter((a) => a.category === cat.id).length +
        store.data.projects.filter((p) => p.category === cat.id).length;

      return `
      <button type="button" class="category-card" data-select-category="${cat.id}">
        <div class="card-icon-box">${cat.name.slice(0, 2).toUpperCase()}</div>
        <h3>${cat.name}</h3>
        <p class="card-excerpt">${cat.description}</p>
        <div class="category-meta">
          <span>${count} položek</span>
          <span>Filtrovat →</span>
        </div>
      </button>`;
    })
    .join('');

  grid.querySelectorAll('[data-select-category]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const catId = btn.dataset.selectCategory;
      uiState.articleCategory = catId;
      uiState.projectCategory = catId;
      renderAllContent();
      document.getElementById('articles-section')?.scrollIntoView({ behavior: 'smooth' });
      showToast(`Zobrazena kategorie: ${getCategoryName(catId)}`);
    });
  });

  const artPills = document.getElementById('article-filter-pills');
  if (artPills) {
    const items = [{ id: 'all', name: 'Vše' }, ...store.data.categories];
    artPills.innerHTML = items
      .map(
        (c) =>
          `<button type="button" class="pill-btn ${uiState.articleCategory === c.id ? 'active' : ''}" data-art-cat="${c.id}">${c.name}</button>`
      )
      .join('');

    artPills.querySelectorAll('[data-art-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        uiState.articleCategory = btn.dataset.artCat;
        renderAllContent();
      });
    });
  }

  const projPills = document.getElementById('project-filter-pills');
  if (projPills) {
    const items = [{ id: 'all', name: 'Všechny oblasti' }, ...store.data.categories];
    projPills.innerHTML = items
      .map(
        (c) =>
          `<button type="button" class="pill-btn ${uiState.projectCategory === c.id ? 'active' : ''}" data-proj-cat="${c.id}">${c.name}</button>`
      )
      .join('');

    projPills.querySelectorAll('[data-proj-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        uiState.projectCategory = btn.dataset.projCat;
        renderAllContent();
      });
    });
  }
}

function renderArticles() {
  const grid = document.getElementById('articles-grid');
  if (!grid) return;

  let list = [...store.data.articles];

  if (uiState.articleCategory !== 'all') {
    list = list.filter((a) => a.category === uiState.articleCategory);
  }
  if (uiState.onlyBookmarkedArticles) {
    list = list.filter((a) => store.isBookmarked(a.id));
  }
  if (uiState.globalQuery) {
    const q = uiState.globalQuery.toLowerCase();
    list = list.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        (a.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  }

  list.sort((a, b) => {
    if (uiState.articleSort === 'oldest') return a.date.localeCompare(b.date);
    if (uiState.articleSort === 'title') return a.title.localeCompare(b.title, 'cs');
    return b.date.localeCompare(a.date);
  });

  if (!list.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <h3>Žádné články neodpovídají zvolenému filtru</h3>
        <p style="margin:0.5rem 0 1rem;">Zkuste zrušit filtr kategorie nebo upravit hledaný výraz.</p>
        <button type="button" class="btn btn-secondary btn-sm" id="reset-art-filters">Resetovat filtry článků</button>
      </div>`;
    document.getElementById('reset-art-filters')?.addEventListener('click', () => {
      uiState.articleCategory = 'all';
      uiState.onlyBookmarkedArticles = false;
      uiState.globalQuery = '';
      const searchInput = document.getElementById('global-search-input');
      if (searchInput) searchInput.value = '';
      renderAllContent();
    });
    return;
  }

  grid.innerHTML = list
    .map((art) => {
      const saved = store.isBookmarked(art.id);
      return `
      <article class="content-card">
        <div class="card-top-row">
          <span class="badge">${getCategoryName(art.category)}</span>
          <button type="button" class="bookmark-btn ${saved ? 'saved' : ''}" data-bookmark="${art.id}" aria-label="Uložit do oblíbených" title="Uložit do oblíbených">
            ${saved ? '★' : '☆'}
          </button>
        </div>
        <h3 class="card-title">${art.title}</h3>
        <p class="card-excerpt">${art.summary}</p>
        <div class="card-meta">
          <span>${art.date}</span>
          <span>•</span>
          <span>${art.readTime}</span>
          <span>•</span>
          <span>${art.author}</span>
        </div>
        <div class="card-footer">
          <button type="button" class="btn btn-secondary btn-sm" data-open-article="${art.id}">Otevřít článek</button>
          <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--text-muted);">${(art.tags || []).slice(0, 2).join(' · ')}</span>
        </div>
      </article>`;
    })
    .join('');

  grid.querySelectorAll('[data-bookmark]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const added = store.toggleBookmark(btn.dataset.bookmark);
      showToast(added ? 'Přidáno do oblíbených.' : 'Odebráno z oblíbených.');
    });
  });

  grid.querySelectorAll('[data-open-article]').forEach((btn) => {
    btn.addEventListener('click', () => openArticleDetail(btn.dataset.openArticle));
  });
}

function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  let list = [...store.data.projects];

  if (uiState.projectCategory !== 'all') {
    list = list.filter((p) => p.category === uiState.projectCategory);
  }
  if (uiState.projectDifficulty !== 'all') {
    list = list.filter((p) => p.difficulty === uiState.projectDifficulty);
  }
  if (uiState.globalQuery) {
    const q = uiState.globalQuery.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q)
    );
  }

  if (!list.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <h3>Nenalezeny žádné hardwarové ani softwarové projekty</h3>
        <p style="margin:0.5rem 0 1rem;">Upravte filtr obtížnosti nebo kategorie.</p>
        <button type="button" class="btn btn-secondary btn-sm" id="reset-proj-filters">Zobrazit všechny projekty</button>
      </div>`;
    document.getElementById('reset-proj-filters')?.addEventListener('click', () => {
      uiState.projectCategory = 'all';
      uiState.projectDifficulty = 'all';
      const diffSelect = document.getElementById('project-difficulty-select');
      if (diffSelect) diffSelect.value = 'all';
      renderAllContent();
    });
    return;
  }

  grid.innerHTML = list
    .map((proj) => {
      const saved = store.isBookmarked(proj.id);
      return `
      <article class="content-card">
        <div class="card-top-row">
          <div style="display:flex;gap:0.45rem;flex-wrap:wrap;">
            <span class="badge badge-lime">${proj.status}</span>
            <span class="badge">${getCategoryName(proj.category)}</span>
            <span class="badge badge-warn">${proj.difficulty}</span>
          </div>
          <button type="button" class="bookmark-btn ${saved ? 'saved' : ''}" data-bookmark="${proj.id}" aria-label="Uložit projekt">
            ${saved ? '★' : '☆'}
          </button>
        </div>
        <h3 class="card-title">${proj.title}</h3>
        <p class="card-excerpt">${proj.summary}</p>
        <div class="progress-wrap">
          <div class="progress-label">
            <span>Stav dokončení</span>
            <span>${proj.progress} %</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width:${proj.progress}%"></div>
          </div>
        </div>
        <div class="card-footer">
          <button type="button" class="btn btn-primary btn-sm" data-open-project="${proj.id}">Detail projektu</button>
          <span class="card-meta">${proj.date}</span>
        </div>
      </article>`;
    })
    .join('');

  grid.querySelectorAll('[data-bookmark]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const added = store.toggleBookmark(btn.dataset.bookmark);
      showToast(added ? 'Projekt uložen do oblíbených.' : 'Projekt odebrán z oblíbených.');
    });
  });

  grid.querySelectorAll('[data-open-project]').forEach((btn) => {
    btn.addEventListener('click', () => openProjectDetail(btn.dataset.openProject));
  });
}

function openArticleDetail(id) {
  const art = store.data.articles.find((a) => a.id === id);
  if (!art) return;
  const container = document.getElementById('detail-modal-body');
  if (!container) return;

  container.innerHTML = `
    <div class="modal-header">
      <div>
        <span class="badge" style="margin-bottom:0.6rem;">${getCategoryName(art.category)}</span>
        <h2 style="font-size:1.65rem;line-height:1.25;">${art.title}</h2>
        <div class="card-meta" style="margin-top:0.6rem;">
          <span>Autor: ${art.author}</span>
          <span>•</span>
          <span>Publikováno: ${art.date}</span>
          <span>•</span>
          <span>Čtení: ${art.readTime}</span>
        </div>
      </div>
      <button type="button" class="btn btn-ghost btn-icon" data-close-modal="detail-modal" aria-label="Zavřít">✕</button>
    </div>
    <div class="article-body">
      <p style="font-weight:600;color:var(--text-primary);">${art.summary}</p>
      ${art.content.map((p) => `<p>${p}</p>`).join('')}
    </div>
    <div style="margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
      <div style="display:flex;gap:0.4rem;flex-wrap:wrap;">
        ${(art.tags || []).map((t) => `<span class="badge">#${t}</span>`).join('')}
      </div>
      <button type="button" class="btn btn-secondary btn-sm" id="modal-bookmark-btn">
        ${store.isBookmarked(art.id) ? '★ Uloženo v oblíbených' : '☆ Přidat do oblíbených'}
      </button>
    </div>
  `;

  container.querySelector('[data-close-modal]')?.addEventListener('click', () => closeModal('detail-modal'));
  document.getElementById('modal-bookmark-btn')?.addEventListener('click', () => {
    const added = store.toggleBookmark(art.id);
    showToast(added ? 'Uloženo do oblíbených.' : 'Odebráno z oblíbených.');
    openArticleDetail(art.id);
  });

  openModal('detail-modal');
}

function openProjectDetail(id) {
  const proj = store.data.projects.find((p) => p.id === id);
  if (!proj) return;
  const container = document.getElementById('detail-modal-body');
  if (!container) return;

  container.innerHTML = `
    <div class="modal-header">
      <div>
        <div style="display:flex;gap:0.5rem;margin-bottom:0.6rem;">
          <span class="badge badge-lime">${proj.status}</span>
          <span class="badge">${getCategoryName(proj.category)}</span>
          <span class="badge badge-warn">${proj.difficulty}</span>
        </div>
        <h2 style="font-size:1.65rem;line-height:1.25;">${proj.title}</h2>
      </div>
      <button type="button" class="btn btn-ghost btn-icon" data-close-modal="detail-modal" aria-label="Zavřít">✕</button>
    </div>
    <div class="article-body">
      <p>${proj.summary}</p>
      <h3 style="margin:1.25rem 0 0.75rem;font-size:1.1rem;">Technické specifikace</h3>
      <ul style="padding-left:1.25rem;color:var(--text-secondary);display:grid;gap:0.45rem;margin-bottom:1.5rem;">
        ${(proj.specs || []).map((s) => `<li>${s}</li>`).join('')}
      </ul>
      <div class="progress-wrap" style="margin-bottom:1.5rem;">
        <div class="progress-label"><span>Fáze vývoje</span><span>${proj.progress} %</span></div>
        <div class="progress-track"><div class="progress-fill" style="width:${proj.progress}%"></div></div>
      </div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
      <a href="${proj.repo}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">Repozitář a schémata ↗</a>
      <button type="button" class="btn btn-secondary btn-sm" id="modal-proj-fav">
        ${store.isBookmarked(proj.id) ? '★ Uloženo' : '☆ Uložit projekt'}
      </button>
    </div>
  `;

  container.querySelector('[data-close-modal]')?.addEventListener('click', () => closeModal('detail-modal'));
  document.getElementById('modal-proj-fav')?.addEventListener('click', () => {
    const added = store.toggleBookmark(proj.id);
    showToast(added ? 'Projekt uložen.' : 'Projekt odebrán.');
    openProjectDetail(proj.id);
  });

  openModal('detail-modal');
}

function renderBookmarksModal() {
  const listEl = document.getElementById('bookmarks-list');
  if (!listEl) return;

  const favArticles = store.data.articles.filter((a) => store.isBookmarked(a.id));
  const favProjects = store.data.projects.filter((p) => store.isBookmarked(p.id));

  if (!favArticles.length && !favProjects.length) {
    listEl.innerHTML = `<p style="color:var(--text-secondary);">Zatím nemáte uložené žádné oblíbené články ani projekty. Klikněte na ikonu hvězdičky u libovolné karty.</p>`;
    return;
  }

  listEl.innerHTML = `
    <div style="display:grid;gap:0.85rem;">
      ${favArticles
        .map(
          (a) => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:0.9rem;background:var(--bg-elevated);border-radius:var(--radius-sm);">
          <div>
            <span class="badge" style="margin-bottom:0.25rem;">Článek</span>
            <div><strong>${a.title}</strong></div>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" data-open-fav-art="${a.id}">Číst</button>
        </div>`
        )
        .join('')}
      ${favProjects
        .map(
          (p) => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:0.9rem;background:var(--bg-elevated);border-radius:var(--radius-sm);">
          <div>
            <span class="badge badge-lime" style="margin-bottom:0.25rem;">Projekt</span>
            <div><strong>${p.title}</strong></div>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" data-open-fav-proj="${p.id}">Detail</button>
        </div>`
        )
        .join('')}
    </div>
  `;

  listEl.querySelectorAll('[data-open-fav-art]').forEach((btn) => {
    btn.addEventListener('click', () => {
      closeModal('bookmarks-modal');
      openArticleDetail(btn.dataset.openFavArt);
    });
  });

  listEl.querySelectorAll('[data-open-fav-proj]').forEach((btn) => {
    btn.addEventListener('click', () => {
      closeModal('bookmarks-modal');
      openProjectDetail(btn.dataset.openFavProj);
    });
  });
}

function renderAllContent() {
  renderStats();
  renderCategories();
  renderArticles();
  renderProjects();
  renderBookmarksModal();
}

function initOscilloscopeCanvas() {
  const canvas = document.getElementById('hero-scope-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let phase = 0;

  const draw = () => {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.14)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    ctx.strokeStyle = '#9ef01a';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const t = (x + phase) * 0.045;
      const pwm = Math.sin(t) > 0.15 ? -34 : 34;
      const y = h * 0.45 + pwm + Math.sin(t * 7) * 2.5;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const t = (x + phase) * 0.045;
      const y = h * 0.65 + Math.sin(t - 0.8) * 18;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    if (store.prefs.showTelemetryAnim && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      phase += 1.4;
    }
    requestAnimationFrame(draw);
  };

  draw();
}

async function bootstrap() {
  await store.init();
  uiState.articleSort = store.prefs.defaultSort;

  const admin = new AdminController(store, showToast);
  admin.init();

  store.subscribe(() => renderAllContent());
  renderAllContent();
  initEngineeringTools();
  initOscilloscopeCanvas();

  document.getElementById('theme-toggle-btn')?.addEventListener('click', () => {
    const next = store.toggleTheme();
    showToast(next === 'dark' ? 'Aktivován tmavý laboratorní režim.' : 'Aktivován světlý režim.');
  });

  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  mobileBtn?.addEventListener('click', () => {
    const isOpen = mobileDrawer.classList.toggle('open');
    mobileBtn.setAttribute('aria-expanded', String(isOpen));
  });
  mobileDrawer?.querySelectorAll('a, button').forEach((item) => {
    item.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      mobileBtn?.setAttribute('aria-expanded', 'false');
    });
  });

  const searchInput = document.getElementById('global-search-input');
  searchInput?.addEventListener('input', (e) => {
    uiState.globalQuery = e.target.value.trim();
    renderArticles();
    renderProjects();
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      searchInput?.focus();
    }
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.open').forEach((m) => closeModal(m.id));
    }
  });

  document.getElementById('article-sort-select')?.addEventListener('change', (e) => {
    uiState.articleSort = e.target.value;
    renderArticles();
  });

  document.getElementById('filter-bookmarks-btn')?.addEventListener('click', (e) => {
    uiState.onlyBookmarkedArticles = !uiState.onlyBookmarkedArticles;
    e.currentTarget.classList.toggle('active', uiState.onlyBookmarkedArticles);
    renderArticles();
  });

  document.getElementById('project-difficulty-select')?.addEventListener('change', (e) => {
    uiState.projectDifficulty = e.target.value;
    renderProjects();
  });

  document.getElementById('open-bookmarks-btn')?.addEventListener('click', () => {
    renderBookmarksModal();
    openModal('bookmarks-modal');
  });

  document.getElementById('open-settings-btn')?.addEventListener('click', () => {
    document.getElementById('pref-theme-select').value = store.prefs.theme;
    document.getElementById('pref-sort-select').value = store.prefs.defaultSort;
    document.getElementById('pref-anim-check').checked = store.prefs.showTelemetryAnim;
    openModal('settings-modal');
  });

  document.getElementById('settings-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const theme = document.getElementById('pref-theme-select').value;
    const defaultSort = document.getElementById('pref-sort-select').value;
    const showTelemetryAnim = document.getElementById('pref-anim-check').checked;
    store.updatePreferences({ theme, defaultSort, showTelemetryAnim });
    uiState.articleSort = defaultSort;
    renderArticles();
    closeModal('settings-modal');
    showToast('Uživatelské předvolby byly uloženy.');
  });

  document.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', () => closeModal(btn.dataset.closeModal));
  });

  document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal(backdrop.id);
    });
  });
}

bootstrap();
