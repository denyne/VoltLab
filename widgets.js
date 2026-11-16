```javascript
/*
 * VoltLab V4 — Widgets Engine
 * --------------------------------
 * Šest technických kalkulaček:
 * 1. Ohmův zákon
 * 2. Elektrický výkon
 * 3. LED rezistor
 * 4. Převodník jednotek
 * 5. Rezistorová síť
 * 6. Energie kondenzátoru
 *
 * Kompatibilní s HTML prvky VoltLab V4.
 */

(() => {
  "use strict";

  const $ = id => document.getElementById(id);

  const EPSILON = 1e-12;

  // --------------------------------------------------
  // ZÁKLADNÍ POMOCNÉ FUNKCE
  // --------------------------------------------------

  function parseNumber(value) {
    if (typeof value === "number") {
      return Number.isFinite(value) ? value : NaN;
    }

    const normalized = String(value ?? "")
      .trim()
      .replace(/\s/g, "")
      .replace(",", ".");

    if (!normalized) return NaN;

    const result = Number(normalized);
    return Number.isFinite(result) ? result : NaN;
  }

  function readInput(id) {
    const element = $(id);
    if (!element) return NaN;

    return parseNumber(element.value);
  }

  function readMultiplier(id) {
    const element = $(id);
    if (!element) return 1;

    const multiplier = parseNumber(element.value);
    return Number.isFinite(multiplier) && multiplier > 0
      ? multiplier
      : 1;
  }

  function formatNumber(value, digits = 4) {
    if (!Number.isFinite(value)) return "—";

    if (value === 0) return "0";

    const absolute = Math.abs(value);

    if (absolute >= 1e9 || absolute < 1e-6) {
      return value.toExponential(3).replace(".", ",");
    }

    return Number(value.toPrecision(digits))
      .toLocaleString("cs-CZ", {
        maximumFractionDigits: digits,
        useGrouping: true
      });
  }

  function formatWithUnit(value, unit, digits = 4) {
    return `${formatNumber(value, digits)} ${unit}`;
  }

  function isPositive(value) {
    return Number.isFinite(value) && value > 0;
  }

  function isNonNegative(value) {
    return Number.isFinite(value) && value >= 0;
  }

  function showResult(id, html, type = "success") {
    const element = $(id);
    if (!element) return;

    element.innerHTML = html;
    element.classList.remove(
      "is-error",
      "is-success",
      "is-warning"
    );
    element.classList.add(`is-${type}`);
    element.hidden = false;
  }

  function showError(id, message) {
    showResult(
      id,
      `<strong>⚠️ ${escapeHTML(message)}</strong>`,
      "error"
    );
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[char]);
  }

  function bindClick(id, callback) {
    const element = $(id);
    if (!element) return;

    element.addEventListener("click", event => {
      event.preventDefault();
      callback();
    });
  }

  function bindEnter(ids, callback) {
    ids.forEach(id => {
      const element = $(id);
      if (!element) return;

      element.addEventListener("keydown", event => {
        if (event.key === "Enter") {
          event.preventDefault();
          callback();
        }
      });
    });
  }

  function getSelectedText(id) {
    const element = $(id);
    if (!element) return "";

    return element.options?.[element.selectedIndex]?.text || "";
  }

  // --------------------------------------------------
  // 1. OHMŮV ZÁKON
  // --------------------------------------------------

  function calculateOhm() {
    const voltageRaw = readInput("ohm-voltage");
    const currentRaw = readInput("ohm-current");
    const resistanceRaw = readInput("ohm-resistance");

    const voltageUnit = readMultiplier("ohm-voltage-unit");
    const currentUnit = readMultiplier("ohm-current-unit");
    const resistanceUnit = readMultiplier("ohm-resistance-unit");

    const voltage = Number.isFinite(voltageRaw)
      ? voltageRaw * voltageUnit
      : NaN;

    const current = Number.isFinite(currentRaw)
      ? currentRaw * currentUnit
      : NaN;

    const resistance = Number.isFinite(resistanceRaw)
      ? resistanceRaw * resistanceUnit
      : NaN;

    const known = [
      Number.isFinite(voltage),
      Number.isFinite(current),
      Number.isFinite(resistance)
    ].filter(Boolean).length;

    if (known !== 2) {
      showError(
        "ohm-result",
        "Vyplň přesně dvě hodnoty. Třetí veličina se vypočítá."
      );
      return;
    }

    if (
      (Number.isFinite(voltage) && voltage < 0) ||
      (Number.isFinite(current) && current < 0) ||
      (Number.isFinite(resistance) && resistance <= 0)
    ) {
      showError(
        "ohm-result",
        "Napětí a proud nesmí být záporné. Odpor musí být větší než nula."
      );
      return;
    }

    let resultVoltage = voltage;
    let resultCurrent = current;
    let resultResistance = resistance;

    if (!Number.isFinite(voltage)) {
      resultVoltage = current * resistance;
    }

    if (!Number.isFinite(current)) {
      if (resistance <= EPSILON) {
        showError("ohm-result", "Odpor musí být větší než nula.");
        return;
      }

      resultCurrent = voltage / resistance;
    }

    if (!Number.isFinite(resistance)) {
      if (current <= EPSILON) {
        showError(
          "ohm-result",
          "Pro výpočet odporu musí být proud větší než nula."
        );
        return;
      }

      resultResistance = voltage / current;
    }

    if (
      !Number.isFinite(resultVoltage) ||
      !Number.isFinite(resultCurrent) ||
      !Number.isFinite(resultResistance)
    ) {
      showError("ohm-result", "Výsledek nelze vypočítat.");
      return;
    }

    const power = resultVoltage * resultCurrent;

    showResult(
      "ohm-result",
      `
        <div class="widget-result-main">
          <span>Výsledek</span>
          <strong>${formatWithUnit(resultVoltage, "V")}</strong>
        </div>

        <div class="widget-result-grid">
          <div>
            <span>Napětí</span>
            <strong>${formatWithUnit(resultVoltage, "V")}</strong>
          </div>
          <div>
            <span>Proud</span>
            <strong>${formatWithUnit(resultCurrent, "A")}</strong>
          </div>
          <div>
            <span>Odpor</span>
            <strong>${formatWithUnit(resultResistance, "Ω")}</strong>
          </div>
          <div>
            <span>Výkon</span>
            <strong>${formatWithUnit(power, "W")}</strong>
          </div>
        </div>

        <p class="widget-result-note">
          Použitý vztah: U = R × I
        </p>
      `
    );
  }

  // --------------------------------------------------
  // 2. ELEKTRICKÝ VÝKON
  // --------------------------------------------------

  function calculatePower() {
    const target = $("power-target")?.value || "watts";

    const voltageRaw = readInput("power-voltage");
    const currentRaw = readInput("power-current");
    const wattsRaw = readInput("power-watts");

    const voltage = Number.isFinite(voltageRaw)
      ? voltageRaw * readMultiplier("power-voltage-unit")
      : NaN;

    const current = Number.isFinite(currentRaw)
      ? currentRaw * readMultiplier("power-current-unit")
      : NaN;

    const watts = Number.isFinite(wattsRaw)
      ? wattsRaw * readMultiplier("power-watts-unit")
      : NaN;

    const values = { voltage, current, watts };

    if (!Object.prototype.hasOwnProperty.call(values, target)) {
      showError("power-result", "Neplatný typ výpočtu.");
      return;
    }

    const otherValues = Object.entries(values)
      .filter(([key]) => key !== target)
      .map(([, value]) => value);

    if (!otherValues.every(Number.isFinite)) {
      showError(
        "power-result",
        "Vyplň dvě známé hodnoty. Třetí se vypočítá."
      );
      return;
    }

    if (otherValues.some(value => value < 0)) {
      showError(
        "power-result",
        "Vstupní hodnoty nesmí být záporné."
      );
      return;
    }

    let resultVoltage = voltage;
    let resultCurrent = current;
    let resultWatts = watts;

    if (target === "watts") {
      resultWatts = voltage * current;
    }

    if (target === "voltage") {
      if (current <= EPSILON) {
        showError(
          "power-result",
          "Proud musí být větší než nula."
        );
        return;
      }

      resultVoltage = watts / current;
    }

    if (target === "current") {
      if (voltage <= EPSILON) {
        showError(
          "power-result",
          "Napětí musí být větší než nula."
        );
        return;
      }

      resultCurrent = watts / voltage;
    }

    if (
      !Number.isFinite(resultVoltage) ||
      !Number.isFinite(resultCurrent) ||
      !Number.isFinite(resultWatts)
    ) {
      showError("power-result", "Výsledek nelze vypočítat.");
      return;
    }

    showResult(
      "power-result",
      `
        <div class="widget-result-main">
          <span>Elektrický výkon</span>
          <strong>${formatWithUnit(resultWatts, "W")}</strong>
        </div>

        <div class="widget-result-grid">
          <div>
            <span>Napětí</span>
            <strong>${formatWithUnit(resultVoltage, "V")}</strong>
          </div>
          <div>
            <span>Proud</span>
            <strong>${formatWithUnit(resultCurrent, "A")}</strong>
          </div>
          <div>
            <span>Výkon</span>
            <strong>${formatWithUnit(resultWatts, "W")}</strong>
          </div>
        </div>

        <p class="widget-result-note">
          Použitý vztah: P = U × I
        </p>
      `
    );
  }

  // --------------------------------------------------
  // 3. LED REZISTOR
  // --------------------------------------------------

  const E12 = [
    10, 12, 15, 18, 22, 27,
    33, 39, 47, 56, 68, 82
  ];

  function nextE12(value) {
    if (!isPositive(value)) return null;

    const exponent = Math.floor(Math.log10(value));
    const base = Math.pow(10, exponent);
    const normalized = value / base;

    for (const standard of E12) {
      if (standard >= normalized - EPSILON) {
        return standard * base;
      }
    }

    return 10 * base;
  }

  function calculateLED() {
    const supply = readInput("led-supply");
    const forward = readInput("led-forward");
    const currentMA = readInput("led-current");

    if (
      !isPositive(supply) ||
      !isNonNegative(forward) ||
      !isPositive(currentMA)
    ) {
      showError(
        "led-result",
        "Zadej platné napětí zdroje, úbytek LED a proud."
      );
      return;
    }

    if (forward >= supply) {
      showError(
        "led-result",
        "Napětí zdroje musí být vyšší než úbytek napětí LED."
      );
      return;
    }

    const current = currentMA / 1000;
    const voltageOnResistor = supply - forward;

    const exactResistance = voltageOnResistor / current;
    const standardResistance = nextE12(exactResistance);

    if (!standardResistance) {
      showError(
        "led-result",
        "Nepodařilo se najít vhodnou hodnotu rezistoru."
      );
      return;
    }

    const actualCurrent =
      voltageOnResistor / standardResistance;

    const resistorPower =
      voltageOnResistor * actualCurrent;

    const recommendedPower = resistorPower * 2;

    const powerOptions = [
      0.0625,
      0.1,
      0.125,
      0.25,
      0.5,
      1,
      2,
      3,
      5,
      10
    ];

    const selectedPower =
      powerOptions.find(power => power >= recommendedPower) ||
      null;

    showResult(
      "led-result",
      `
        <div class="widget-result-main">
          <span>Doporučený rezistor</span>
          <strong>${formatWithUnit(standardResistance, "Ω")}</strong>
        </div>

        <div class="widget-result-grid">
          <div>
            <span>Přesná vypočtená hodnota</span>
            <strong>${formatWithUnit(exactResistance, "Ω")}</strong>
          </div>

          <div>
            <span>Skutečný proud</span>
            <strong>${formatWithUnit(actualCurrent * 1000, "mA")}</strong>
          </div>

          <div>
            <span>Ztrátový výkon</span>
            <strong>${formatWithUnit(resistorPower, "W")}</strong>
          </div>

          <div>
            <span>Doporučený výkon rezistoru</span>
            <strong>
              ${selectedPower
                ? formatWithUnit(selectedPower, "W")
                : "Vyžaduje výkonnější součástku"}
            </strong>
          </div>
        </div>

        <p class="widget-result-note">
          Použitý vztah: R = (Uzdroj − ULED) / I
        </p>

        <p class="widget-result-note">
          Výběr odporu používá řadu E12. Doporučený výkon počítá
          s přibližně dvojnásobnou rezervou.
        </p>
      `
    );
  }

  // --------------------------------------------------
  // 4. PŘEVODNÍK JEDNOTEK
  // --------------------------------------------------

  const conversionUnits = {
    voltage: {
      V: 1,
      mV: 1e-3,
      µV: 1e-6,
      kV: 1e3
    },

    current: {
      A: 1,
      mA: 1e-3,
      µA: 1e-6,
      kA: 1e3
    },

    power: {
      W: 1,
      mW: 1e-3,
      µW: 1e-6,
      kW: 1e3,
      MW: 1e6
    },

    resistance: {
      "Ω": 1,
      "kΩ": 1e3,
      "MΩ": 1e6,
      "mΩ": 1e-3
    },

    capacitance: {
      F: 1,
      mF: 1e-3,
      "µF": 1e-6,
      nF: 1e-9,
      pF: 1e-12
    },

    time: {
      s: 1,
      ms: 1e-3,
      "µs": 1e-6,
      min: 60,
      h: 3600
    },

    frequency: {
      Hz: 1,
      kHz: 1e3,
      MHz: 1e6,
      GHz: 1e9
    }
  };

  function updateConverterOptions() {
    const typeElement = $("convert-type");
    const fromElement = $("convert-from");
    const toElement = $("convert-to");

    if (!typeElement || !fromElement || !toElement) return;

    const type = typeElement.value;
    const units = conversionUnits[type];

    if (!units) return;

    const previousFrom = fromElement.value;
    const previousTo = toElement.value;

    const options = Object.keys(units);

    function populate(select, preferred) {
      select.innerHTML = "";

      options.forEach(unit => {
        const option = document.createElement("option");
        option.value = unit;
        option.textContent = unit;
        select.appendChild(option);
      });

      if (options.includes(preferred)) {
        select.value = preferred;
      }
    }

    populate(fromElement, previousFrom);
    populate(toElement, previousTo);

    if (fromElement.value === toElement.value && options.length > 1) {
      toElement.value = options[1];
    }
  }

  function calculateConversion() {
    const type = $("convert-type")?.value;
    const value = readInput("convert-value");

    const from = $("convert-from")?.value;
    const to = $("convert-to")?.value;

    const units = conversionUnits[type];

    if (!units || !(from in units) || !(to in units)) {
      showError(
        "convert-result",
        "Vyber platnou kategorii a jednotky."
      );
      return;
    }

    if (!Number.isFinite(value)) {
      showError(
        "convert-result",
        "Zadej hodnotu, kterou chceš převést."
      );
      return;
    }

    const result = value * units[from] / units[to];

    if (!Number.isFinite(result)) {
      showError(
        "convert-result",
        "Výsledek převodu je mimo podporovaný rozsah."
      );
      return;
    }

    showResult(
      "convert-result",
      `
        <div class="widget-result-main">
          <span>Výsledek převodu</span>
          <strong>${formatNumber(result, 7)} ${escapeHTML(to)}</strong>
        </div>

        <p class="widget-result-note">
          ${formatNumber(value, 7)} ${escapeHTML(from)}
          = ${formatNumber(result, 7)} ${escapeHTML(to)}
        </p>
      `
    );
  }

  // --------------------------------------------------
  // 5. REZISTOROVÁ SÍŤ
  // --------------------------------------------------

  function parseResistorValues(raw) {
    const text = String(raw || "").trim();

    if (!text) return [];

    /*
     * Podporované formáty:
     * 100, 220, 330
     * 100; 220; 330
     * 1,5; 2,5; 3,5
     *
     * Čárka může být oddělovač položek,
     * nebo desetinný oddělovač.
     */

    let parts;

    if (text.includes(";")) {
      parts = text.split(";");
    } else {
      parts = text.split(/[,\s]+/);
    }

    return parts
      .map(part => parseNumber(part))
      .filter(value => Number.isFinite(value));
  }

  function calculateResistorNetwork() {
    const mode = $("resistor-mode")?.value || "series";
    const raw = $("resistor-values")?.value || "";

    const values = parseResistorValues(raw);

    if (values.length < 2) {
      showError(
        "resistor-result",
        "Zadej alespoň dva odpory. Odděluj je čárkou nebo středníkem."
      );
      return;
    }

    if (values.some(value => !isPositive(value))) {
      showError(
        "resistor-result",
        "Všechny odpory musí být větší než nula."
      );
      return;
    }

    if (values.length > 100) {
      showError(
        "resistor-result",
        "Pro jeden výpočet můžeš zadat maximálně 100 rezistorů."
      );
      return;
    }

    let total;

    if (mode === "parallel") {
      const reciprocalSum = values.reduce(
        (sum, value) => sum + 1 / value,
        0
      );

      total = 1 / reciprocalSum;
    } else {
      total = values.reduce(
        (sum, value) => sum + value,
        0
      );
    }

    if (!Number.isFinite(total)) {
      showError(
        "resistor-result",
        "Výsledek je mimo podporovaný rozsah."
      );
      return;
    }

    const operationName =
      mode === "parallel"
        ? "Paralelní zapojení"
        : "Sériové zapojení";

    const formula =
      mode === "parallel"
        ? "1/R = 1/R₁ + 1/R₂ + ..."
        : "R = R₁ + R₂ + ...";

    showResult(
      "resistor-result",
      `
        <div class="widget-result-main">
          <span>Celkový odpor</span>
          <strong>${formatWithUnit(total, "Ω")}</strong>
        </div>

        <div class="widget-result-grid">
          <div>
            <span>Typ zapojení</span>
            <strong>${operationName}</strong>
          </div>

          <div>
            <span>Počet rezistorů</span>
            <strong>${values.length}</strong>
          </div>
        </div>

        <p class="widget-result-note">
          Použitý vztah: ${formula}
        </p>

        <p class="widget-result-note">
          Vstupní hodnoty:
          ${values.map(value => formatNumber(value) + " Ω").join(", ")}
        </p>
      `
    );
  }

  // --------------------------------------------------
  // 6. ENERGIE KONDENZÁTORU
  // --------------------------------------------------

  function calculateCapacitorEnergy() {
    const capacitanceUF = readInput("cap-energy-capacitance");
    const voltage = readInput("cap-energy-voltage");

    if (!isPositive(capacitanceUF) || !isNonNegative(voltage)) {
      showError(
        "cap-energy-result",
        "Zadej platnou kapacitu a nezáporné napětí."
      );
      return;
    }

    const capacitance = capacitanceUF * 1e-6;

    const energy =
      0.5 * capacitance * voltage * voltage;

    const charge =
      capacitance * voltage;

    const capacitanceNF = capacitance * 1e9;
    const chargeMicroC = charge * 1e6;
    const energyMicroJ = energy * 1e6;

    showResult(
      "cap-energy-result",
      `
        <div class="widget-result-main">
          <span>Uložená energie</span>
          <strong>${formatWithUnit(energyMicroJ, "µJ")}</strong>
        </div>

        <div class="widget-result-grid">
          <div>
            <span>Kapacita</span>
            <strong>${formatWithUnit(capacitanceNF, "nF")}</strong>
          </div>

          <div>
            <span>Náboj</span>
            <strong>${formatWithUnit(chargeMicroC, "µC")}</strong>
          </div>

          <div>
            <span>Energie</span>
            <strong>${formatWithUnit(energy, "J")}</strong>
          </div>

          <div>
            <span>Napětí</span>
            <strong>${formatWithUnit(voltage, "V")}</strong>
          </div>
        </div>

        <p class="widget-result-note">
          Použitý vztah: E = ½ × C × U²
        </p>
      `
    );
  }

  // --------------------------------------------------
  // INICIALIZACE
  // --------------------------------------------------

  function initWidgets() {
    // Ohmův zákon
    bindClick("ohm-calculate", calculateOhm);
    bindEnter(
      ["ohm-voltage", "ohm-current", "ohm-resistance"],
      calculateOhm
    );

    // Elektrický výkon
    bindClick("power-calculate", calculatePower);
    bindEnter(
      ["power-voltage", "power-current", "power-watts"],
      calculatePower
    );

    // LED rezistor
    bindClick("led-calculate", calculateLED);
    bindEnter(
      ["led-supply", "led-forward", "led-current"],
      calculateLED
    );

    // Převodník
    const convertType = $("convert-type");

    if (convertType) {
      convertType.addEventListener(
        "change",
        updateConverterOptions
      );

      updateConverterOptions();
    }

    bindClick("convert-calculate", calculateConversion);
    bindEnter(["convert-value"], calculateConversion);

    // Rezistorová síť
    bindClick(
      "resistor-calculate",
      calculateResistorNetwork
    );

    bindEnter(
      ["resistor-values"],
      calculateResistorNetwork
    );

    // Energie kondenzátoru
    bindClick(
      "cap-energy-calculate",
      calculateCapacitorEnergy
    );

    bindEnter(
      ["cap-energy-capacitance", "cap-energy-voltage"],
      calculateCapacitorEnergy
    );

    console.info("VoltLab V4: Widgets initialized.");
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initWidgets,
      { once: true }
    );
  } else {
    initWidgets();
  }

  // --------------------------------------------------
  // VEŘEJNÉ API
  // --------------------------------------------------

  window.VoltLabWidgets = {
    calculateOhm,
    calculatePower,
    calculateLED,
    calculateConversion,
    calculateResistorNetwork,
    calculateCapacitorEnergy,

    updateConverterOptions,

    version: "4.0"
  };

})();
```
