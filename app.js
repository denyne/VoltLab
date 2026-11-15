
/* =====================================================
   VOLTLAB V3 – CORE APPLICATION
   Hlavní propojení webu, dat a administrace
   ===================================================== */

(function () {
  "use strict";

  const CONFIG = window.VOLTLAB_CONFIG || {};

  const STORAGE = CONFIG.storage || {
    articles: "voltLabArticles_v3",
    projects: "voltLabProjects_v3",
    gallery: "voltLabGallery_v3",
    widgets: "voltLabWidgets_v3",
    categories: "voltLabCategories_v3",
    settings: "voltLabSettings_v3",
    statistics: "voltLabStatistics_v3",
    theme: "voltLabTheme_v3"
  };

  const DEFAULTS = {
    articles: window.VOLTLAB_DEFAULT_ARTICLES || [],
    projects: window.VOLTLAB_DEFAULT_PROJECTS || [],
    gallery: [],
    widgets: CONFIG.widgets || [],
    categories: CONFIG.categories || [],
    settings: CONFIG.homepage || {},
    statistics: {
      pageViews: 0,
      articleViews: 0,
      projectViews: 0,
      visits: []
    }
  };

  const memoryStorage = {};

  function readStorage(key, fallback) {
    try {
      const value = localStorage.getItem(key);

      if (value === null) {
        return fallback;
      }

      return JSON.parse(value);
    } catch (error) {
      console.warn("VoltLab: Chyba při čtení dat:", key, error);
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("VoltLab: Chyba při ukládání:", key, error);
      toast("Data se nepodařilo uložit. Zkontroluj kapacitu úložiště.", "error");
      return false;
    }
  }

  function getData(name) {
    if (!STORAGE[name]) return [];
    return readStorage(STORAGE[name], DEFAULTS[name] || []);
  }

  function saveData(name, value) {
    if (!STORAGE[name]) return false;
    return writeStorage(STORAGE[name], value);
  }

  function toast(message, type = "success") {
    let container = document.getElementById("toast-container");

    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const element = document.createElement("div");
    element.className = `toast toast-${type}`;
    element.textContent = message;

    container.appendChild(element);

    setTimeout(() => {
      element.remove();
    }, 3500);
  }

  function getArticles() {
    return getData("articles");
  }

  function saveArticles(items) {
    return Array.isArray(items) && saveData("articles", items);
  }

  function getProjects() {
    return getData("projects");
  }

  function saveProjects(items) {
    return Array.isArray(items) && saveData("projects", items);
  }

  function getGallery() {
    return getData("gallery");
  }

  function saveGallery(items) {
    return Array.isArray(items) && saveData("gallery", items);
  }

  function getCategories() {
    return getData("categories");
  }

  function saveCategories(items) {
    return Array.isArray(items) && saveData("categories", items);
  }

  function getWidgets() {
    return getData("widgets");
  }

  function saveWidgets(items) {
    return Array.isArray(items) && saveData("widgets", items);
  }

  function getSettings() {
    return getData("settings");
  }

  function saveSettings(settings) {
    return settings && typeof settings === "object"
      ? saveData("settings", settings)
      : false;
  }

  function getStatistics() {
    return getData("statistics");
  }

  function saveStatistics(statistics) {
    return saveData("statistics", statistics);
  }

  function incrementStatistic(type) {
    const statistics = getStatistics();

    if (typeof statistics[type] !== "number") {
      statistics[type] = 0;
    }

    statistics[type]++;

    if (Array.isArray(statistics.visits)) {
      statistics.visits.push({
        type,
        date: new Date().toISOString()
      });

      if (statistics.visits.length > 1000) {
        statistics.visits = statistics.visits.slice(-1000);
      }
    }

    saveStatistics(statistics);
  }

  function setTheme(theme) {
    if (!["dark", "light"].includes(theme)) return;

    document.documentElement.dataset.theme = theme;

    try {
      localStorage.setItem(STORAGE.theme, theme);
    } catch (error) {
      console.warn("VoltLab: Motiv se nepodařilo uložit.");
    }

    const button = document.getElementById("theme-toggle");

    if (button) {
      button.setAttribute(
        "aria-label",
        theme === "dark" ? "Zapnout světlý režim" : "Zapnout tmavý režim"
      );
    }
  }

  function toggleTheme() {
    const current =
      document.documentElement.dataset.theme ||
      CONFIG.appearance?.defaultTheme ||
      "dark";

    setTheme(current === "dark" ? "light" : "dark");
  }

  function initializeTheme() {
    let theme = CONFIG.appearance?.defaultTheme || "dark";

    try {
      theme = localStorage.getItem(STORAGE.theme) || theme;
    } catch (error) {
      console.warn("VoltLab: Motiv není dostupný.");
    }

    setTheme(theme);
  }

  function initializeDefaults() {
    Object.keys(DEFAULTS).forEach(name => {
      if (!STORAGE[name]) return;

      try {
        if (localStorage.getItem(STORAGE[name]) === null) {
          localStorage.setItem(
            STORAGE[name],
            JSON.stringify(DEFAULTS[name])
          );
        }
      } catch (error) {
        console.warn("VoltLab: Výchozí data nelze uložit:", name);
      }
    });
  }

  function exportData() {
    const backup = {
      application: "VoltLab",
      version: CONFIG.site?.version || "3.0.0",
      exportedAt: new Date().toISOString(),
      data: {}
    };

    Object.keys(STORAGE).forEach(name => {
      backup.data[name] = readStorage(
        STORAGE[name],
        DEFAULTS[name] ?? null
      );
    });

    const blob = new Blob(
      [JSON.stringify(backup, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `voltlab-zaloha-${Date.now()}.json`;
    link.click();

    URL.revokeObjectURL(url);
    toast("Záloha byla připravena.", "success");
  }

  function importData(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error("Nebyl vybrán soubor."));
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        try {
          const backup = JSON.parse(reader.result);

          if (
            backup.application !== "VoltLab" ||
            !backup.data ||
            typeof backup.data !== "object"
          ) {
            throw new Error("Soubor není platná záloha VoltLab.");
          }

          Object.keys(STORAGE).forEach(name => {
            if (
              Object.prototype.hasOwnProperty.call(backup.data, name)
            ) {
              writeStorage(STORAGE[name], backup.data[name]);
            }
          });

          toast("Záloha byla importována.", "success");
          resolve(true);
        } catch (error) {
          toast(error.message || "Import se nezdařil.", "error");
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error("Soubor se nepodařilo přečíst."));
      };

      reader.readAsText(file);
    });
  }

  function resetWidgets() {
    return saveWidgets(CONFIG.widgets || []);
  }

  function toggleWidget(id, enabled) {
    const widgets = getWidgets();
    const widget = widgets.find(item => item.id === id);

    if (!widget) return false;

    widget.enabled = Boolean(enabled);
    return saveWidgets(widgets);
  }

  function cloneDefaultArticles() {
    return saveArticles(
      JSON.parse(JSON.stringify(DEFAULTS.articles))
    );
  }

  function cloneDefaultProjects() {
    return saveProjects(
      JSON.parse(JSON.stringify(DEFAULTS.projects))
    );
  }

  function initializeNavigation() {
    const toggle = document.getElementById("mobile-menu-toggle");
    const navigation = document.querySelector(".main-nav");

    if (toggle && navigation) {
      toggle.addEventListener("click", () => {
        navigation.classList.toggle("is-open");
      });
    }

    document.querySelectorAll(".main-nav a").forEach(link => {
      link.addEventListener("click", () => {
        navigation?.classList.remove("is-open");
      });
    });
  }

  function initializeThemeButton() {
    const button = document.getElementById("theme-toggle");

    if (button) {
      button.addEventListener("click", toggleTheme);
    }
  }

  function initialize() {
    initializeDefaults();
    initializeTheme();
    initializeNavigation();
    initializeThemeButton();

    if (CONFIG.statistics?.enabled) {
      incrementStatistic("pageViews");
    }

    document.dispatchEvent(
      new CustomEvent("voltLabReady")
    );
  }

  window.VoltLab = {
    getArticles,
    saveArticles,
    getProjects,
    saveProjects,
    getGallery,
    saveGallery,
    getCategories,
    saveCategories,
    getWidgets,
    saveWidgets,
    getSettings,
    saveSettings,
    getStatistics,
    saveStatistics,
    incrementStatistic,
    setTheme,
    toggleTheme,
    toast,
    exportData,
    importData
  };

  window.VOLTLAB_toggleWidget = toggleWidget;
  window.VOLTLAB_resetWidgets = resetWidgets;
  window.VOLTLAB_cloneDefaultArticles = cloneDefaultArticles;
  window.VOLTLAB_cloneDefaultProjects = cloneDefaultProjects;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }

})();
