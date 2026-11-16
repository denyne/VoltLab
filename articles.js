
window.VOLTLAB_DEFAULT_ARTICLES = [
  {
    id: "arduino-start",
    title: "Arduino: první kroky",
    category: "arduino",
    icon: "⌘",
    readTime: "5 min",
    excerpt: "Seznam se s deskou Arduino, prostředím IDE a svým prvním programem.",
    content: `Arduino je platforma pro jednoduché prototypování elektroniky. Umožňuje propojit programování s reálným světem pomocí vstupů a výstupů.

Co budeš potřebovat:
- Arduino Uno nebo kompatibilní desku
- USB kabel
- Počítač s Arduino IDE
- LED diodu a rezistor 220–330 Ω

První program:
Otevři Arduino IDE, vyber správnou desku a port. Vytvoř nový projekt a vlož ukázkový kód Blink.

Jak to funguje:
Funkce setup() se provede jednou po spuštění. Nastaví pin 13 jako výstup. Funkce loop() se potom opakuje stále dokola a střídavě zapíná a vypíná LED.

Tip:
Začni jednoduchými pokusy. Postupně přidávej tlačítka, senzory a další komponenty.`,
    tags: ["Arduino", "začátečník", "programování"]
  },
  {
    id: "ohm-law",
    title: "Ohmův zákon jednoduše",
    category: "electronics",
    icon: "Ω",
    readTime: "4 min",
    excerpt: "Napětí, proud a odpor. Tři veličiny, které tvoří základ elektrických obvodů.",
    content: `Ohmův zákon popisuje vztah mezi napětím, proudem a odporem.

Základní vzorec:
U = R × I

Kde:
- U je napětí ve voltech (V)
- R je odpor v ohmech (Ω)
- I je proud v ampérech (A)

Z něj získáš také:
I = U / R
R = U / I

Příklad:
Máš zdroj 12 V a rezistor 220 Ω. Proud vypočítáš jako 12 / 220 = 0,0545 A, tedy přibližně 54,5 mA.

Důležité:
Vždy používej správné jednotky. Před dosazením do vzorce převeď miliampéry na ampéry a kiloohmy na ohmy.`,
    tags: ["elektronika", "výpočty", "základy"]
  },
  {
    id: "led-resistor",
    title: "Jak zapojit LED diodu",
    category: "electronics",
    icon: "◉",
    readTime: "4 min",
    excerpt: "Proč LED potřebuje rezistor a jak správně vybrat jeho hodnotu.",
    content: `LED je polovodičová součástka, která při průchodu proudu vyzařuje světlo. Na rozdíl od běžné žárovky je citlivá na překročení maximálního proudu.

Proč potřebuje rezistor:
Rezistor omezuje proud procházející LED. Bez něj může dojít k jejímu poškození.

Výpočet:
R = (Uzdroje − Uled) / I

Příklad:
Napájení 5 V, červená LED s úbytkem 2 V a proudem 20 mA:
R = (5 − 2) / 0,02 = 150 Ω.

V praxi můžeš použít nejbližší vyšší běžnou hodnotu, například 180 Ω.

Pozor:
Ověř maximální proud LED a výkonovou ztrátu rezistoru. Při vyšších proudech je nutné počítat také s jeho zahříváním.`,
    tags: ["LED", "rezistor", "elektronika"]
  },
  {
    id: "robot-first",
    title: "Jak funguje jednoduchý robot",
    category: "robotics",
    icon: "◎",
    readTime: "6 min",
    excerpt: "Z čeho se skládá malý robot a jak spolupracují jeho jednotlivé části.",
    content: `Jednoduchý mobilní robot může být postavený na několika základních částech.

Řídicí jednotka:
Mikrokontrolér zpracovává informace a rozhoduje, co robot udělá.

Senzory:
Senzory mohou měřit vzdálenost, světlo nebo třeba čáru na podlaze.

Motory:
Motory vytvářejí pohyb. U malého robota se často používají stejnosměrné převodové motory.

Ovládání:
Motorový driver umožňuje řídit směr a rychlost motorů.

Začni jednoduše:
Nejdříve vyzkoušej pohyb dopředu a dozadu. Potom přidej zatáčení a nakonec senzory.`,
    tags: ["robotika", "motory", "začátečník"]
  },
  {
    id: "3d-basics",
    title: "Základy 3D tisku",
    category: "3d-printing",
    icon: "▦",
    readTime: "5 min",
    excerpt: "Od 3D modelu k hotovému výtisku. Co znamenají základní pojmy?",
    content: `3D tisk umožňuje vyrábět fyzické objekty z digitálních modelů.

Jak proces probíhá:
1. Vytvoříš nebo stáhneš 3D model.
2. Otevřeš ho v programu slicer.
3. Nastavíš materiál, teplotu, rychlost a další parametry.
4. Slicer vytvoří G-code.
5. Tiskárna podle něj vytiskne model po jednotlivých vrstvách.

Základní pojmy:
- PLA: oblíbený materiál pro začátečníky.
- PETG: odolnější materiál s jinými tiskovými vlastnostmi.
- Infill: vnitřní výplň modelu.
- Layer height: výška jedné vrstvy.
- Supports: podpěry pro převislé části.

Tip:
Začni malými modely a měň vždy jen několik parametrů, abys poznal jejich vliv na výsledek.`,
    tags: ["3D tisk", "PLA", "modelování"]
  },
  {
    id: "esp32-home",
    title: "ESP32 a chytrá domácnost",
    category: "smart-home",
    icon: "⌂",
    readTime: "7 min",
    excerpt: "Jak může ESP32 ovládat zařízení a komunikovat přes Wi-Fi.",
    content: `ESP32 je výkonný mikrokontrolér s integrovanou Wi-Fi a Bluetooth konektivitou. Hodí se pro různé projekty chytré domácnosti.

Co můžeš vytvořit:
- Teplotní monitor.
- Wi-Fi ovládání LED osvětlení.
- Jednoduchý webový server.
- Monitorování senzorů.

Jak začít:
Připoj ESP32 k počítači, nainstaluj podporu desek v Arduino IDE a nahraj jednoduchý testovací program.

Komunikace:
ESP32 se může připojit k domácí Wi-Fi síti a poskytovat data dalším zařízením.

Bezpečnost:
Nedávej veřejně přístupné zařízení bez zabezpečení. Nepřipojuj síťové napětí přímo na GPIO piny.`,
    tags: ["ESP32", "Wi-Fi", "Smart Home"]
  },
  {
    id: "programming-start",
    title: "Programování od nuly",
    category: "programming",
    icon: "</>",
    readTime: "5 min",
    excerpt: "Proměnné, podmínky a cykly – základní stavební kameny programování.",
    content: `Programování je způsob, jak popsat počítači posloupnost kroků, které má vykonat.

Proměnné:
Ukládají hodnoty, se kterými může program pracovat.

Podmínky:
Umožňují programu rozhodovat se podle situace.

Cykly:
Opakují určitou část kódu.

Příklad v JavaScriptu:
const teplota = 24;

if (teplota > 25) {
  console.log("Je teplo");
} else {
  console.log("Teplota je v normě");
}

Jak se učit:
Piš malé programy, zkoušej změny a neboj se chyb. Právě jejich hledání je důležitou součástí programování.`,
    tags: ["programování", "JavaScript", "začátečník"]
  }
];
