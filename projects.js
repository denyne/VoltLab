```javascript
/*
 * VoltLab V4 — Projects Database
 * --------------------------------
 * Databáze praktických DIY projektů.
 *
 * Struktura:
 * id, title, category, icon, difficulty,
 * time, description, components, steps,
 * code, note
 */

window.VOLTLAB_PROJECTS = [
  {
    id: "led-blink",
    title: "LED Blink — První blikající LED",
    category: "arduino",
    icon: "💡",
    difficulty: "Začátečník",
    time: "15 minut",
    description: "Úplně první Arduino projekt. Rozblikáš LED diodu a pochopíš základní práci s digitálními výstupy.",
    components: [
      "Arduino Uno nebo kompatibilní deska",
      "LED dioda",
      "Rezistor 220–330 Ω",
      "Nepájivé kontaktní pole",
      "Propojovací vodiče",
      "USB kabel"
    ],
    steps: [
      "Připoj GND Arduina k záporné napájecí liště kontaktního pole.",
      "Připoj digitální pin 8 přes rezistor k anodě LED.",
      "Připoj katodu LED k GND.",
      "Otevři Arduino IDE a vytvoř nový program.",
      "Nahraj kód do desky.",
      "LED by měla pravidelně blikat."
    ],
    code: `const int ledPin = 8;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  digitalWrite(ledPin, HIGH);
  delay(1000);

  digitalWrite(ledPin, LOW);
  delay(1000);
}`,
    note: "LED vždy zapojuj s proudovým omezovacím rezistorem. Jeho hodnotu ověř podle parametrů konkrétní LED a napájecího napětí."
  },

  {
    id: "traffic-light",
    title: "Arduino semafor",
    category: "arduino",
    icon: "🚦",
    difficulty: "Začátečník",
    time: "30 minut",
    description: "Vytvoř model semaforu se třemi LED diodami a naprogramuj jejich střídání.",
    components: [
      "Arduino Uno",
      "Červená LED",
      "Žlutá LED",
      "Zelená LED",
      "3× rezistor 220–330 Ω",
      "Nepájivé pole",
      "Propojovací vodiče"
    ],
    steps: [
      "Připoj každou LED přes vlastní rezistor.",
      "Červenou LED připoj na pin 8.",
      "Žlutou LED připoj na pin 9.",
      "Zelenou LED připoj na pin 10.",
      "Všechny katody připoj na GND.",
      "Nahraj program a sleduj jednotlivé fáze semaforu."
    ],
    code: `const int red = 8;
const int yellow = 9;
const int green = 10;

void setup() {
  pinMode(red, OUTPUT);
  pinMode(yellow, OUTPUT);
  pinMode(green, OUTPUT);
}

void loop() {
  digitalWrite(red, HIGH);
  delay(3000);
  digitalWrite(red, LOW);

  digitalWrite(yellow, HIGH);
  delay(1000);
  digitalWrite(yellow, LOW);

  digitalWrite(green, HIGH);
  delay(3000);
  digitalWrite(green, LOW);

  digitalWrite(yellow, HIGH);
  delay(1000);
  digitalWrite(yellow, LOW);
}`,
    note: "Jde o demonstrační model, nikoliv skutečný dopravní semafor. Každá LED potřebuje vlastní rezistor."
  },

  {
    id: "button-led",
    title: "LED ovládaná tlačítkem",
    category: "arduino",
    icon: "🔘",
    difficulty: "Začátečník",
    time: "20 minut",
    description: "Nauč se číst digitální vstupy a ovládat LED pomocí fyzického tlačítka.",
    components: [
      "Arduino Uno",
      "LED dioda",
      "Rezistor 220–330 Ω",
      "Tlačítko",
      "Nepájivé pole",
      "Propojovací vodiče"
    ],
    steps: [
      "Připoj LED přes rezistor na pin 8 a GND.",
      "Jednu stranu tlačítka připoj na pin 2.",
      "Druhou stranu tlačítka připoj na GND.",
      "V programu zapni interní pull-up rezistor.",
      "Nahraj program.",
      "Při stisknutí tlačítka se LED rozsvítí."
    ],
    code: `const int ledPin = 8;
