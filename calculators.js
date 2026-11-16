
(() => {
  "use strict";

  const APP = window.VOLTLAB;

  if (!APP) {
    console.error("VoltLab: Nejprve načti config.js.");
    return;
  }

  if (APP.calculators?.initialized) return;

  const STORAGE_KEY = APP.storageKeys.calculatorHistory;

  // --------------------------------------------------
  // POMOCNÉ FUNKCE
  // --------------------------------------------------

  const number = (value, label = "Hodnota") => {
    const n = Number(value);

    if (value === "" || value === null || value === undefined ||
        !Number.isFinite(n)) {
      throw new Error(`${label}: zadej platné číslo.`);
    }

    return n;
  };

  const positive = (value, label) => {
    const n = number(value, label);

    if (n <= 0) {
      throw new Error(`${label}: hodnota musí být větší než nula.`);
    }

    return n;
  };

  const optional = (value, fallback) => {
    if (value === "" || value === null || value === undefined) {
      return fallback;
    }
    return number(value);
  };

  const format = (value, digits = 5) => {
    if (!Number.isFinite(value)) return "—";

    return Number(value.toPrecision(digits)).toLocaleString("cs-CZ", {
      maximumSignificantDigits: digits
    });
  };

  const result = (label, value, unit, digits = 5) => ({
    label,
    value,
    unit,
    formatted: `${format(value, digits)} ${unit}`
  });

  const validateResult = results => {
    for (const item of Object.values(results)) {
      if (!Number.isFinite(item.value)) {
        throw new Error("Výpočet vytvořil neplatný výsledek.");
      }
    }
    return results;
  };

  const saveHistory = (id, inputs, results) => {
    try {
      const history = APP.storage.get(STORAGE_KEY, []);

      history.unshift({
        id: APP.utils.id(),
        calculatorId: id,
        calculation: id,
        timestamp: new Date().toISOString(),
        inputs,
        results
      });

      APP.storage.set(STORAGE_KEY, history.slice(0, 100));

      APP.events?.emit("calculator:completed", {
        calculatorId: id,
        results
      });
    } catch (error) {
      console.warn("VoltLab: Historii výpočtu se nepodařilo uložit.", error);
    }
  };

  const define = (id, name, category, description, formula, calculate) => ({
    id,
    name,
    category,
    description,
    formula,
    calculate
  });

  // --------------------------------------------------
  // KALKULAČKY
  // --------------------------------------------------

  const definitions = [];

  function register(definition) {
    definitions.push({
      id: definition.id,
      name: definition.name,
      category: definition.category,
      description: definition.description,
      formula: definition.formula
    });

    calculators[definition.id] = values => {
      if (!values || typeof values !== "object") {
        throw new Error("Chybí vstupní hodnoty.");
      }

      const inputs = { ...values };
      const results = validateResult(definition.calculate(inputs));

      saveHistory(definition.id, inputs, results);

      return results;
    };
  }

  const calculators = {};

  // 1. OHMŮV ZÁKON

  register(define(
    "ohms-law",
    "Ohmův zákon",
    "Základní elektrotechnika",
    "Výpočet napětí, proudu a odporu.",
    "U = R × I",
    v => {
      const u = optional(v.voltage, null);
      const i = optional(v.current, null);
      const r = optional(v.resistance, null);

      const known = [u, i, r].filter(x => x !== null).length;

      if (known !== 2) {
        throw new Error("Vyplň přesně dvě hodnoty.");
      }

      if ([u, i, r].some(x => x !== null && x <= 0)) {
        throw new Error("Hodnoty musí být větší než nula.");
      }

      let U = u;
      let I = i;
      let R = r;

      if (U === null) U = I * R;
      if (I === null) I = U / R;
      if (R === null) R = U / I;

      return {
        voltage: result("Napětí", U, "V"),
        current: result("Proud", I, "A"),
        resistance: result("Odpor", R, "Ω")
      };
    }
  ));

  // 2. ELEKTRICKÝ VÝKON

  register(define(
    "power",
    "Elektrický výkon",
    "Základní elektrotechnika",
    "Výpočet výkonu z napětí a proudu.",
    "P = U × I",
    v => {
      const U = positive(v.voltage, "Napětí");
      const I = positive(v.current, "Proud");
      const P = U * I;

      return {
        power: result("Elektrický výkon", P, "W"),
        voltage: result("Napětí", U, "V"),
        current: result("Proud", I, "A")
      };
    }
  ));

  // 3. REZISTOR PRO LED

  register(define(
    "led-resistor",
    "Rezistor pro LED",
    "Součástky",
    "Výpočet odporu a výkonu rezistoru pro LED.",
    "R = (Uzdroj − ULED) / I",
    v => {
      const supply = positive(v.supplyVoltage, "Napájecí napětí");
      const led = positive(v.ledVoltage, "Úbytek LED");
      const currentMa = positive(v.currentMa, "Proud LED");

      if (supply <= led) {
        throw new Error("Napájecí napětí musí být vyšší než napětí LED.");
      }

      const current = currentMa / 1000;
      const voltage = supply - led;
      const resistance = voltage / current;
      const power = voltage * current;

      const standardValues = [
        1, 1.2, 1.5, 1.8, 2.2, 2.7,
        3.3, 3.9, 4.7, 5.6, 6.8, 8.2
      ];

      const decade = Math.pow(10, Math.floor(Math.log10(resistance)));
      const standard = standardValues
        .map(x => x * decade)
        .find(x => x >= resistance) || 10 * decade;

      const standardPower = current * current * standard;

      return {
        resistance: result("Potřebný odpor", resistance, "Ω"),
        standardResistance: result("Doporučený standardní odpor", standard, "Ω"),
        power: result("Výkon rezistoru", power, "W"),
        recommendedPower: result("Výkon při standardním odporu", standardPower, "W"),
        current: result("Proud LED", current * 1000, "mA")
      };
    }
  ));

  // 4. DĚLIČ NAPĚTÍ

  register(define(
    "voltage-divider",
    "Dělič napětí",
    "Obvody",
    "Výpočet výstupního napětí rezistorového děliče.",
    "Uout = Uin × R2 / (R1 + R2)",
    v => {
      const U = positive(v.inputVoltage, "Vstupní napětí");
      const R1 = positive(v.r1, "Rezistor R1");
      const R2 = positive(v.r2, "Rezistor R2");

      const current = U / (R1 + R2);
      const output = current * R2;

      return {
        outputVoltage: result("Výstupní napětí", output, "V"),
        current: result("Proud děličem", current, "A"),
        totalResistance: result("Celkový odpor", R1 + R2, "Ω"),
        powerR1: result("Výkon R1", current * current * R1, "W"),
        powerR2: result("Výkon R2", current * current * R2, "W")
      };
    }
  ));

  // 5. RC ČASOVÁ KONSTANTA

  register(define(
    "rc-time-constant",
    "RC časová konstanta",
    "Kondenzátory",
    "Výpočet časové konstanty a mezní frekvence RC článku.",
    "τ = R × C",
    v => {
      const R = positive(v.resistance, "Odpor");
      const C = positive(v.capacitance, "Kapacita");

      const tau = R * C;
      const frequency = 1 / (2 * Math.PI * tau);

      return {
        timeConstant: result("Časová konstanta", tau, "s"),
        milliseconds: result("Časová konstanta", tau * 1000, "ms"),
        cutoffFrequency: result("Mezní frekvence", frequency, "Hz")
      };
    }
  ));

  // 6. ENERGIE KONDENZÁTORU

  register(define(
    "capacitor-energy",
    "Energie kondenzátoru",
    "Kondenzátory",
    "Výpočet energie a elektrického náboje.",
    "E = ½ × C × U²",
    v => {
      const C = positive(v.capacitance, "Kapacita");
      const U = positive(v.voltage, "Napětí");

      return {
        energy: result("Uložená energie", 0.5 * C * U * U, "J"),
        charge: result("Elektrický náboj", C * U, "C"),
        voltage: result("Napětí", U, "V")
      };
    }
  ));

  // 7. ENERGIE CÍVKY

  register(define(
    "inductor-energy",
    "Energie cívky",
    "Cívky",
    "Výpočet energie uložené v magnetickém poli cívky.",
    "E = ½ × L × I²",
    v => {
      const L = positive(v.inductance, "Indukčnost");
      const I = positive(v.current, "Proud");

      return {
        energy: result("Uložená energie", 0.5 * L * I * I, "J"),
        inductance: result("Indukčnost", L, "H"),
        current: result("Proud", I, "A")
      };
    }
  ));

  // 8. VÝDRŽ BATERIE

  register(define(
    "battery-runtime",
    "Výdrž baterie",
    "Napájení",
    "Odhad provozní doby baterie podle kapacity a odběru.",
    "t = Kapacita / Proud",
    v => {
      const capacity = positive(v.capacityAh, "Kapacita baterie");
      const current = positive(v.currentA, "Odběr proudu");
      const efficiency = optional(v.efficiency, 100);

      if (efficiency <= 0 || efficiency > 100) {
        throw new Error("Účinnost musí být mezi 0 a 100 %.");
      }

      const hours = capacity / current * efficiency / 100;

      return {
        runtime: result("Odhadovaná výdrž", hours, "h"),
        minutes: result("Odhadovaná výdrž", hours * 60, "min"),
        energy: result("Kapacita při napětí 12 V", capacity * 12, "Wh")
      };
    }
  ));

  // 9. ÚBYTEK NAPĚTÍ NA KABELU

  register(define(
    "cable-voltage-drop",
    "Úbytek napětí na kabelu",
    "Kabeláž",
    "Orientační výpočet úbytku napětí v měděném vodiči.",
    "ΔU = I × ρ × (2 × l) / S",
    v => {
      const length = positive(v.length, "Délka kabelu");
      const current = positive(v.current, "Proud");
      const area = positive(v.area, "Průřez vodiče");
      const voltage = positive(v.voltage, "Napájecí napětí");

      const resistivity = 0.0175;
      const resistance = resistivity * 2 * length / area;
      const drop = current * resistance;
      const percentage = drop / voltage * 100;
      const outputVoltage = voltage - drop;

      if (outputVoltage < 0) {
        throw new Error("Úbytek napětí je vyšší než napájecí napětí.");
      }

      return {
        voltageDrop: result("Úbytek napětí", drop, "V"),
        percentage: result("Procentuální úbytek", percentage, "%"),
        resistance: result("Odpor vedení", resistance, "Ω"),
        outputVoltage: result("Napětí na konci vedení", outputVoltage, "V"),
        powerLoss: result("Ztrátový výkon", current * current * resistance, "W")
      };
    }
  ));

  // 10. INDUKTIVNÍ REAKTANCE

  register(define(
    "inductive-reactance",
    "Induktivní reaktance",
    "Střídavé obvody",
    "Výpočet induktivního odporu cívky při dané frekvenci.",
    "XL = 2 × π × f × L",
    v => {
      const frequency = positive(v.frequency, "Frekvence");
      const inductance = positive(v.inductance, "Indukčnost");

      const XL = 2 * Math.PI * frequency * inductance;

      return {
        reactance: result("Induktivní reaktance", XL, "Ω"),
        frequency: result("Frekvence", frequency, "Hz"),
        inductance: result("Indukčnost", inductance, "H")
      };
    }
  ));

  // 11. KAPACITNÍ REAKTANCE

  register(define(
    "capacitive-reactance",
    "Kapacitní reaktance",
    "Střídavé obvody",
    "Výpočet kapacitního odporu kondenzátoru.",
    "XC = 1 / (2 × π × f × C)",
    v => {
      const frequency = positive(v.frequency, "Frekvence");
      const capacitance = positive(v.capacitance, "Kapacita");

      const XC = 1 / (2 * Math.PI * frequency * capacitance);

      return {
        reactance: result("Kapacitní reaktance", XC, "Ω"),
        frequency: result("Frekvence", frequency, "Hz"),
        capacitance: result("Kapacita", capacitance, "F")
      };
    }
  ));

  // --------------------------------------------------
  // VEŘEJNÉ API
  // --------------------------------------------------

  APP.calculators = {
    initialized: true,

    definitions,

    search(query = "") {
      const q = String(query).trim().toLocaleLowerCase("cs-CZ");

      if (!q) return [...definitions];

      return definitions.filter(item =>
        [
          item.id,
          item.name,
          item.category,
          item.description,
          item.formula
        ].join(" ").toLocaleLowerCase("cs-CZ").includes(q)
      );
    },

    getById(id) {
      return definitions.find(item => item.id === id) || null;
    },

    calculate(id, values) {
      const calculator = calculators[id];

      if (!calculator) {
        throw new Error("Neznámá kalkulačka.");
      }

      return calculator(values);
    },

    getHistory(limit = 100) {
      const history = APP.storage.get(STORAGE_KEY, []);

      return Array.isArray(history)
        ? history.slice(0, Math.max(0, limit))
        : [];
    },

    clearHistory() {
      APP.storage.set(STORAGE_KEY, []);
      APP.events?.emit("calculator:history-cleared");
    },

    removeHistoryItem(id) {
      const history = this.getHistory();
      const updated = history.filter(item => item.id !== id);

      APP.storage.set(STORAGE_KEY, updated);
      return updated.length !== history.length;
    },

    getStats() {
      const history = this.getHistory();

      return {
        total: history.length,
        available: definitions.length,
        mostUsed: Object.entries(
          history.reduce((counts, item) => {
            counts[item.calculatorId] =
              (counts[item.calculatorId] || 0) + 1;
            return counts;
          }, {})
        ).sort((a, b) => b[1] - a[1])[0]?.[0] || null
      };
    }
  };

  // Zpřístupnění jednotlivých kalkulaček pro app.js.
  Object.assign(APP.calculators, calculators);

  console.log("VoltLab: Kalkulačky V4 MAX připraveny.");
})();
