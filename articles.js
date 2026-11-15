
window.VOLTLAB_DEFAULT_ARTICLES = [
  {
    id: "arduino-start",
    title: "Arduino: První kroky",
    category: "arduino",
    icon: "⌘",
    readTime: "6 min",
    excerpt: "Seznam se s deskou Arduino a vytvoř svůj první elektronický projekt.",
    content: `<h3>Co je Arduino?</h3>
<p>Arduino je otevřená platforma pro tvorbu elektronických projektů. Umožňuje jednoduše ovládat LED, motory, senzory a mnoho dalších součástek.</p>
<h3>Co budeš potřebovat?</h3>
<ul><li>Arduino Uno nebo kompatibilní desku</li><li>USB kabel</li><li>Počítač s Arduino IDE</li><li>LED a rezistor 220 Ω</li></ul>
<h3>První program</h3>
<pre><code>void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}
void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(1000);
  digitalWrite(LED_BUILTIN, LOW);
  delay(1000);
}</code></pre>
<p>Program rozbliká vestavěnou LED. Gratuluji – právě jsi vytvořil svůj první Arduino program!</p>`,
    tags: ["Arduino", "začátečník", "programování"]
  },
  {
    id: "ohm-law",
    title: "Ohmův zákon jednoduše",
    category: "electronics",
    icon: "Ω",
    readTime: "5 min",
    excerpt: "Pochop vztah mezi napětím, proudem a odporem.",
    content: `<h3>Základ elektroniky</h3>
<p>Ohmův zákon popisuje vztah mezi elektrickým napětím, proudem a odporem.</p>
<p><strong>U = R × I</strong></p>
<ul><li>U – napětí ve voltech (V)</li><li>R – odpor v ohmech (Ω)</li><li>I – proud v ampérech (A)</li></ul>
<h3>Příklad</h3>
<p>Rezistorem 100 Ω protéká proud 0,02 A. Napětí je U = 100 × 0,02 = 2 V.</p>
<p>Vyzkoušej si výpočty v kalkulačce Ohmova zákona na VoltLabu.</p>`,
    tags: ["elektronika", "výpočty", "základy"]
  },
  {
    id: "led-resistor",
    title: "Jak vybrat rezistor pro LED",
    category: "electronics",
    icon: "◉",
    readTime: "4 min",
    excerpt: "Zjisti, proč LED potřebuje rezistor a jak vypočítat jeho hodnotu.",
    content: `<h3>Proč potřebuje LED rezistor?</h3>
<p>LED je citlivá na proud. Bez omezení proudu může dojít k jejímu poškození.</p>
<h3>Výpočet</h3>
<p><strong>R = (U napájení − U LED) / I LED</strong></p>
<p>Příklad: napájení 5 V, LED s úbytkem 2 V a proudem 20 mA:</p>
<p>R = (5 − 2) / 0,02 = 150 Ω.</p>
<p>V praxi vyber vhodnou standardní hodnotu rezistoru a ověř jeho výkonové zatížení.</p>`,
    tags: ["LED", "rezistor", "elektronika"]
  },
  {
    id: "robot-first",
    title: "Tvůj první robot",
    category: "robotics",
    icon: "◈",
    readTime: "7 min",
    excerpt: "Základní přehled součástek pro jednoduchého mobilního robota.",
    content: `<h3>Z čeho se robot skládá?</h3>
<p>Jednoduchý robot může obsahovat řídicí desku, dva motory, motorový driver, baterii a podvozek.</p>
<h3>Řídicí jednotka</h3>
<p>Arduino může číst senzory a ovládat motory podle naprogramovaných pravidel.</p>
<h3>První úkol</h3>
<p>Nejprve zkus robota rozjet dopředu a dozadu. Potom přidej zatáčení a nakonec senzor překážek.</p>`,
    tags: ["robot", "motory", "Arduino"]
  },
  {
    id: "3d-basics",
    title: "Základy 3D tisku",
    category: "3d-printing",
    icon: "▧",
    readTime: "6 min",
    excerpt: "Jak vzniká 3D tištěný díl a co potřebuješ pro první tisk.",
    content: `<h3>Od modelu k výrobku</h3>
<p>3D tisk umožňuje vyrábět prostorové objekty postupným ukládáním materiálu ve vrstvách.</p>
<h3>Co potřebuješ?</h3>
<ul><li>3D tiskárnu</li><li>Filament, například PLA</li><li>3D model</li><li>Slicer pro přípravu tisku</li></ul>
<h3>První model</h3>
<p>Začni jednoduchým držákem nebo krabičkou. Naučíš se nastavit teplotu, výšku vrstvy a podpěry.</p>`,
    tags: ["3D tisk", "PLA", "modelování"]
  },
  {
    id: "esp32-home",
    title: "ESP32 a chytrá domácnost",
    category: "smart-home",
    icon: "⌂",
    readTime: "8 min",
    excerpt: "Prozkoumej možnosti Wi-Fi mikrokontroléru ESP32.",
    content: `<h3>Co je ESP32?</h3>
<p>ESP32 je výkonný mikrokontrolér s integrovanou Wi-Fi a Bluetooth konektivitou.</p>
<h3>Možnosti využití</h3>
<ul><li>Měření teploty a vlhkosti</li><li>Ovládání světel</li><li>Webové rozhraní</li><li>Monitoring domácnosti</li></ul>
<p>ESP32 je skvělý základ pro vlastní IoT projekty.</p>`,
    tags: ["ESP32", "Wi-Fi", "IoT"]
  },
  {
    id: "programming-start",
    title: "Jak začít s programováním",
    category: "programming",
    icon: "</>",
    readTime: "5 min",
    excerpt: "Seznam se s proměnnými, podmínkami a cykly.",
    content: `<h3>Programování krok za krokem</h3>
<p>Programování znamená popsat počítači nebo mikrokontroléru, co má udělat.</p>
<h3>Základní stavební prvky</h3>
<ul><li>Proměnné ukládají hodnoty.</li><li>Podmínky rozhodují podle situace.</li><li>Cykly opakují příkazy.</li><li>Funkce rozdělují program na části.</li></ul>
<pre><code>let teplota = 25;
if (teplota > 30) {
  console.log("Je horko");
} else {
  console.log("Teplota je v normě");
}</code></pre>`,
    tags: ["programování", "základy", "kód"]
  }
];
