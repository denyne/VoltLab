```javascript
/*
 * VoltLab V4 — Articles Database
 * --------------------------------
 * Databáze článků a technických návodů.
 *
 * Každý článek obsahuje:
 * id, title, category, icon, readTime,
 * excerpt, content, tags
 *
 * Kategorie:
 * arduino, electronics, robotics,
 * 3d-printing, smart-home, programming
 */

window.VOLTLAB_ARTICLES = [
  {
    id: "arduino-start",
    title: "Arduino: První kroky do světa elektroniky",
    category: "arduino",
    icon: "⌘",
    readTime: "8 min",
    excerpt: "Poznej Arduino, jeho možnosti a vytvoř svůj první elektronický projekt.",
    tags: ["Arduino", "Začátečníci", "Mikrokontroléry"],
    content: `
      <h2>Co je Arduino?</h2>
      <p>Arduino je otevřená elektronická platforma, která umožňuje jednoduše vytvářet vlastní elektronické projekty. Kombinuje vývojovou desku s mikrokontrolérem a programovací prostředí.</p>

      <p>Díky Arduinu můžeš ovládat LED diody, motory, displeje, senzory nebo třeba vytvořit vlastní automatizovaný systém.</p>

      <h2>Co budeš potřebovat?</h2>
      <ul>
        <li>Arduino Uno nebo kompatibilní desku</li>
        <li>USB kabel</li>
        <li>Počítač</li>
        <li>Arduino IDE</li>
        <li>LED diodu a rezistor 220–330 Ω</li>
        <li>Propojovací vodiče a nepájivé pole</li>
      </ul>

      <h2>První program: Blink</h2>
      <p>Nejjednodušší projekt spočívá v pravidelném rozsvěcení a zhasínání LED diody.</p>

      <pre><code>void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(1000);

  digitalWrite(LED_BUILTIN, LOW);
  delay(1000);
}</code></pre>

      <h2>Jak program funguje?</h2>
      <p>Funkce <code>setup()</code> se spustí jednou po zapnutí desky. Nastaví vestavěný LED pin jako výstup.</p>
      <p>Funkce <code>loop()</code> se neustále opakuje. Nejprve LED rozsvítí, počká jednu sekundu, zhasne a znovu počká.</p>

      <h2>Co vyzkoušet dál?</h2>
      <ul>
        <li>Blikání LED v různých intervalech.</li>
        <li>Ovládání LED pomocí tlačítka.</li>
        <li>Regulaci jasu pomocí PWM.</li>
        <li>Měření teploty senzorem.</li>
      </ul>

      <blockquote>Tip: Než připojíš součástky, vždy zkontroluj jejich napájecí napětí a zapojení pinů.</blockquote>
    `
  },

  {
    id: "ohm-law",
    title: "Ohmův zákon jednoduše a prakticky",
    category: "electronics",
    icon: "Ω",
    readTime: "7 min",
    excerpt: "Pochop vztah mezi napětím, proudem a odporem. Základ každého elektronického obvodu.",
    tags: ["Elektronika", "Ohmův zákon", "Výpočty"],
    content: `
      <h2>Co je Ohmův zákon?</h2>
      <p>Ohmův zákon popisuje vztah mezi elektrickým napětím, proudem a odporem. Patří mezi nejdůležitější vztahy v elektrotechnice.</p>

      <h2>Základní vzorec</h2>
      <p><strong>U = R × I</strong></p>
      <ul>
        <li><strong>U</strong> – napětí ve voltech (V)</li>
        <li><strong>R</strong> – odpor v ohmech (Ω)</li>
        <li><strong>I</strong> – proud v ampérech (A)</li>
      </ul>

      <h2>Jak vzorec upravit?</h2>
      <p>Pokud potřebuješ vypočítat proud:</p>
      <p><strong>I = U / R</strong></p>

      <p>Pokud potřebuješ vypočítat odpor:</p>
      <p><strong>R = U / I</strong></p>

      <h2>Praktický příklad</h2>
      <p>Máš zdroj 12 V a rezistor 1 000 Ω.</p>
      <p>I = 12 / 1000 = 0,012 A</p>
      <p>Výsledný proud je tedy 12 mA.</p>

      <h2>Výkon rezistoru</h2>
      <p>Pro výpočet elektrického výkonu můžeš použít:</p>
      <p><strong>P = U × I</strong></p>
      <p>V našem příkladu je výkon 12 × 0,012 = 0,144 W.</p>

      <p>Rezistor musí mít dostatečnou výkonovou rezervu. V praxi se často volí součástka s vyšším jmenovitým výkonem, například 0,25 W.</p>

      <h2>Kdy se Ohmův zákon hodí?</h2>
      <ul>
        <li>Při návrhu LED obvodů.</li>
        <li>Při výběru rezistorů.</li>
        <li>Při měření elektrických obvodů.</li>
        <li>Při kontrole proudového odběru.</li>
      </ul>

      <blockquote>Tip: Vyzkoušej si výpočty také v kalkulačce Ohmova zákona přímo ve VoltLabu.</blockquote>
    `
  },

  {
    id: "led-resistor",
    title: "Jak správně zapojit LED diodu",
    category: "electronics",
    icon: "💡",
    readTime: "6 min",
    excerpt: "Zjisti, jak funguje LED dioda, proč potřebuje rezistor a jak vypočítat jeho hodnotu.",
    tags: ["LED", "Rezistory", "Elektronika"],
    content: `
      <h2>Jak funguje LED?</h2>
      <p>LED je polovodičová součástka, která při průchodu elektrického proudu vyzařuje světlo.</p>

      <p>Má dvě základní elektrody:</p>
      <ul>
        <li><strong>Anoda (+)</strong> – delší vývod u běžných LED.</li>
        <li><strong>Katoda (-)</strong> – kratší vývod, často označený také zploštělou stranou pouzdra.</li>
      </ul>

      <h2>Proč potřebuje rezistor?</h2>
      <p>LED má poměrně strmou proudově-napěťovou charakteristiku. Bez omezení proudu by se mohla poškodit.</p>

      <h2>Výpočet rezistoru</h2>
      <p>Použijeme vzorec:</p>
      <p><strong>R = (U<sub>zdroje</sub> − U<sub>LED</sub>) / I</strong></p>

      <p>Příklad:</p>
      <ul>
        <li>Napájení: 5 V</li>
        <li>Úbytek na LED: 2 V</li>
        <li>Zvolený proud: 10 mA</li>
      </ul>

      <p>R = (5 − 2) / 0,01 = 300 Ω</p>
      <p>Vhodná běžná hodnota může být 330 Ω, která proud mírně sníží.</p>

      <h2>Na co si dát pozor?</h2>
      <ul>
        <li>Vždy ověř parametry konkrétní LED v datasheetu.</li>
        <li>Ne každá LED je určena pro stejný proud.</li>
        <li>Ověř maximální výkon rezistoru.</li>
        <li>U více LED zapojených sériově počítej s úbytky napětí všech LED.</li>
      </ul>

      <h2>Výkon rezistoru</h2>
      <p>Výkon vypočítáš jako P = I² × R. V našem příkladu je to přibližně 0,033 W.</p>
      <p>Je rozumné zvolit rezistor s dostatečnou výkonovou rezervou.</p>

      <blockquote>Tip: Ve VoltLab LED kalkulačce si můžeš rychle spočítat potřebný odpor pro své zapojení.</blockquote>
    `
  },

  {
    id: "robot-first",
    title: "Jak postavit svého prvního robota",
    category: "robotics",
    icon: "🤖",
    readTime: "10 min",
    excerpt: "Vytvoř jednoduché robotické vozítko a nauč se základy řízení motorů.",
    tags: ["Robotika", "Motory", "Arduino"],
    content: `
      <h2>Co je robotické vozítko?</h2>
      <p>Robotické vozítko je jednoduchý mobilní robot, který se dokáže pohybovat pomocí elektromotorů.</p>

      <h2>Potřebné součástky</h2>
      <ul>
        <li>Arduino Uno nebo kompatibilní deska</li>
        <li>Dva stejnosměrné motory s převodovkou</li>
        <li>Motorový driver, například TB6612FNG</li>
        <li>Podvozek a dvě kola</li>
        <li>Napájecí zdroj odpovídající motorům</li>
        <li>Propojovací vodiče</li>
      </ul>

      <h2>Proč potřebujeme motorový driver?</h2>
      <p>Mikrokontrolér nedokáže přímo dodávat proud potřebný pro běžné motory. Motorový driver proto slouží jako výkonový mezičlánek.</p>

      <h2>Základní princip pohybu</h2>
      <ul>
        <li>Oba motory dopředu – robot jede rovně.</li>
        <li>Levý motor dopředu, pravý dozadu – robot zatáčí.</li>
        <li>Oba motory dozadu – robot couvá.</li>
        <li>Oba motory zastavené – robot stojí.</li>
      </ul>

      <h2>První program</h2>
      <pre><code>const int motorLeft = 5;
