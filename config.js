
/* =========================================================
   VOLTLAB V4 MAX
   CORE CONFIGURATION & DATA SYSTEM
   ========================================================= */

"use strict";

window.VOLTLAB = window.VOLTLAB || {};

(() => {
  const APP = window.VOLTLAB;

  APP.version = "4.0.0";
  APP.name = "VoltLab";
  APP.edition = "MAX";
  APP.build = "V4-MAX-2026";

  /* -------------------------------------------------------
     STORAGE KEYS
  ------------------------------------------------------- */

  APP.storageKeys = {
    settings: "voltlab_v4_settings",
    articles: "voltlab_v4_articles",
    projects: "voltlab_v4_projects",
    categories: "voltlab_v4_categories",
    favorites: "voltlab_v4_favorites",
    history: "voltlab_v4_history",
    journal: "voltlab_v4_journal",
    notes: "voltlab_v4_notes",
    progress: "voltlab_v4_progress",
    calculatorHistory: "voltlab_v4_calculator_history",
    adminSession: "voltlab_v4_admin_session",
    customComponents: "voltlab_v4_custom_components",
    customFormulas: "voltlab_v4_custom_formulas",
    customLessons: "voltlab_v4_custom_lessons",
    achievements: "voltlab_v4_achievements",
    workspace: "voltlab_v4_workspace"
  };

  /* -------------------------------------------------------
     DEFAULT SETTINGS
  ------------------------------------------------------- */

  APP.defaults = {
    settings: {
      theme: "dark",
      accent: "green",
      language: "cs",
      fontSize: "normal",
      reduceMotion: false,
      compactMode: false,
      showTips: true,
      autosave: true,
      soundEffects: false,
      confirmDelete: true,
      rememberLastPage: true,
      startPage: "dashboard"
    },

    favorites: [],
    history: [],
    journal: [],
    notes: [],
    calculatorHistory: [],
    progress: {},
    achievements: [],
    workspace: {
      activeProject: null,
      lastCalculator: null,
      lastPage: "dashboard"
    }
  };

  /* -------------------------------------------------------
     NAVIGATION
  ------------------------------------------------------- */

  APP.navigation = [
    {
      id: "dashboard",
      label: "Přehled",
      icon: "⌂",
      group: "main"
    },
    {
      id: "academy",
      label: "Elektro akademie",
      icon: "🎓",
      group: "learn"
    },
    {
      id: "articles",
      label: "Články",
      icon: "▤",
      group: "learn"
    },
    {
      id: "wiki",
      label: "Elektro wiki",
      icon: "📚",
      group: "learn"
    },
    {
      id: "formulas",
      label: "Vzorce a tabulky",
      icon: "ƒ",
      group: "learn"
    },
    {
      id: "calculators",
      label: "Kalkulačky",
      icon: "🧮",
      group: "tools"
    },
    {
      id: "components",
      label: "Databáze součástek",
      icon: "⌁",
      group: "tools"
    },
    {
      id: "circuit-studio",
      label: "Circuit Studio",
      icon: "⌘",
      group: "tools"
    },
    {
      id: "pcb-studio",
      label: "PCB Studio",
      icon: "▦",
      group: "tools"
    },
    {
      id: "signal-lab",
      label: "Signal Lab",
      icon: "∿",
      group: "tools"
    },
    {
      id: "logic-lab",
      label: "Logic Lab",
      icon: "⊞",
      group: "tools"
    },
    {
      id: "code-lab",
      label: "Code Lab",
      icon: "</>",
      group: "tools"
    },
    {
      id: "projects",
      label: "Projekty",
      icon: "⚒",
      group: "create"
    },
    {
      id: "journal",
      label: "Můj deník",
      icon: "✎",
      group: "create"
    },
    {
      id: "settings",
      label: "Nastavení",
      icon: "⚙",
      group: "system"
    },
    {
      id: "admin",
      label: "Admin Access",
      icon: "♙",
      group: "system"
    }
  ];

  /* -------------------------------------------------------
     CATEGORIES
  ------------------------------------------------------- */

  APP.defaultCategories = [
    {
      id: "basics",
      name: "Základy elektrotechniky",
      icon: "⚡",
      description: "Napětí, proud, odpor a základní principy.",
      color: "green"
    },
    {
      id: "circuits",
      name: "Elektrické obvody",
      icon: "⌁",
      description: "Sériové a paralelní obvody.",
      color: "teal"
    },
    {
      id: "components",
      name: "Elektronické součástky",
      icon: "▦",
      description: "Rezistory, kondenzátory, tranzistory a další.",
      color: "blue"
    },
    {
      id: "digital",
      name: "Digitální technika",
      icon: "⊞",
      description: "Logické obvody, čítače a procesory.",
      color: "purple"
    },
    {
      id: "power",
      name: "Výkonová elektronika",
      icon: "ϟ",
      description: "Zdroje, měniče a výkonové prvky.",
      color: "orange"
    },
    {
      id: "measurements",
      name: "Měření",
      icon: "◉",
      description: "Multimetry, osciloskopy a laboratorní měření.",
      color: "green"
    },
    {
      id: "programming",
      name: "Programování",
      icon: "</>",
      description: "Arduino, mikrokontroléry a embedded systémy.",
      color: "teal"
    },
    {
      id: "projects",
      name: "Praktické projekty",
      icon: "⚒",
      description: "Návody, konstrukce a experimenty.",
      color: "blue"
    }
  ];

  /* -------------------------------------------------------
     UNITS DATABASE
  ------------------------------------------------------- */

  APP.units = {
    voltage: {
      label: "Napětí",
      symbol: "V",
      units: [
        { id: "uV", name: "mikrovolt", factor: 0.000001 },
        { id: "mV", name: "milivolt", factor: 0.001 },
        { id: "V", name: "volt", factor: 1 },
        { id: "kV", name: "kilovolt", factor: 1000 }
      ]
    },

    current: {
      label: "Proud",
      symbol: "A",
      units: [
        { id: "nA", name: "nanoampér", factor: 1e-9 },
        { id: "uA", name: "mikroampér", factor: 1e-6 },
        { id: "mA", name: "miliampér", factor: 0.001 },
        { id: "A", name: "ampér", factor: 1 },
        { id: "kA", name: "kiloampér", factor: 1000 }
      ]
    },

    resistance: {
      label: "Odpor",
      symbol: "Ω",
      units: [
        { id: "mOhm", name: "milliohm", factor: 0.001 },
        { id: "Ohm", name: "ohm", factor: 1 },
        { id: "kOhm", name: "kiloohm", factor: 1000 },
        { id: "MOhm", name: "megaohm", factor: 1000000 }
      ]
    },

    power: {
      label: "Výkon",
      symbol: "W",
      units: [
        { id: "mW", name: "miliwatt", factor: 0.001 },
        { id: "W", name: "watt", factor: 1 },
        { id: "kW", name: "kilowatt", factor: 1000 },
        { id: "MW", name: "megawatt", factor: 1000000 }
      ]
    },

    capacitance: {
      label: "Kapacita",
      symbol: "F",
      units: [
        { id: "pF", name: "pikofarad", factor: 1e-12 },
        { id: "nF", name: "nanofarad", factor: 1e-9 },
        { id: "uF", name: "mikrofarad", factor: 1e-6 },
        { id: "mF", name: "milifarad", factor: 0.001 },
        { id: "F", name: "farad", factor: 1 }
      ]
    },

    frequency: {
      label: "Frekvence",
      symbol: "Hz",
      units: [
        { id: "mHz", name: "millihertz", factor: 0.001 },
        { id: "Hz", name: "hertz", factor: 1 },
        { id: "kHz", name: "kilohertz", factor: 1000 },
        { id: "MHz", name: "megahertz", factor: 1e6 },
        { id: "GHz", name: "gigahertz", factor: 1e9 }
      ]
    },

    energy: {
      label: "Energie",
      symbol: "J",
      units: [
        { id: "mJ", name: "millijoule", factor: 0.001 },
        { id: "J", name: "joule", factor: 1 },
        { id: "kJ", name: "kilojoule", factor: 1000 },
        { id: "Wh", name: "watthodina", factor: 3600 },
        { id: "kWh", name: "kilowatthodina", factor: 3600000 }
      ]
    }
  };

  /* -------------------------------------------------------
     VALIDATION
  ------------------------------------------------------- */

  APP.validate = {
    number(value, options = {}) {
      const number = Number(value);

      if (!Number.isFinite(number)) return false;

      if (options.min !== undefined && number < options.min) {
        return false;
      }

      if (options.max !== undefined && number > options.max) {
        return false;
      }

      return true;
    },

    text(value, min = 1, max = 5000) {
      if (typeof value !== "string") return false;

      const length = value.trim().length;

      return length >= min && length <= max;
    },

    id(value) {
      return typeof value === "string" &&
        /^[a-zA-Z0-9_-]{1,80}$/.test(value);
    },

    email(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
  };

  /* -------------------------------------------------------
     SAFE STORAGE
  ------------------------------------------------------- */

  APP.storage = {
    available: true,

    get(key, fallback = null) {
      try {
        const raw = localStorage.getItem(key);

        if (raw === null) return fallback;

        return JSON.parse(raw);
      } catch (error) {
        console.warn("[VoltLab] Storage read error:", error);
        return fallback;
      }
    },

    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.error("[VoltLab] Storage write error:", error);
        APP.storage.available = false;
        return false;
      }
    },

    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        console.error("[VoltLab] Storage remove error:", error);
        return false;
      }
    },

    clearVoltLabData() {
      Object.values(APP.storageKeys).forEach(key => {
        this.remove(key);
      });
    },

    bytes() {
      let total = 0;

      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);

          if (key && key.startsWith("voltlab_v4_")) {
            total += (localStorage.getItem(key) || "").length * 2;
          }
        }
      } catch (error) {
        console.warn(error);
      }

      return total;
    }
  };

  /* -------------------------------------------------------
     DATA ACCESS
  ------------------------------------------------------- */

  APP.data = {
    get settings() {
      return {
        ...APP.defaults.settings,
        ...APP.storage.get(
          APP.storageKeys.settings,
          {}
        )
      };
    },

    saveSettings(settings) {
      const clean = {
        ...APP.defaults.settings,
        ...settings
      };

      return APP.storage.set(
        APP.storageKeys.settings,
        clean
      );
    },

    getCategories() {
      return APP.storage.get(
        APP.storageKeys.categories,
        APP.defaultCategories
      );
    },

    saveCategories(categories) {
      if (!Array.isArray(categories)) return false;

      return APP.storage.set(
        APP.storageKeys.categories,
        categories
      );
    },

    getFavorites() {
      return APP.storage.get(
        APP.storageKeys.favorites,
        []
      );
    },

    toggleFavorite(id) {
      if (!APP.validate.id(id)) return false;

      const favorites = this.getFavorites();
      const index = favorites.indexOf(id);

      if (index >= 0) {
        favorites.splice(index, 1);
      } else {
        favorites.push(id);
      }

      APP.storage.set(APP.storageKeys.favorites, favorites);

      return favorites.includes(id);
    },

    isFavorite(id) {
      return this.getFavorites().includes(id);
    },

    getHistory() {
      return APP.storage.get(
        APP.storageKeys.history,
        []
      );
    },

    addHistory(item) {
      if (!item || typeof item !== "object") return;

      const history = this.getHistory();

      history.unshift({
        ...item,
        timestamp: Date.now()
      });

      APP.storage.set(
        APP.storageKeys.history,
        history.slice(0, 100)
      );
    },

    getJournal() {
      return APP.storage.get(
        APP.storageKeys.journal,
        []
      );
    },

    saveJournal(entries) {
      return APP.storage.set(
        APP.storageKeys.journal,
        entries
      );
    },

    getProgress() {
      return APP.storage.get(
        APP.storageKeys.progress,
        {}
      );
    },

    saveProgress(progress) {
      return APP.storage.set(
        APP.storageKeys.progress,
        progress
      );
    }
  };

  /* -------------------------------------------------------
     UTILITIES
  ------------------------------------------------------- */

  APP.utils = {
    id(prefix = "item") {
      const random = Math.random().toString(36).slice(2, 9);

      return `${prefix}_${Date.now().toString(36)}_${random}`;
    },

    escapeHTML(value) {
      return String(value ?? "").replace(
        /[&<>"']/g,
        char => ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
        })[char]
      );
    },

    formatNumber(value, decimals = 3) {
      const number = Number(value);

      if (!Number.isFinite(number)) return "—";

      return new Intl.NumberFormat("cs-CZ", {
        maximumFractionDigits: decimals
      }).format(number);
    },

    formatDate(value = Date.now()) {
      return new Intl.DateTimeFormat("cs-CZ", {
        dateStyle: "medium"
      }).format(new Date(value));
    },

    formatDateTime(value = Date.now()) {
      return new Intl.DateTimeFormat("cs-CZ", {
        dateStyle: "short",
        timeStyle: "short"
      }).format(new Date(value));
    },

    clamp(value, min, max) {
      return Math.min(max, Math.max(min, value));
    },

    debounce(callback, delay = 250) {
      let timer;

      return (...args) => {
        clearTimeout(timer);

        timer = setTimeout(() => {
          callback(...args);
        }, delay);
      };
    },

    throttle(callback, delay = 250) {
      let waiting = false;

      return (...args) => {
        if (waiting) return;

        waiting = true;
        callback(...args);

        setTimeout(() => {
          waiting = false;
        }, delay);
      };
    },

    download(filename, content, type = "text/plain") {
      const blob = new Blob([content], { type });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => URL.revokeObjectURL(url), 1000);
    },

    copy(text) {
      if (navigator.clipboard?.writeText) {
        return navigator.clipboard.writeText(String(text));
      }

      return Promise.reject(
        new Error("Clipboard API není dostupné.")
      );
    },

    uid() {
      return crypto.randomUUID
        ? crypto.randomUUID()
        : this.id("uid");
    }
  };

  /* -------------------------------------------------------
     UNIT CONVERSION
  ------------------------------------------------------- */

  APP.convertUnit = function(value, group, from, to) {
    const units = APP.units[group];

    if (!units) {
      throw new Error("Neznámá skupina jednotek.");
    }

    const source = units.units.find(unit => unit.id === from);
    const target = units.units.find(unit => unit.id === to);

    if (!source || !target) {
      throw new Error("Neznámá jednotka.");
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
      throw new Error("Zadej platnou číselnou hodnotu.");
    }

    return number * source.factor / target.factor;
  };

  /* -------------------------------------------------------
     BACKUP AND RESTORE
  ------------------------------------------------------- */

  APP.backup = {
    create() {
      const data = {
        app: APP.name,
        version: APP.version,
        createdAt: new Date().toISOString(),
        storage: {}
      };

      Object.entries(APP.storageKeys).forEach(([name, key]) => {
        data.storage[name] = APP.storage.get(key, null);
      });

      return data;
    },

    export() {
      const data = this.create();

      APP.utils.download(
        `voltlab-backup-${new Date().toISOString().slice(0, 10)}.json`,
        JSON.stringify(data, null, 2),
        "application/json"
      );

      APP.events.emit("backup:exported", data);
    },

    restore(data) {
      if (!data || data.app !== APP.name) {
        throw new Error("Neplatná záloha VoltLab.");
      }

      if (!data.storage || typeof data.storage !== "object") {
        throw new Error("Záloha neobsahuje platná data.");
      }

      Object.entries(APP.storageKeys).forEach(([name, key]) => {
        if (Object.prototype.hasOwnProperty.call(data.storage, name)) {
          APP.storage.set(key, data.storage[name]);
        }
      });

      APP.events.emit("backup:restored", data);

      return true;
    }
  };

  /* -------------------------------------------------------
     EVENT SYSTEM
  ------------------------------------------------------- */

  APP.events = {
    listeners: {},

    on(name, callback) {
      if (typeof callback !== "function") return () => {};

      if (!this.listeners[name]) {
        this.listeners[name] = [];
      }

      this.listeners[name].push(callback);

      return () => this.off(name, callback);
    },

    off(name, callback) {
      if (!this.listeners[name]) return;

      this.listeners[name] = this.listeners[name].filter(
        listener => listener !== callback
      );
    },

    emit(name, detail = null) {
      (this.listeners[name] || []).forEach(callback => {
        try {
          callback(detail);
        } catch (error) {
          console.error("[VoltLab Event]", error);
        }
      });

      window.dispatchEvent(
        new CustomEvent(`voltlab:${name}`, { detail })
      );
    }
  };

  /* -------------------------------------------------------
     TOAST NOTIFICATIONS
  ------------------------------------------------------- */

  APP.notify = function(message, type = "success", duration = 3000) {
    const container = document.querySelector(".toast-container");

    if (!container) {
      console.log(`[VoltLab ${type}]`, message);
      return;
    }

    const toast = document.createElement("div");

    toast.className = `toast ${type}`;
    toast.textContent = String(message);

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-8px)";

      setTimeout(() => toast.remove(), 250);
    }, duration);
  };

  /* -------------------------------------------------------
     SETTINGS APPLICATION
  ------------------------------------------------------- */

  APP.applySettings = function() {
    const settings = APP.data.settings;

    document.documentElement.dataset.theme = settings.theme;
    document.documentElement.dataset.accent = settings.accent;
    document.documentElement.dataset.reduceMotion =
      String(settings.reduceMotion);

    document.documentElement.dataset.compact =
      String(settings.compactMode);

    document.documentElement.dataset.fontSize =
      settings.fontSize;

    APP.events.emit("settings:applied", settings);
  };

  /* -------------------------------------------------------
     INITIALIZATION
  ------------------------------------------------------- */

  APP.init = function() {
    if (APP.initialized) return;

    APP.initialized = true;

    APP.applySettings();

    if (!APP.storage.available) {
      console.warn(
        "[VoltLab] Local storage may be unavailable."
      );
    }

    APP.events.emit("app:ready", {
      version: APP.version,
      edition: APP.edition
    });

    console.info(
      `%cVoltLab ${APP.version} ${APP.edition}`,
      "color:#a4e66d;font-size:16px;font-weight:bold"
    );

    console.info("Core system initialized.");
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", APP.init, {
      once: true
    });
  } else {
    APP.init();
  }

})();
