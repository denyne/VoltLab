
/* =========================================================
   VOLTLAB V4 MAX
   ENGINEERING CALCULATORS
   ========================================================= */

"use strict";

window.VOLTLAB = window.VOLTLAB || {};

(() => {
  const APP = window.VOLTLAB;

  const STORAGE_KEY = APP.storageKeys.calculatorHistory;

  const EPSILON = 1e-12;

  /* -------------------------------------------------------
     CORE HELPERS
  ------------------------------------------------------- */

  function number(value, name = "Hodnota") {
    const result = Number(value);

    if (!Number.isFinite(result)) {
      throw new Error(`${name} musí být platné číslo.`);
    }

    return result;
  }

  function positive(value, name = "Hodnota") {
    const result = number(value, name);

    if (result <= 0) {
      throw new Error(`${name} musí být větší než nula.`);
    }

    return result;
  }

  function nonNegative(value, name = "Hodnota") {
    const result = number(value, name);

    if (result < 0) {
      throw new Error(`${name} nesmí být záporná.`);
    }

    return result;
  }

  function round(value, digits = 6) {
    if (!Number.isFinite(value)) return value;

    const factor = Math.pow(10, digits);

    return Math.round(value * factor) / factor;
  }

  function format(value, digits = 6) {
    return Number(value).toLocaleString("cs-CZ", {
      maximumFractionDigits: digits
    });
  }

  function result(value, unit, label, details = {}) {
    return {
      value,
      formatted: `${format(value)} ${unit}`,
      unit,
      label,
      ...details
    };
  }

  function saveHistory(calculation, input, output) {
    const history = APP.storage.get(STORAGE_KEY, []);

    history.unshift({
      id: APP.utils.id("calc"),
      calculation,
      input,
      output,
      timestamp: Date.now()
    });

    APP.storage.set(STORAGE_KEY, history.slice(0, 100));

    APP.events.emit("calculator:completed", {
      calculation,
      output
    });
  }

  function complete(name, input, output) {
    saveHistory(name, input, output);
    return output;
  }

  /* -------------------------------------------------------
     OHM'S LAW
     U = R * I
     I = U / R
     R = U / I
  ------------------------------------------------------- */

  function ohmsLaw(values) {
    const { voltage, current, resistance } = values;

    const hasU = voltage !== undefined && voltage !== "";
    const hasI = current !== undefined && current !== "";
    const hasR = resistance !== undefined && resistance !== "";

    if ([hasU, hasI, hasR].filter(Boolean).length !== 2) {
      throw new Error("Zadej přesně dvě známé hodnoty.");
    }

    let U, I, R;

    if (hasU && hasI) {
      U = nonNegative(voltage, "Napětí");
      I = nonNegative(current, "Proud");

      if (I <= EPSILON) {
        throw new Error("Proud musí být větší než nula.");
      }

      R = U / I;
    }

    if (hasU && hasR) {
      U = nonNegative(voltage, "Napětí");
      R = positive(resistance, "Odpor");
      I = U / R;
    }

    if (hasI && hasR) {
      I = nonNegative(current, "Proud");
      R = positive(resistance, "Odpor");
      U = I * R;
    }

    const output = {
      voltage: result(U, "V", "Napětí"),
      current: result(I, "A", "Proud"),
      resistance: result(R, "Ω", "Odpor"),
      power: result(U * I, "W", "Výkon")
    };

    return complete("ohms-law", values, output);
  }

  /* -------------------------------------------------------
     ELECTRICAL POWER
     P = U * I
  ------------------------------------------------------- */

  function power(values) {
    const U = nonNegative(values.voltage, "Napětí");
    const I = nonNegative(values.current, "Proud");

    const P = U * I;

    const output = {
      power: result(P, "W", "Výkon"),
      powerMilliwatts: result(P * 1000, "mW", "Výkon"),
      powerKilowatts: result(P / 1000, "kW", "Výkon")
    };

    return complete("power", values, output);
  }

  /* -------------------------------------------------------
     LED RESISTOR
     R = (Us - Uled) / I
  ------------------------------------------------------- */

  function ledResistor(values) {
    const supply = positive(values.supplyVoltage, "Napájecí napětí");
    const ledVoltage = nonNegative(values.ledVoltage, "Napětí LED");
    const currentMa = positive(values.currentMa, "Proud LED");

    if (supply <= ledVoltage) {
      throw new Error("Napájecí napětí musí být větší než napětí LED.");
    }

    const current = currentMa / 1000;
    const resistance = (supply - ledVoltage) / current;
    const resistorPower = (supply - ledVoltage) * current;

    const output = {
      resistance: result(resistance, "Ω", "Vypočtený odpor"),
      nearestStandard: result(
        nearestResistor(resistance),
        "Ω",
        "Nejbližší běžná hodnota"
      ),
      power: result(resistorPower, "W", "Výkon rezistoru"),
      recommendedPower: result(
        resistorPower * 2,
        "W",
        "Orientační výkonová rezerva"
      ),
      current: result(current, "A", "Proud")
    };

    return complete("led-resistor", values, output);
  }

  /* -------------------------------------------------------
     STANDARD RESISTOR VALUES
  ------------------------------------------------------- */

  function nearestResistor(value, series = "E24") {
    const seriesValues = {
      E6: [1, 1.5, 2.2, 3.3, 4.7, 6.8],
      E12: [
        1, 1.2, 1.5, 1.8, 2.2, 2.7,
        3.3, 3.9, 4.7, 5.6, 6.8, 8.2
      ],
      E24: [
        1, 1.1, 1.2, 1.3, 1.5, 1.6,
        1.8, 2.0, 2.2, 2.4, 2.7, 3.0,
        3.3, 3.6, 3.9, 4.3, 4.7, 5.1,
        5.6, 6.2, 6.8, 7.5, 8.2, 9.1
      ]
    };

    const values = seriesValues[series] || seriesValues.E24;

    const exponent = Math.floor(Math.log10(value));

    let best = null;
    let bestDifference = Infinity;

    for (let power = exponent - 1; power <= exponent + 1; power++) {
      for (const base of values) {
        const candidate = base * Math.pow(10, power);
        const difference = Math.abs(candidate - value);

        if (difference < bestDifference) {
          best = candidate;
          bestDifference = difference;
        }
      }
    }

    return best;
  }

  /* -------------------------------------------------------
     RESISTOR COLOR CODE
  ------------------------------------------------------- */

  const resistorColors = {
    black:  { digit: 0, multiplier: 1, tolerance: null },
    brown:  { digit: 1, multiplier: 10, tolerance: 1 },
    red:    { digit: 2, multiplier: 100, tolerance: 2 },
    orange: { digit: 3, multiplier: 1000, tolerance: null },
    yellow: { digit: 4, multiplier: 10000, tolerance: null },
    green:  { digit: 5, multiplier: 100000, tolerance: 0.5 },
    blue:   { digit: 6, multiplier: 1000000, tolerance: 0.25 },
    violet: { digit: 7, multiplier: 10000000, tolerance: 0.1 },
    grey:   { digit: 8, multiplier: 100000000, tolerance: 0.05 },
    white:  { digit: 9, multiplier: 1000000000, tolerance: null },
    gold:   { digit: null, multiplier: 0.1, tolerance: 5 },
    silver: { digit: null, multiplier: 0.01, tolerance: 10 }
  };

  function resistorColorCode(colors) {
    if (!Array.isArray(colors) || ![4, 5].includes(colors.length)) {
      throw new Error("Zadej čtyři nebo pět barevných proužků.");
    }

    const selected = colors.map(color => {
      const key = String(color).toLowerCase();
      const data = resistorColors[key];

      if (!data) {
        throw new Error(`Neznámá barva: ${color}`);
      }

      return { color: key, ...data };
    });

    const digitCount = colors.length === 4 ? 2 : 3;

    const digits = selected
      .slice(0, digitCount)
      .map(item => item.digit);

    if (digits.some(digit => digit === null)) {
      throw new Error("Barva není platná pro číselný proužek.");
    }

    const multiplier = selected[digitCount].multiplier;

    const base = Number(digits.join(""));
    const resistance = base * multiplier;

    const tolerance = selected.length === 4
      ? selected[3].tolerance
      : selected[4].tolerance;

    if (tolerance === null) {
      throw new Error("Neplatná barva tolerančního proužku.");
    }

    const output = {
      resistance: result(resistance, "Ω", "Odpor"),
      tolerance: result(tolerance, "%", "Tolerance"),
      minimum: result(
        resistance * (1 - tolerance / 100),
        "Ω",
        "Minimální odpor"
      ),
      maximum: result(
        resistance * (1 + tolerance / 100),
        "Ω",
        "Maximální odpor"
      )
    };

    return complete("resistor-color-code", colors, output);
  }

  /* -------------------------------------------------------
     SERIES RESISTORS
     R = R1 + R2 + ...
  ------------------------------------------------------- */

  function seriesResistors(values) {
    if (!Array.isArray(values) || values.length < 2) {
      throw new Error("Zadej alespoň dva rezistory.");
    }

    const resistances = values.map(
      value => positive(value, "Odpor")
    );

    const total = resistances.reduce(
      (sum, value) => sum + value,
      0
    );

    return complete("series-resistors", values, {
      resistance: result(total, "Ω", "Celkový odpor")
    });
  }

  /* -------------------------------------------------------
     PARALLEL RESISTORS
     1/R = 1/R1 + 1/R2 + ...
  ------------------------------------------------------- */

  function parallelResistors(values) {
    if (!Array.isArray(values) || values.length < 2) {
      throw new Error("Zadej alespoň dva rezistory.");
    }

    const resistances = values.map(
      value => positive(value, "Odpor")
    );

    const inverse = resistances.reduce(
      (sum, value) => sum + 1 / value,
      0
    );

    const total = 1 / inverse;

    return complete("parallel-resistors", values, {
      resistance: result(total, "Ω", "Celkový odpor")
    });
  }

  /* -------------------------------------------------------
     VOLTAGE DIVIDER
     Vout = Vin * R2 / (R1 + R2)
  ------------------------------------------------------- */

  function voltageDivider(values) {
    const vin = nonNegative(values.inputVoltage, "Vstupní napětí");
    const r1 = positive(values.r1, "Rezistor R1");
    const r2 = positive(values.r2, "Rezistor R2");

    const outputVoltage = vin * r2 / (r1 + r2);
    const current = vin / (r1 + r2);
    const powerR1 = current * current * r1;
    const powerR2 = current * current * r2;

    const output = {
      outputVoltage: result(outputVoltage, "V", "Výstupní napětí"),
      current: result(current, "A", "Proud děličem"),
      powerR1: result(powerR1, "W", "Výkon R1"),
      powerR2: result(powerR2, "W", "Výkon R2")
    };

    return complete("voltage-divider", values, output);
  }

  /* -------------------------------------------------------
     RC TIME CONSTANT
     tau = R * C
  ------------------------------------------------------- */

  function rcTimeConstant(values) {
    const resistance = positive(values.resistance, "Odpor");
    const capacitance = positive(values.capacitance, "Kapacita");

    const tau = resistance * capacitance;

    const output = {
      timeConstant: result(tau, "s", "Časová konstanta"),
      milliseconds: result(tau * 1000, "ms", "Časová konstanta"),
      fiveTau: result(tau * 5, "s", "Přibližné ustálení (5τ)"),
      frequency: result(
        1 / (2 * Math.PI * tau),
        "Hz",
        "Mezní frekvence RC článku"
      )
    };

    return complete("rc-time-constant", values, output);
  }

  /* -------------------------------------------------------
     CAPACITOR ENERGY
     E = 1/2 * C * U²
  ------------------------------------------------------- */

  function capacitorEnergy(values) {
    const capacitance = positive(values.capacitance, "Kapacita");
    const voltage = nonNegative(values.voltage, "Napětí");

    const energy = 0.5 * capacitance * voltage * voltage;

    return complete("capacitor-energy", values, {
      energy: result(energy, "J", "Energie"),
      millijoules: result(energy * 1000, "mJ", "Energie")
    });
  }

  /* -------------------------------------------------------
     INDUCTOR ENERGY
     E = 1/2 * L * I²
  ------------------------------------------------------- */

  function inductorEnergy(values) {
    const inductance = positive(values.inductance, "Indukčnost");
    const current = nonNegative(values.current, "Proud");

    const energy = 0.5 * inductance * current * current;

    return complete("inductor-energy", values, {
      energy: result(energy, "J", "Energie"),
      millijoules: result(energy * 1000, "mJ", "Energie")
    });
  }

  /* -------------------------------------------------------
     BATTERY RUNTIME
     hours = capacity(Ah) / current(A)
  ------------------------------------------------------- */

  function batteryRuntime(values) {
    const capacity = positive(values.capacityAh, "Kapacita baterie");
    const current = positive(values.currentA, "Odebíraný proud");

    const efficiency = values.efficiency === undefined
      ? 100
      : number(values.efficiency, "Účinnost");

    if (efficiency <= 0 || efficiency > 100) {
      throw new Error("Účinnost musí být v rozsahu 0 až 100 %.");
    }

    const runtime = capacity / current * efficiency / 100;

    return complete("battery-runtime", values, {
      hours: result(runtime, "h", "Teoretická výdrž"),
      minutes: result(runtime * 60, "min", "Výdrž v minutách"),
      days: result(runtime / 24, "d", "Výdrž ve dnech")
    });
  }

  /* -------------------------------------------------------
     CABLE VOLTAGE DROP
     ΔU = 2 * L * I * rho / A
     For copper at 20 °C.
  ------------------------------------------------------- */

  function cableVoltageDrop(values) {
    const length = positive(values.length, "Délka kabelu");
    const current = positive(values.current, "Proud");
    const area = positive(values.area, "Průřez vodiče");

    const voltage = positive(values.voltage, "Napětí");

    // Copper resistivity in Ω·mm²/m
    const rho = 0.0175;

    const resistance = 2 * length * rho / area;
    const drop = current * resistance;
    const percentage = drop / voltage * 100;

    return complete("cable-voltage-drop", values, {
      resistance: result(resistance, "Ω", "Odpor vedení"),
      voltageDrop: result(drop, "V", "Úbytek napětí"),
      percentage: result(percentage, "%", "Procentuální úbytek"),
      outputVoltage: result(
        voltage - drop,
        "V",
        "Napětí na konci vedení"
      )
    });
  }

  /* -------------------------------------------------------
     INDUCTIVE REACTANCE
     XL = 2 * pi * f * L
  ------------------------------------------------------- */

  function inductiveReactance(values) {
    const frequency = positive(values.frequency, "Frekvence");
    const inductance = positive(values.inductance, "Indukčnost");

    const reactance = 2 * Math.PI * frequency * inductance;

    return complete("inductive-reactance", values, {
      reactance: result(reactance, "Ω", "Induktivní reaktance")
    });
  }

  /* -------------------------------------------------------
     CAPACITIVE REACTANCE
     XC = 1 / (2 * pi * f * C)
  ------------------------------------------------------- */

  function capacitiveReactance(values) {
    const frequency = positive(values.frequency, "Frekvence");
    const capacitance = positive(values.capacitance, "Kapacita");

    const reactance =
      1 / (2 * Math.PI * frequency * capacitance);

    return complete("capacitive-reactance", values, {
      reactance: result(reactance, "Ω", "Kapacitní reaktance")
    });
  }

  /* -------------------------------------------------------
     UNIT CONVERTER
  ------------------------------------------------------- */

  const unitFactors = {
    voltage: {
      V: 1,
      mV: 0.001,
      kV: 1000
    },

    current: {
      A: 1,
      mA: 0.001,
      uA: 0.000001
    },

    resistance: {
      ohm: 1,
      kohm: 1000,
      Mohm: 1000000
    },

    capacitance: {
      F: 1,
      mF: 0.001,
      uF: 0.000001,
      nF: 0.000000001,
      pF: 0.000000000001
    },

    power: {
      W: 1,
      mW: 0.001,
      kW: 1000
    },

    frequency: {
      Hz: 1,
      kHz: 1000,
      MHz: 1000000,
      GHz: 1000000000
    },

    energy: {
      J: 1,
      mJ: 0.001,
      uJ: 0.000001,
      Wh: 3600,
      kWh: 3600000
    },

    inductance: {
      H: 1,
      mH: 0.001,
      uH: 0.000001,
      nH: 0.000000001
    }
  };

  function convertUnit(values) {
    const amount = number(values.value, "Hodnota");
    const type = values.type;

    const units = unitFactors[type];

    if (!units) {
      throw new Error("Neznámý typ jednotky.");
    }

    const from = units[values.from];
    const to = units[values.to];

    if (!from || !to) {
      throw new Error("Neplatná jednotka převodu.");
    }

    const converted = amount * from / to;

    return complete("unit-converter", values, {
      converted: result(converted, values.to, "Výsledek"),
      original: result(amount, values.from, "Původní hodnota")
    });
  }

  /* -------------------------------------------------------
     CALCULATOR HISTORY
  ------------------------------------------------------- */

  function getHistory(limit = 50) {
    return APP.storage
      .get(STORAGE_KEY, [])
      .slice(0, Math.max(0, limit));
  }

  function clearHistory() {
    APP.storage.set(STORAGE_KEY, []);

    APP.events.emit("calculator:history-cleared");

    return true;
  }

  function removeHistoryItem(id) {
    const history = APP.storage.get(STORAGE_KEY, []);

    const filtered = history.filter(item => item.id !== id);

    APP.storage.set(STORAGE_KEY, filtered);

    return filtered.length !== history.length;
  }

  /* -------------------------------------------------------
     CALCULATOR DEFINITIONS
  ------------------------------------------------------- */

  const definitions = [
    {
      id: "ohms-law",
      name: "Ohmův zákon",
      category: "Základy",
      description: "Výpočet napětí, proudu a odporu.",
      formula: "U = R × I",
      fields: ["voltage", "current", "resistance"]
    },
    {
      id: "power",
      name: "Elektrický výkon",
      category: "Základy",
      description: "Výpočet elektrického výkonu.",
      formula: "P = U × I",
      fields: ["voltage", "current"]
    },
    {
      id: "led-resistor",
      name: "LED rezistor",
      category: "Součástky",
      description: "Výpočet odporu pro LED.",
      formula: "R = (U - ULED) / I",
      fields: ["supplyVoltage", "ledVoltage", "currentMa"]
    },
    {
      id: "resistor-color-code",
      name: "Barevný kód rezistoru",
      category: "Součástky",
      description: "Převod barevných proužků na hodnotu odporu.",
      formula: "R = číslice × násobitel",
      fields: ["colors"]
    },
    {
      id: "series-resistors",
      name: "Sériové rezistory",
      category: "Obvody",
      description: "Výpočet celkového odporu v sérii.",
      formula: "R = R1 + R2 + ...",
      fields: ["resistances"]
    },
    {
      id: "parallel-resistors",
      name: "Paralelní rezistory",
      category: "Obvody",
      description: "Výpočet celkového odporu paralelně.",
      formula: "1/R = 1/R1 + 1/R2 + ...",
      fields: ["resistances"]
    },
    {
      id: "voltage-divider",
      name: "Dělič napětí",
      category: "Obvody",
      description: "Výpočet výstupního napětí.",
      formula: "Uout = Uin × R2 / (R1 + R2)",
      fields: ["inputVoltage", "r1", "r2"]
    },
    {
      id: "rc-time-constant",
      name: "RC časová konstanta",
      category: "Obvody",
      description: "Výpočet časové konstanty RC článku.",
      formula: "τ = R × C",
      fields: ["resistance", "capacitance"]
    },
    {
      id: "capacitor-energy",
      name: "Energie kondenzátoru",
      category: "Součástky",
      description: "Výpočet energie uložené v kondenzátoru.",
      formula: "E = ½ × C × U²",
      fields: ["capacitance", "voltage"]
    },
    {
      id: "inductor-energy",
      name: "Energie cívky",
      category: "Součástky",
      description: "Výpočet energie magnetického pole.",
      formula: "E = ½ × L × I²",
      fields: ["inductance", "current"]
    },
    {
      id: "battery-runtime",
      name: "Výdrž baterie",
      category: "Napájení",
      description: "Orientační výpočet doby provozu.",
      formula: "t = Ah / A",
      fields: ["capacityAh", "currentA", "efficiency"]
    },
    {
      id: "cable-voltage-drop",
      name: "Úbytek napětí kabelu",
      category: "Napájení",
      description: "Výpočet úbytku na měděném dvouvodičovém vedení.",
      formula: "ΔU = I × R vedení",
      fields: ["length", "current", "area", "voltage"]
    },
    {
      id: "inductive-reactance",
      name: "Induktivní reaktance",
      category: "AC obvody",
      description: "Výpočet reaktance cívky.",
      formula: "XL = 2πfL",
      fields: ["frequency", "inductance"]
    },
    {
      id: "capacitive-reactance",
      name: "Kapacitní reaktance",
      category: "AC obvody",
      description: "Výpočet reaktance kondenzátoru.",
      formula: "XC = 1 / (2πfC)",
      fields: ["frequency", "capacitance"]
    },
    {
      id: "unit-converter",
      name: "Převod jednotek",
      category: "Nástroje",
      description: "Převody elektrických jednotek.",
      formula: "Nová hodnota = původní × poměr jednotek",
      fields: ["value", "from", "to"]
    }
  ];

  /* -------------------------------------------------------
     PUBLIC API
  ------------------------------------------------------- */

  APP.calculators = {
    definitions,

    ohmsLaw,
    power,
    ledResistor,
    nearestResistor,
    resistorColorCode,
    seriesResistors,
    parallelResistors,
    voltageDivider,
    rcTimeConstant,
    capacitorEnergy,
    inductorEnergy,
    batteryRuntime,
    cableVoltageDrop,
    inductiveReactance,
    capacitiveReactance,
    convertUnit,

    getHistory,
    clearHistory,
    removeHistoryItem,

    getById(id) {
      return definitions.find(item => item.id === id) || null;
    },

    search(query = "") {
      const q = String(query).toLocaleLowerCase("cs");

      return definitions.filter(item =>
        `${item.name} ${item.description} ${item.category} ${item.formula}`
          .toLocaleLowerCase("cs")
          .includes(q)
      );
    }
  };

  console.info(
    `[VoltLab] Calculators loaded: ${definitions.length}`
  );

})();
