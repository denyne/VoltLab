
window.VOLTLAB_DEFAULT_PROJECTS = [
  {
    id: "led-blink",
    title: "LED Blink",
    category: "arduino",
    icon: "◉",
    difficulty: "Začátečník",
    time: "15 minut",
    description: "Rozblikání LED diody pomocí Arduina. Ideální první projekt.",
    components: ["Arduino Uno", "LED dioda", "Rezistor 220–330 Ω", "Propojovací vodiče", "USB kabel"],
    steps: [
      "Připoj delší nožičku LED přes rezistor na pin 13.",
      "Kratší nožičku připoj na GND.",
      "Otevři Arduino IDE a vyber správnou desku.",
      "Nahraj program a sleduj blikání LED."
    ],
    code: `void setup() {
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH);
  delay(1000);

  digitalWrite(13, LOW);
  delay(1000);
}`,
    note: "Pokud používáš desku s vestavěnou LED na pinu 13, můžeš externí LED vynechat."
  },
  {
    id: "temperature-sensor",
    title: "Teplotní senzor",
    category: "arduino",
    icon: "◌",
    difficulty: "Začátečník",
    time: "30 minut",
    description: "Měření teploty pomocí digitálního senzoru a zobrazení hodnot v sériovém monitoru.",
    components: ["Arduino Uno", "Senzor DS18B20", "Rezistor 4,7 kΩ", "Propojovací vodiče"],
    steps: [
      "Připoj napájení senzoru podle jeho datasheetu.",
      "Datový pin připoj na digitální pin Arduina.",
      "Mezi datovou linku a napájení zapoj pull-up rezistor 4,7 kΩ.",
      "Nainstaluj potřebnou knihovnu a nahraj program."
    ],
    code: `// Ukázková kostra projektu
#include <OneWire.h>
#include <DallasTemperature.h>

#define SENSOR_PIN 2

OneWire oneWire(SENSOR_PIN);
DallasTemperature sensors(&oneWire);

void setup() {
  Serial.begin(9600);
  sensors.begin();
}

void loop() {
  sensors.requestTemperatures();
  float temp = sensors.getTempCByIndex(0);

  Serial.print("Teplota: ");
  Serial.print(temp);
  Serial.println(" °C");

  delay(1000);
}`,
    note: "Tento příklad vyžaduje knihovny OneWire a DallasTemperature."
  },
  {
    id: "esp32-webserver",
    title: "ESP32 Wi-Fi webserver",
    category: "smart-home",
    icon: "⌂",
    difficulty: "Pokročilý",
    time: "45 minut",
    description: "Vytvoř jednoduchou webovou stránku hostovanou přímo na ESP32.",
    components: ["ESP32 DevKit", "USB kabel", "Wi-Fi síť"],
    steps: [
      "Připrav ESP32 a podporu desek v Arduino IDE.",
      "Doplň název Wi-Fi sítě a heslo.",
      "Nahraj program do desky.",
      "V sériovém monitoru zjisti IP adresu zařízení.",
      "Otevři IP adresu v prohlížeči."
    ],
    code: `#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "NAZEV_SITE";
const char* password = "HESLO_SITE";

WebServer server(80);

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }

  server.on("/", []() {
    server.send(200, "text/html",
      "<h1>VoltLab ESP32</h1><p>Server funguje!</p>");
  });

  server.begin();
  Serial.println(WiFi.localIP());
}

void loop() {
  server.handleClient();
}`,
    note: "Před zveřejněním projektu odstraň skutečné přihlašovací údaje k Wi-Fi."
  },
  {
    id: "robot-car",
    title: "Robotické autíčko",
    category: "robotics",
    icon: "◎",
    difficulty: "Středně pokročilý",
    time: "2–3 hodiny",
    description: "Malé vozítko se dvěma motory a řídicí jednotkou.",
    components: ["Arduino nebo ESP32", "2× DC převodový motor", "Motor driver", "Podvozek", "Kola", "Zdroj napájení"],
    steps: [
      "Sestav podvozek a upevni motory.",
      "Připoj motory k motor driveru.",
      "Propoj řídicí jednotku s driverem.",
      "Zajisti vhodné napájení motorů a logiky.",
      "Otestuj pohyb obou motorů a jejich směr."
    ],
    code: `const int leftA = 5;
const int leftB = 6;
const int rightA = 9;
const int rightB = 10;

void setup() {
  pinMode(leftA, OUTPUT);
  pinMode(leftB, OUTPUT);
  pinMode(rightA, OUTPUT);
  pinMode(rightB, OUTPUT);
}

void loop() {
  // Jízda vpřed
  digitalWrite(leftA, HIGH);
  digitalWrite(leftB, LOW);
  digitalWrite(rightA, HIGH);
  digitalWrite(rightB, LOW);
  delay(1000);

  // Zastavení
  digitalWrite(leftA, LOW);
  digitalWrite(rightA, LOW);
  delay(1000);
}`,
    note: "Motory nikdy nenapájej přímo z GPIO pinů. Použij vhodný motorový driver a samostatný zdroj."
  },
  {
    id: "3d-holder",
    title: "Vlastní 3D držák",
    category: "3d-printing",
    icon: "▦",
    difficulty: "Začátečník",
    time: "1 hodina",
    description: "Navrhni a vytiskni jednoduchý držák pro elektronickou desku nebo senzor.",
    components: ["3D tiskárna", "PLA filament", "CAD software", "Posuvné měřítko"],
    steps: [
      "Změř rozměry součástky, kterou chceš upevnit.",
      "V CAD programu vytvoř základnu a upevňovací body.",
      "Přidej otvory pro šrouby a dostatečné vůle.",
      "Exportuj model jako STL.",
      "Nastav slicer a vytiskni prototyp.",
      "Ověř rozměry a případně model uprav."
    ],
    code: `// Ukázkový parametrický model v OpenSCAD
length = 70;
width = 45;
height = 4;
hole = 3.2;

difference() {
  cube([length, width, height]);

  translate([8, 8, -1])
    cylinder(h=height+2, d=hole, $fn=32);

  translate([length-8, 8, -1])
    cylinder(h=height+2, d=hole, $fn=32);

  translate([8, width-8, -1])
    cylinder(h=height+2, d=hole, $fn=32);

  translate([length-8, width-8, -1])
    cylinder(h=height+2, d=hole, $fn=32);
}`,
    note: "Rozměry si přizpůsob podle skutečné desky a zkontroluj vůle pro šrouby."
  }
];