const int buttonPin = 2;

void setup() {
  pinMode(ledPin, OUTPUT);
  pinMode(buttonPin, INPUT_PULLUP);
}

void loop() {
  bool pressed = digitalRead(buttonPin) == LOW;

  digitalWrite(ledPin, pressed ? HIGH : LOW);
}`,
    note: "Používáme INPUT_PULLUP, proto je tlačítko při stisknutí vyhodnoceno jako LOW. Mechanická tlačítka mohou vyžadovat odstranění zákmitů (debouncing)."
  },

  {
    id: "temperature-sensor",
    title: "Digitální teploměr DS18B20",
    category: "arduino",
    icon: "🌡️",
    difficulty: "Mírně pokročilý",
    time: "45 minut",
    description: "Měř teplotu pomocí digitálního senzoru DS18B20 a zobrazuj hodnoty v sériovém monitoru.",
    components: [
      "Arduino Uno",
      "Senzor DS18B20",
      "Rezistor 4,7 kΩ",
      "Nepájivé pole",
      "Propojovací vodiče"
    ],
    steps: [
      "Připoj VDD senzoru na 5 V.",
      "Připoj GND senzoru na GND.",
      "Připoj datový pin na digitální pin 2.",
      "Mezi datový pin a napájení připoj rezistor 4,7 kΩ.",
      "Nainstaluj knihovny OneWire a DallasTemperature.",
      "Nahraj program a otevři Serial Monitor."
    ],
    code: `#include <OneWire.h>
#include <DallasTemperature.h>

const int sensorPin = 2;

OneWire oneWire(sensorPin);
DallasTemperature sensors(&oneWire);

void setup() {
  Serial.begin(9600);
  sensors.begin();
}

void loop() {
  sensors.requestTemperatures();

  float temperature =
    sensors.getTempCByIndex(0);

  if (temperature == DEVICE_DISCONNECTED_C) {
    Serial.println("Senzor neni pripojen!");
  } else {
    Serial.print("Teplota: ");
    Serial.print(temperature);
    Serial.println(" °C");
  }

  delay(1000);
}`,
    note: "Před zapojením ověř pinout konkrétního pouzdra DS18B20. U delších vodičů může být potřeba upravit zapojení a napájení."
  },

  {
    id: "potentiometer-led",
    title: "Regulace jasu LED potenciometrem",
    category: "arduino",
    icon: "🎚️",
    difficulty: "Začátečník",
    time: "25 minut",
    description: "Pomocí potenciometru reguluj jas LED diody. Vyzkoušíš analogový vstup a PWM výstup.",
    components: [
      "Arduino Uno",
      "Potenciometr 10 kΩ",
      "LED dioda",
      "Rezistor 220–330 Ω",
      "Nepájivé pole",
      "Propojovací vodiče"
    ],
    steps: [
      "Připoj krajní vývody potenciometru na 5 V a GND.",
      "Střední vývod potenciometru připoj na A0.",
      "LED připoj přes rezistor na PWM pin 9.",
      "Katodu LED připoj na GND.",
      "Nahraj program.",
      "Otáčením potenciometru měň jas LED."
    ],
    code: `const int potPin = A0;
