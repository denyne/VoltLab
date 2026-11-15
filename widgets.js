
/* =====================================================
   VOLTLAB V3 – WIDGETS
   Technické kalkulačky a nástroje
   ===================================================== */

(function () {
  "use strict";

  const definitions = [
    {
      id: "ohm-calculator",
      name: "Ohmův zákon",
      description: "Výpočet napětí, proudu, odporu a výkonu.",
      enabled: true,
      position: 1
    },
    {
      id: "unit-converter",
      name: "Převod jednotek",
      description: "Převody elektronických jednotek.",
      enabled: true,
      position: 2
    },
    {
      id: "resistor-calculator",
      name: "Barevný kód rezistoru",
      description: "Určení hodnoty rezistoru podle barevných proužků.",
      enabled: true,
      position: 3
    }
  ];

  const colors = {
    black: 0,
    brown: 1,
    red: 2,
    orange: 3,
    yellow: 4,
    green: 5,
    blue: 6,
    violet: 7,
    grey: 8,
    white: 9
  };

  const multipliers = {
    black: 1,
    brown: 10,
    red: 100,
    orange: 1000,
    yellow: 10000,
    green: 100000,
    blue: 1000000,
    gold: 0.1,
    silver: 0.01
  };

  const tolerances = {
    brown: "±1 %",
    red: "±2 %",
    green: "±0,5 %",
    blue: "±0,25 %",
    violet: "±0,1 %",
    grey: "±0,05 %",
    gold: "±5 %",
    silver: "±10 %",
    none: "±20 %"
  };

  function round(value) {
    return Number(value.toFixed(6));
  }

  function format(value, unit = "") {
    return `${Number(value.toFixed(4)).toLocaleString("cs-CZ")} ${unit}`.trim();
  }

  function calculateOhms({ voltage, current, resistance }) {
    voltage = Number(voltage);
    current = Number(current);
    resistance = Number(resistance);

    const supplied = [
      Number.isFinite(voltage) && voltage > 0,
      Number.isFinite(current) && current > 0,
      Number.isFinite(resistance) && resistance > 0
    ];

    if (supplied.filter(Boolean).length !== 2) {
      throw new Error("Zadej přesně dvě kladné hodnoty.");
    }

    if (!supplied[0]) voltage = current * resistance;
    if (!supplied[1]) current = voltage / resistance;
    if (!supplied[2]) resistance = voltage / current;

    return {
      voltage: round(voltage),
      current: round(current),
      resistance: round(resistance),
      power: round(voltage * current)
    };
  }

  function convertUnit(value, from, to) {
    const units = {
      V: 1,
      mV: 0.001,
      kV: 1000,
      A: 1,
      mA: 0.001,
      uA: 0.000001,
      ohm: 1,
      kohm: 1000,
      Mohm: 1000000,
      W: 1,
      mW: 0.001,
      kW: 1000,
      F: 1,
      uF: 0.000001,
      nF: 0.000000001,
      pF: 0.000000000001,
      Hz: 1,
      kHz: 1000,
      MHz: 1000000,
      GHz: 1000000000
    };

    value = Number(value);

    if (!Number.isFinite(value)) {
      throw new Error("Zadej platnou číselnou hodnotu.");
    }

    if (!(from in units) || !(to in units)) {
      throw new Error("Neznámá jednotka.");
    }

    const groups = {
      V: "voltage", mV: "voltage", kV: "voltage",
      A: "current", mA: "current", uA: "current",
      ohm: "resistance", kohm: "resistance", Mohm: "resistance",
      W: "power", mW: "power", kW: "power",
      F: "capacitance", uF: "capacitance",
      nF: "capacitance", pF: "capacitance",
      Hz: "frequency", kHz: "frequency",
      MHz: "frequency", GHz: "frequency"
    };

    if (groups[from] !== groups[to]) {
      throw new Error("Nelze převádět různé druhy jednotek.");
    }

    return round(value * units[from] / units[to]);
  }

  function calculateResistor(band1, band2, multiplier, tolerance = "gold") {
    const first = colors[band1];
    const second = colors[band2];
    const factor = multipliers[multiplier];

    if (first === undefined || second === undefined || factor === undefined) {
      throw new Error("Vyber platné barvy proužků.");
    }

    if (tolerances[tolerance] === undefined) {
      throw new Error("Neznámá tolerance.");
    }

    const resistance = (first * 10 + second) * factor;

    return {
      resistance: round(resistance),
      formatted: formatResistance(resistance),
      tolerance: tolerances[tolerance]
    };
  }

  function formatResistance(value) {
    if (value >= 1000000) {
      return `${format(value / 1000000, "MΩ")}`;
    }

    if (value >= 1000) {
      return `${format(value / 1000, "kΩ")}`;
    }

    return `${format(value, "Ω")}`;
  }

  function getDefinitions() {
    return definitions.map(item => ({ ...item }));
  }

  function getEnabledWidgets() {
    const app = window.VoltLab;
    const saved = app?.getWidgets?.() || [];

    return definitions
      .map(definition => {
        const custom = saved.find(item => item.id === definition.id);
        return { ...definition, ...(custom || {}) };
      })
      .filter(item => item.enabled)
      .sort((a, b) => a.position - b.position);
  }

  function renderOhmCalculator() {
    return `
      <div class="widget-card" id="widget-ohm-calculator">
        <h3>Ohmův zákon</h3>
        <p>Vyplň přesně dvě hodnoty.</p>

        <div class="widget-fields">
          <label>Napětí (V)
            <input type="number" step="any" id="ohm-voltage">
          </label>

          <label>Proud (A)
            <input type="number" step="any" id="ohm-current">
          </label>

          <label>Odpor (Ω)
            <input type="number" step="any" id="ohm-resistance">
          </label>
        </div>

        <button type="button" class="button button-primary"
          data-widget-action="calculate-ohm">
          Vypočítat
        </button>

        <div id="ohm-result" aria-live="polite"></div>
      </div>
    `;
  }

  function renderUnitConverter() {
    return `
      <div class="widget-card" id="widget-unit-converter">
        <h3>Převod jednotek</h3>

        <label>Hodnota
          <input type="number" step="any" id="converter-value" value="1">
        </label>

        <label>Z jednotky
          <select id="converter-from">
            ${unitOptions()}
          </select>
        </label>

        <label>Na jednotku
          <select id="converter-to">
            ${unitOptions()}
          </select>
        </label>

        <button type="button" class="button button-primary"
          data-widget-action="convert">
          Převést
        </button>

        <div id="converter-result" aria-live="polite"></div>
      </div>
    `;
  }

  function unitOptions() {
    const units = [
      ["V", "Volt"],
      ["mV", "Milivolt"],
      ["kV", "Kilovolt"],
      ["A", "Ampér"],
      ["mA", "Miliampér"],
      ["uA", "Mikroampér"],
      ["ohm", "Ohm"],
      ["kohm", "Kiloohm"],
      ["Mohm", "Megaohm"],
      ["W", "Watt"],
      ["mW", "Miliwatt"],
      ["kW", "Kilowatt"],
      ["F", "Farad"],
      ["uF", "Mikrofarad"],
      ["nF", "Nanofarad"],
      ["pF", "Pikofarad"],
      ["Hz", "Hertz"],
      ["kHz", "Kilohertz"],
      ["MHz", "Megahertz"],
      ["GHz", "Gigahertz"]
    ];

    return units.map(([value, label]) =>
      `<option value="${value}">${label} (${value})</option>`
    ).join("");
  }

  function renderResistorCalculator() {
    const options = Object.keys(colors)
      .map(color =>
        `<option value="${color}">${color}</option>`
      ).join("");

    const multiplierOptions = Object.keys(multipliers)
      .map(color =>
        `<option value="${color}">${color}</option>`
      ).join("");

    const toleranceOptions = Object.keys(tolerances)
      .map(color =>
        `<option value="${color}">${color}</option>`
      ).join("");

    return `
      <div class="widget-card" id="widget-resistor-calculator">
        <h3>Barevný kód rezistoru</h3>

        <label>První proužek
          <select id="resistor-band-1">${options}</select>
        </label>

        <label>Druhý proužek
          <select id="resistor-band-2">${options}</select>
        </label>

        <label>Násobitel
          <select id="resistor-multiplier">${multiplierOptions}</select>
        </label>

        <label>Tolerance
          <select id="resistor-tolerance">${toleranceOptions}</select>
        </label>

        <button type="button" class="button button-primary"
          data-widget-action="calculate-resistor">
          Vypočítat odpor
        </button>

        <div id="resistor-result" aria-live="polite"></div>
      </div>
    `;
  }

  function showResult(id, content) {
    const element = document.getElementById(id);
    if (element) element.textContent = content;
  }

  function handleAction(action) {
    try {
      if (action === "calculate-ohm") {
        const result = calculateOhms({
          voltage: document.getElementById("ohm-voltage").value,
          current: document.getElementById("ohm-current").value,
          resistance: document.getElementById("ohm-resistance").value
        });

        showResult(
          "ohm-result",
          `Napětí: ${format(result.voltage, "V")} | Proud: ${format(result.current, "A")} | Odpor: ${format(result.resistance, "Ω")} | Výkon: ${format(result.power, "W")}`
        );
      }

      if (action === "convert") {
        const result = convertUnit(
          document.getElementById("converter-value").value,
          document.getElementById("converter-from").value,
          document.getElementById("converter-to").value
        );

        showResult("converter-result", `Výsledek: ${format(result)}`);
      }

      if (action === "calculate-resistor") {
        const result = calculateResistor(
          document.getElementById("resistor-band-1").value,
          document.getElementById("resistor-band-2").value,
          document.getElementById("resistor-multiplier").value,
          document.getElementById("resistor-tolerance").value
        );

        showResult(
          "resistor-result",
          `Odpor: ${result.formatted} | Tolerance: ${result.tolerance}`
        );
      }
    } catch (error) {
      const target = {
        "calculate-ohm": "ohm-result",
        convert: "converter-result",
        "calculate-resistor": "resistor-result"
      }[action];

      if (target) showResult(target, error.message);
    }
  }

  function initializeEvents() {
    document.addEventListener("click", event => {
      const button = event.target.closest("[data-widget-action]");
      if (!button) return;

      handleAction(button.dataset.widgetAction);
    });
  }

  function renderWidget(id) {
    const renderers = {
      "ohm-calculator": renderOhmCalculator,
      "unit-converter": renderUnitConverter,
      "resistor-calculator": renderResistorCalculator
    };

    return renderers[id] ? renderers[id]() : "";
  }

  function initialize() {
    const app = window.VoltLab;

    if (!app) {
      console.warn("VoltLab core nebyl nalezen.");
      return;
    }

    const current = app.getWidgets();

    if (!current.length) {
      app.saveWidgets(definitions);
    }

    initializeEvents();

    document.dispatchEvent(
      new CustomEvent("voltLabWidgetsReady")
    );
  }

  window.VOLTLAB_WIDGET_DEFINITIONS = definitions;
  window.VoltLabWidgets = {
    getDefinitions,
    getEnabledWidgets,
    renderWidget,
    calculateOhms,
    convertUnit,
    calculateResistor,
    formatResistance
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }

})();
