
/* =====================================================
   VOLTLAB V3 – CONFIG.JS
   Hlavní konfigurace webu
   ===================================================== */

window.VOLTLAB_CONFIG = {

  /* ZÁKLADNÍ INFORMACE */
  site: {
    name: "VoltLab",
    title: "VoltLab – Svět elektroniky a techniky",
    description:
      "Technologie, elektronika, Arduino, robotika, 3D tisk a chytrá domácnost.",
    version: "3.0.0",
    language: "cs",
    author: "VoltLab"
  },

  version: "3.0.0",

  /* VZHLED WEBU */
  appearance: {
    defaultTheme: "dark",
    accentColor: "#00e676",
    secondaryColor: "#00bcd4",
    backgroundColor: "#101418",
    fontFamily: "Inter, Arial, sans-serif",
    animations: true,
    roundedCorners: true
  },

  /* ÚVODNÍ STRÁNKA */
  homepage: {
    title: "Objev svět techniky",
    subtitle: "Tvoř. Objevuj. Programuj.",
    description:
      "VoltLab je místo pro všechny, které baví elektronika, Arduino, robotika, 3D tisk a moderní technologie.",
    buttonText: "Prozkoumat projekty",
    buttonLink: "#projects"
  },

  /* NAVIGACE */
  navigation: [
    { label: "Domů", href: "#home" },
    { label: "Články", href: "#articles" },
    { label: "Projekty", href: "#projects" },
    { label: "Nástroje", href: "#tools" },
    { label: "Galerie", href: "#gallery" },
    { label: "O nás", href: "#about" }
  ],

  /* KATEGORIE */
  categories: [
    {
      id: "arduino",
      name: "Arduino",
      icon: "⚡",
      description: "Mikrokontroléry, senzory a programování."
    },
    {
      id: "electronics",
      name: "Elektronika",
      icon: "🔌",
      description: "Součástky, obvody a měření."
    },
    {
      id: "robotics",
      name: "Robotika",
      icon: "🤖",
      description: "Roboti, motory a automatizace."
    },
    {
      id: "3d-printing",
      name: "3D tisk",
      icon: "🖨️",
      description: "Modelování, tisk a konstrukce."
    },
    {
      id: "smart-home",
      name: "Smart Home",
      icon: "🏠",
      description: "ESP32, chytrá domácnost a IoT."
    },
    {
      id: "automation",
      name: "Automatizace",
      icon: "⚙️",
      description: "Automatizace a řízení zařízení."
    }
  ],

  /* ADMINISTRACE */
  admin: {
    enabled: true,

    /*
      Pouze demonstrační heslo.
      Pro veřejný web použij bezpečné přihlášení přes backend.
    */
    demoPassword: "zmen-me-2026",

    sessionKey: "voltLabAdminSession",

    roles: [
      "admin",
      "editor"
    ]
  },

  /* LOCAL STORAGE */
  storage: {
    articles: "voltLabArticles_v3",
    projects: "voltLabProjects_v3",
    settings: "voltLabSettings_v3",
    gallery: "voltLabGallery_v3",
    widgets: "voltLabWidgets_v3",
    categories: "voltLabCategories_v3",
    statistics: "voltLabStatistics_v3",
    theme: "voltLabTheme_v3"
  },

  /* FUNKCE WEBU */
  features: {
    articles: true,
    projects: true,
    gallery: true,
    search: true,
    categories: true,
    darkMode: true,
    admin: true,
    widgets: true,
    statistics: true,
    backup: true
  },

  /* LIMITY */
  limits: {
    articlesPerPage: 9,
    projectsPerPage: 9,
    galleryPerPage: 12,
    searchMinimumCharacters: 2,
    maximumImageSizeMB: 5
  },

  /* WIDGETY A KALKULAČKY */
  widgets: [
    {
      id: "ohms-law",
      title: "Ohmův zákon",
      description: "Výpočet napětí, proudu a odporu.",
      icon: "⚡",
      enabled: true
    },
    {
      id: "unit-converter",
      title: "Převodník jednotek",
      description: "Převod elektrických jednotek.",
      icon: "🔄",
      enabled: true
    },
    {
      id: "resistor-calculator",
      title: "Kalkulačka rezistorů",
      description: "Výpočet odporu podle barevných proužků.",
      icon: "🎨",
      enabled: true
    }
  ],

  /* STATISTIKY */
  statistics: {
    enabled: true,
    trackPageViews: true,
    trackArticles: true,
    trackProjects: true
  },

  /* BACKEND */
  backend: {
    enabled: false,
    provider: null,
    apiUrl: null
  }

};

/* =====================================================
   KONEC KONFIGURACE
   ===================================================== */