const int motorRight = 6;

void setup() {
  pinMode(motorLeft, OUTPUT);
  pinMode(motorRight, OUTPUT);
}

void loop() {
  analogWrite(motorLeft, 150);
  analogWrite(motorRight, 150);

  delay(2000);

  analogWrite(motorLeft, 0);
  analogWrite(motorRight, 0);

  delay(1000);
}</code></pre>

      <p>Ukázka předpokládá vhodné zapojení motorového driveru s PWM vstupy. Konkrétní řízení směru a zapojení se liší podle použitého driveru.</p>

      <h2>Bezpečnost</h2>
      <ul>
        <li>Nepřipojuj motory přímo na GPIO piny Arduina.</li>
        <li>Zkontroluj proudové limity driveru.</li>
        <li>Před změnou zapojení odpoj napájení.</li>
        <li>Při spuštění měj kola volně nad podložkou.</li>
      </ul>

      <blockquote>Další krok: Přidej ultrazvukový senzor a vytvoř robota, který se vyhýbá překážkám.</blockquote>
    `
  },

  {
    id: "3d-basics",
    title: "3D tisk: Jak začít od úplných základů",
    category: "3d-printing",
    icon: "▦",
    readTime: "9 min",
    excerpt: "Seznam se s FDM tiskem, filamenty, slicerem a nastavením první tiskové úlohy.",
    tags: ["3D tisk", "FDM", "Modelování"],
    content: `
      <h2>Co je 3D tisk?</h2>
      <p>3D tisk umožňuje vyrábět fyzické objekty z digitálních modelů. Jednou z nejrozšířenějších metod je FDM, při které tiskárna postupně ukládá roztavený plast.</p>

      <h2>Jak funguje FDM tisk?</h2>
      <ol>
        <li>Vytvoříš nebo stáhneš 3D model.</li>
        <li>Otevřeš model ve sliceru.</li>
        <li>Nastavíš parametry tisku.</li>
        <li>Slicer vytvoří G-code.</li>
        <li>Tiskárna podle něj vytiskne objekt.</li>
      </ol>

      <h2>Nejčastější materiály</h2>
      <h3>PLA</h3>
      <p>Snadno se tiskne a je vhodný pro začátečníky, dekorace a běžné prototypy.</p>

      <h3>PETG</h3>
      <p>Často nabízí lepší houževnatost a odolnost než PLA. Hodí se na funkční součástky.</p>

      <h3>ABS</h3>
      <p>Je vhodný pro některé technické díly, ale vyžaduje vyšší teploty a dobře řešené větrání a tiskové prostředí.</p>

      <h2>Důležité parametry</h2>
      <ul>
        <li><strong>Layer height:</strong> výška jednotlivé vrstvy.</li>
        <li><strong>Infill:</strong> vnitřní výplň modelu.</li>
        <li><strong>Wall count:</strong> počet obvodových stěn.</li>
        <li><strong>Print speed:</strong> rychlost tisku.</li>
        <li><strong>Bed temperature:</strong> teplota tiskové podložky.</li>
      </ul>

      <h2>Tipy pro první tisk</h2>
      <ul>
        <li>Zkontroluj čistotu tiskové podložky.</li>
        <li>Správně nastav první vrstvu.</li>
        <li>Použij profil odpovídající materiálu.</li>
        <li>Začni jednoduchým testovacím modelem.</li>
      </ul>

      <blockquote>Tip: První vrstva je základ úspěšného tisku. Věnuj jejímu nastavení dostatek času.</blockquote>
    `
  },

  {
    id: "esp32-home",
    title: "ESP32: Základy chytré domácnosti",
    category: "smart-home",
    icon: "⌂",
    readTime: "11 min",
    excerpt: "Propoj senzory, Wi-Fi a automatizaci pomocí dostupného modulu ESP32.",
    tags: ["ESP32", "Wi-Fi", "Smart Home"],
    content: `
      <h2>Co je ESP32?</h2>
      <p>ESP32 je rodina výkonných mikrokontrolérů s integrovanými bezdrátovými funkcemi, například Wi-Fi a Bluetooth u mnoha variant.</p>

      <h2>Co můžeš vytvořit?</h2>
      <ul>
        <li>Monitorování teploty a vlhkosti.</li>
        <li>Ovládání LED osvětlení.</li>
        <li>Webové rozhraní pro vlastní zařízení.</li>
        <li>Bezdrátové senzory.</li>
        <li>Automatizaci domácnosti.</li>
      </ul>

      <h2>První webový server</h2>
      <p>ESP32 může hostovat jednoduchou webovou stránku, kterou otevřeš z telefonu nebo počítače ve stejné síti.</p>

      <pre><code>#include &lt;WiFi.h&gt;