const int ledPin = 9;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  int value = analogRead(potPin);

  int brightness = map(
    value,
    0,
    1023,
    0,
    255
  );

  analogWrite(ledPin, brightness);
}`,
    note: "Použij PWM pin podporovaný konkrétní deskou. Rozsah analogového převodníku se může mezi deskami lišit."
  },

  {
    id: "esp32-webserver",
    title: "ESP32 vlastní webový server",
    category: "smart-home",
    icon: "🌐",
    difficulty: "Mírně pokročilý",
    time: "60 minut",
    description: "Vytvoř jednoduchou webovou stránku hostovanou přímo na ESP32 a ovládej vestavěnou LED.",
    components: [
      "ESP32 DevKit",
      "USB kabel",
      "Wi-Fi síť",
      "Počítač nebo telefon"
    ],
    steps: [
      "Připrav vývojové prostředí Arduino IDE pro ESP32.",
      "Doplň vlastní Wi-Fi údaje do programu.",
      "Nahraj program do ESP32.",
      "Otevři Serial Monitor s rychlostí 115200 baud.",
      "Počkej na připojení a zjisti IP adresu.",
      "Otevři IP adresu v prohlížeči zařízení připojeného ke stejné síti.",
      "Vyzkoušej ovládání vestavěné LED."
    ],
    code: `#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "NAZEV_WIFI";
const char* password = "HESLO_WIFI";

const int ledPin = 2;

WebServer server(80);

void handleRoot() {
  String page =
    "<h1>VoltLab ESP32</h1>"
    "<p><a href='/on'>Zapnout LED</a></p>"
    "<p><a href='/off'>Vypnout LED</a></p>";

  server.send(200, "text/html", page);
}

void setup() {
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);

  WiFi.begin(ssid, password);

  Serial.print("Pripojovani");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());

  server.on("/", handleRoot);

  server.on("/on", []() {
    digitalWrite(ledPin, HIGH);
    server.sendHeader("Location", "/");
    server.send(303);
  });

  server.on("/off", []() {
    digitalWrite(ledPin, LOW);
    server.sendHeader("Location", "/");
    server.send(303);
  });

  server.begin();
}

void loop() {
  server.handleClient();
}`,
    note: "Pin 2 je pouze příklad a nemusí být připojen k LED u každé desky ESP32. Nepoužívej skutečné přístupové údaje v kódu, který sdílíš. Tento demonstrační server nemá autentizaci a nesmí být vystaven do veřejného internetu."
  },

  {
    id: "esp32-temperature",
    title: "ESP32 Wi-Fi teploměr",
    category: "smart-home",
    icon: "🌡️",
    difficulty: "Pokročilý",
    time: "75 minut",
    description: "Připoj teplotní senzor k ESP32 a zobraz naměřenou hodnotu přes jednoduché webové rozhraní.",
    components: [
      "ESP32 DevKit",
      "Senzor DS18B20",
      "Rezistor 4,7 kΩ",
      "Propojovací vodiče",
      "USB kabel",
      "Wi-Fi síť"
    ],
    steps: [
      "Připoj DS18B20 podle jeho pinoutu.",
      "Datový vodič připoj na vhodný GPIO pin.",
      "Použij pull-up rezistor 4,7 kΩ mezi datovou linkou a 3,3 V.",
      "Nainstaluj knihovny OneWire a DallasTemperature.",
      "Připoj ESP32 k Wi-Fi.",
      "Zobraz hodnotu teploty na webové stránce."
    ],
    code: `#include <WiFi.h>
#include <WebServer.h>
#include <OneWire.h>
#include <DallasTemperature.h>

const char* ssid = "NAZEV_WIFI";
const char* password = "HESLO_WIFI";

const int sensorPin = 4;

OneWire oneWire(sensorPin);
DallasTemperature sensors(&oneWire);

WebServer server(80);

void handleRoot() {
  sensors.requestTemperatures();

  float temperature =
    sensors.getTempCByIndex(0);

  String page = "<h1>VoltLab Teplomer</h1>";

  if (temperature == DEVICE_DISCONNECTED_C) {
    page += "<p>Senzor neni pripojen.</p>";
  } else {
    page += "<p>Teplota: ";
    page += String(temperature, 1);
    page += " &deg;C</p>";
  }

  server.send(200, "text/html", page);
}

