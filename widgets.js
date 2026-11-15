
(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  function number(id) {
    const element = $(id);
    if (!element || element.value.trim() === "") return null;

    const value = Number(element.value);
    return Number.isFinite(value) ? value : null;
  }

  function output(id, message, error = false) {
    const element = $(id);
    if (!element) return;

    element.textContent = message;
    element.classList.toggle("is-error", error);
    element.classList.add("has-result");
  }

  function format(value, digits = 5) {
    if (!Number.isFinite(value)) return "—";

    return Number(value.toPrecision(digits)).toLocaleString("cs-CZ", {
      maximumFractionDigits: digits
    });
  }

  function formatAuto(value, units) {
    if (!Number.isFinite(value)) return "—";

    const absolute = Math.abs(value);

    for (let i = units.length - 1; i >= 0; i--) {
      if (absolute >= units[i].factor) {
        return `${format(value / units[i].factor)} ${units[i].name}`;
      }
    }

    return `${format(value / units[0].factor)} ${units[0].name}`;
  }

  function positive(value) {
    return value !== null && value > 0;
  }

  // --------------------------------------------------
  // OHMŮV ZÁKON
  // --------------------------------------------------

  function initOhm() {
    const button = $("ohm-calculate");
    if (!button) return;

    button.addEventListener("click", () => {
      const rawU = number("ohm-voltage");
      const rawI = number("ohm-current");
      const rawR = number("ohm-resistance");

      const U = rawU === null ? null :
        rawU * Number($("ohm-voltage-unit").value);

      const I = rawI === null ? null :
        rawI * Number($("ohm-current-unit").value);

      const R = rawR === null ? null :
        rawR * Number($("ohm-resistance-unit").value);

      const values = [U, I, R];
      const known = values.filter(v => v !== null);

      if (known.length !== 2) {
        output(
          "ohm-result",
          "Vyplň přesně dvě hodnoty. Třetí nech prázdnou.",
          true
        );
        return;
      }

      if (known.some(v => !positive(v))) {
        output(
          "ohm-result",
          "Hodnoty musí být větší než nula.",
          true
        );
        return;
      }

      let result;
      let message;

      if (U === null) {
        result = I * R;
        message = `Napětí: ${formatAuto(result, [
          { factor: 0.001, name: "mV" },
          { factor: 1, name: "V" },
          { factor: 1000, name: "kV" }
        ])}`;
      } else if (I === null) {
        result = U / R;
        message = `Proud: ${formatAuto(result, [
          { factor: 0.000001, name: "µA" },
          { factor: 0.001, name: "mA" },
          { factor: 1, name: "A" }
        ])}`;
      } else {
        result = U / I;
        message = `Odpor: ${formatAuto(result, [
          { factor: 1, name: "Ω" },
          { factor: 1000, name: "kΩ" },
          { factor: 1000000, name: "MΩ" }
        ])}`;
      }

      output("ohm-result", message);
    });
  }

  // --------------------------------------------------
  // ELEKTRICKÝ VÝKON
  // --------------------------------------------------

  function initPower() {
    const button = $("power-calculate");
    if (!button) return;

    button.addEventListener("click", () => {
      const target = $("power-target").value;

      const rawU = number("power-voltage");
      const rawI = number("power-current");
      const rawP = number("power-watts");

      const U = rawU === null ? null :
        rawU * Number($("power-voltage-unit").value);

      const I = rawI === null ? null :
        rawI * Number($("power-current-unit").value);

      const P = rawP === null ? null :
        rawP * Number($("power-watts-unit").value);

      const values = { voltage: U, current: I, power: P };
      const required = target === "power"
        ? ["voltage", "current"]
        : target === "voltage"
          ? ["power", "current"]
          : ["power", "voltage"];

      const inputs = required.map(key => values[key]);

      if (inputs.some(value => value === null)) {
        output(
          "power-result",
          "Vyplň obě hodnoty potřebné pro výpočet.",
          true
        );
        return;
      }

      if (inputs.some(value => !positive(value))) {
        output(
          "power-result",
          "Hodnoty musí být větší než nula.",
          true
        );
        return;
      }

      let result;
      let message;

      if (target === "power") {
        result = U * I;
        message = `Výkon: ${formatAuto(result, [
          { factor: 0.001, name: "mW" },
          { factor: 1, name: "W" },
          { factor: 1000, name: "kW" }
        ])}`;
      } else if (target === "voltage") {
        result = P / I;
        message = `Napětí: ${formatAuto(result, [
          { factor: 0.001, name: "mV" },
          { factor: 1, name: "V" },
          { factor: 1000, name: "kV" }
        ])}`;
      } else {
        result = P / U;
        message = `Proud: ${formatAuto(result, [
          { factor: 0.000001, name: "µA" },
          { factor: 0.001, name: "mA" },
          { factor: 1, name: "A" }
        ])}`;
      }

      output("power-result", message);
    });
  }

  // --------------------------------------------------
  // LED REZISTOR
  // --------------------------------------------------

  const E12 = [
    10, 12, 15, 18, 22, 27,
    33, 39, 47, 56, 68, 82
  ];

  function nextStandardResistor(value) {
    const decade = Math.pow(10, Math.floor(Math.log10(value)));

    for (let multiplier of [1, 10, 100, 1000]) {
      for (const base of E12) {
        const candidate = base * decade * multiplier;

        if (candidate >= value) return candidate;
      }
    }

    return value;
  }

  function initLed() {
    const button = $("led-calculate");
    if (!button) return;

    button.addEventListener("click", () => {
      const supply = number("led-supply");
      const forward = number("led-forward");
      const current = number("led-current");

      if (
        supply === null ||
        forward === null ||
        current === null ||
        supply <= 0 ||
        forward < 0 ||
        current <= 0 ||
        supply <= forward
      ) {
        output(
          "led-result",
          "Zkontroluj hodnoty. Napájení musí být vyšší než úbytek LED a proud musí být kladný.",
          true
        );
        return;
      }

      const currentA = current / 1000;
      const calculatedR = (supply - forward) / currentA;
      const standardR = nextStandardResistor(calculatedR);

      const actualCurrent = (supply - forward) / standardR;
      const resistorPower = Math.pow(actualCurrent, 2) * standardR;

      output(
        "led-result",
        `Vypočtený odpor: ${format(calculatedR)} Ω\n` +
        `Doporučený odpor: ${format(standardR)} Ω\n` +
        `Skutečný proud: ${format(actualCurrent * 1000)} mA\n` +
        `Ztrátový výkon: ${format(resistorPower * 1000)} mW\n` +
        `Zvol rezistor s výkonovou rezervou.`
      );
    });
  }

  // --------------------------------------------------
  // PŘEVODNÍK JEDNOTEK
  // --------------------------------------------------

  const UNIT_GROUPS = {
    voltage: [
      { name: "µV", factor: 0.000001 },
      { name: "mV", factor: 0.001 },
      { name: "V", factor: 1 },
      { name: "kV", factor: 1000 }
    ],

    current: [
      { name: "µA", factor: 0.000001 },
      { name: "mA", factor: 0.001 },
      { name: "A", factor: 1 },
      { name: "kA", factor: 1000 }
    ],

    power: [
      { name: "µW", factor: 0.000001 },
      { name: "mW", factor: 0.001 },
      { name: "W", factor: 1 },
      { name: "kW", factor: 1000 },
      { name: "MW", factor: 1000000 }
    ],

    resistance: [
      { name: "mΩ", factor: 0.001 },
      { name: "Ω", factor: 1 },
      { name: "kΩ", factor: 1000 },
      { name: "MΩ", factor: 1000000 }
    ],

    capacitance: [
      { name: "pF", factor: 0.000000000001 },
      { name: "nF", factor: 0.000000001 },
      { name: "µF", factor: 0.000001 },
      { name: "mF", factor: 0.001 },
      { name: "F", factor: 1 }
    ]
  };

  function populateUnits() {
    const type = $("convert-type");
    const from = $("convert-from");
    const to = $("convert-to");

    if (!type || !from || !to) return;

    const units = UNIT_GROUPS[type.value];

    from.replaceChildren();
    to.replaceChildren();

    units.forEach(unit => {
      const optionA = document.createElement("option");
      optionA.value = String(unit.factor);
      optionA.textContent = unit.name;

      const optionB = optionA.cloneNode(true);

      from.appendChild(optionA);
      to.appendChild(optionB);
    });

    if (units.length > 1) {
      from.selectedIndex = Math.min(1, units.length - 1);
      to.selectedIndex = Math.min(2, units.length - 1);
    }

    calculateConversion();
  }

  function calculateConversion() {
    const value = number("convert-value");
    const from = $("convert-from");
    const to = $("convert-to");

    if (value === null || !from || !to) {
      output("convert-result", "Zadej platnou číselnou hodnotu.", true);
      return;
    }

    const fromFactor = Number(from.value);
    const toFactor = Number(to.value);

    if (
      !Number.isFinite(fromFactor) ||
      !Number.isFinite(toFactor) ||
      toFactor <= 0
    ) {
      output("convert-result", "Vyber platné jednotky.", true);
      return;
    }

    const result = value * fromFactor / toFactor;

    output(
      "convert-result",
      `Výsledek: ${format(result)} ${to.selectedOptions[0].textContent}`
    );
  }

  function initConverter() {
    if (!$("convert-type")) return;

    $("convert-type").addEventListener("change", populateUnits);
    $("convert-value").addEventListener("input", calculateConversion);
    $("convert-from").addEventListener("change", calculateConversion);
    $("convert-to").addEventListener("change", calculateConversion);

    populateUnits();
  }

  // --------------------------------------------------
  // SPUŠTĚNÍ
  // --------------------------------------------------

  function init() {
    initOhm();
    initPower();
    initLed();
    initConverter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
