/**
 * VoltLab V5 — Interaktivní inženýrské kalkulačky a převodníky
 */

export function initEngineeringTools() {
  initOhmsLawTool();
  initVoltageDividerTool();
  initRcFilterTool();
}

function formatEngineering(value, unit) {
  if (!Number.isFinite(value) || value === 0) return `0 ${unit}`;
  const abs = Math.abs(value);
  if (abs >= 1e6) return `${(value / 1e6).toFixed(3)} M${unit}`;
  if (abs >= 1e3) return `${(value / 1e3).toFixed(3)} k${unit}`;
  if (abs >= 1) return `${value.toFixed(3)} ${unit}`;
  if (abs >= 1e-3) return `${(value * 1e3).toFixed(3)} m${unit}`;
  if (abs >= 1e-6) return `${(value * 1e6).toFixed(3)} µ${unit}`;
  if (abs >= 1e-9) return `${(value * 1e9).toFixed(3)} n${unit}`;
  return `${(value * 1e12).toFixed(3)} p${unit}`;
}

function initOhmsLawTool() {
  const vInput = document.getElementById('ohm-voltage');
  const rInput = document.getElementById('ohm-resistance');
  const out = document.getElementById('ohm-output');
  if (!vInput || !rInput || !out) return;

  const calculate = () => {
    const u = parseFloat(vInput.value);
    const r = parseFloat(rInput.value);
    if (Number.isNaN(u) || Number.isNaN(r) || r <= 0) {
      out.innerHTML = 'Zadejte platné napětí a nenulový odpor R > 0 Ω.';
      return;
    }
    const i = u / r;
    const p = u * i;
    out.innerHTML = `Proud I = <strong>${formatEngineering(i, 'A')}</strong><br>Ztrátový výkon P = <strong>${formatEngineering(p, 'W')}</strong>`;
  };

  vInput.addEventListener('input', calculate);
  rInput.addEventListener('input', calculate);
  calculate();
}

function initVoltageDividerTool() {
  const vinEl = document.getElementById('div-vin');
  const r1El = document.getElementById('div-r1');
  const r2El = document.getElementById('div-r2');
  const out = document.getElementById('div-output');
  if (!vinEl || !r1El || !r2El || !out) return;

  const calculate = () => {
    const vin = parseFloat(vinEl.value);
    const r1 = parseFloat(r1El.value);
    const r2 = parseFloat(r2El.value);
    if (Number.isNaN(vin) || Number.isNaN(r1) || Number.isNaN(r2) || r1 < 0 || r2 <= 0) {
      out.innerHTML = 'Zadejte platné hodnoty odporů (R2 > 0 kΩ).';
      return;
    }
    const vout = vin * (r2 / (r1 + r2));
    const current = vin / ((r1 + r2) * 1000);
    const ratio = (r2 / (r1 + r2)) * 100;
    out.innerHTML = `Vout = <strong>${vout.toFixed(3)} V</strong> (${ratio.toFixed(1)} %)<br>Klidový proud = <strong>${formatEngineering(current, 'A')}</strong>`;
  };

  [vinEl, r1El, r2El].forEach((el) => el.addEventListener('input', calculate));
  calculate();
}

function initRcFilterTool() {
  const rEl = document.getElementById('rc-res');
  const cEl = document.getElementById('rc-cap');
  const out = document.getElementById('rc-output');
  if (!rEl || !cEl || !out) return;

  const calculate = () => {
    const rOhm = parseFloat(rEl.value);
    const cNf = parseFloat(cEl.value);
    if (Number.isNaN(rOhm) || Number.isNaN(cNf) || rOhm <= 0 || cNf <= 0) {
      out.innerHTML = 'Zadejte kladné hodnoty R (Ω) a C (nF).';
      return;
    }
    const cFarad = cNf * 1e-9;
    const fc = 1 / (2 * Math.PI * rOhm * cFarad);
    const tau = rOhm * cFarad;
    out.innerHTML = `Mezní frekvence fc (-3 dB) = <strong>${formatEngineering(fc, 'Hz')}</strong><br>Časová konstanta τ = <strong>${formatEngineering(tau, 's')}</strong>`;
  };

  rEl.addEventListener('input', calculate);
  cEl.addEventListener('input', calculate);
  calculate();
}
