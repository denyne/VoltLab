
/* =========================================================
   VOLTLAB V4 MAX
   ARTICLES DATABASE
   ========================================================= */

"use strict";

window.VOLTLAB = window.VOLTLAB || {};

(() => {
  const APP = window.VOLTLAB;

  const articles = [

    /* =====================================================
       1. ZÁKLADY ELEKTROTECHNIKY
    ===================================================== */

    {
      id: "electricity-basics",
      title: "Co je elektřina a jak funguje?",
      category: "basics",
      level: "beginner",
      difficulty: 1,
      readingTime: 7,
      featured: true,
      tags: ["elektřina", "náboj", "elektrony", "základy"],
      excerpt: "Seznam se se základními principy elektřiny a elektrického náboje.",
      content: `
# Co je elektřina?

Elektřina je soubor fyzikálních jevů spojených s elektrickým nábojem.

Elektrický náboj je vlastnost částic. Známe kladný a záporný náboj.

## Elektrony a protony

Atom obsahuje protony, neutrony a elektrony.

- Proton má kladný elektrický náboj.
- Elektron má záporný elektrický náboj.
- Neutron nemá elektrický náboj.

Elektrický proud vzniká usměrněným pohybem elektrických nábojů.

## Elektrický obvod

Aby mohl elektrický proud téct, potřebujeme uzavřený elektrický obvod.

Základní části obvodu jsou:

1. Zdroj elektrické energie.
2. Vodiče.
3. Spotřebič.
4. Případně spínač nebo ochranný prvek.

## Důležité veličiny

- Napětí U se měří ve voltech (V).
- Proud I se měří v ampérech (A).
- Odpor R se měří v ohmech (Ω).

Tyto veličiny spolu souvisí pomocí Ohmova zákona.
      `
    },

    {
      id: "voltage-current-resistance",
      title: "Napětí, proud a odpor",
      category: "basics",
      level: "beginner",
      difficulty: 1,
      readingTime: 9,
      featured: true,
      tags: ["napětí", "proud", "odpor", "Ohmův zákon"],
      excerpt: "Tři nejdůležitější veličiny v elektrotechnice.",
      content: `
# Napětí, proud a odpor

## Napětí U

Napětí vyjadřuje rozdíl elektrického potenciálu mezi dvěma body.

Jednotkou je volt (V).

## Proud I

Elektrický proud vyjadřuje množství elektrického náboje, které projde průřezem vodiče za jednotku času.

Jednotkou je ampér (A).

## Odpor R

Elektrický odpor vyjadřuje, jak moc součástka nebo vodič brání průchodu proudu.

Jednotkou je ohm (Ω).

## Ohmův zákon

Základní vztah je:

U = R × I

Z něj lze odvodit:

I = U / R

R = U / I

## Příklad

Máme zdroj 12 V a rezistor 100 Ω.

Proud:

I = 12 / 100 = 0,12 A

Obvodem tedy protéká 120 mA.
      `
    },

    {
      id: "ohms-law",
      title: "Ohmův zákon podrobně",
      category: "basics",
      level: "beginner",
      difficulty: 2,
      readingTime: 10,
      featured: true,
      tags: ["Ohmův zákon", "výpočet", "rezistor", "napětí"],
      excerpt: "Nauč se počítat napětí, proud a odpor.",
      content: `
# Ohmův zákon

Ohmův zákon popisuje vztah mezi napětím, proudem a odporem.

## Základní rovnice

U = R × I

Kde:

- U je napětí ve voltech.
- R je odpor v ohmech.
- I je proud v ampérech.

## Výpočet proudu

I = U / R

Příklad:

U = 9 V

R = 330 Ω

I = 9 / 330

I ≈ 0,0273 A

Výsledkem je přibližně 27,3 mA.

## Výpočet odporu

R = U / I

## Výpočet napětí

U = R × I

## Kdy zákon platí?

V této jednoduché podobě popisuje ohmické chování součástek při konstantních podmínkách.

U polovodičů, žárovek a dalších nelineárních prvků může být vztah složitější.
      `
    },

    {
      id: "electric-power",
      title: "Elektrický výkon a energie",
      category: "basics",
      level: "beginner",
      difficulty: 2,
      readingTime: 8,
      tags: ["výkon", "energie", "watt", "spotřeba"],
      excerpt: "Jak vypočítat výkon a spotřebu elektrického zařízení.",
      content: `
# Elektrický výkon

Elektrický výkon udává, jak rychle se přenáší nebo přeměňuje energie.

Základní vzorec:

P = U × I

Jednotkou je watt (W).

## Další vzorce

P = R × I²

P = U² / R

## Elektrická energie

E = P × t

Při použití výkonu ve wattech a času v sekundách získáme energii v joulech.

Při použití kilowattů a hodin získáme kilowatthodiny (kWh).

## Příklad

Zařízení má výkon 100 W a pracuje 5 hodin.

Spotřeba:

0,1 kW × 5 h = 0,5 kWh.
      `
    },

    {
      id: "dc-ac",
      title: "Stejnosměrný a střídavý proud",
      category: "basics",
      level: "beginner",
      difficulty: 2,
      readingTime: 8,
      tags: ["DC", "AC", "střídavý proud", "stejnosměrný proud"],
      excerpt: "Rozdíl mezi DC a AC a kde se s nimi setkáš.",
      content: `
# Stejnosměrný a střídavý proud

## Stejnosměrný proud (DC)

U stejnosměrného proudu má proud stálý směr.

Typické zdroje:

- Baterie.
- Akumulátory.
- USB napájení.
- Stejnosměrné laboratorní zdroje.

## Střídavý proud (AC)

U střídavého proudu se směr a velikost proudu periodicky mění.

V evropské elektrické síti je běžná frekvence 50 Hz.

## Efektivní hodnota

U sinusového průběhu platí:

Uef = Umax / √2

Efektivní hodnota střídavého napětí vyjadřuje ekvivalentní stejnosměrné napětí z hlediska výkonu na odporové zátěži.
      `
    },

    /* =====================================================
       2. ELEKTRICKÉ OBVODY
    ===================================================== */

    {
      id: "series-circuit",
      title: "Sériové zapojení rezistorů",
      category: "circuits",
      level: "beginner",
      difficulty: 2,
      readingTime: 6,
      tags: ["série", "rezistory", "odpor", "obvody"],
      excerpt: "Jak se chovají rezistory zapojené za sebou.",
      content: `
# Sériové zapojení

Při sériovém zapojení jsou součástky zapojeny za sebou.

## Vlastnosti

- Všemi rezistory protéká stejný proud.
- Napětí se rozdělí mezi jednotlivé rezistory.
- Celkový odpor je součtem odporů.

## Vzorec

Rcelk = R1 + R2 + R3 + ...

## Příklad

R1 = 100 Ω

R2 = 220 Ω

R3 = 330 Ω

Rcelk = 650 Ω.
      `
    },

    {
      id: "parallel-circuit",
      title: "Paralelní zapojení rezistorů",
      category: "circuits",
      level: "beginner",
      difficulty: 2,
      readingTime: 7,
      tags: ["paralelně", "rezistory", "obvody"],
      excerpt: "Výpočet výsledného odporu při paralelním zapojení.",
      content: `
# Paralelní zapojení

Při paralelním zapojení jsou součástky připojeny mezi stejné dva uzly.

## Vlastnosti

- Na všech větvích je stejné napětí.
- Proud se rozděluje do jednotlivých větví.
- Výsledný odpor je menší než nejmenší jednotlivý odpor.

## Vzorec

1 / Rcelk = 1 / R1 + 1 / R2 + ...

Pro dva rezistory lze použít:

Rcelk = (R1 × R2) / (R1 + R2)

## Příklad

R1 = 100 Ω

R2 = 100 Ω

Rcelk = 50 Ω.
      `
    },

    {
      id: "voltage-divider",
      title: "Napěťový dělič",
      category: "circuits",
      level: "intermediate",
      difficulty: 3,
      readingTime: 9,
      tags: ["dělič", "napětí", "rezistory", "výpočty"],
      excerpt: "Jak získat nižší napětí pomocí dvou rezistorů.",
      content: `
# Napěťový dělič

Napěťový dělič umožňuje získat část vstupního napětí.

## Zapojení

Dva rezistory jsou zapojeny sériově.

Výstupní napětí odebíráme na jednom z nich.

## Vzorec

Uout = Uin × R2 / (R1 + R2)

## Příklad

Uin = 12 V

R1 = 1000 Ω

R2 = 1000 Ω

Uout = 12 × 1000 / 2000

Uout = 6 V.

## Pozor

Připojená zátěž může změnit výsledné výstupní napětí.

Napěťový dělič proto není automaticky vhodnou náhradou stabilizátoru napětí.
      `
    },

    {
      id: "kirchhoff-laws",
      title: "Kirchhoffovy zákony",
      category: "circuits",
      level: "intermediate",
      difficulty: 3,
      readingTime: 11,
      tags: ["Kirchhoff", "uzly", "smyčky", "obvody"],
      excerpt: "Dva základní zákony pro analýzu elektrických obvodů.",
      content: `
# Kirchhoffovy zákony

## První Kirchhoffův zákon

Součet proudů vstupujících do uzlu se rovná součtu proudů z uzlu vystupujících.

ΣI = 0

Zákon vychází ze zachování elektrického náboje.

## Druhý Kirchhoffův zákon

Algebraický součet napětí v uzavřené smyčce je nulový.

ΣU = 0

## K čemu se používají?

- Analýza složitějších obvodů.
- Výpočet proudů ve větvích.
- Výpočet napětí.
- Řešení elektrických sítí.
      `
    },

    /* =====================================================
       3. SOUČÁSTKY
    ===================================================== */

    {
      id: "resistors",
      title: "Rezistory a jejich značení",
      category: "components",
      level: "beginner",
      difficulty: 2,
      readingTime: 9,
      featured: true,
      tags: ["rezistor", "odpor", "tolerance", "SMD"],
      excerpt: "Typy rezistorů, hodnoty, tolerance a barevné značení.",
      content: `
# Rezistory

Rezistor je pasivní elektronická součástka, která omezuje elektrický proud.

## Základní parametry

- Odpor v ohmech.
- Maximální výkon.
- Tolerance.
- Teplotní koeficient.
- Typ pouzdra.

## Běžné hodnoty

100 Ω, 220 Ω, 330 Ω, 470 Ω, 1 kΩ, 4,7 kΩ, 10 kΩ.

## Barevné značení

Barevné proužky určují hodnotu odporu a toleranci.

Například:

Hnědá – 1

Černá – 0

Červená – násobitel 100

Výsledkem je 1000 Ω, tedy 1 kΩ.

## Výkon rezistoru

Výkon vypočítáme například:

P = I² × R

Při návrhu je potřeba zohlednit rezervu výkonové zatížitelnosti.
      `
    },

    {
      id: "capacitors",
      title: "Kondenzátory",
      category: "components",
      level: "beginner",
      difficulty: 2,
      readingTime: 9,
      tags: ["kondenzátor", "kapacita", "elektrolyt", "keramika"],
      excerpt: "Princip kondenzátoru, druhy a základní použití.",
      content: `
# Kondenzátory

Kondenzátor ukládá energii v elektrickém poli.

Jeho základní veličinou je kapacita C.

Jednotkou je farad (F).

## Druhy kondenzátorů

- Keramické.
- Elektrolytické.
- Tantalové.
- Fóliové.
- Superkondenzátory.

## Důležité parametry

- Kapacita.
- Maximální napětí.
- Tolerance.
- ESR.
- Teplotní rozsah.

## Energie

E = 1/2 × C × U²

## Pozor

Elektrolytické kondenzátory bývají polarizované.

Je nutné dodržet správnou polaritu a nepřekročit maximální dovolené napětí.
      `
    },

    {
      id: "inductors",
      title: "Cívky a indukčnost",
      category: "components",
      level: "intermediate",
      difficulty: 3,
      readingTime: 8,
      tags: ["cívka", "indukčnost", "magnetické pole"],
      excerpt: "Jak funguje indukčnost a kde se používají cívky.",
      content: `
# Cívky

Cívka je součástka, která vytváří magnetické pole při průchodu proudu.

Její vlastností je indukčnost L.

Jednotkou je henry (H).

## Vlastnosti

Cívka se brání změnám proudu.

Napětí na ideální cívce:

U = L × di/dt

## Použití

- Filtry.
- Spínané zdroje.
- Transformátory.
- Rezonanční obvody.
- Elektromagnety.
      `
    },

    {
      id: "diodes",
      title: "Diody a usměrňování",
      category: "components",
      level: "beginner",
      difficulty: 2,
      readingTime: 10,
      featured: true,
      tags: ["dioda", "LED", "usměrnění", "polovodiče"],
      excerpt: "Princip polovodičové diody a její praktické využití.",
      content: `
# Diody

Dioda je polovodičová součástka, která umožňuje průchod proudu především jedním směrem.

## Vývody

- Anoda.
- Katoda.

## Typy diod

- Usměrňovací.
- Schottkyho.
- Zenerova.
- LED.
- Fotodioda.

## LED

LED je světelná dioda.

Při návrhu obvodu je důležité omezit proud.

Předřadný odpor lze vypočítat:

R = (Uzdroje - ULED) / ILED

## Usměrňování

Diodový můstek umožňuje usměrnit střídavé napětí na pulzující stejnosměrné napětí.
      `
    },

    {
      id: "transistors",
      title: "Tranzistory – základy",
      category: "components",
      level: "intermediate",
      difficulty: 3,
      readingTime: 12,
      tags: ["tranzistor", "BJT", "MOSFET", "spínání"],
      excerpt: "Jak fungují bipolární a unipolární tranzistory.",
      content: `
# Tranzistory

Tranzistor je polovodičová součástka používaná pro zesilování a spínání.

## Bipolární tranzistor

Základní typy:

- NPN.
- PNP.

Vývody:

- Báze.
- Kolektor.
- Emitor.

Malý proud báze může řídit větší proud kolektoru.

## MOSFET

MOSFET je tranzistor řízený elektrickým polem.

Vývody:

- Gate.
- Drain.
- Source.

## Použití

- Spínané zdroje.
- Motorové řízení.
- Digitální logika.
- Zesilovače.
- Výkonové spínače.
      `
    },

    /* =====================================================
       4. DIGITÁLNÍ TECHNIKA
    ===================================================== */

    {
      id: "binary-system",
      title: "Binární číselná soustava",
      category: "digital",
      level: "beginner",
      difficulty: 2,
      readingTime: 7,
      tags: ["binární", "bity", "čísla", "digitální"],
      excerpt: "Jak počítače pracují s nulami a jedničkami.",
      content: `
# Binární soustava

Binární soustava používá pouze dvě číslice:

0 a 1.

Jedna binární číslice se nazývá bit.

## Příklad

Binární číslo 1010:

1 × 8 + 0 × 4 + 1 × 2 + 0 × 1

Výsledek je 10 v desítkové soustavě.

## Jednotky

- 1 bit.
- 1 byte = 8 bitů.
- 1 KiB = 1024 byte.
- 1 MiB = 1024 KiB.
      `
    },

    {
      id: "logic-gates",
      title: "Logická hradla",
      category: "digital",
      level: "beginner",
      difficulty: 2,
      readingTime: 10,
      featured: true,
      tags: ["AND", "OR", "NOT", "XOR", "logika"],
      excerpt: "Přehled základních logických operací.",
      content: `
# Logická hradla

Logická hradla pracují s binárními hodnotami.

## AND

Výstup je 1 pouze tehdy, když jsou všechny vstupy 1.

## OR

Výstup je 1, pokud je alespoň jeden vstup 1.

## NOT

Výstup je opačný než vstup.

## XOR

Výstup je 1, pokud se vstupy liší.

## NAND a NOR

Jsou negované varianty hradel AND a OR.

## Použití

Logická hradla tvoří základ digitálních obvodů, procesorů a řídicích systémů.
      `
    },

    {
      id: "microcontrollers",
      title: "Mikrokontroléry a Arduino",
      category: "programming",
      level: "beginner",
      difficulty: 2,
      readingTime: 11,
      tags: ["Arduino", "mikrokontrolér", "GPIO", "programování"],
      excerpt: "Co je mikrokontrolér a jak ovládá elektroniku.",
      content: `
# Mikrokontroléry

Mikrokontrolér je malý počítač integrovaný v jednom čipu.

Obsahuje procesor, paměť a periferní jednotky.

## GPIO

GPIO jsou univerzální vstupní a výstupní piny.

Mohou sloužit například k:

- Čtení tlačítek.
- Ovládání LED.
- Řízení relé.
- Komunikaci se senzory.

## Arduino

Arduino je populární platforma pro výuku a prototypování.

Umožňuje rychle vytvářet elektronické projekty.

## Další platformy

- ESP32.
- STM32.
- Raspberry Pi Pico.
- AVR.
      `
    },

    /* =====================================================
       5. MĚŘENÍ
    ===================================================== */

    {
      id: "multimeter",
      title: "Jak používat multimetr",
      category: "measurements",
      level: "beginner",
      difficulty: 2,
      readingTime: 10,
      featured: true,
      tags: ["multimetr", "měření", "napětí", "proud"],
      excerpt: "Základy bezpečného měření elektrických veličin.",
      content: `
# Multimetr

Multimetr je měřicí přístroj pro elektrické veličiny.

## Napětí

Napětí měříme paralelně k měřenému prvku.

## Proud

Proud měříme sériově v obvodu.

Před měřením proudu je nutné správně zvolit zdířku a rozsah.

## Odpor

Odpor měříme na odpojeném a nenapájeném obvodu.

## Bezpečnost

Nikdy nepřipojuj multimetr v režimu měření proudu přímo paralelně ke zdroji napětí.

Před měřením ověř rozsah, zdířky, stav kabelů a kategorii měřicího přístroje.

Měření na síťovém napětí patří pouze osobám s odpovídající kvalifikací a vybavením.
      `
    },

    {
      id: "oscilloscope",
      title: "Osciloskop a měření signálů",
      category: "measurements",
      level: "intermediate",
      difficulty: 3,
      readingTime: 10,
      tags: ["osciloskop", "signál", "frekvence", "amplituda"],
      excerpt: "Jak zobrazit a analyzovat elektrický signál.",
      content: `
# Osciloskop

Osciloskop zobrazuje průběh elektrického signálu v čase.

## Základní parametry

- Časová základna.
- Vertikální citlivost.
- Spouštění (trigger).
- Vzorkovací frekvence.
- Šířka pásma.

## Co můžeme měřit?

- Amplitudu.
- Frekvenci.
- Periodu.
- Zpoždění.
- Šum.
- Přechodové jevy.

## Frekvence

F = 1 / T

Kde T je perioda signálu.

## Bezpečnost

Pozor na zemní svorku běžného stolního osciloskopu. Její nesprávné připojení může způsobit zkrat nebo nebezpečný stav.
      `
    },

    /* =====================================================
       6. NAPÁJENÍ
    ===================================================== */

    {
      id: "power-supplies",
      title: "Napájecí zdroje",
      category: "power",
      level: "intermediate",
      difficulty: 3,
      readingTime: 12,
      tags: ["zdroj", "napájení", "stabilizace", "DC"],
      excerpt: "Lineární a spínané napájecí zdroje.",
      content: `
# Napájecí zdroje

Napájecí zdroj dodává energii elektronickému zařízení.

## Lineární zdroje

Používají transformátor, usměrňovač, filtr a lineární stabilizátor.

Výhody:

- Jednoduchost.
- Nízké rušení.
- Dobré vlastnosti pro některé analogové aplikace.

Nevýhody:

- Nižší účinnost při velkém rozdílu napětí.
- Vyšší tepelné ztráty.

## Spínané zdroje

Pracují pomocí rychlého spínání polovodičů a akumulačních prvků.

Výhody:

- Vysoká účinnost.
- Menší rozměry.
- Široký rozsah vstupních napětí.

Nevýhody:

- Složitější návrh.
- Možnost elektromagnetického rušení.
      `
    },

    {
      id: "battery-basics",
      title: "Baterie a akumulátory",
      category: "power",
      level: "beginner",
      difficulty: 2,
      readingTime: 10,
      tags: ["baterie", "Li-ion", "kapacita", "akumulátor"],
      excerpt: "Kapacita, napětí a základní druhy akumulátorů.",
      content: `
# Baterie a akumulátory

Akumulátor je opakovaně nabíjitelný elektrochemický zdroj energie.

## Důležité parametry

- Jmenovité napětí.
- Kapacita v Ah.
- Energie ve Wh.
- Maximální nabíjecí proud.
- Maximální vybíjecí proud.
- Počet cyklů.

## Energie

E = U × Ah

Při napětí 3,7 V a kapacitě 2 Ah:

E = 7,4 Wh.

## Li-ion akumulátory

Lithium-iontové články vyžadují vhodné nabíjení, ochranu a dodržení teplotních limitů.

Používej správný nabíjecí obvod a ochranné prvky.
      `
    },

    /* =====================================================
       7. PRAKTICKÉ PROJEKTY
    ===================================================== */

    {
      id: "led-project",
      title: "První projekt: LED s rezistorem",
      category: "projects",
      level: "beginner",
      difficulty: 1,
      readingTime: 8,
      featured: true,
      tags: ["LED", "rezistor", "začátečník", "projekt"],
      excerpt: "Jednoduchý praktický obvod pro začátečníky.",
      content: `
# LED s předřadným rezistorem

Cílem je připojit LED k bezpečnému nízkonapěťovému zdroji.

## Potřebné součástky

- LED.
- Rezistor.
- Nízkonapěťový zdroj.
- Propojovací vodiče.

## Výpočet rezistoru

R = (Uzdroje - ULED) / ILED

Příklad:

Uzdroje = 5 V

ULED = 2 V

ILED = 0,01 A

R = (5 - 2) / 0,01

R = 300 Ω

Vhodná standardní hodnota může být například 330 Ω.

## Výkon rezistoru

P = I² × R

Při proudu 10 mA a odporu 330 Ω je výkon přibližně 0,033 W.

Zvol vhodný výkonový typ s rezervou.

## Zapojení

Zdroj → rezistor → LED → zpět ke zdroji.

Dodrž správnou polaritu LED.
      `
    },

    {
      id: "breadboard",
      title: "Práce s nepájivým polem",
      category: "projects",
      level: "beginner",
      difficulty: 1,
      readingTime: 7,
      tags: ["breadboard", "prototypování", "zapojení"],
      excerpt: "Jak rychle sestavovat jednoduché elektronické obvody.",
      content: `
# Nepájivé kontaktní pole

Breadboard umožňuje sestavovat elektronické obvody bez pájení.

## Jak funguje?

Vnitřní kontakty jsou propojeny do skupin.

U běžného nepájivého pole:

- Pětice otvorů v jedné řadě bývá elektricky spojena.
- Prostřední mezera odděluje dvě části.
- Napájecí lišty mohou být propojeny podél okraje.

## Praktické rady

- Před zapojením odpoj napájení.
- Zkontroluj propojení napájecích lišt.
- Nepřekračuj proudové limity kontaktů.
- Dávej pozor na zkraty.
      `
    }

  ];

  /* -------------------------------------------------------
     ARTICLE STORAGE
  ------------------------------------------------------- */

  const STORAGE_KEY = APP.storageKeys.articles;

  function getCustomArticles() {
    return APP.storage.get(STORAGE_KEY, []);
  }

  function saveCustomArticles(items) {
    return APP.storage.set(STORAGE_KEY, items);
  }

  function getAll() {
    return [...articles, ...getCustomArticles()];
  }

  function getById(id) {
    return getAll().find(article => article.id === id) || null;
  }

  function search(query, filters = {}) {
    const normalized = String(query || "")
      .trim()
      .toLocaleLowerCase("cs");

    return getAll().filter(article => {
      const text = [
        article.title,
        article.excerpt,
        article.category,
        article.content,
        ...(article.tags || [])
      ].join(" ").toLocaleLowerCase("cs");

      const matchesQuery =
        !normalized || text.includes(normalized);

      const matchesCategory =
        !filters.category ||
        article.category === filters.category;

      const matchesLevel =
        !filters.level ||
        article.level === filters.level;

      const matchesFeatured =
        !filters.featured ||
        article.featured === true;

      return (
        matchesQuery &&
        matchesCategory &&
        matchesLevel &&
        matchesFeatured
      );
    });
  }

  function add(article) {
    if (!article || typeof article !== "object") {
      throw new Error("Neplatný článek.");
    }

    if (!APP.validate.text(article.title, 3, 150)) {
      throw new Error("Název článku musí mít 3 až 150 znaků.");
    }

    if (!APP.validate.text(article.content, 10, 50000)) {
      throw new Error("Obsah článku je neplatný.");
    }

    const custom = getCustomArticles();

    const item = {
      id: APP.utils.id("article"),
      title: article.title.trim(),
      category: article.category || "basics",
      level: article.level || "beginner",
      difficulty: Number(article.difficulty) || 1,
      readingTime: Number(article.readingTime) || 5,
      featured: false,
      tags: Array.isArray(article.tags) ? article.tags : [],
      excerpt: article.excerpt || "",
      content: article.content,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      custom: true
    };

    custom.push(item);
    saveCustomArticles(custom);

    APP.events.emit("articles:changed", item);

    return item;
  }

  function update(id, changes) {
    const custom = getCustomArticles();
    const index = custom.findIndex(item => item.id === id);

    if (index < 0) {
      throw new Error("Článek nebyl nalezen nebo není vlastní.");
    }

    custom[index] = {
      ...custom[index],
      ...changes,
      id,
      updatedAt: Date.now()
    };

    saveCustomArticles(custom);

    APP.events.emit("articles:changed", custom[index]);

    return custom[index];
  }

  function remove(id) {
    const custom = getCustomArticles();
    const updated = custom.filter(item => item.id !== id);

    if (updated.length === custom.length) return false;

    saveCustomArticles(updated);

    APP.events.emit("articles:deleted", id);

    return true;
  }

  function markRead(id) {
    const progress = APP.data.getProgress();

    progress.articles = progress.articles || {};

    progress.articles[id] = {
      completed: true,
      completedAt: Date.now()
    };

    APP.data.saveProgress(progress);

    APP.events.emit("article:read", { id });
  }

  function isRead(id) {
    const progress = APP.data.getProgress();

    return Boolean(progress.articles?.[id]?.completed);
  }

  function getStats() {
    const all = getAll();

    return {
      total: all.length,
      custom: getCustomArticles().length,
      featured: all.filter(item => item.featured).length,
      beginner: all.filter(item => item.level === "beginner").length,
      intermediate: all.filter(item => item.level === "intermediate").length,
      advanced: all.filter(item => item.level === "advanced").length,
      read: Object.keys(
        APP.data.getProgress().articles || {}
      ).filter(id => APP.data.getProgress().articles[id].completed).length
    };
  }

  function getRelated(id, limit = 4) {
    const current = getById(id);

    if (!current) return [];

    return getAll()
      .filter(item => item.id !== id)
      .map(item => {
        const sharedTags = (current.tags || []).filter(
          tag => (item.tags || []).includes(tag)
        ).length;

        const sameCategory =
          item.category === current.category ? 2 : 0;

        return {
          article: item,
          score: sharedTags + sameCategory
        };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.article);
  }

  /* -------------------------------------------------------
     PUBLIC API
  ------------------------------------------------------- */

  APP.articles = {
    database: articles,
    getAll,
    getById,
    search,
    add,
    update,
    remove,
    markRead,
    isRead,
    getStats,
    getRelated
  };

  console.info(
    `[VoltLab] Articles loaded: ${getAll().length}`
  );

})();
