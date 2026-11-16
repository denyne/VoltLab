
/* =========================================================
   VOLTLAB V4 MAX
   PROJECT DATABASE & PROJECT MANAGER
   ========================================================= */

"use strict";

window.VOLTLAB = window.VOLTLAB || {};

(() => {
  const APP = window.VOLTLAB;
  const STORAGE_KEY = APP.storageKeys.projects;

  /* -------------------------------------------------------
     BUILT-IN PROJECT DATABASE
  ------------------------------------------------------- */

  const database = [

    {
      id: "led-blinker",
      title: "LED blikač",
      category: "basics",
      level: "beginner",
      difficulty: 1,
      estimatedTime: "30–60 minut",
      description: "Jednoduchý obvod, který pravidelně rozsvěcuje a zhasíná LED.",
      tags: ["LED", "časování", "555", "začátečník"],
      featured: true,
      estimatedCost: 80,
      components: [
        { name: "LED", quantity: 1, price: 5 },
        { name: "Rezistor 330 Ω", quantity: 1, price: 3 },
        { name: "NE555", quantity: 1, price: 20 },
        { name: "Rezistor 10 kΩ", quantity: 1, price: 3 },
        { name: "Kondenzátor 100 µF", quantity: 1, price: 8 },
        { name: "Nepájivé pole", quantity: 1, price: 40 }
      ],
      steps: [
        {
          title: "Připrav součástky",
          description: "Připrav NE555, LED, rezistory, kondenzátor a nepájivé pole."
        },
        {
          title: "Vlož časovač",
          description: "Umísti NE555 přes středovou mezeru nepájivého pole."
        },
        {
          title: "Zapoj časovací část",
          description: "Zapoj rezistory a kondenzátor podle zapojení astabilního režimu."
        },
        {
          title: "Připoj LED",
          description: "Připoj LED přes vhodný předřadný rezistor na výstup časovače."
        },
        {
          title: "Otestuj obvod",
          description: "Připoj vhodné nízkonapěťové napájení a zkontroluj blikání."
        }
      ],
      safety: "Používej pouze vhodné nízké stejnosměrné napětí. Před změnou zapojení odpoj napájení."
    },

    {
      id: "led-lamp",
      title: "Jednoduchá LED lampička",
      category: "basics",
      level: "beginner",
      difficulty: 1,
      estimatedTime: "20–40 minut",
      description: "Malá LED lampička napájená z bezpečného nízkonapěťového zdroje.",
      tags: ["LED", "osvětlení", "rezistor"],
      featured: true,
      estimatedCost: 60,
      components: [
        { name: "LED", quantity: 1, price: 5 },
        { name: "Rezistor 330 Ω", quantity: 1, price: 3 },
        { name: "Vodiče", quantity: 2, price: 10 },
        { name: "Nízkonapěťový zdroj", quantity: 1, price: 35 },
        { name: "Vypínač", quantity: 1, price: 7 }
      ],
      steps: [
        {
          title: "Vyber LED",
          description: "Zjisti její dopředné napětí a doporučený proud z katalogového listu."
        },
        {
          title: "Vypočítej rezistor",
          description: "Použij vztah R = (Uzdroje − ULED) / ILED."
        },
        {
          title: "Zapoj obvod",
          description: "Zapoj zdroj, rezistor, LED a vypínač do série."
        },
        {
          title: "Otestuj lampičku",
          description: "Zkontroluj polaritu a funkčnost při bezpečném napájecím napětí."
        }
      ],
      safety: "Nepřipojuj LED přímo ke zdroji bez omezení proudu."
    },

    {
      id: "voltage-divider-project",
      title: "Napěťový dělič",
      category: "circuits",
      level: "beginner",
      difficulty: 2,
      estimatedTime: "20 minut",
      description: "Praktické sestavení a měření napěťového děliče.",
      tags: ["rezistory", "napětí", "měření"],
      featured: true,
      estimatedCost: 30,
      components: [
        { name: "Rezistor 1 kΩ", quantity: 2, price: 6 },
        { name: "Nepájivé pole", quantity: 1, price: 20 },
        { name: "Propojovací vodiče", quantity: 3, price: 4 }
      ],
      steps: [
        {
          title: "Připrav rezistory",
          description: "Připrav dva rezistory stejné hodnoty."
        },
        {
          title: "Zapoj sérii",
          description: "Zapoj oba rezistory do série mezi kladný pól zdroje a zem."
        },
        {
          title: "Změř výstup",
          description: "Změř napětí na druhém rezistoru."
        },
        {
          title: "Porovnej výsledek",
          description: "Porovnej naměřené napětí s teoretickým výpočtem."
        }
      ],
      safety: "Používej nízkonapěťový zdroj a nepřekračuj výkonovou zatížitelnost rezistorů."
    },

    {
      id: "arduino-traffic-light",
      title: "Arduino semafor",
      category: "programming",
      level: "beginner",
      difficulty: 2,
      estimatedTime: "1–2 hodiny",
      description: "Tři LED simulují světelný cyklus semaforu.",
      tags: ["Arduino", "LED", "programování", "GPIO"],
      featured: true,
      estimatedCost: 180,
      components: [
        { name: "Arduino kompatibilní deska", quantity: 1, price: 130 },
        { name: "Červená LED", quantity: 1, price: 5 },
        { name: "Žlutá LED", quantity: 1, price: 5 },
        { name: "Zelená LED", quantity: 1, price: 5 },
        { name: "Rezistor 220–330 Ω", quantity: 3, price: 9 },
        { name: "Nepájivé pole", quantity: 1, price: 20 },
        { name: "Propojovací vodiče", quantity: 1, price: 6 }
      ],
      steps: [
        {
          title: "Připrav desku",
          description: "Připoj vývojovou desku k počítači."
        },
        {
          title: "Zapoj LED",
          description: "Každou LED připoj přes vlastní rezistor na samostatný výstupní pin."
        },
        {
          title: "Napiš program",
          description: "Vytvoř sekvenci červené, červené se žlutou, zelené a žluté."
        },
        {
          title: "Nahraj program",
          description: "Nahraj program do desky a sleduj průběh."
        },
        {
          title: "Uprav časování",
          description: "Změň délku jednotlivých stavů a otestuj výsledek."
        }
      ],
      code: `const int red = 8;
const int yellow = 9;
const int green = 10;

void setup() {
  pinMode(red, OUTPUT);
  pinMode(yellow, OUTPUT);
  pinMode(green, OUTPUT);
}

void loop() {
  digitalWrite(red, HIGH);
  delay(3000);

  digitalWrite(yellow, HIGH);
  delay(1000);

  digitalWrite(red, LOW);
  digitalWrite(yellow, LOW);
  digitalWrite(green, HIGH);
  delay(3000);

  digitalWrite(green, LOW);
  digitalWrite(yellow, HIGH);
  delay(1000);

  digitalWrite(yellow, LOW);
}`,
      safety: "Každou LED připoj přes samostatný rezistor. Respektuj limity výstupních pinů desky."
    },

    {
      id: "light-sensor",
      title: "Automatické světlo s fotorezistorem",
      category: "components",
      level: "intermediate",
      difficulty: 3,
      estimatedTime: "1–2 hodiny",
      description: "Obvod, který reaguje na intenzitu okolního světla.",
      tags: ["LDR", "senzor", "Arduino", "automatizace"],
      estimatedCost: 160,
      components: [
        { name: "Arduino kompatibilní deska", quantity: 1, price: 130 },
        { name: "Fotorezistor LDR", quantity: 1, price: 8 },
        { name: "Rezistor 10 kΩ", quantity: 1, price: 3 },
        { name: "LED", quantity: 1, price: 5 },
        { name: "Rezistor 330 Ω", quantity: 1, price: 3 },
        { name: "Vodiče", quantity: 1, price: 11 }
      ],
      steps: [
        {
          title: "Připrav senzor",
          description: "Připrav fotorezistor a rezistor pro napěťový dělič."
        },
        {
          title: "Zapoj dělič",
          description: "Připoj LDR a pevný rezistor mezi napájení a zem. Střed děliče připoj na analogový vstup."
        },
        {
          title: "Zapoj LED",
          description: "Připoj LED přes rezistor na digitální výstup."
        },
        {
          title: "Naprogramuj reakci",
          description: "Přečti analogovou hodnotu a porovnej ji s nastaveným prahem."
        },
        {
          title: "Otestuj senzor",
          description: "Zakryj a osvětli LDR a sleduj změny."
        }
      ],
      safety: "Používej pouze nízkonapěťové zapojení."
    },

    {
      id: "555-tone-generator",
      title: "Generátor tónu s NE555",
      category: "circuits",
      level: "intermediate",
      difficulty: 3,
      estimatedTime: "1 hodina",
      description: "Vytvoř jednoduchý zvukový signál pomocí časovače NE555.",
      tags: ["NE555", "frekvence", "zvuk", "generátor"],
      estimatedCost: 90,
      components: [
        { name: "NE555", quantity: 1, price: 20 },
        { name: "Rezistor 1 kΩ", quantity: 1, price: 3 },
        { name: "Rezistor 10 kΩ", quantity: 1, price: 3 },
        { name: "Kondenzátor 10 nF", quantity: 1, price: 5 },
        { name: "Piezo reproduktor", quantity: 1, price: 35 },
        { name: "Nepájivé pole", quantity: 1, price: 24 }
      ],
      steps: [
        {
          title: "Připrav časovač",
          description: "Umísti NE555 na nepájivé pole."
        },
        {
          title: "Zapoj astabilní režim",
          description: "Zapoj rezistory a kondenzátor podle schématu astabilního multivibrátoru."
        },
        {
          title: "Připoj piezo",
          description: "Připoj vhodný piezo měnič na výstup časovače."
        },
        {
          title: "Otestuj tón",
          description: "Připoj nízkonapěťové napájení a ověř vznik zvuku."
        }
      ],
      safety: "Dodrž napájecí rozsah NE555 a limity výstupu. Nepřipojuj nízkoimpedanční reproduktor bez vhodného výstupního stupně."
    },

    {
      id: "rc-filter",
      title: "RC dolní propust",
      category: "circuits",
      level: "intermediate",
      difficulty: 3,
      estimatedTime: "45 minut",
      description: "Sestavení jednoduchého pasivního filtru pro analogové signály.",
      tags: ["RC", "filtr", "frekvence", "kondenzátor"],
      estimatedCost: 50,
      components: [
        { name: "Rezistor 10 kΩ", quantity: 1, price: 3 },
        { name: "Kondenzátor 100 nF", quantity: 1, price: 5 },
        { name: "Nepájivé pole", quantity: 1, price: 30 },
        { name: "Vodiče", quantity: 1, price: 12 }
      ],
      steps: [
        {
          title: "Připrav RC člen",
          description: "Připrav rezistor a kondenzátor."
        },
        {
          title: "Zapoj filtr",
          description: "Zapoj rezistor sériově se vstupem a kondenzátor mezi výstup a zem."
        },
        {
          title: "Vypočítej mezní frekvenci",
          description: "Použij vztah fc = 1 / (2πRC)."
        },
        {
          title: "Proveď měření",
          description: "Porovnej chování filtru při různých vstupních frekvencích."
        }
      ],
      safety: "Nepřiváděj na vstup napětí mimo povolený rozsah měřicího vybavení."
    }

  ];

  /* -------------------------------------------------------
     DATA ACCESS
  ------------------------------------------------------- */

  function getCustom() {
    return APP.storage.get(STORAGE_KEY, []);
  }

  function saveCustom(items) {
    return APP.storage.set(STORAGE_KEY, items);
  }

  function getAll() {
    return [...database, ...getCustom()];
  }

  function getById(id) {
    return getAll().find(project => project.id === id) || null;
  }

  /* -------------------------------------------------------
     PRICE CALCULATIONS
  ------------------------------------------------------- */

  function calculateCost(project) {
    if (!project || !Array.isArray(project.components)) {
      return 0;
    }

    return project.components.reduce((total, component) => {
      const quantity = Math.max(0, Number(component.quantity) || 0);
      const price = Math.max(0, Number(component.price) || 0);

      return total + quantity * price;
    }, 0);
  }

  function getComponentCount(project) {
    if (!project || !Array.isArray(project.components)) {
      return 0;
    }

    return project.components.reduce((total, component) => {
      return total + Math.max(0, Number(component.quantity) || 0);
    }, 0);
  }

  /* -------------------------------------------------------
     SEARCH & FILTER
  ------------------------------------------------------- */

  function search(query = "", filters = {}) {
    const normalized = String(query)
      .trim()
      .toLocaleLowerCase("cs");

    return getAll().filter(project => {
      const searchable = [
        project.title,
        project.description,
        project.category,
        ...(project.tags || []),
        ...(project.components || []).map(item => item.name)
      ].join(" ").toLocaleLowerCase("cs");

      const matchesQuery =
        !normalized || searchable.includes(normalized);

      const matchesCategory =
        !filters.category ||
        project.category === filters.category;

      const matchesLevel =
        !filters.level ||
        project.level === filters.level;

      const matchesFeatured =
        !filters.featured ||
        project.featured === true;

      const matchesBudget =
        filters.maxCost === undefined ||
        calculateCost(project) <= Number(filters.maxCost);

      return (
        matchesQuery &&
        matchesCategory &&
        matchesLevel &&
        matchesFeatured &&
        matchesBudget
      );
    });
  }

  function sort(projects, mode = "name") {
    const result = [...projects];

    switch (mode) {
      case "cost-low":
        return result.sort(
          (a, b) => calculateCost(a) - calculateCost(b)
        );

      case "cost-high":
        return result.sort(
          (a, b) => calculateCost(b) - calculateCost(a)
        );

      case "difficulty":
        return result.sort(
          (a, b) => (a.difficulty || 1) - (b.difficulty || 1)
        );

      case "name":
      default:
        return result.sort(
          (a, b) => a.title.localeCompare(b.title, "cs")
        );
    }
  }

  /* -------------------------------------------------------
     PROJECT CREATION
  ------------------------------------------------------- */

  function validateProject(project) {
    if (!project || typeof project !== "object") {
      throw new Error("Neplatný projekt.");
    }

    if (!APP.validate.text(project.title, 3, 150)) {
      throw new Error("Název musí mít 3 až 150 znaků.");
    }

    if (!APP.validate.text(project.description, 5, 3000)) {
      throw new Error("Popis projektu je příliš krátký nebo dlouhý.");
    }

    if (project.components && !Array.isArray(project.components)) {
      throw new Error("Seznam součástek musí být pole.");
    }

    if (project.steps && !Array.isArray(project.steps)) {
      throw new Error("Postup musí být pole.");
    }
  }

  function add(project) {
    validateProject(project);

    const custom = getCustom();

    const item = {
      id: APP.utils.id("project"),
      title: project.title.trim(),
      category: project.category || "basics",
      level: project.level || "beginner",
      difficulty: Number(project.difficulty) || 1,
      estimatedTime: project.estimatedTime || "Neuvedeno",
      description: project.description.trim(),
      tags: Array.isArray(project.tags) ? project.tags : [],
      featured: false,
      components: Array.isArray(project.components)
        ? project.components
        : [],
      steps: Array.isArray(project.steps)
        ? project.steps
        : [],
      safety: project.safety || "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      custom: true
    };

    custom.push(item);
    saveCustom(custom);

    APP.events.emit("projects:changed", item);

    return item;
  }

  function update(id, changes) {
    const custom = getCustom();
    const index = custom.findIndex(project => project.id === id);

    if (index < 0) {
      throw new Error("Projekt nebyl nalezen nebo není vlastní.");
    }

    const updated = {
      ...custom[index],
      ...changes,
      id,
      updatedAt: Date.now()
    };

    validateProject(updated);

    custom[index] = updated;
    saveCustom(custom);

    APP.events.emit("projects:changed", updated);

    return updated;
  }

  function remove(id) {
    const custom = getCustom();
    const filtered = custom.filter(project => project.id !== id);

    if (filtered.length === custom.length) return false;

    saveCustom(filtered);

    APP.events.emit("projects:deleted", { id });

    return true;
  }

  /* -------------------------------------------------------
     PROJECT PROGRESS
  ------------------------------------------------------- */

  function getProgressData() {
    return APP.storage.get("voltlab_v4_project_progress", {});
  }

  function saveProgressData(data) {
    return APP.storage.set("voltlab_v4_project_progress", data);
  }

  function getProgress(id) {
    const data = getProgressData();

    return data[id] || {
      completedSteps: [],
      status: "not-started",
      updatedAt: null
    };
  }

  function updateProgress(id, completedSteps) {
    const project = getById(id);

    if (!project) {
      throw new Error("Projekt nebyl nalezen.");
    }

    const maxSteps = (project.steps || []).length;

    const validSteps = [...new Set(
      completedSteps
        .map(Number)
        .filter(index =>
          Number.isInteger(index) &&
          index >= 0 &&
          index < maxSteps
        )
    )];

    const status =
      validSteps.length === 0
        ? "not-started"
        : validSteps.length >= maxSteps && maxSteps > 0
          ? "completed"
          : "in-progress";

    const data = getProgressData();

    data[id] = {
      completedSteps: validSteps,
      status,
      updatedAt: Date.now()
    };

    saveProgressData(data);

    APP.events.emit("project:progress", {
      id,
      progress: data[id]
    });

    return data[id];
  }

  function toggleStep(id, stepIndex) {
    const progress = getProgress(id);
    const steps = [...progress.completedSteps];

    const index = steps.indexOf(stepIndex);

    if (index >= 0) {
      steps.splice(index, 1);
    } else {
      steps.push(stepIndex);
    }

    return updateProgress(id, steps);
  }

  function getCompletionPercentage(id) {
    const project = getById(id);

    if (!project || !project.steps?.length) return 0;

    const progress = getProgress(id);

    return Math.round(
      progress.completedSteps.length / project.steps.length * 100
    );
  }

  /* -------------------------------------------------------
     COMPONENT SHOPPING LIST
  ------------------------------------------------------- */

  function getShoppingList(id) {
    const project = getById(id);

    if (!project) return [];

    return (project.components || []).map(component => ({
      ...component,
      totalPrice:
        (Number(component.quantity) || 0) *
        (Number(component.price) || 0),
      checked: false
    }));
  }

  /* -------------------------------------------------------
     FAVORITES
  ------------------------------------------------------- */

  function toggleFavorite(id) {
    const project = getById(id);

    if (!project) return false;

    return APP.data.toggleFavorite(`project:${id}`);
  }

  function isFavorite(id) {
    return APP.data.isFavorite(`project:${id}`);
  }

  function getFavorites() {
    return getAll().filter(project => isFavorite(project.id));
  }

  /* -------------------------------------------------------
     STATISTICS
  ------------------------------------------------------- */

  function getStats() {
    const all = getAll();
    const progress = getProgressData();

    const completed = Object.values(progress).filter(
      item => item.status === "completed"
    ).length;

    return {
      total: all.length,
      custom: getCustom().length,
      featured: all.filter(project => project.featured).length,
      beginner: all.filter(project => project.level === "beginner").length,
      intermediate: all.filter(project => project.level === "intermediate").length,
      advanced: all.filter(project => project.level === "advanced").length,
      completed,
      favorites: getFavorites().length
    };
  }

  /* -------------------------------------------------------
     EXPORT PROJECT
  ------------------------------------------------------- */

  function exportProject(id) {
    const project = getById(id);

    if (!project) {
      throw new Error("Projekt nebyl nalezen.");
    }

    const exportData = {
      app: APP.name,
      version: APP.version,
      type: "voltlab-project",
      exportedAt: new Date().toISOString(),
      project
    };

    APP.utils.download(
      `${project.id}.json`,
      JSON.stringify(exportData, null, 2),
      "application/json"
    );

    return exportData;
  }

  function importProject(data) {
    if (
      !data ||
      data.type !== "voltlab-project" ||
      !data.project
    ) {
      throw new Error("Soubor neobsahuje platný projekt VoltLab.");
    }

    const project = {
      ...data.project,
      id: APP.utils.id("imported-project"),
      custom: true,
      importedAt: Date.now()
    };

    return add(project);
  }

  /* -------------------------------------------------------
     PUBLIC API
  ------------------------------------------------------- */

  APP.projects = {
    database,
    getAll,
    getById,
    search,
    sort,
    add,
    update,
    remove,
    calculateCost,
    getComponentCount,
    getProgress,
    updateProgress,
    toggleStep,
    getCompletionPercentage,
    getShoppingList,
    toggleFavorite,
    isFavorite,
    getFavorites,
    getStats,
    exportProject,
    importProject
  };

  console.info(
    `[VoltLab] Projects loaded: ${getAll().length}`
  );

})();
