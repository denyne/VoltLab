```javascript
/* =========================================================
   VOLTLAB V3.1 — ENGINEERING CALCULATORS
   Ohm's law · Electrical power · LED resistor
   Unit converter · Resistor networks · Capacitor energy
   ========================================================= */

(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  // ---------------------------------------------------------
  // NUMBER HELPERS
  // ---------------------------------------------------------

  function readNumber(id) {
    const element = $(id);
    if (!element) return null;

    const raw = element.value.trim().replace(",", ".");

    if (raw === "") return null;

    const value = Number(raw);

    return Number.isFinite(value) ? value : NaN;
  }

  function format(value, digits = 4) {
    if (!Number.isFinite(value)) return "—";

    return new Intl.NumberFormat("cs-CZ", {
      maximumSignificantDigits: digits
    }).format(value);
  }

  function formatAuto(value, unit = "Ω") {
    if (!Number.isFinite(value)) return "—";

    const abs = Math.abs(value);

    if (unit === "Ω") {
      if (abs >= 1_000_000) return `${format(value / 1_000_000)} MΩ`;
      if (abs >= 1_000) return `${format(value / 1_000)} kΩ`;
      if (abs > 0 && abs < 0.001) return `${format(value * 1_000_000)} µΩ`;
      if (abs > 0 && abs < 1) return `${format(value * 1_000)} mΩ`;
    }

    if (unit === "V") {
      if (abs >= 1_000) return `${format(value / 1_000)} kV`;
      if (abs > 0 && abs < 1) return `${format(value * 1_000)} mV`;
    }

    if (unit === "A") {
      if (abs >= 1) return `${format(value)} A`;
      if (abs >= 0.001) return `${format(value * 1_000)} mA`;
      if (abs > 0) return `${format(value * 1_000_000)} µA`;
    }

    if (unit === "W") {
      if (abs >= 1_000) return `${format(value / 1_000)} kW`;
      if (abs >= 1) return `${format(value)} W`;
      if (abs >= 0.001) return `${format(value * 1_000)} mW`;
      if (abs > 0) return `${format(value * 1_000_000)} µW`;
    }

    return `${format(value)} ${unit}`;
  }

  function formatEnergy(value) {
    if (value >= 1) return `${format(value)} J`;
    if (value >= 0.001) return `${format(value * 1000)} mJ`;
    if (value >= 0.000001) return `${format(value * 1_000_000)} µJ`;
    return `${format(value * 1_000_000_000)} nJ`;
  }

  function formatCharge(value) {
    if (value >= 1) return `${format(value)} C`;
    if (value >= 0.001) return `${format(value * 1000)} mC`;
    if (value >= 0.000001) return `${format(value * 1_000_000)} µC`;
    return `${format(value * 1_000_000_000)} nC`;
  }

  function showResult(id, message, isError = false) {
    const element = $(id);
    if (!element) return;

    element.textContent = message;
    element.classList.toggle("has-result", !isError);
    element.classList.toggle("has-error", isError);
  }

  function bind(id, event, callback) {
    const element = $(id);

    if (element) {
      element.addEventListener(event, callback);
    }
  }

  function positive(value, label) {
    if (value === null || !Number.isFinite(value) || value <= 0) {
      throw new Error(`${label} musí být kladné číslo.`);
    }

    return value;
  }

  function nonNegative(value, label) {
    if (value === null || !Number.isFinite(value) || value < 0) {
      throw new Error(`${label} nesmí být záporné.`);
    }

    return value;
  }

  function runCalculation(resultId, callback) {
    try {
      callback();
    } catch (error) {
      showResult(
        resultId,
        error.message || "Zkontroluj zadané hodnoty.",
        true
      );
    }
  }

  // ---------------------------------------------------------
  // UNIT CONVERTER
  // ---------------------------------------------------------

  const unitFactors = {
    voltage: {
      V: 1,
      mV: 0.001,
      kV: 1000
    },

    current: {
      A: 1,
      mA: 0.001,
      µA: 0.000001
    },

    resistance: {
      "Ω": 1,
      kΩ: 1000,
      MΩ: 1000000
    },

    capacitance: {
      F: 1,
      mF: 0.001,
      µF: 0.000001,
      nF: 0.000000001,
      pF: 0.000000000001
    },

    power: {
      W: 1,
      mW: 0.001,
      kW: 1000
    },

    time: {
      s: 1,
      ms: 0.001,
      min: 60,
      h: 3600
    },

    frequency: {
      Hz: 1,
      kHz: 1000,
      MHz: 1000000,
      GHz: 1000000000
    }
  };

  const conversionUnits = {
    voltage: ["V", "mV", "kV"],
    current: ["A", "mA", "µA"],
    resistance: ["Ω", "kΩ", "MΩ"],
    capacitance: ["F", "mF", "µF", "nF", "pF"],
    power: ["W", "mW", "kW"],
    time: ["s", "ms", "min", "h"],
    frequency: ["Hz", "kHz", "MHz", "GHz"]
  };

  function initConverter() {
    const type = $("convert-type");
    const from = $("convert-from");
    const to = $("convert-to");

    if (!type || !from || !to) return;

    function updateOptions() {
      const units = conversionUnits[type.value] || [];

      from.replaceChildren();
      to.replaceChildren();

      units.forEach((unit) => {
        from.add(new Option(unit, unit));
        to.add(new Option(unit, unit));
      });

      if (units.length > 1) {
        from.value = units[0];
        to.value = units[1];
      }
    }

    updateOptions();

    bind("convert-type", "change", updateOptions);

    bind("convert-calculate", "click", () => {
      runCalculation("convert-result", () => {
        const value = readNumber("convert-value");

        if (value === null || !Number.isFinite(value)) {
          throw new Error("Zadej platnou hodnotu.");
        }

        const factors = unitFactors[type.value];

        const source = factors?.[from.value];
        const target = factors?.[to.value];

        if (source === undefined || target === undefined) {
          throw new Error("Vybrané jednotky nejsou podporované.");
        }

        const result = value * source / target;

        if (!Number.isFinite(result)) {
          throw new Error("Výsledek je mimo rozsah kalkulačky.");
        }

        showResult(
          "convert-result",
          `${format(value)} ${from.value} = ${format(result)} ${to.value}`
        );
      });
    });
  }

  // ---------------------------------------------------------
  // OHM'S LAW
  // ---------------------------------------------------------

  function initOhm() {
    bind("ohm-calculate", "click", () => {
      runCalculation("ohm-result", () => {
        const voltage = readNumber("ohm-voltage");
        const current = readNumber("ohm-current");
        const resistance = readNumber("ohm-resistance");

        const filled = [
          voltage,
          current,
          resistance
        ].filter((value) => value !== null);

        if (filled.length !== 2) {
          throw new Error(
            "Vyplň přesně dvě hodnoty. Třetí dopočítáme."
          );
        }

        if (voltage !== null) positive(voltage, "Napětí");
        if (current !== null) positive(current, "Proud");
        if (resistance !== null) positive(resistance, "Odpor");

        // Select values are numeric multipliers.
        const voltageFactor = Number($("ohm-voltage-unit")?.value ?? 1);
        const currentFactor = Number($("ohm-current-unit")?.value ?? 1);
        const resistanceFactor = Number($("ohm-resistance-unit")?.value ?? 1);

        const V = voltage === null ? null : voltage * voltageFactor;
        const I = current === null ? null : current * currentFactor;
        const R = resistance === null ? null : resistance * resistanceFactor;

        let message;

        if (V === null) {
          const result = I * R;
          message = `Napětí: ${formatAuto(result, "V")}`;
        } else if (I === null) {
          const result = V / R;
          message = `Proud: ${formatAuto(result, "A")}`;
        } else {
          const result = V / I;
          message = `Odpor: ${formatAuto(result, "Ω")}`;
        }

        showResult("ohm-result", message);
      });
    });
  }

  // ---------------------------------------------------------
  // ELECTRICAL POWER
  // ---------------------------------------------------------

  function initPower() {
    bind("power-calculate", "click", () => {
      runCalculation("power-result", () => {
        const target = $("power-target")?.value || "power";

        const voltageInput = readNumber("power-voltage");
        const currentInput = readNumber("power-current");
        const wattsInput = readNumber("power-watts");

        // Select values are numeric multipliers.
        const voltageFactor = Number($("power-voltage-unit")?.value ?? 1);
        const currentFactor = Number($("power-current-unit")?.value ?? 1);
        const powerFactor = Number($("power-watts-unit")?.value ?? 1);

        const V = voltageInput === null
          ? null
          : voltageInput * voltageFactor;

        const I = currentInput === null
          ? null
          : currentInput * currentFactor;

        const P = wattsInput === null
          ? null
          : wattsInput * powerFactor;

        const values = {
          voltage: V,
          current: I,
          power: P
        };

        const missing = Object.keys(values).filter(
          (key) => values[key] === null
        );

        if (missing.length !== 1 || missing[0] !== target) {
          throw new Error(
            "Vyber veličinu k výpočtu a vyplň zbývající dvě hodnoty."
          );
        }

        Object.entries(values).forEach(([key, value]) => {
          if (key !== target) {
            positive(value, "Zadaná hodnota");
          }
        });

        let result;
        let message;

        if (target === "power") {
          result = V * I;
          message = `Výkon: ${formatAuto(result, "W")}`;
        } else if (target === "voltage") {
          result = P / I;
          message = `Napětí: ${formatAuto(result, "V")}`;
        } else if (target === "current") {
          result = P / V;
          message = `Proud: ${formatAuto(result, "A")}`;
        } else {
          throw new Error("Neznámá veličina k výpočtu.");
        }

        if (!Number.isFinite(result)) {
          throw new Error("Výsledek nelze vypočítat.");
        }

        showResult("power-result", message);
      });
    });
  }

  // ---------------------------------------------------------
  // LED RESISTOR CALCULATOR
  // ---------------------------------------------------------

  function nearestE12Above(value) {
    const e12 = [
      1.0, 1.2, 1.5, 1.8, 2.2, 2.7,
      3.3, 3.9, 4.7, 5.6, 6.8, 8.2
    ];

    if (!Number.isFinite(value) || value <= 0) {
      return null;
    }

    const exponent = Math.floor(Math.log10(value));

    for (let scale = exponent - 1; scale <= exponent + 2; scale++) {
      const multiplier = Math.pow(10, scale);

      for (const number of e12) {
        const candidate = number * multiplier;

        if (candidate >= value) {
          return candidate;
        }
      }
    }

    return null;
  }

  function recommendedResistorPower(power) {
    // Conservative recommendation: choose a rating at least
    // twice the calculated dissipation.
    const required = power * 2;

    const ratings = [
      0.125,
      0.25,
      0.5,
      1,
      2,
      3,
      5,
      10,
      15,
      20,
      25,
      50,
      100
    ];

    return ratings.find((rating) => rating >= required)
      || Math.ceil(required);
  }

  function initLed() {
    bind("led-calculate", "click", () => {
      runCalculation("led-result", () => {
        const supply = positive(
          readNumber("led-supply"),
          "Napájecí napětí"
        );

        const forward = nonNegative(
          readNumber("led-forward"),
          "Úbytek LED"
        );

        const current = positive(
          readNumber("led-current"),
          "Proud LED"
        );

        if (supply <= forward) {
          throw new Error(
            "Napájecí napětí musí být vyšší než napětí LED."
          );
        }

        const currentA = current / 1000;

        const idealResistance = (supply - forward) / currentA;

        const standardResistance = nearestE12Above(idealResistance);

        if (!standardResistance) {
          throw new Error("Požadovaný odpor je mimo rozsah kalkulačky.");
        }

        const actualCurrent = (supply - forward) / standardResistance;

        const resistorPower =
          Math.pow(supply - forward, 2) / standardResistance;

        const recommendedPower = recommendedResistorPower(resistorPower);

        showResult(
          "led-result",
          `Ideální odpor: ${formatAuto(idealResistance, "Ω")}\n` +
          `Doporučený E12 odpor: ${formatAuto(standardResistance, "Ω")}\n` +
          `Skutečný proud: ${formatAuto(actualCurrent, "A")}\n` +
          `Ztrátový výkon: ${formatAuto(resistorPower, "W")}\n` +
          `Doporučený výkon rezistoru: alespoň ${format(recommendedPower)} W`
        );
      });
    });
  }

  // ---------------------------------------------------------
  // RESISTOR NETWORKS
  // ---------------------------------------------------------

  function parseResistorValues(raw) {
    const input = raw.trim();

    if (!input) return [];

    let parts;

    if (input.includes(";")) {
      // Semicolon allows decimal commas:
      // 1,5; 2,5; 3,5
      parts = input.split(";");
      parts = parts.map((item) => item.trim().replace(",", "."));
    } else {
      // Commas or spaces separate individual resistors:
      // 100, 220, 330
      parts = input.split(/[,\s]+/).map((item) => item.trim());
    }

    return parts
      .filter(Boolean)
      .map((item) => Number(item));
  }

  function initResistors() {
    bind("resistor-calculate", "click", () => {
      runCalculation("resistor-result", () => {
        const raw = $("resistor-values")?.value || "";

        const values = parseResistorValues(raw);

        if (values.length < 2) {
          throw new Error(
            "Zadej alespoň dva odpory oddělené čárkou nebo středníkem."
          );
        }

        if (values.some(
          (value) => !Number.isFinite(value) || value <= 0
        )) {
          throw new Error(
            "Všechny odpory musí být kladná čísla."
          );
        }

        const mode = $("resistor-mode")?.value || "series";

        let result;

        if (mode === "parallel") {
          result = 1 / values.reduce(
            (sum, value) => sum + 1 / value,
            0
          );
        } else if (mode === "series") {
          result = values.reduce(
            (sum, value) => sum + value,
            0
          );
        } else {
          throw new Error("Neznámý typ zapojení.");
        }

        if (!Number.isFinite(result) || result <= 0) {
          throw new Error("Výsledný odpor nelze vypočítat.");
        }

        const label = mode === "parallel"
          ? "Výsledný paralelní odpor"
          : "Výsledný sériový odpor";

        showResult(
          "resistor-result",
          `${label}: ${formatAuto(result, "Ω")}\n` +
          `Počet rezistorů: ${values.length}`
        );
      });
    });
  }

  // ---------------------------------------------------------
  // CAPACITOR ENERGY
  // ---------------------------------------------------------

  function initCapacitor() {
    bind("cap-energy-calculate", "click", () => {
      runCalculation("cap-energy-result", () => {
        const capacitance = positive(
          readNumber("cap-energy-capacitance"),
          "Kapacita"
        );

        const voltage = nonNegative(
          readNumber("cap-energy-voltage"),
          "Napětí"
        );

        // Input capacitance is in µF.
        const capacitanceF = capacitance * 0.000001;

        // E = 1/2 × C × U²
        const energy =
          0.5 * capacitanceF * voltage * voltage;

        // Q = C × U
        const charge =
          capacitanceF * voltage;

        if (!Number.isFinite(energy) || !Number.isFinite(charge)) {
          throw new Error("Výsledek je mimo rozsah kalkulačky.");
        }

        showResult(
          "cap-energy-result",
          `Energie: ${formatEnergy(energy)}\n` +
          `Náboj: ${formatCharge(charge)}`
        );
      });
    });
  }

  // ---------------------------------------------------------
  // INITIALIZATION
  // ---------------------------------------------------------

  function init() {
    initOhm();
    initPower();
    initLed();
    initConverter();
    initResistors();
    initCapacitor();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

})();
```
