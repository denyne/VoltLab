
(() => {
  const $ = id => document.getElementById(id);
  const number = id => {
    const el = $(id);
    if (!el || el.value.trim() === "") return null;
    const n = Number(el.value);
    return Number.isFinite(n) ? n : null;
  };
  const show = (id, html) => { if ($(id)) $(id).innerHTML = html; };
  const fmt = (n, digits = 5) => Number(n.toPrecision(digits)).toLocaleString("cs-CZ");
  const error = msg => `<span class="result-error">⚠ ${msg}</span>`;
  const result = (label, value, unit, extra = "") =>
    `<div class="result-label">${label}</div><div class="result-value">${fmt(value)} <small>${unit}</small></div>${extra}`;

  function initOhm() {
    $("ohm-calculate")?.addEventListener("click", () => {
      const u = number("ohm-voltage");
      const i = number("ohm-current");
      const r = number("ohm-resistance");
      const values = [u, i, r];
      const known = values.filter(v => v !== null).length;
      if (known !== 2) {
        show("ohm-result", error("Vyplň přesně dvě hodnoty."));
        return;
      }
      if (values.filter(v => v !== null).some(v => v <= 0)) {
        show("ohm-result", error("Hodnoty musí být větší než nula."));
        return;
      }

      const uv = u === null ? null : u * Number($("ohm-voltage-unit").value);
      const ia = i === null ? null : i * Number($("ohm-current-unit").value);
      const ro = r === null ? null : r * Number($("ohm-resistance-unit").value);
      let html = "";

      if (uv === null) html = result("Vypočítané napětí", ro * ia, "V");
      if (ia === null) html = result("Vypočítaný proud", uv / ro, "A");
      if (ro === null) html = result("Vypočítaný odpor", uv / ia, "Ω");

      show("ohm-result", html);
    });
  }

  function initPower() {
    $("power-calculate")?.addEventListener("click", () => {
      const target = $("power-target").value;
      const u = number("power-voltage");
      const i = number("power-current");
      const p = number("power-watts");
      const vals = { voltage: u, current: i, power: p };
      const missing = Object.keys(vals).filter(k => vals[k] === null);
      if (missing.length !== 1 || missing[0] !== target) {
        show("power-result", error("Vyplň dvě hodnoty a třetí vyber jako výsledek."));
        return;
      }
      if (Object.values(vals).filter(v => v !== null).some(v => v <= 0)) {
        show("power-result", error("Hodnoty musí být větší než nula."));
        return;
      }

      const U = u === null ? null : u * Number($("power-voltage-unit").value);
      const I = i === null ? null : i * Number($("power-current-unit").value);
      const P = p === null ? null : p * Number($("power-watts-unit").value);

      if (target === "power") show("power-result", result("Vypočítaný výkon", U * I, "W"));
      if (target === "voltage") show("power-result", result("Vypočítané napětí", P / I, "V"));
      if (target === "current") show("power-result", result("Vypočítaný proud", P / U, "A"));
    });
  }

  function nextStandardResistor(value) {
    const standard = [1, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2];
    const decade = Math.pow(10, Math.floor(Math.log10(value)));
    for (const base of standard) {
      const candidate = base * decade;
      if (candidate >= value) return candidate;
    }
    return 10 * decade;
  }

  function initLed() {
    $("led-calculate")?.addEventListener("click", () => {
      const supply = number("led-supply");
      const forward = number("led-forward");
      const current = number("led-current");
      if ([supply, forward, current].some(v => v === null || v <= 0)) {
        show("led-result", error("Vyplň všechna pole kladnými hodnotami."));
        return;
      }
      if (supply <= forward) {
        show("led-result", error("Napájecí napětí musí být vyšší než úbytek LED."));
        return;
      }
      const amps = current / 1000;
      const required = (supply - forward) / amps;
      const standard = nextStandardResistor(required);
      const dissipation = Math.pow(amps, 2) * standard;
      show("led-result",
        result("Vypočítaný odpor", required, "Ω",
          `<div class="result-detail">Doporučená standardní hodnota: <strong>${fmt(standard)} Ω</strong><br>Výkon rezistoru: <strong>${fmt(dissipation)} W</strong><br>Vyber rezistor s výkonovou rezervou.</div>`));
    });
  }

  const units = {
    voltage: [["mV", .001], ["V", 1], ["kV", 1000]],
    current: [["µA", .000001], ["mA", .001], ["A", 1]],
    power: [["mW", .001], ["W", 1], ["kW", 1000]],
    resistance: [["Ω", 1], ["kΩ", 1000], ["MΩ", 1000000]],
    capacitance: [["pF", 1e-12], ["nF", 1e-9], ["µF", 1e-6], ["mF", .001], ["F", 1]]
  };

  function populateUnits() {
    const type = $("convert-type").value;
    const options = units[type].map(([name]) => `<option value="${name}">${name}</option>`).join("");
    $("convert-from").innerHTML = options;
    $("convert-to").innerHTML = options;
    $("convert-from").selectedIndex = Math.min(1, units[type].length - 1);
    $("convert-to").selectedIndex = 0;
  }

  function initConverter() {
    $("convert-type")?.addEventListener("change", populateUnits);
    $("convert-calculate")?.addEventListener("click", () => {
      const value = number("convert-value");
      if (value === null) {
        show("convert-result", error("Zadej hodnotu, kterou chceš převést."));
        return;
      }
      const type = $("convert-type").value;
      const from = $("convert-from").value;
      const to = $("convert-to").value;
      const source = units[type].find(u => u[0] === from);
      const target = units[type].find(u => u[0] === to);
      const converted = value * source[1] / target[1];
      show("convert-result", result("Výsledek převodu", converted, to));
    });
    populateUnits();
  }

  function initTabs() {
    document.querySelectorAll(".calc-tab").forEach(button => {
      button.addEventListener("click", () => {
        document.querySelectorAll(".calc-tab").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".calculator-panel").forEach(p => p.classList.remove("active"));
        button.classList.add("active");
        $("calc-" + button.dataset.calc)?.classList.add("active");
      });
    });
  }

  function initClear() {
    document.querySelectorAll("[data-clear]").forEach(button => {
      button.addEventListener("click", () => {
        const type = button.dataset.clear;
        const panel = $("calc-" + type);
        panel?.querySelectorAll("input").forEach(input => input.value = "");
        panel?.querySelectorAll(".result-panel").forEach(el => el.textContent = "Výsledek se zobrazí zde.");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initOhm();
    initPower();
    initLed();
    initConverter();
    initTabs();
    initClear();
  });
})();
