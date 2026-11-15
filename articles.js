
(() => {
  "use strict";

  window.VOLTLAB_DEFAULT_ARTICLES = [

    {
      id: "arduino-start",
      title: "Arduino – první kroky",
      category: "arduino",
      icon: "⌘",
      readTime: 6,
      excerpt: "Jak začít s Arduinem, připravit prostředí a rozběhnout první LED.",
      content: `
Arduino je oblíbená platforma pro výuku elektroniky a tvorbu vlastních zařízení.

Pro začátek potřebuješ:
- Arduino Uno nebo kompatibilní desku
- USB kabel
- Arduino IDE
- LED a rezistor

Nainstaluj Arduino IDE, připoj desku a vyber správný typ desky a port.

První projekt může být blikající LED. V Arduino IDE najdeš příklad Blink v nabídce File → Examples → 01.Basics.

Při připojení externí LED vždy použij vhodný předřadný rezistor.
      `,
      tags: ["Arduino", "začátečník", "LED"]
    },

    {
      id: "ohm-law",
      title: "Ohmův zákon jednoduše",
      category: "electronics",
      icon: "Ω",
      readTime: 5,
      excerpt: "Pochop vztah mezi napětím, proudem a odporem.",
      content: `
Ohmův zákon popisuje vztah mezi napětím, proudem a odporem.

Základní vzorec:

U = R × I

Kde:
- U je napětí ve voltech
- R je odpor v ohmech
- I je proud v ampérech

Základní úpravy:

I = U / R

R = U / I

Příklad:

Pokud máš zdroj 5 V a rezistor 220 Ω, proud je přibližně 0,0227 A, tedy 22,7 mA.

Vždy také kontroluj výkonovou ztrátu součástky.
      `,
      tags: ["elektronika", "Ohmův zákon", "výpočty"]
    },

    {
      id: "led-resistor",
      title: "Jak vybrat rezistor k LED",
      category: "electronics",
      icon: "▥",
      readTime: 4,
      excerpt: "Spočítej správný předřadný odpor a ochraň svoji LED.",
      content: `
LED potřebuje omezení proudu. K tomu slouží předřadný rezistor.

Vzorec:

R = (Uzdroj - ULED) / I

Příklad:

Napájení: 5 V
Úbytek LED: 2 V
Proud: 10 mA

R = (5 - 2) / 0,01

R = 300 Ω

Můžeš použít nejbližší vyšší běžnou hodnotu, například 330 Ω.

Nezapomeň zkontrolovat maximální proud LED i výstupního pinu mikrokontroléru.
      `,
      tags: ["LED", "rezistor", "elektronika"]
    },

    {
      id: "robot-first",
      title: "Postav si prvního robota",
      category: "robotics",
      icon: "◎",
      readTime: 8,
      excerpt: "Základní přehled podvozku, motorů a řídicí elektroniky.",
      content: `
Jednoduchý robot může být postavený na dvoukolovém podvozku.

Potřebuješ:
- Podvozek
- Dva DC motory
- Motorový driver
- Řídicí desku
- Napájení
- Propojovací vodiče

Motory nikdy nepřipojuj přímo na GPIO mikrokontroléru. Použij motorový driver, který zvládne jejich proud.

Nejdříve otestuj každý motor samostatně. Potom můžeš přidat senzory a automatické řízení.
      `,
      tags: ["robotika", "motory", "Arduino"]
    },

    {
      id: "3d-basics",
      title: "Základy 3D tisku",
      category: "3d-printing",
      icon: "▧",
      readTime: 7,
      excerpt: "První tisk, materiály a základní nastavení sliceru.",
      content: `
FDM tiskárna vytváří objekty postupným ukládáním roztaveného filamentu.

Nejčastější materiály:

PLA – vhodný pro začátečníky a běžné modely.

PETG – houževnatější materiál s lepší odolností.

ABS – vyžaduje náročnější tiskové podmínky.

Před tiskem zkontroluj:
- Čistotu tiskové podložky
- Správnou první vrstvu
- Teplotu trysky
- Nastavení sliceru

Začni jednoduchým testovacím modelem.
      `,
      tags: ["3D tisk", "PLA", "slicer"]
    },

    {
      id: "esp32-home",
      title: "ESP32 a chytrá domácnost",
      category: "smart-home",
      icon: "⌂",
      readTime: 9,
      excerpt: "Využij Wi-Fi mikrokontrolér pro vlastní automatizaci.",
      content: `
ESP32 je mikrokontrolér s podporou Wi-Fi a Bluetooth.

Můžeš ho využít například pro:
- Měření teploty
- Ovládání osvětlení
- Monitorování prostředí
- Lokální webové rozhraní
- Automatizaci domácnosti

Pozor: GPIO ESP32 pracují s logikou 3,3 V. Nepřipojuj na ně přímo 5 V, pokud konkrétní deska výslovně neuvádí, že je daný vstup toleruje.

Při připojení do domácí sítě mysli také na bezpečnost.
      `,
      tags: ["ESP32", "Wi-Fi", "IoT"]
    },

    {
      id: "programming-start",
      title: "Základy programování mikrokontrolérů",
      category: "programming",
      icon: "</>",
      readTime: 6,
      excerpt: "Proměnné, podmínky a funkce jako základ každého programu.",
      content: `
Při programování mikrokontrolérů se setkáš s několika základními prvky.

Proměnná ukládá hodnotu.

Podmínka if rozhoduje podle toho, zda je splněna určitá podmínka.

Funkce seskupuje příkazy do jednoho pojmenovaného bloku.

Cyklus loop může opakovaně vykonávat určitou činnost.

Nejlepší způsob, jak se učit, je psát malé programy a postupně je rozšiřovat.
      `,
      tags: ["programování", "kód", "začátečník"]
    }

  ];

})();
