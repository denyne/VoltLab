
/* =====================================================
   VOLTLAB V3 – ARTICLES
   Výchozí technické články
   ===================================================== */

(function () {
  "use strict";

  window.VOLTLAB_DEFAULT_ARTICLES = [
    {
      id: "arduino-zacatek",
      title: "Arduino: Jak začít s programováním",
      category: "arduino",
      excerpt: "První kroky s deskou Arduino, vývojovým prostředím a jednoduchým programem.",
      content: `
Arduino je oblíbená platforma pro výuku elektroniky a programování.

CO JE ARDUINO?

Arduino je vývojová platforma, která umožňuje ovládat elektronické součástky pomocí programu.

CO BUDEŠ POTŘEBOVAT?

- Arduino Uno
- USB kabel
- Počítač
- LED diodu
- Rezistor 220 Ω
- Propojovací vodiče

PRVNÍ PROGRAM

Jedním z nejznámějších prvních projektů je blikající LED dioda.

Program:

void setup() {
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH);
  delay(1000);

  digitalWrite(13, LOW);
  delay(1000);
}

JAK PROGRAM FUNGUJE?

Funkce setup() se spustí pouze jednou při zapnutí nebo resetu desky.

Funkce loop() se neustále opakuje.

Příkaz digitalWrite() nastavuje digitální výstup a delay() určuje časovou prodlevu v milisekundách.

ZÁVĚR

Arduino je skvělý začátek pro vlastní elektronické projekty.
      `,
      image: "assets/images/arduino.jpg",
      icon: "cpu",
      date: "2026-11-15",
      readTime: "5 min",
      featured: true,
      tags: ["Arduino", "programování", "začátečníci"]
    },
    {
      id: "ohmuv-zakon",
      title: "Ohmův zákon jednoduše",
      category: "electronics",
      excerpt: "Nauč se vypočítat napětí, proud a odpor v elektrickém obvodu.",
      content: `
Ohmův zákon patří mezi nejdůležitější pravidla elektrotechniky.

ZÁKLADNÍ VZOREC

U = R × I

Kde:

- U je elektrické napětí ve voltech (V).
- R je elektrický odpor v ohmech (Ω).
- I je elektrický proud v ampérech (A).

DALŠÍ ÚPRAVY VZORCE

I = U / R

R = U / I

PŘÍKLAD

Máme rezistor 1000 Ω a napětí 5 V.

I = 5 / 1000

I = 0,005 A

Výsledný proud je 5 mA.

PRAKTICKÉ VYUŽITÍ

Ohmův zákon využiješ při návrhu LED obvodů, napájecích zdrojů i při opravách elektroniky.

ZÁVĚR

Pochopení Ohmova zákona je základním krokem při práci s elektronikou.
      `,
      image: "assets/images/ohmuv-zakon.jpg",
      icon: "zap",
      date: "2026-11-15",
      readTime: "4 min",
      featured: true,
      tags: ["elektronika", "Ohmův zákon", "základy"]
    },
    {
      id: "led-rezistor",
      title: "Jak správně zapojit LED diodu",
      category: "electronics",
      excerpt: "Proč potřebuje LED dioda rezistor a jak vypočítat jeho hodnotu.",
      content: `
LED dioda je polovodičová součástka, která při průchodu proudu vyzařuje světlo.

POLARITA LED

LED má dvě vývody:

- Anoda – kladný pól.
- Katoda – záporný pól.

PROČ POUŽÍVAT REZISTOR?

LED dioda potřebuje omezení proudu. Bez vhodného rezistoru může dojít k jejímu poškození.

VÝPOČET REZISTORU

Použijeme vzorec:

R = (Uzdroj - ULED) / I

PŘÍKLAD

Napájecí napětí: 5 V

Úbytek napětí na LED: 2 V

Požadovaný proud: 0,01 A

R = (5 - 2) / 0,01

R = 300 Ω

Zvolíme vhodnou standardní hodnotu, například 330 Ω.

ZÁVĚR

Při zapojování LED vždy kontroluj polaritu a používej vhodné proudové omezení.
      `,
      image: "assets/images/led.jpg",
      icon: "lightbulb",
      date: "2026-11-15",
      readTime: "4 min",
      featured: false,
      tags: ["LED", "rezistor", "elektronika"]
    },
    {
      id: "robotika-zacatek",
      title: "Robotika: Jak postavit prvního robota",
      category: "robotics",
      excerpt: "Základy robotiky, motory, senzory a řízení pohybu.",
      content: `
Robotika spojuje mechaniku, elektroniku a programování.

ZÁKLADNÍ ČÁSTI ROBOTA

- Řídicí jednotka.
- Motory.
- Senzory.
- Napájení.
- Mechanická konstrukce.

PRVNÍ PROJEKT

Jednoduchým začátkem může být malý robot na dvou kolech.

Můžeš použít:

- Arduino Uno.
- Dva stejnosměrné motory.
- Motorový driver.
- Ultrazvukový senzor.
- Podvozek.
- Baterii.

JAK ROBOT FUNGUJE?

Řídicí jednotka zpracovává data ze senzorů a podle programu ovládá motory.

BEZPEČNOST

Při práci s motory kontroluj napájení a proudové zatížení řídicí elektroniky.

ZÁVĚR

Robotika nabízí spoustu možností pro vlastní konstrukce a experimenty.
      `,
      image: "assets/images/robotika.jpg",
      icon: "bot",
      date: "2026-11-15",
      readTime: "6 min",
      featured: true,
      tags: ["robotika", "motory", "Arduino"]
    },
    {
      id: "3d-tisk-zaklady",
      title: "3D tisk: Základy pro začátečníky",
      category: "3d-printing",
      excerpt: "Jak funguje 3D tisk, filamenty a první vlastní modely.",
      content: `
3D tisk umožňuje vytvářet fyzické objekty z digitálních modelů.

JAK FUNGUJE FDM TISK?

Tiskárna postupně nanáší roztavený plast ve vrstvách.

ZÁKLADNÍ POJMY

- Filament – materiál používaný pro tisk.
- Extruder – mechanismus podávající filament.
- Hotend – část, ve které se filament taví.
- Slicer – program připravující model pro tisk.

NEJBĚŽNĚJŠÍ MATERIÁLY

PLA je vhodný pro začátečníky.

PETG nabízí vyšší odolnost a houževnatost.

ABS vyžaduje pečlivější nastavení a vhodné větrání.

PRVNÍ TISK

Začni jednoduchým modelem, například testovací kostkou.

ZÁVĚR

3D tisk je užitečný při výrobě držáků, krytů a součástek pro vlastní projekty.
      `,
      image: "assets/images/3d-tisk.jpg",
      icon: "box",
      date: "2026-11-15",
      readTime: "5 min",
      featured: false,
      tags: ["3D tisk", "PLA", "modelování"]
    },
    {
      id: "chytra-domacnost",
      title: "Chytrá domácnost s ESP32",
      category: "smart-home",
      excerpt: "Seznam se s ESP32 a možnostmi automatizace domácnosti.",
      content: `
Chytrá domácnost propojuje zařízení, senzory a automatizaci.

CO JE ESP32?

ESP32 je mikrokontrolér s podporou Wi-Fi a Bluetooth.

CO S NÍM MŮŽEŠ VYTVOŘIT?

- Měření teploty.
- Monitorování vlhkosti.
- Ovládání osvětlení.
- Sledování spotřeby.
- Automatické upozornění.

ZÁKLADNÍ SOUČÁSTKY

- ESP32.
- Teplotní senzor.
- Propojovací vodiče.
- USB napájení.

BEZPEČNOST

Pro začátek používej nízké bezpečné napětí. Síťové napětí 230 V svěř odborníkovi a nepřipojuj ho přímo k vývojové desce.

ZÁVĚR

ESP32 je výborná platforma pro domácí automatizaci a IoT projekty.
      `,
      image: "assets/images/esp32.jpg",
      icon: "house",
      date: "2026-11-15",
      readTime: "5 min",
      featured: true,
      tags: ["ESP32", "IoT", "chytrá domácnost"]
    },
    {
      id: "multimetr",
      title: "Jak používat digitální multimetr",
      category: "electronics",
      excerpt: "Změř napětí, odpor a proud a nauč se správně používat multimetr.",
      content: `
Digitální multimetr je základním nástrojem každého elektronika.

MĚŘENÍ NAPĚTÍ

Napětí se měří paralelně k měřenému prvku.

MĚŘENÍ PROUDU

Při měření proudu se multimetr zapojuje sériově do obvodu.

MĚŘENÍ ODPORU

Odpor měř pouze v obvodu bez napájení a po vybití kondenzátorů.

BEZPEČNOST

- Před měřením zkontroluj správný vstup měřicích kabelů.
- Nastav správný rozsah.
- Nikdy neměř odpor na napájeném obvodu.
- Neprováděj měření síťového napětí, pokud nemáš odpovídající znalosti a vybavení.

ZÁVĚR

Multimetr ti pomůže odhalit chyby v obvodu a ověřit správnou funkci součástek.
      `,
      image: "assets/images/multimetr.jpg",
      icon: "activity",
      date: "2026-11-15",
      readTime: "5 min",
      featured: false,
      tags: ["multimetr", "měření", "elektronika"]
    }
  ];

})();
