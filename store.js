/**
 * VoltLab V5 — State Management, Persistence & Optional Supabase Adapter
 * Bezpečnostní architektura:
 * - Žádná hesla ani tajné klíče v klientském kódu.
 * - Výchozí běh na GitHub Pages ukládá změny pouze do lokální sandbox paměti prohlížeče.
 * - Volitelně lze připojit externí projekt Supabase (veřejná URL + Anon Key) se serverovým RLS.
 */

const STORAGE_KEYS = {
  CONTENT: 'voltlab_v5_content',
  PREFS: 'voltlab_v5_prefs',
  BOOKMARKS: 'voltlab_v5_bookmarks',
  SUPABASE_CFG: 'voltlab_v5_supabase_cfg',
  SUPABASE_SESSION: 'voltlab_v5_supabase_session'
};

const DEFAULT_PREFS = {
  theme: 'dark',
  compactCards: false,
  defaultSort: 'newest',
  showTelemetryAnim: true
};

export class VoltLabStore {
  constructor() {
    this.data = {
      categories: [],
      articles: [],
      projects: []
    };
    this.prefs = { ...DEFAULT_PREFS };
    this.bookmarks = new Set();
    this.supabaseConfig = null;
    this.authSession = null;
    this.listeners = new Set();
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  notify() {
    this.listeners.forEach((fn) => fn(this));
  }

  async init() {
    this.loadPreferences();
    this.loadBookmarks();
    this.loadSupabaseConfig();

    const cached = localStorage.getItem(STORAGE_KEYS.CONTENT);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && Array.isArray(parsed.articles) && Array.isArray(parsed.projects)) {
          this.data = parsed;
        }
      } catch (e) {
        console.warn('VoltLab: Poškozená lokální mezipaměť, načítám výchozí seed.', e);
      }
    }

    if (!this.data.articles.length) {
      await this.loadSeedData();
    }

    // Pokud je nakonfigurován Supabase, pokusíme se načíst veřejná data ze serveru
    if (this.isSupabaseConfigured()) {
      await this.syncFromSupabase();
    }

    this.applyTheme();
    this.notify();
  }

  async loadSeedData() {
    try {
      const response = await fetch('./data/seed.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const seed = await response.json();
      this.data = seed;
      this.saveContentLocal();
    } catch (err) {
      console.error('VoltLab: Nepodařilo se načíst seed.json:', err);
    }
  }

  saveContentLocal() {
    localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(this.data));
  }

  loadPreferences() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PREFS);
      if (raw) {
        this.prefs = { ...DEFAULT_PREFS, ...JSON.parse(raw) };
      }
    } catch {
      this.prefs = { ...DEFAULT_PREFS };
    }
  }

  updatePreferences(partial) {
    this.prefs = { ...this.prefs, ...partial };
    localStorage.setItem(STORAGE_KEYS.PREFS, JSON.stringify(this.prefs));
    this.applyTheme();
    this.notify();
  }

  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.prefs.theme);
  }

  toggleTheme() {
    const next = this.prefs.theme === 'dark' ? 'light' : 'dark';
    this.updatePreferences({ theme: next });
    return next;
  }

  loadBookmarks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      if (raw) {
        this.bookmarks = new Set(JSON.parse(raw));
      }
    } catch {
      this.bookmarks = new Set();
    }
  }

  toggleBookmark(id) {
    if (this.bookmarks.has(id)) {
      this.bookmarks.delete(id);
    } else {
      this.bookmarks.add(id);
    }
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify([...this.bookmarks]));
    this.notify();
    return this.bookmarks.has(id);
  }

  isBookmarked(id) {
    return this.bookmarks.has(id);
  }

  // =========================================================================
  // Supabase Backend Integration (Server-side Auth + Row Level Security)
  // =========================================================================
  loadSupabaseConfig() {
    try {
      const cfg = localStorage.getItem(STORAGE_KEYS.SUPABASE_CFG);
      const sess = sessionStorage.getItem(STORAGE_KEYS.SUPABASE_SESSION);
      if (cfg) this.supabaseConfig = JSON.parse(cfg);
      if (sess) this.authSession = JSON.parse(sess);
    } catch {
      this.supabaseConfig = null;
      this.authSession = null;
    }
  }

  isSupabaseConfigured() {
    return Boolean(
      this.supabaseConfig &&
      this.supabaseConfig.url &&
      this.supabaseConfig.anonKey
    );
  }

  isServerAuthenticated() {
    return Boolean(this.isSupabaseConfigured() && this.authSession && this.authSession.access_token);
  }

  saveSupabaseConfig(url, anonKey) {
    const cleanUrl = url.trim().replace(/\/$/, '');
    const cleanKey = anonKey.trim();
    if (!cleanUrl || !cleanKey) {
      localStorage.removeItem(STORAGE_KEYS.SUPABASE_CFG);
      sessionStorage.removeItem(STORAGE_KEYS.SUPABASE_SESSION);
      this.supabaseConfig = null;
      this.authSession = null;
    } else {
      this.supabaseConfig = { url: cleanUrl, anonKey: cleanKey };
      localStorage.setItem(STORAGE_KEYS.SUPABASE_CFG, JSON.stringify(this.supabaseConfig));
    }
    this.notify();
  }

  async loginWithSupabase(email, password) {
    if (!this.isSupabaseConfigured()) {
      throw new Error('Backend Supabase není nakonfigurován. Nelze provést serverové ověření.');
    }
    const endpoint = `${this.supabaseConfig.url}/auth/v1/token?grant_type=password`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': this.supabaseConfig.anonKey
      },
      body: JSON.stringify({ email, password })
    });
    const payload = await res.json();
    if (!res.ok) {
      throw new Error(payload.error_description || payload.msg || 'Ověření serverem selhalo.');
    }
    this.authSession = {
      access_token: payload.access_token,
      user: payload.user
    };
    sessionStorage.setItem(STORAGE_KEYS.SUPABASE_SESSION, JSON.stringify(this.authSession));
    this.notify();
    return this.authSession;
  }

  async logoutSupabase() {
    if (this.isServerAuthenticated()) {
      try {
        await fetch(`${this.supabaseConfig.url}/auth/v1/logout`, {
          method: 'POST',
          headers: {
            'apikey': this.supabaseConfig.anonKey,
            'Authorization': `Bearer ${this.authSession.access_token}`
          }
        });
      } catch {
        // Ignorujeme síťovou chybu při odhlášení
      }
    }
    this.authSession = null;
    sessionStorage.removeItem(STORAGE_KEYS.SUPABASE_SESSION);
    this.notify();
  }

  async syncFromSupabase() {
    if (!this.isSupabaseConfigured()) return;
    try {
      const res = await fetch(`${this.supabaseConfig.url}/rest/v1/voltlab_content?select=*`, {
        headers: {
          'apikey': this.supabaseConfig.anonKey
        }
      });
      if (!res.ok) return;
      const rows = await res.json();
      if (Array.isArray(rows) && rows.length > 0) {
        const articles = rows.filter(r => r.type === 'article').map(r => r.payload);
        const projects = rows.filter(r => r.type === 'project').map(r => r.payload);
        if (articles.length) this.data.articles = articles;
        if (projects.length) this.data.projects = projects;
        this.saveContentLocal();
      }
    } catch (e) {
      console.warn('VoltLab: Synchronizace se Supabase se nezdařila, používám lokální data.', e);
    }
  }

  async persistRecordToSupabase(type, record) {
    if (!this.isServerAuthenticated()) return;
    const res = await fetch(`${this.supabaseConfig.url}/rest/v1/voltlab_content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': this.supabaseConfig.anonKey,
        'Authorization': `Bearer ${this.authSession.access_token}`,
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        id: record.id,
        type,
        payload: record,
        updated_at: new Date().toISOString()
      })
    });
    if (!res.ok) {
      throw new Error('Server odmítl zápis (zkontrolujte RLS politiky v Supabase).');
    }
  }

  async deleteRecordFromSupabase(id) {
    if (!this.isServerAuthenticated()) return;
    const res = await fetch(`${this.supabaseConfig.url}/rest/v1/voltlab_content?id=eq.${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        'apikey': this.supabaseConfig.anonKey,
        'Authorization': `Bearer ${this.authSession.access_token}`
      }
    });
    if (!res.ok) {
      throw new Error('Server odmítl smazání záznamu (RLS).');
    }
  }

  // =========================================================================
  // CRUD operace pro články, projekty a kategorie
  // =========================================================================
  async upsertArticle(article) {
    const idx = this.data.articles.findIndex((a) => a.id === article.id);
    if (idx >= 0) {
      this.data.articles[idx] = article;
    } else {
      this.data.articles.unshift(article);
    }
    if (this.isServerAuthenticated()) {
      await this.persistRecordToSupabase('article', article);
    }
    this.saveContentLocal();
    this.notify();
  }

  async deleteArticle(id) {
    this.data.articles = this.data.articles.filter((a) => a.id !== id);
    if (this.isServerAuthenticated()) {
      await this.deleteRecordFromSupabase(id);
    }
    this.saveContentLocal();
    this.notify();
  }

  async upsertProject(project) {
    const idx = this.data.projects.findIndex((p) => p.id === project.id);
    if (idx >= 0) {
      this.data.projects[idx] = project;
    } else {
      this.data.projects.unshift(project);
    }
    if (this.isServerAuthenticated()) {
      await this.persistRecordToSupabase('project', project);
    }
    this.saveContentLocal();
    this.notify();
  }

  async deleteProject(id) {
    this.data.projects = this.data.projects.filter((p) => p.id !== id);
    if (this.isServerAuthenticated()) {
      await this.deleteRecordFromSupabase(id);
    }
    this.saveContentLocal();
    this.notify();
  }

  upsertCategory(category) {
    const idx = this.data.categories.findIndex((c) => c.id === category.id);
    if (idx >= 0) {
      this.data.categories[idx] = category;
    } else {
      this.data.categories.push(category);
    }
    this.saveContentLocal();
    this.notify();
  }

  deleteCategory(id) {
    this.data.categories = this.data.categories.filter((c) => c.id !== id);
    this.saveContentLocal();
    this.notify();
  }

  exportJSON() {
    return JSON.stringify(this.data, null, 2);
  }

  importJSON(jsonString) {
    const parsed = JSON.parse(jsonString);
    if (!parsed || !Array.isArray(parsed.articles) || !Array.isArray(parsed.projects) || !Array.isArray(parsed.categories)) {
      throw new Error('Neplatná struktura JSON souboru (chybí articles, projects nebo categories).');
    }
    this.data = parsed;
    this.saveContentLocal();
    this.notify();
  }

  async resetToSeed() {
    localStorage.removeItem(STORAGE_KEYS.CONTENT);
    await this.loadSeedData();
    this.notify();
  }
}