void setup() {
  Serial.begin(115200);

  sensors.begin();

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }

  server.on("/", handleRoot);
  server.begin();

  Serial.println(WiFi.localIP());
}

void loop() {
  server.handleClient();
}`,
    note: "Ověř napájení senzoru a kompatibilitu GPIO. ESP32 používá 3,3V logiku. Tento jednoduchý server je určen pro lokální testování."
  },

  {
    id: "robot-car",
    title: "Robotické autíčko s Arduino",
    category: "robotics",
    icon: "🤖",
    difficulty: "Mírně pokročilý",
    time: "2–3 hodiny",
    description: "Postav dvoukolové robotické vozítko s motory a motorovým driverem.",
    components: [
      "Arduino Uno",
      "2× DC motor s převodovkou",
      "Motorový driver TB6612FNG",
      "Robotický podvozek",
      "2× kolo",
      "Napájecí zdroj podle parametrů motorů",
      "Propojovací vodiče"
    ],
    steps: [
      "Připevni motory k podvozku.",
      "Namontuj kola a případné opěrné kolečko.",
      "Propoj motory s výstupy motorového driveru.",
      "Propoj řídicí vstupy driveru s Arduino piny.",
      "Připoj logické napájení driveru a společnou zem.",
      "Motorové napájení připoj podle specifikace driveru a motorů.",
      "Nahraj testovací program a nejprve vyzkoušej vozítko se zvednutými koly."
    ],
    code: `const int pwmLeft = 5;
const int pwmRight = 6;

const int leftIn1 = 7;
const int leftIn2 = 8;

const int rightIn1 = 9;
const int rightIn2 = 10;

void stopMotors() {
  analogWrite(pwmLeft, 0);
  analogWrite(pwmRight, 0);

  digitalWrite(leftIn1, LOW);
  digitalWrite(leftIn2, LOW);

  digitalWrite(rightIn1, LOW);
  digitalWrite(rightIn2, LOW);
}

void setup() {
  pinMode(pwmLeft, OUTPUT);
  pinMode(pwmRight, OUTPUT);

  pinMode(leftIn1, OUTPUT);
  pinMode(leftIn2, OUTPUT);

  pinMode(rightIn1, OUTPUT);
  pinMode(rightIn2, OUTPUT);

  stopMotors();
}

void loop() {
  digitalWrite(leftIn1, HIGH);
  digitalWrite(leftIn2, LOW);

  digitalWrite(rightIn1, HIGH);
  digitalWrite(rightIn2, LOW);

  analogWrite(pwmLeft, 150);
  analogWrite(pwmRight, 150);

  delay(2000);

  stopMotors();
  delay(1000);
}`,
    note: "Ukázka předpokládá kompatibilní zapojení driveru s uvedenými vstupy. U TB6612FNG musí být správně vyřešen také pin STBY. Nepřipojuj motory přímo k Arduino GPIO. Při změně směru nejprve motory zastav."
  },

  {
    id: "line-follower",
    title: "Robot sledující černou čáru",
    category: "robotics",
    icon: "➰",
    difficulty: "Pokročilý",
    time: "3–5 hodin",
    description: "Vytvoř autonomní robotické vozítko, které pomocí infračervených senzorů sleduje trasu.",
    components: [
      "Arduino Uno",
      "2× DC motor",
      "Motorový driver",
      "2kanálový IR senzor čáry",
      "Robotický podvozek",
      "Kola a napájení"
    ],
    steps: [
      "Sestav robotický podvozek.",
      "Připoj oba motory přes driver.",
      "Připoj levý a pravý senzor k digitálním vstupům.",
      "Ověř, jak senzory rozlišují černou a bílou plochu.",
      "Nastav prahové hodnoty a výšku senzorů.",
      "Vyzkoušej jízdu na jednoduché trase.",
      "Uprav rychlost a reakce robota."
    ],
    code: `const int leftSensor = 2;
const int rightSensor = 3;