#include &lt;WebServer.h&gt;

const char* ssid = "NAZEV_WIFI";
const char* password = "HESLO_WIFI";

WebServer server(80);

void handleRoot() {
  server.send(
    200,
    "text/html",
    "&lt;h1&gt;VoltLab ESP32&lt;/h1&gt;&lt;p&gt;Server funguje!&lt;/p&gt;"
  );
}

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }

  server.on("/", handleRoot);
  server.begin();
}

void loop() {
  server.handleClient();
}</code></pre>

      <h2>Jak se připojit?</h2>
      <ol>
        <li>Doplň název a heslo své Wi-Fi.</li>
        <li>Nahraj program do ESP32.</li>
        <li>Otevři Serial Monitor.</li>
        <li>Zjisti přidělenou IP adresu.</li>
        <li>Zadej IP adresu do prohlížeče v místní síti.</li>
      </ol>

      <h2>Důležité bezpečnostní zásady</h2>
      <ul>
        <li>Nepoužívej skutečné přístupové údaje v ukázkách sdílených veřejně.</li>
        <li>Nezveřejňuj nezabezpečený webový server přímo na internetu.</li>
        <li>GPIO ESP32 pracují s nízkým napětím a nejsou určeny pro přímé připojení k síťovému napětí.</li>
        <li>Při ovládání spotřebičů používej vhodně dimenzované a bezpečně oddělené moduly.</li>
      </ul>

      <blockquote>Tip: Začni jednoduchým senzorem teploty a postupně přidávej další funkce.</blockquote>
    `
  },

  {
    id: "programming-start",
    title: "Programování pro technické projekty",
    category: "programming",
    icon: "</>",
    readTime: "8 min",
    excerpt: "Nauč se základní principy programování, proměnné, podmínky a cykly.",
    tags: ["Programování", "C++", "Začátečníci"],
    content: `
      <h2>Proč se naučit programovat?</h2>
      <p>Programování je způsob, jak předat počítači nebo mikrokontroléru přesné instrukce. Díky němu můžeš vytvářet weby, aplikace, automatizaci i vlastní elektronická zařízení.</p>

      <h2>1. Proměnné</h2>
      <p>Proměnná uchovává hodnotu, se kterou může program pracovat.</p>

      <pre><code>int temperature = 24;
