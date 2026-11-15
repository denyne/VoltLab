
(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  function number(id) {
    const el = $(id);
    if (!el || el.value.trim() === "") return null;
    const value = Number(el.value);
    return Number.isFinite(value) ? value : null;
  }

  function showResult(id, message) {
    const el = $(id);
    if (!el) return;
    el.textContent = message;
    el.classList.add("has-result");
  }

  function format(value, digits = 4) {
    return Number(value.toFixed(digits)).toLocaleString("cs-CZ");
  }

  function formatAuto(value, units) {
    const absolute = Math.abs(value);
    for (let i = units.length - 1; i >= 0; i--) {
      if (absolute >= units[i].factor) {
        return `${format(value / units[i].factor)} ${units[i].unit}`;
      }
    }
    return `${format(value / units[0].factor)} ${units[0].unit}`;
  }

  function initOhm() {
    const button = $("ohm-calculate");
    if (!button) return;

    button.addEventListener("click", () => {
      const raw = [
        number("ohm-voltage"),
        number("ohm-current"),
        number("ohm-resistance")
      ];

      const filled = raw.filter(v => v !== null).length;

      if (filled !== 2 || raw.some(v => v !== null && v < 0)) {
        showResult("ohm-result", "Vyplň přesně dvě nezáporné hodnoty.");
        return;
      }

      const U = raw[0] === null ? null : raw[0] * Number($("ohm-voltage-unit").value);
      const I = raw[1] === null ? null : raw[1] * Number($("ohm-current-unit").value);
      const R = raw[2] === null ? null : raw[2] * Number($("ohm-resistance-unit").value);

      if ((I === null && R === 0) || (R === null && I === 0)) {
        showResult("ohm-result", "Výpočet nelze provést s nulovou hodnotou ve jmenovateli.");
        return;
      }

      let result;

      if (U === null) {
        const voltage = I * R;
        result = `Napětí: ${formatAuto(voltage, [
          { factor: 0.001, unit: "mV" },
          { factor: 1, unit: "V" },
          { factor: 1000, unit: "kV" }
        ])}`;
      } else if (I === null) {
        const current = U / R;
        result = `Proud: ${formatAuto(current, [
          { factor: 0.000001, unit: "µA" },
          { factor: 0.001, unit: "mA" },
          { factor: 1, unit: "A" }
        ])}`;
      } else {
        const resistance = U / I;
        result = `Odpor: ${formatAuto(resistance, [
          { factor: 1, unit: "Ω" },
          { factor: 1000, unit: "kΩ" },
          { factor: 1000000, unit: "MΩ" }
        ])}`;
      }

      showResult("ohm-result", result);
    });
  }

  function initPower() {
    const button = $("power-calculate");
    if (!button) return;

    button.addEventListener("click", () => {
      const target = $("power-target").value;
      const rawU = number("power-voltage");
      const rawI = number("power-current");
      const rawP = number("power-watts");

      const U = rawU === null ? null : rawU * Number($("power-voltage-unit").value);
      const I = rawI === null ? null : rawI * Number($("power-current-unit").value);
      const P = rawP === null ? null : rawP * Number($("power-watts-unit").value);

      if ([U, I, P].some(v => v !== null && v < 0)) {
        showResult("power-result", "Hodnoty nesmí být záporné.");
        return;
      }

      let result;

      if (target === "power") {
        if (U === null || I === null || rawP !== null) {
          showResult("power-result", "Pro výpočet výkonu vyplň napětí a proud. Pole výkonu nech prázdné.");
          return;
        }
        result = `Výkon: ${formatAuto(U * I, [
          { factor: 0.001, unit: "mW" },
          { factor: 1, unit: "W" },
          { factor: 1000, unit: "kW" }
        ])}`;
      } else if (target === "voltage") {
        if (I === null || I === 0 || P === null || rawU !== null) {
          showResult("power-result", "Pro výpočet napětí vyplň proud a výkon. Pole napětí nech prázdné.");
          return;
        }
        result = `Napětí: ${formatAuto(P / I, [
          { factor: 0.001, unit: "mV" },
          { factor: 1, unit: "V" },
          { factor: 1000, unit: "kV" }
        ])}`;
      } else {
        if (U === null || U === 0 || P === null || rawI !== null) {
          showResult("power-result", "Pro výpočet proudu vyplň napětí a výkon. Pole proudu nech prázdné.");
          return;
        }
        result = `Proud: ${formatAuto(P / U, [
          { factor: 0.000001, unit: "µA" },
          { factor: 0.001, unit: "mA" },
          { factor: 1, unit: "A" }
        ])}`;
      }

      showResult("power-result", result);
    });
  }

  function nextStandardResistor(value) {
    const e12 = [1, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2];
    const decade = Math.pow(10, Math.floor(Math.log10(value)));

    for (const base of e12) {
      const candidate = base * decade;
      if (candidate >= value) return candidate;
    }

    return 10 * decade;
  }

  function initLed() {
    const button = $("led-calculate");
    if (!button) return;

    button.addEventListener("click", () => {
      const supply = number("led-supply");
      const forward = number("led-forward");
      const currentMa = number("led-current");

      if (supply === null || forward === null || currentMa === null ||
          supply <= 0 || forward < 0 || currentMa <= 0 || forward >= supply) {
        showResult("led-result", "Zkontroluj hodnoty. Napájení musí být vyšší než úbytek LED a proud musí být kladný.");
        return;
      }

      const current = currentMa / 1000;
      const voltageOnResistor = supply - forward;
      const idealResistance = voltageOnResistor / current;
      const standardResistance = nextStandardResistor(idealResistance);
      const actualCurrent = voltageOnResistor / standardResistance;
      const power = voltageOnResistor * actualCurrent;

      showResult("led-result",
        `Vypočtený odpor: ${format(idealResistance, 1)} Ω\n` +
        `Doporučený E12 rezistor: ${format(standardResistance, 1)} Ω\n` +
        `Skutečný proud: ${format(actualCurrent * 1000, 2)} mA\n` +
        `Ztrátový výkon: ${format(power * 1000, 2)} mW\n` +
        `Doporučení: zvol rezistor s dostatečnou výkonovou rezervou.`
      );
    });
  }

  const conversionUnits = {
    voltage: [
      { name: "mV", factor: 0.001 },
      { name: "V", factor: 1 },
      { name: "kV", factor: 1000 }
    ],
    current: [
      { name: "µA", factor: 0.000001 },
      { name: "mA", factor: 0.001 },
      { name: "A", factor: 1 }
    ],
    power: [
      { name: "mW", factor: 0.001 },
      { name: "W", factor: 1 },
      { name: "kW", factor: 1000 }
    ],
    resistance: [
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

    const units = conversionUnits[type.value];

    from.innerHTML = "";
    to.innerHTML = "";

    units.forEach((unit, index) => {
      const optionFrom = new Option(unit.name, String(unit.factor));
      const optionTo = new Option(unit.name, String(unit.factor));
      from.add(optionFrom);
      to.add(optionTo);
      if (index === Math.min(1, units.length - 1)) to.selectedIndex = index;
    });
  }

  function initConverter() {
    if (!$("convert-type")) return;

    populateUnits();
    $("convert-type").addEventListener("change", populateUnits);

    $("convert-calculate").addEventListener("click", () => {
      const value = number("convert-value");

      if (value === null) {
        showResult("convert-result", "Zadej hodnotu, kterou chceš převést.");
        return;
      }

      const fromFactor = Number($("convert-from").value);
      const toFactor = Number($("convert-to").value);
      const result = value * fromFactor / toFactor;

      showResult("convert-result", `Výsledek: ${format(result, 8)} ${$("convert-to").selectedOptions[0].textContent}`);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initOhm();
    initPower();
    initLed();
    initConverter();
  });
})();