const int leftMotor = 5;
const int rightMotor = 6;

void setup() {
  pinMode(leftSensor, INPUT);
  pinMode(rightSensor, INPUT);

  pinMode(leftMotor, OUTPUT);
  pinMode(rightMotor, OUTPUT);
}

void stopRobot() {
  analogWrite(leftMotor, 0);
  analogWrite(rightMotor, 0);
}

void loop() {
  int left = digitalRead(leftSensor);
  int right = digitalRead(rightSensor);

  // Predpoklad: LOW = cerna cara.
  if (left == LOW && right == LOW) {
    analogWrite(leftMotor, 150);
    analogWrite(rightMotor, 150);
  }
  else if (left == LOW) {
    analogWrite(leftMotor, 80);
    analogWrite(rightMotor, 160);
  }
  else if (right == LOW) {
    analogWrite(leftMotor, 160);
    analogWrite(rightMotor, 80);
  }
  else {
    stopRobot();
  }
}`,
    note: "Logika senzorů se liší podle modulu. Před jízdou ověř jejich výstupy a správně nastav prahovou hodnotu. Pro skutečné sledování čáry je vhodné doplnit kalibraci a regulaci rychlosti."
  },

  {
    id: "3d-holder",
    title: "3D tištěný držák na elektroniku",
    category: "3d-printing",
    icon: "🧩",
    difficulty: "Začátečník",
    time: "1–2 hodiny",
    description: "Navrhni a vytiskni vlastní držák pro Arduino, ESP32 nebo jinou malou elektronickou desku.",
    components: [
      "3D tiskárna",
      "PLA nebo PETG filament",
      "CAD software",
      "Posuvné měřítko",
      "Šroubky podle návrhu"
    ],
    steps: [
      "Změř rozměry desky a rozteče montážních otvorů.",
      "Vytvoř základní model držáku v CAD programu.",
      "Přidej montážní sloupky a otvory.",
      "Zkontroluj, zda držák neblokuje konektory.",
      "Exportuj model do STL nebo 3MF.",
      "Připrav tisk ve sliceru.",
      "Vytiskni prototyp a ověř rozměry."
    ],
    code: `// Jednoduchy parametricky model v OpenSCAD

boardWidth = 55;
boardLength = 75;
baseThickness = 3;

wallHeight = 8;
margin = 5;

difference() {
  cube([
    boardWidth + margin * 2,
    boardLength + margin * 2,
    baseThickness + wallHeight
  ]);

  translate([margin, margin, baseThickness])
    cube([
      boardWidth,
      boardLength,
      wallHeight + 1
    ]);
}`,
    note: "Model je pouze základní geometrická ukázka, nikoliv hotový držák pro konkrétní desku. Rozměry a montážní otvory uprav podle skutečné elektroniky."
  },

  {
    id: "smart-light",
    title: "Automatické světlo podle intenzity okolí",
    category: "smart-home",
    icon: "🌙",
    difficulty: "Mírně pokročilý",
    time: "45–60 minut",
    description: "Vytvoř světlo, které reaguje na intenzitu okolního osvětlení pomocí světelného senzoru.",
    components: [
      "Arduino Uno",
      "Fotorezistor",
      "Rezistor 10 kΩ",
      "LED dioda",
      "Rezistor 220–330 Ω",
      "Nepájivé pole"
    ],
    steps: [
      "Vytvoř napěťový dělič z fotorezistoru a rezistoru.",
      "Střed děliče připoj na analogový vstup A0.",
      "LED připoj přes rezistor na PWM pin 9.",
      "Nahraj program.",
      "Vyzkoušej reakci na zakrytí senzoru.",
      "Podle potřeby uprav hranici sepnutí."
    ],
    code: `const int lightPin = A0;
const int ledPin = 9;

const int threshold = 400;

