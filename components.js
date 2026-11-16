
/* =========================================================
   VOLTLAB V4 MAX
   ELECTRONIC COMPONENT DATABASE
   ========================================================= */

"use strict";

window.VOLTLAB = window.VOLTLAB || {};

(() => {
  const APP = window.VOLTLAB;
  const STORAGE_KEY = APP.storageKeys.customComponents;

  /* -------------------------------------------------------
     COMPONENT DATABASE
  ------------------------------------------------------- */

  const database = [

    // RESISTORS

    {
      id: "res-220",
      name: "Rezistor 220 Ω",
      category: "resistor",
      type: "Pasivní součástka",
      description: "Běžný rezistor pro omezení proudu v elektronických obvodech.",
      symbol: "R",
      value: "220 Ω",
      parameters: {
        resistance: "220 Ω",
        tolerance: "±5 %",
        power: "0,25 W",
        technology: "THT"
      },
      applications: ["LED obvody", "Dělič napětí", "Základní elektronika"],
      tags: ["rezistor", "odpor", "220", "LED"],
      datasheet: "",
      featured: true
    },

    {
      id: "res-330",
      name: "Rezistor 330 Ω",
      category: "resistor",
      type: "Pasivní součástka",
      description: "Často používaný rezistor pro omezení proudu LED.",
      symbol: "R",
      value: "330 Ω",
      parameters: {
        resistance: "330 Ω",
        tolerance: "±5 %",
        power: "0,25 W",
        technology: "THT"
      },
      applications: ["LED", "Digitální výstupy", "Prototypování"],
      tags: ["rezistor", "330", "LED"],
      datasheet: ""
    },

    {
      id: "res-1k",
      name: "Rezistor 1 kΩ",
      category: "resistor",
      type: "Pasivní součástka",
      description: "Univerzální rezistor pro běžné elektronické obvody.",
      symbol: "R",
      value: "1 kΩ",
      parameters: {
        resistance: "1000 Ω",
        tolerance: "±5 %",
        power: "0,25 W",
        technology: "THT"
      },
      applications: ["Dělič napětí", "Pull-up", "Pull-down"],
      tags: ["rezistor", "1k", "odpor"],
      datasheet: ""
    },

    {
      id: "res-10k",
      name: "Rezistor 10 kΩ",
      category: "resistor",
      type: "Pasivní součástka",
      description: "Velmi častá hodnota pro signálové obvody a děliče.",
      symbol: "R",
      value: "10 kΩ",
      parameters: {
        resistance: "10000 Ω",
        tolerance: "±5 %",
        power: "0,25 W",
        technology: "THT"
      },
      applications: ["Pull-up", "Pull-down", "Senzory"],
      tags: ["rezistor", "10k", "odpor"],
      datasheet: ""
    },

    // CAPACITORS

    {
      id: "cap-100nf",
      name: "Keramický kondenzátor 100 nF",
      category: "capacitor",
      type: "Keramický kondenzátor",
      description: "Běžný blokovací kondenzátor pro potlačení rušení napájení.",
      symbol: "C",
      value: "100 nF",
      parameters: {
        capacitance: "100 nF",
        voltage: "50 V",
        dielectric: "X7R",
        polarity: "Nepolarizovaný"
      },
      applications: ["Blokování napájení", "Filtrace", "Digitální obvody"],
      tags: ["kondenzátor", "100nF", "keramika"],
      datasheet: ""
    },

    {
      id: "cap-100uf",
      name: "Elektrolytický kondenzátor 100 µF",
      category: "capacitor",
      type: "Elektrolytický kondenzátor",
      description: "Polarizovaný kondenzátor používaný pro filtraci napájení.",
      symbol: "C",
      value: "100 µF",
      parameters: {
        capacitance: "100 µF",
        voltage: "25 V",
        polarity: "Polarizovaný",
        technology: "THT"
      },
      applications: ["Filtrace", "Napájecí zdroje", "Vyhlazení napětí"],
      tags: ["kondenzátor", "100uF", "elektrolyt"],
      datasheet: ""
    },

    {
      id: "cap-10uf",
      name: "Elektrolytický kondenzátor 10 µF",
      category: "capacitor",
      type: "Elektrolytický kondenzátor",
      description: "Menší polarizovaný kondenzátor pro filtrační a časovací obvody.",
      symbol: "C",
      value: "10 µF",
      parameters: {
        capacitance: "10 µF",
        voltage: "25 V",
        polarity: "Polarizovaný"
      },
      applications: ["Filtrace", "Časování", "Analogové obvody"],
      tags: ["kondenzátor", "10uF"],
      datasheet: ""
    },

    // DIODES

    {
      id: "diode-1n4007",
      name: "1N4007",
      category: "diode",
      type: "Usměrňovací dioda",
      description: "Běžná usměrňovací dioda pro nízkofrekvenční aplikace.",
      symbol: "D",
      value: "1N4007",
      parameters: {
        repetitivePeakReverseVoltage: "1000 V",
        averageForwardCurrent: "1 A",
        technology: "THT",
        package: "DO-41"
      },
      applications: ["Usměrňovače", "Ochrana proti přepólování", "Napájení"],
      tags: ["dioda", "usměrnění", "1N4007"],
      datasheet: ""
    },

    {
      id: "diode-1n4148",
      name: "1N4148",
      category: "diode",
      type: "Spínací dioda",
      description: "Rychlá malá signálová dioda.",
      symbol: "D",
      value: "1N4148",
      parameters: {
        repetitivePeakReverseVoltage: "100 V",
        averageForwardCurrent: "150 mA",
        package: "DO-35"
      },
      applications: ["Signálové obvody", "Spínání", "Logika"],
      tags: ["dioda", "1N4148", "signál"],
      datasheet: ""
    },

    {
      id: "led-red",
      name: "Červená LED 5 mm",
      category: "led",
      type: "Světelná dioda",
      description: "Červená indikační LED s pouzdrem 5 mm.",
      symbol: "LED",
      value: "5 mm",
      parameters: {
        typicalForwardVoltage: "Přibližně 1,8–2,2 V",
        recommendedCurrent: "Podle katalogového listu",
        color: "Červená",
        package: "THT 5 mm"
      },
      applications: ["Indikace", "Osvětlení", "Signalizace"],
      tags: ["LED", "červená", "5mm"],
      datasheet: ""
    },

    // TRANSISTORS

    {
      id: "trans-bc547",
      name: "BC547",
      category: "transistor",
      type: "NPN bipolární tranzistor",
      description: "Malý univerzální NPN tranzistor pro signálové aplikace.",
      symbol: "Q",
      value: "BC547",
      parameters: {
        polarity: "NPN",
        collectorEmitterVoltage: "45 V",
        collectorCurrent: "100 mA",
        package: "TO-92"
      },
      applications: ["Spínání", "Zesilování", "Ovládání LED"],
      tags: ["tranzistor", "NPN", "BC547"],
      datasheet: ""
    },

    {
      id: "trans-bc557",
      name: "BC557",
      category: "transistor",
      type: "PNP bipolární tranzistor",
      description: "Univerzální malý PNP tranzistor.",
      symbol: "Q",
      value: "BC557",
      parameters: {
        polarity: "PNP",
        collectorEmitterVoltage: "45 V",
        collectorCurrent: "100 mA",
        package: "TO-92"
      },
      applications: ["Spínání", "Zesilování", "Analogové obvody"],
      tags: ["tranzistor", "PNP", "BC557"],
      datasheet: ""
    },

    {
      id: "mosfet-irfz44n",
      name: "IRFZ44N",
      category: "mosfet",
      type: "N-kanálový výkonový MOSFET",
      description: "Výkonový MOSFET určený pro aplikace s odpovídajícím napětím řízení gate.",
      symbol: "Q",
      value: "IRFZ44N",
      parameters: {
        channel: "N-channel",
        drainSourceVoltage: "55 V",
        continuousDrainCurrent: "49 A při stanovených podmínkách chlazení",
        package: "TO-220",
        rdsOn: "Katalogově přibližně 17,5 mΩ při VGS = 10 V"
      },
      applications: ["Spínání", "Výkonové obvody", "Měniče"],
      tags: ["MOSFET", "IRFZ44N", "N-channel"],
      datasheet: ""
    },

    // INTEGRATED CIRCUITS

    {
      id: "ic-ne555",
      name: "NE555",
      category: "ic",
      type: "Časovač",
      description: "Klasický časovač používaný pro generování pulzů a časování.",
      symbol: "U",
      value: "NE555",
      parameters: {
        supplyVoltage: "Podle konkrétní varianty, běžně 4,5–16 V",
        output: "Digitální výstup",
        package: "DIP-8 / SOIC-8"
      },
      applications: ["Časování", "PWM", "Generátory", "Blikače"],
      tags: ["NE555", "časovač", "555"],
      datasheet: ""
    },

    {
      id: "ic-lm358",
      name: "LM358",
      category: "ic",
      type: "Dvojitý operační zesilovač",
      description: "Integrovaný obvod se dvěma operačními zesilovači.",
      symbol: "U",
      value: "LM358",
      parameters: {
        channels: "2",
        supply: "Jednoduché nebo symetrické napájení podle varianty",
        package: "DIP-8 / SOIC-8"
      },
      applications: ["Zesilovače", "Senzory", "Filtry", "Komparátory"],
      tags: ["LM358", "operační zesilovač"],
      datasheet: ""
    },

    // MICROCONTROLLERS

    {
      id: "arduino-uno",
      name: "Arduino Uno",
      category: "microcontroller",
      type: "Vývojová deska",
      description: "Populární vývojová platforma pro výuku a prototypování.",
      symbol: "MCU",
      value: "Arduino Uno",
      parameters: {
        processor: "ATmega328P",
        digitalPins: "14",
        pwmPins: "6",
        analogInputs: "6",
        operatingVoltage: "5 V",
        flashMemory: "32 KB"
      },
      applications: ["Prototypování", "Automatizace", "Výuka"],
      tags: ["Arduino", "mikrokontrolér", "ATmega328P"],
      datasheet: ""
    },

    {
      id: "esp32",
      name: "ESP32",
      category: "microcontroller",
      type: "Bezdrátový mikrokontrolér",
      description: "Mikrokontrolér s podporou Wi-Fi a Bluetooth; přesné parametry závisí na variantě.",
      symbol: "MCU",
      value: "ESP32",
      parameters: {
        connectivity: "Wi-Fi, Bluetooth podle varianty",
        logicVoltage: "3,3 V",
        processor: "Podle konkrétní varianty",
        gpio: "Podle konkrétní varianty"
      },
      applications: ["IoT", "Bezdrátové senzory", "Automatizace"],
      tags: ["ESP32", "Wi-Fi", "Bluetooth", "IoT"],
      datasheet: ""
    },

    // SENSORS

    {
      id: "sensor-ldr",
      name: "Fotorezistor LDR",
      category: "sensor",
      type: "Světelný senzor",
      description: "Součástka, jejíž odpor se mění podle intenzity osvětlení.",
      symbol: "LDR",
      value: "LDR",
      parameters: {
        principle: "Fotovodivost",
        output: "Změna odporu",
        polarity: "Bez polarity"
      },
      applications: ["Automatické osvětlení", "Měření světla", "Senzorové obvody"],
      tags: ["LDR", "senzor", "světlo"],
      datasheet: ""
    },

    {
      id: "sensor-dht22",
      name: "DHT22",
      category: "sensor",
      type: "Teplotní a vlhkostní senzor",
      description: "Digitální senzor pro měření teploty a relativní vlhkosti.",
      symbol: "S",
      value: "DHT22",
      parameters: {
        temperatureRange: "Přibližně −40 až 80 °C",
        humidityRange: "0–100 % RH",
        interface: "Digitální"
      },
      applications: ["Meteorologické stanice", "IoT", "Monitoring"],
      tags: ["DHT22", "teplota", "vlhkost"],
      datasheet: ""
    },

    // SWITCHES AND OTHER PARTS

    {
      id: "relay-5v",
      name: "Relé 5 V",
      category: "relay",
      type: "Elektromechanické relé",
      description: "Elektromagneticky ovládaný spínací prvek.",
      symbol: "K",
      value: "5 V",
      parameters: {
        coilVoltage: "5 V",
        contacts: "Podle konkrétní varianty",
        contactRating: "Ověřit podle katalogového listu"
      },
      applications: ["Spínání zátěží", "Automatizace", "Řízení"],
      tags: ["relé", "5V", "spínač"],
      datasheet: ""
    },

    {
      id: "switch-pushbutton",
      name: "Tlačítko",
      category: "switch",
      type: "Mechanický spínač",
      description: "Momentový spínací prvek pro ovládání obvodů.",
      symbol: "SW",
      value: "Push button",
      parameters: {
        operation: "Momentové",
        contacts: "Podle varianty",
        mounting: "THT"
      },
      applications: ["Ovládání", "Reset", "Digitální vstupy"],
      tags: ["tlačítko", "spínač"],
      datasheet: ""
    }

  ];

  /* -------------------------------------------------------
     CATEGORY DEFINITIONS
  ------------------------------------------------------- */

  const categories = [
    { id: "resistor", name: "Rezistory", icon: "▤" },
    { id: "capacitor", name: "Kondenzátory", icon: "Ⅱ" },
    { id: "inductor", name: "Cívky", icon: "∿" },
    { id: "diode", name: "Diody", icon: "▷" },
    { id: "led", name: "LED", icon: "✧" },
    { id: "transistor", name: "Tranzistory", icon: "⑂" },
    { id: "mosfet", name: "MOSFET", icon: "⌁" },
    { id: "ic", name: "Integrované obvody", icon: "▦" },
    { id: "microcontroller", name: "Mikrokontroléry", icon: "⌘" },
    { id: "sensor", name: "Senzory", icon: "◉" },
    { id: "relay", name: "Relé", icon: "⚡" },
    { id: "switch", name: "Spínače", icon: "⏻" },
    { id: "other", name: "Ostatní", icon: "▧" }
  ];

  /* -------------------------------------------------------
     STORAGE
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
    return getAll().find(item => item.id === id) || null;
  }

  /* -------------------------------------------------------
     SEARCH
  ------------------------------------------------------- */

  function search(query = "", filters = {}) {
    const normalized = String(query)
      .trim()
      .toLocaleLowerCase("cs");

    return getAll().filter(component => {
      const searchable = [
        component.name,
        component.description,
        component.value,
        component.type,
        component.category,
        ...(component.tags || []),
        ...(component.applications || []),
        ...Object.values(component.parameters || {})
      ].join(" ").toLocaleLowerCase("cs");

      const matchesQuery =
        !normalized || searchable.includes(normalized);

      const matchesCategory =
        !filters.category ||
        component.category === filters.category;

      const matchesType =
        !filters.type ||
        component.type === filters.type;

      const matchesFeatured =
        !filters.featured ||
        component.featured === true;

      return (
        matchesQuery &&
        matchesCategory &&
        matchesType &&
        matchesFeatured
      );
    });
  }

  function getByCategory(category) {
    return getAll().filter(
      component => component.category === category
    );
  }

  /* -------------------------------------------------------
     CREATE CUSTOM COMPONENT
  ------------------------------------------------------- */

  function add(component) {
    if (!component || typeof component !== "object") {
      throw new Error("Neplatná součástka.");
    }

    if (!APP.validate.text(component.name, 2, 150)) {
      throw new Error("Název musí mít 2 až 150 znaků.");
    }

    if (!APP.validate.text(component.description, 3, 3000)) {
      throw new Error("Popis součástky není platný.");
    }

    const custom = getCustom();

    const item = {
      id: APP.utils.id("component"),
      name: component.name.trim(),
      category: component.category || "other",
      type: component.type || "Vlastní součástka",
      description: component.description,
      symbol: component.symbol || "",
      value: component.value || "",
      parameters: component.parameters || {},
      applications: component.applications || [],
      tags: component.tags || [],
      datasheet: "",
      featured: false,
      custom: true,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    custom.push(item);
    saveCustom(custom);

    APP.events.emit("components:changed", item);

    return item;
  }

  /* -------------------------------------------------------
     UPDATE
  ------------------------------------------------------- */

  function update(id, changes) {
    const custom = getCustom();
    const index = custom.findIndex(item => item.id === id);

    if (index < 0) {
      throw new Error("Součástka nebyla nalezena nebo není vlastní.");
    }

    const updated = {
      ...custom[index],
      ...changes,
      id,
      custom: true,
      updatedAt: Date.now()
    };

    if (!APP.validate.text(updated.name, 2, 150)) {
      throw new Error("Neplatný název.");
    }

    custom[index] = updated;
    saveCustom(custom);

    APP.events.emit("components:changed", updated);

    return updated;
  }

  /* -------------------------------------------------------
     DELETE
  ------------------------------------------------------- */

  function remove(id) {
    const custom = getCustom();
    const filtered = custom.filter(item => item.id !== id);

    if (filtered.length === custom.length) return false;

    saveCustom(filtered);

    APP.events.emit("components:deleted", { id });

    return true;
  }

  /* -------------------------------------------------------
     FAVORITES
  ------------------------------------------------------- */

  function toggleFavorite(id) {
    if (!getById(id)) return false;

    return APP.data.toggleFavorite(`component:${id}`);
  }

  function isFavorite(id) {
    return APP.data.isFavorite(`component:${id}`);
  }

  function getFavorites() {
    return getAll().filter(item => isFavorite(item.id));
  }

  /* -------------------------------------------------------
     COMPONENT COMPARISON
  ------------------------------------------------------- */

  function compare(ids) {
    if (!Array.isArray(ids) || ids.length < 2) {
      throw new Error("Vyber alespoň dvě součástky.");
    }

    return ids.map(id => {
      const component = getById(id);

      if (!component) {
        throw new Error(`Součástka ${id} nebyla nalezena.`);
      }

      return {
        id: component.id,
        name: component.name,
        category: component.category,
        parameters: component.parameters
      };
    });
  }

  /* -------------------------------------------------------
     STATISTICS
  ------------------------------------------------------- */

  function getStats() {
    const all = getAll();

    const byCategory = {};

    categories.forEach(category => {
      byCategory[category.id] = all.filter(
        item => item.category === category.id
      ).length;
    });

    return {
      total: all.length,
      custom: getCustom().length,
      favorites: getFavorites().length,
      categories: byCategory
    };
  }

  /* -------------------------------------------------------
     EXPORT
  ------------------------------------------------------- */

  function exportCustom() {
    const data = {
      app: APP.name,
      version: APP.version,
      type: "voltlab-components",
      exportedAt: new Date().toISOString(),
      components: getCustom()
    };

    APP.utils.download(
      "voltlab-components.json",
      JSON.stringify(data, null, 2),
      "application/json"
    );

    return data;
  }

  function importCustom(data) {
    if (
      !data ||
      data.type !== "voltlab-components" ||
      !Array.isArray(data.components)
    ) {
      throw new Error("Neplatný soubor databáze součástek.");
    }

    const imported = data.components.map(component => ({
      ...component,
      id: APP.utils.id("imported-component"),
      custom: true,
      importedAt: Date.now()
    }));

    const combined = [...getCustom(), ...imported];

    saveCustom(combined);

    APP.events.emit("components:imported", {
      count: imported.length
    });

    return imported;
  }

  /* -------------------------------------------------------
     PUBLIC API
  ------------------------------------------------------- */

  APP.components = {
    database,
    categories,
    getAll,
    getById,
    search,
    getByCategory,
    add,
    update,
    remove,
    toggleFavorite,
    isFavorite,
    getFavorites,
    compare,
    getStats,
    exportCustom,
    importCustom
  };

  console.info(
    `[VoltLab] Components loaded: ${getAll().length}`
  );

})();
