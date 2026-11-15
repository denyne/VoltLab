
(() => {
  "use strict";

  window.VOLTLAB_CONFIG = {
    site: {
      name: "VoltLab",
      version: "3.1",
      language: "cs"
    },

    appearance: {
      defaultTheme: "dark",
      accent: "#a4e66d",
      secondary: "#54d6bd"
    },

    categories: [
      {
        id: "arduino",
        name: "Arduino",
        icon: "⌘",
        description: "Mikrokontroléry, senzory a vlastní zařízení."
      },
      {
        id: "electronics",
        name: "Elektronika",
        icon: "ϟ",
        description: "Součástky, obvody, měření a elektronické základy."
      },
      {
        id: "robotics",
        name: "Robotika",
        icon: "◎",
        description: "Roboti, motory, senzory a automatizace."
      },
      {
        id: "3d-printing",
        name: "3D tisk",
        icon: "▧",
        description: "Modelování, tisk a konstrukce."
      },
      {
        id: "smart-home",
        name: "Smart Home",
        icon: "⌂",
        description: "ESP32, senzory a chytrá domácnost."
      },
      {
        id: "programming",
        name: "Programování",
        icon: "</>",
        description: "Kód, software a programování zařízení."
      }
    ],

    storage: {
      articles: "voltlab_v31_articles",
      projects: "voltlab_v31_projects",
      theme: "voltlab_v31_theme",
      session: "voltlab_v31_admin_session"
    },

    admin: {
      enabled: true,
      demoPassword: "zmen-me-2026"
    }
  };

})();