void setup() {
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int light = analogRead(lightPin);

  Serial.println(light);

  if (light < threshold) {
    analogWrite(ledPin, 180);
  } else {
    analogWrite(ledPin, 0);
  }

  delay(100);
}`,
    note: "Směr změny hodnoty fotorezistoru závisí na zapojení děliče. Prahovou hodnotu uprav podle skutečných měření. Nepřipojuj síťové osvětlení přímo k Arduino."
  },

  {
    id: "capacitor-tester",
    title: "Jednoduchý tester kondenzátorů",
    category: "electronics",
    icon: "🔋",
    difficulty: "Pokročilý",
    time: "60–90 minut",
    description: "Sestav demonstrační měřicí obvod pro odhad kapacity kondenzátoru pomocí časové konstanty RC.",
    components: [
      "Arduino Uno",
      "Testovaný kondenzátor",
      "Známý rezistor",
      "Nepájivé pole",
      "Propojovací vodiče"
    ],
    steps: [
      "Vyber známý rezistor a kondenzátor s vhodným napětím.",
      "Připoj RC obvod podle schématu měření.",
      "Připoj měřicí bod na analogový vstup.",
      "Použij digitální pin pro řízené nabíjení.",
      "Změř dobu nabíjení do zvoleného napěťového prahu.",
      "Odhadni kapacitu ze známého odporu a časové konstanty."
    ],
    code: `const int chargePin = 8;
const int measurePin = A0;

const float resistance = 10000.0;
const float threshold = 0.632;

void setup() {
  Serial.begin(9600);
  pinMode(chargePin, OUTPUT);
}

void loop() {
  digitalWrite(chargePin, LOW);
  delay(2000);

  int initialValue = analogRead(measurePin);

  unsigned long startTime = millis();

  digitalWrite(chargePin, HIGH);

  while (analogRead(measurePin) < 647) {
    if (millis() - startTime > 30000) {
      Serial.println("Timeout");
      break;
    }
  }

  unsigned long elapsed =
    millis() - startTime;

  float capacitance =
    (float)elapsed / 1000.0 / resistance;

  Serial.print("Cas: ");
  Serial.print(elapsed);
  Serial.println(" ms");

  Serial.print("Hruby odhad kapacity: ");
  Serial.print(capacitance * 1000000.0);
  Serial.println(" uF");

  digitalWrite(chargePin, LOW);

  delay(3000);
}`,
    note: "Jde o orientační experiment, nikoliv přesný laboratorní měřič. Použij pouze nízkonapěťový obvod. Před manipulací kondenzátor bezpečně vybij a ověř jeho polaritu i maximální napětí. Prahová hodnota v ukázce odpovídá přibližně 63 % rozsahu 10bitového ADC."
  }
];

/*
 * VoltLab Projects API
 * Pomocné funkce pro práci s projekty.
 */

window.VoltLabProjects = {
  getAll() {
    return [...(window.VOLTLAB_PROJECTS || [])];
  },

  getById(id) {
    return (window.VOLTLAB_PROJECTS || []).find(
      project => project.id === id
    ) || null;
  },

  getByCategory(category) {
    return (window.VOLTLAB_PROJECTS || []).filter(
      project => project.category === category
    );
  },

  getByDifficulty(difficulty) {
    return (window.VOLTLAB_PROJECTS || []).filter(
      project => project.difficulty === difficulty
    );
  },

  search(query) {
    const normalized = String(query || "")
      .trim()
      .toLocaleLowerCase("cs");

    if (!normalized) {
      return this.getAll();
    }

    return this.getAll().filter(project => {
      const searchable = [
        project.title,
        project.description,
        project.category,
        project.difficulty,
        project.time,
        ...(project.components || []),
        ...(project.steps || [])
      ].join(" ").toLocaleLowerCase("cs");

      return searchable.includes(normalized);
    });
  },

  getCategories() {
    return [...new Set(
      this.getAll().map(project => project.category)
    )];
  },

  getCount() {
    return this.getAll().length;
  }
};
```