float voltage = 3.3;
bool ledOn = true;</code></pre>

      <h2>2. Podmínky</h2>
      <p>Podmínka umožňuje provést určitou část programu jen tehdy, když platí zadaný výraz.</p>

      <pre><code>int temperature = 30;

if (temperature > 25) {
  // Zapni ventilátor
} else {
  // Ventilátor nech vypnutý
}</code></pre>

      <h2>3. Cykly</h2>
      <p>Cyklus opakuje určitou část kódu.</p>

      <pre><code>for (int i = 0; i < 5; i++) {
  Serial.println(i);
}</code></pre>

      <h2>4. Funkce</h2>
      <p>Funkce rozdělují program na menší a přehlednější části.</p>

      <pre><code>int add(int a, int b) {
  return a + b;
}

void setup() {
  Serial.begin(9600);
  Serial.println(add(5, 3));
}

void loop() {
}</code></pre>

      <h2>Jak se učit efektivně?</h2>
      <ul>
        <li>Piš krátké programy.</li>
        <li>Experimentuj s hodnotami.</li>
        <li>Uč se číst chybové hlášky.</li>
        <li>Vytvářej malé praktické projekty.</li>
        <li>Postupně spojuj jednotlivé znalosti.</li>
      </ul>

      <blockquote>Nejlepší způsob, jak se naučit programovat, je něco skutečně vytvořit.</blockquote>
    `
  },

  {
    id: "multimeter",
    title: "Jak správně používat multimetr",
    category: "electronics",
    icon: "📟",
    readTime: "9 min",
    excerpt: "Nauč se měřit napětí, proud, odpor a kontinuitu bez zbytečných chyb.",
    tags: ["Multimetr", "Měření", "Elektronika"],
    content: `
      <h2>Co je multimetr?</h2>
      <p>Multimetr je měřicí přístroj, který kombinuje několik základních funkcí. V elektronice se používá téměř neustále.</p>

      <h2>Měření napětí</h2>
      <p>Napětí měříš paralelně k součástce nebo části obvodu. Zvol správný rozsah a typ měření AC nebo DC.</p>

      <h2>Měření odporu</h2>
      <p>Při měření odporu musí být obvod bez napájení. U součástek zapojených v obvodu mohou ostatní prvky ovlivnit výsledek.</p>

      <h2>Měření proudu</h2>
      <p>Proud se měří sériově. Multimetr musí být zapojen do proudové cesty a musíš použít správný vstupní konektor.</p>

      <h2>Test kontinuity</h2>
      <p>Režim kontinuity pomáhá ověřit, zda jsou dva body elektricky propojené. Multimetr obvykle při spojení vydá zvukový signál.</p>

      <h2>Nejčastější chyby</h2>
      <ul>
        <li>Měření odporu na napájeném obvodu.</li>
        <li>Připojení ampérmetru přímo paralelně ke zdroji.</li>
        <li>Použití nesprávného vstupního konektoru.</li>
        <li>Nesprávně nastavený rozsah.</li>
      </ul>

      <blockquote>Bezpečnost: Tento návod je určen pro základní nízkonapěťovou elektroniku. Měření síťového napětí vyžaduje odpovídající přístroj, kvalifikaci a bezpečnostní postupy.</blockquote>
    `
  },

  {
    id: "soldering",
    title: "Pájení elektroniky: Jak na čisté spoje",
    category: "electronics",
    icon: "🔥",
    readTime: "8 min",
    excerpt: "Zvládni základy pájení, správnou teplotu, cín i kontrolu hotového spoje.",
    tags: ["Pájení", "Dílna", "Elektronika"],
    content: `
      <h2>Co je pájení?</h2>
      <p>Pájení je způsob spojování kovových částí pomocí roztavené pájky. V elektronice se používá především pro připojování součástek k plošným spojům.</p>

      <h2>Co budeš potřebovat?</h2>
      <ul>
        <li>Pájecí stanici nebo vhodnou páječku.</li>
        <li>Pájku určenou pro elektroniku.</li>
        <li>Vhodné tavidlo.</li>
        <li>Čistič hrotu.</li>
        <li>Odsávání nebo odsávací pásek.</li>
        <li>Ochranné pomůcky a dobře větrané pracoviště.</li>
      </ul>

      <h2>Postup pájení</h2>
      <ol>
        <li>Očisti pájecí plošky a vývody.</li>
        <li>Správně upevni součástku.</li>
        <li>Hrotem zahřej současně plošku i vývod.</li>
        <li>Přilož pájku ke spoji, ne pouze na hrot.</li>
        <li>Nech spoj přirozeně vychladnout.</li>
        <li>Zkontroluj vzhled a mechanickou pevnost spoje.</li>
      </ol>

      <h2>Jak vypadá dobrý spoj?</h2>
      <p>Dobrý spoj má dostatečné smáčení obou spojovaných částí, není popraskaný a nevytváří nechtěné propojení se sousedními ploškami.</p>

      <h2>Nejčastější problémy</h2>
      <ul>
        <li><strong>Studený spoj:</strong> nedostatečné prohřátí nebo špatné smáčení.</li>
        <li><strong>Přebytek pájky:</strong> může vytvořit můstek mezi ploškami.</li>
        <li><strong>Poškozená ploška:</strong> příliš dlouhé nebo intenzivní zahřívání.</li>
      </ul>

      <blockquote>Tip: Trénuj nejprve na staré desce nebo cvičném pájecím kitu. Pracuj ve větraném prostoru a nedotýkej se hrotu páječky.</blockquote>
    `
  },

  {
    id: "sensor-basics",
    title: "Senzory: Jak dostat informace z okolního světa",
    category: "arduino",
    icon: "📡",
    readTime: "7 min",
    excerpt: "Zjisti, jak fungují teplotní, světelné, pohybové a vzdálenostní senzory.",
    tags: ["Senzory", "Arduino", "Měření"],
    content: `
      <h2>Co je senzor?</h2>
      <p>Senzor převádí fyzikální veličinu na signál, který může elektronický systém zpracovat.</p>

      <h2>Typy senzorů</h2>
      <h3>Teplotní senzory</h3>
      <p>Měří teplotu okolí nebo objektu. Příkladem jsou DS18B20, NTC termistory a různé integrované digitální senzory.</p>

      <h3>Světelné senzory</h3>
      <p>Fotorezistor mění svůj odpor podle intenzity dopadajícího světla. S vhodným zapojením můžeš měřit osvětlení pomocí analogového vstupu.</p>

      <h3>Pohybové senzory</h3>
      <p>PIR senzory detekují změny infračerveného záření a často se používají pro detekci pohybu osob.</p>

      <h3>Vzdálenostní senzory</h3>
      <p>Ultrazvukové senzory odhadují vzdálenost pomocí času šíření zvukové vlny.</p>

      <h2>Jak připojit senzor?</h2>
      <p>Vždy si ověř napájecí napětí, zapojení pinů, typ signálu a logické úrovně. Některé senzory používají digitální rozhraní, jiné analogový výstup.</p>

      <h2>Co můžeš postavit?</h2>
      <ul>
        <li>Automatické noční světlo.</li>
        <li>Teploměr s displejem.</li>
        <li>Parkovací senzor.</li>
        <li>Detektor pohybu.</li>
        <li>Monitorovací stanici prostředí.</li>
      </ul>

      <blockquote>Tip: Při připojování senzorů k ESP32 vždy zkontroluj maximální povolené napětí jeho GPIO pinů.</blockquote>
    `
  },

  {
    id: "web-basics",
    title: "Jak vytvořit vlastní webovou stránku",
    category: "programming",
    icon: "🌐",
    readTime: "10 min",
    excerpt: "HTML, CSS a JavaScript: tři základní stavební kameny moderního webu.",
    tags: ["HTML", "CSS", "JavaScript", "Web"],
    content: `
      <h2>Jak funguje web?</h2>
      <p>Webová stránka se obvykle skládá z HTML, CSS a JavaScriptu. Každá technologie má vlastní úlohu.</p>

      <h2>HTML – struktura</h2>
      <p>HTML určuje obsah a strukturu stránky.</p>

      <pre><code>&lt;h1&gt;Můj první web&lt;/h1&gt;
