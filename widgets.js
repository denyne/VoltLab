
/* =========================================================
   VOLTLAB — CALCULATORS
   Ohm's law · Power · LED resistor · Unit converter
   Resistor networks · Capacitor energy
   ========================================================= */

(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  // ---------- Number helpers ----------

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
      if (abs > 0 && abs < 1) return `${format(value * 1_000)} mW`;
    }

    return `${format(value)} ${unit}`;
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
    if (element) element.addEventListener(event, callback);
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
      showResult(resultId, error.message || "Zkontroluj zadané hodnoty.", true);
    }
  }

  // ---------- Unit conversions ----------

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
      Ω: 1,
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

        if (!source || !target) {
          throw new Error("Vybrané jednotky nejsou podporované.");
        }

        const result = value * source / target;

        showResult(
          "convert-result",
          `${format(value)} ${from.value} = ${format(result)} ${to.value}`
        );
      });
    });
  }

  // ---------- Ohm's law ----------

  function initOhm() {
    bind("ohm-calculate", "click", () => {
      runCalculation("ohm-result", () => {
        const voltage = readNumber("ohm-voltage");
        const current = readNumber("ohm-current");
        const resistance = readNumber("ohm-resistance");

        const fields = [
          { value: voltage, id: "ohm-voltage", unit: "V" },
          { value: current, id: "ohm-current", unit: "A" },
          { value: resistance, id: "ohm-resistance", unit: "Ω" }
        ];

        const filled = fields.filter((field) => field.value !== null);

        if (filled.length !== 2) {
          throw new Error("Vyplň přesně dvě hodnoty. Třetí dopočítáme.");
        }

        fields.forEach((field) => {
          if (field.value !== null) {
            positive(field.value, "Zadaná hodnota");
          }
        });

        const units = {
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
            Ω: 1,
            kΩ: 1000,
            MΩ: 1000000
          }
        };

        const V = voltage === null
          ? null
          : voltage * units.voltage[$("ohm-voltage-unit")?.value || "V"];

        const I = current === null
          ? null
          : current * units.current[$("ohm-current-unit")?.value || "A"];

        const R = resistance === null
          ? null
          : resistance * units.resistance[$("ohm-resistance-unit")?.value || "Ω"];

        let message = "";

        if (V === null) {
          const result = I * R;
          message = `Napětí: ${formatAuto(result, "V")}`;
        } else if (I === null) {
          if (R === 0) throw new Error("Odpor nesmí být nulový.");
          const result = V / R;
          message = `Proud: ${formatAuto(result, "A")}`;
        } else {
          if (I === 0) throw new Error("Proud nesmí být nulový.");
          const result = V / I;
          message = `Odpor: ${formatAuto(result, "Ω")}`;
        }

        showResult("ohm-result", message);
      });
    });
  }

  // ---------- Electrical power ----------

  function initPower() {
    bind("power-calculate", "click", () => {
      runCalculation("power-result", () => {
        const target = $("power-target")?.value || "power";

        const voltageInput = readNumber("power-voltage");
        const currentInput = readNumber("power-current");
        const wattsInput = readNumber("power-watts");

        const voltageUnit = $("power-voltage-unit")?.value || "V";
        const currentUnit = $("power-current-unit")?.value || "A";
        const wattsUnit = $("power-watts-unit")?.value || "W";

        const voltageFactors = { V: 1, mV: 0.001, kV: 1000 };
        const currentFactors = { A: 1, mA: 0.001, µA: 0.000001 };
        const powerFactors = { W: 1, mW: 0.001, kW: 1000 };

        const V = voltageInput === null
          ? null
          : voltageInput * voltageFactors[voltageUnit];

        const I = currentInput === null
          ? null
          : currentInput * currentFactors[currentUnit];

        const P = wattsInput === null
          ? null
          : wattsInput * powerFactors[wattsUnit];

        const values = { voltage: V, current: I, power: P };
        const missing = Object.keys(values).filter((key) => values[key] === null);

        if (missing.length !== 1 || missing[0] !== target) {
          throw new Error("Vyber veličinu k výpočtu a vyplň zbývající dvě hodnoty.");
        }

        Object.entries(values).forEach(([key, value]) => {
          if (key !== target) positive(value, "Zadaná hodnota");
        });

        let result;
        let message;

        if (target === "power") {
          result = V * I;
          message = `Výkon: ${formatAuto(result, "W")}`;
        } else if (target === "voltage") {
          if (I === 0) throw new Error("Proud nesmí být nulový.");
          result = P / I;
          message = `Napětí: ${formatAuto(result, "V")}`;
        } else {
          if (V === 0) throw new Error("Napětí nesmí být nulové.");
          result = P / V;
          message = `Proud: ${formatAuto(result, "A")}`;
        }

        showResult("power-result", message);
      });
    });
  }

  // ---------- LED resistor calculator ----------

  function nearestE12Above(value) {
    const e12 = [
      1.0, 1.2, 1.5, 1.8, 2.2, 2.7,
      3.3, 3.9, 4.7, 5.6, 6.8, 8.2
    ];

    if (!Number.isFinite(value) || value <= 0) return null;

    const exponent = Math.floor(Math.log10(value));
    const base = Math.pow(10, exponent);

    for (let scale = exponent - 1; scale <= exponent + 1; scale++) {
      const multiplier = Math.pow(10, scale);

      for (const number of e12) {
        const candidate = number * multiplier;
        if (candidate >= value) return candidate;
      }
    }

    return base * 10;
  }

  function initLed() {
    bind("led-calculate", "click", () => {
      runCalculation("led-result", () => {
        const supply = positive(readNumber("led-supply"), "Napájecí napětí");
        const forward = positive(readNumber("led-forward"), "Napětí LED");
        const current = positive(readNumber("led-current"), "Proud LED");

        if (supply <= forward) {
          throw new Error("Napájecí napětí musí být vyšší než napětí LED.");
        }

        const currentA = current / 1000;
        const idealResistance = (supply - forward) / currentA;
        const standardResistance = nearestE12Above(idealResistance);

        const actualCurrent = (supply - forward) / standardResistance;
        const resistorPower = Math.pow(supply - forward, 2) / standardResistance;

        let recommendedPower = 0.25;
        if (resistorPower > 0.125) recommendedPower = 0.5;
        if (resistorPower > 0.25) recommendedPower = 1;
        if (resistorPower > 0.5) recommendedPower = 2;
        if (resistorPower > 1) recommendedPower = Math.ceil(resistorPower * 2);

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

  // ---------- Resistor networks ----------

  function initResistors() {
    bind("resistor-calculate", "click", () => {
      runCalculation("resistor-result", () => {
        const raw = $("resistor-values")?.value || "";

        const values = raw
          .split(/[,;\s]+/)
          .filter(Boolean)
          .map((item) => Number(item.replace(",", ".")));

        if (values.length < 2) {
          throw new Error("Zadej alespoň dva odpory oddělené čárkou nebo mezerou.");
        }

        if (values.some((value) => !Number.isFinite(value) || value <= 0)) {
          throw new Error("Všechny odpory musí být kladná čísla.");
        }

        const mode = $("resistor-mode")?.value || "series";

        let result;

        if (mode === "parallel") {
          result = 1 / values.reduce((sum, value) => sum + 1 / value, 0);
        } else {
          result = values.reduce((sum, value) => sum + value, 0);
        }

        const label = mode === "parallel"
          ? "Výsledný paralelní odpor"
          : "Výsledný sériový odpor";

        showResult(
          "resistor-result",
          `${label}: ${formatAuto(result, "Ω")}\nPočet rezistorů: ${values.length}`
        );
      });
    });
  }

  // ---------- Capacitor energy ----------

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

        // Vstup kapacity je v µF.
        const capacitanceF = capacitance * 0.000001;

        const energy = 0.5 * capacitanceF * voltage * voltage;
        const charge = capacitanceF * voltage;

        const energyLabel = energy >= 1
          ? `${format(energy)} J`
          : `${format(energy * 1000)} mJ`;

        const chargeLabel = charge >= 0.001
          ? `${format(charge * 1000)} mC`
          : `${format(charge * 1_000_000)} µC`;

        showResult(
          "cap-energy-result",
          `Energie: ${energyLabel}\nNáboj: ${chargeLabel}`
        );
      });
    });
  }

  // ---------- Initialize ----------

  function init() {
    initOhm();
    initPower();
    initLed();
    initConverter();
    initResistors();
    initCapacitor();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