&lt;p&gt;Vítej na mé stránce!&lt;/p&gt;
&lt;button&gt;Klikni na mě&lt;/button&gt;</code></pre>

      <h2>CSS – vzhled</h2>
      <p>CSS ovlivňuje barvy, velikosti, rozložení a animace.</p>

      <pre><code>body {
  background: #101614;
  color: white;
  font-family: sans-serif;
}

h1 {
  color: #b6f36b;
}</code></pre>

      <h2>JavaScript – interaktivita</h2>
      <p>JavaScript umožňuje reagovat na kliknutí, měnit obsah a pracovat s daty.</p>

      <pre><code>const button = document.querySelector("button");

button.addEventListener("click", () => {
  alert("Ahoj z VoltLabu!");
});</code></pre>

      <h2>Jak začít?</h2>
      <ol>
        <li>Vytvoř soubor index.html.</li>
        <li>Přidej style.css.</li>
        <li>Vytvoř app.js.</li>
        <li>Propoj soubory pomocí HTML.</li>
        <li>Otevři stránku v prohlížeči.</li>
      </ol>

      <h2>Co se naučit dál?</h2>
      <ul>
        <li>Responzivní design.</li>
        <li>CSS Flexbox a Grid.</li>
        <li>DOM a události v JavaScriptu.</li>
        <li>Ukládání dat.</li>
        <li>Základy přístupnosti a SEO.</li>
      </ul>

      <blockquote>Tip: Začni malým projektem a postupně přidávej funkce. I VoltLab může být skvělým projektem pro učení.</blockquote>
    `
  }
];

/*
 * Globální pomocné funkce pro další části webu.
 * Zachovávají jednoduchý přístup k databázi článků.
 */

window.VoltLabArticles = {
  getAll() {
    return [...(window.VOLTLAB_ARTICLES || [])];
  },

  getById(id) {
    return (window.VOLTLAB_ARTICLES || []).find(
      article => article.id === id
    ) || null;
  },

  getByCategory(category) {
    return (window.VOLTLAB_ARTICLES || []).filter(
      article => article.category === category
    );
  },

  search(query) {
    const normalized = String(query || "")
      .trim()
      .toLocaleLowerCase("cs");

    if (!normalized) {
      return this.getAll();
    }

    return this.getAll().filter(article => {
      const searchable = [
        article.title,
        article.excerpt,
        article.content,
        article.category,
        ...(article.tags || [])
      ].join(" ").toLocaleLowerCase("cs");

      return searchable.includes(normalized);
    });
  },

  getCategories() {
    return [...new Set(
      this.getAll().map(article => article.category)
    )];
  },

  getCount() {
    return this.getAll().length;
  }
};
```
