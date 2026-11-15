
/* =====================================================
   VOLTLAB V3 – PROJECTS
   Praktické technické projekty
   ===================================================== */

(function () {
  "use strict";

  window.VOLTLAB_DEFAULT_PROJECTS = [

    {
      id: "arduino-led",
      title: "Blikající LED s Arduinem",
      category: "arduino",
      description: "Jednoduchý projekt pro první seznámení s Arduinem a digitálními výstupy.",
      difficulty: "Začátečník",
      icon: "lightbulb",
      image: "assets/images/project-led.jpg",
      components: [
        "Arduino Uno",
        "LED dioda",
        "Rezistor 220–330 Ω",
        "Propojovací vodiče",
        "USB kabel"
      ],
      wiring: [
        "Digitální pin 13 připoj přes rezistor k anodě LED.",
        "Katodu LED připoj na GND.",
        "Arduino připoj k počítači přes USB."
      ],
      instructions: [
        "Připrav Arduino a potřebné součástky.",
        "Zapoj LED diodu přes rezistor.",
        "Otevři Arduino IDE.",
        "Vlož připravený program.",
        "Vyber správnou desku a port.",
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
      tips: [
        "Rezistor chrání LED před nadměrným proudem.",
        "Délku blikání změníš úpravou hodnoty delay().",
        "Některé desky mají LED připojenou přímo na pinu 13."
      ],
      tags: ["Arduino", "LED", "začátečník"],
      date: "2026-11-15",
      featured: true
    },

    {
      id: "arduino-teplota",
      title: "Měření teploty pomocí senzoru",
      category: "arduino",
      description: "Vytvoř si jednoduchý teploměr s Arduinem a digitálním senzorem.",
      difficulty: "Začátečník",
      icon: "thermometer",
      image: "assets/images/project-teplota.jpg",
      components: [
        "Arduino Uno",
        "Senzor DS18B20",
        "Rezistor 4,7 kΩ",
        "Propojovací vodiče",
        "USB kabel"
      ],
      wiring: [
        "VCC senzoru připoj na 5 V.",
        "GND senzoru připoj na GND.",
        "DATA senzoru připoj na digitální pin 2.",
        "Mezi DATA a 5 V zapoj pull-up rezistor 4,7 kΩ."
      ],
      instructions: [
        "Zapoj senzor podle schématu.",
        "Nainstaluj knihovny OneWire a DallasTemperature.",
        "Vlož program do Arduino IDE.",
        "Nahraj program do desky.",
        "Otevři sériový monitor."
      ],
      code: `#include <OneWire.h>
#include <DallasTemperature.h>

#define ONE_WIRE_BUS 2

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

void setup() {
  Serial.begin(9600);
  sensors.begin();
}

void loop() {
  sensors.requestTemperatures();

  float temperature = sensors.getTempCByIndex(0);

  Serial.print("Teplota: ");
  Serial.print(temperature);
  Serial.println(" °C");

  delay(1000);
}`,
      tips: [
        "Nezapomeň nainstalovat obě potřebné knihovny.",
        "Senzor DS18B20 může mít různé typy pouzder.",
        "Při delším vedení věnuj pozornost zapojení a kvalitě kabeláže."
      ],
      tags: ["Arduino", "teplota", "DS18B20"],
      date: "2026-11-15",
      featured: true
    },

    {
      id: "esp32-webserver",
      title: "Vlastní webserver na ESP32",
      category: "smart-home",
      description: "Vytvoř jednoduchý webserver, který zobrazí stav ESP32 v místní síti.",
      difficulty: "Pokročilý začátečník",
      icon: "wifi",
      image: "assets/images/project-esp32.jpg",
      components: [
        "ESP32 DevKit",
        "USB kabel",
        "Počítač",
        "Wi-Fi síť"
      ],
      wiring: [
        "Připoj ESP32 k počítači pomocí USB.",
        "Pro tento základní projekt nejsou potřeba externí součástky."
      ],
      instructions: [
        "Otevři Arduino IDE.",
        "Nainstaluj podporu desek ESP32.",
        "Doplň název a heslo své Wi-Fi sítě.",
        "Nahraj program.",
        "Otevři sériový monitor a zjisti IP adresu.",
        "Zadej IP adresu do prohlížeče zařízení ve stejné síti."
      ],
      code: `#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "NAZEV_WIFI";
const char* password = "HESLO_WIFI";

WebServer server(80);

void handleRoot() {
  server.send(
    200,
    "text/html; charset=utf-8",
    "<h1>VoltLab ESP32</h1><p>Webserver funguje!</p>"
  );
}

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println(WiFi.localIP());

  server.on("/", handleRoot);
  server.begin();
}

void loop() {
  server.handleClient();
}`,
      tips: [
        "Nahraď údaje Wi-Fi vlastními přihlašovacími údaji.",
        "Nezveřejňuj heslo Wi-Fi ve veřejném repozitáři.",
        "ESP32 musí být připojeno ke stejné síti jako zařízení, ze kterého web otevíráš."
      ],
      tags: ["ESP32", "Wi-Fi", "webserver", "IoT"],
      date: "2026-11-15",
      featured: true
    },

    {
      id: "robot-line-follower",
      title: "Robot sledující černou čáru",
      category: "robotics",
      description: "Postav malého robota, který pomocí senzorů sleduje černou čáru.",
      difficulty: "Středně pokročilý",
      icon: "bot",
      image: "assets/images/project-robot.jpg",
      components: [
        "Arduino Uno",
        "Dvoukolový robotický podvozek",
        "Dva stejnosměrné motory",
        "Motorový driver",
        "Dva IR senzory čáry",
        "Bateriový zdroj"
      ],
      wiring: [
        "IR senzor vlevo připoj na digitální pin 2.",
        "IR senzor vpravo připoj na digitální pin 3.",
        "Motorový driver připoj na řídicí piny Arduina.",
        "Motory připoj na výstupy driveru.",
        "Zajisti společnou zem řídicí elektroniky a motorového driveru."
      ],
      instructions: [
        "Sestav robotický podvozek.",
        "Připevni IR senzory směrem k podložce.",
        "Zapoj motorový driver a motory.",
        "Nahraj program.",
        "Umísti robota na připravenou černou dráhu.",
        "Podle potřeby uprav citlivost senzorů a rychlost motorů."
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

void loop() {
  int left = digitalRead(leftSensor);
  int right = digitalRead(rightSensor);

  // Příklad předpokládá LOW na černé čáře.
  // Podle typu senzoru může být logika opačná.

  if (left == LOW && right == LOW) {
    forward();
  } else if (left == LOW) {
    turnLeft();
  } else if (right == LOW) {
    turnRight();
  } else {
    stopRobot();
  }
}

void forward() {
  analogWrite(leftMotor, 150);
  analogWrite(rightMotor, 150);
}

void turnLeft() {
  analogWrite(leftMotor, 0);
  analogWrite(rightMotor, 150);
}

void turnRight() {
  analogWrite(leftMotor, 150);
  analogWrite(rightMotor, 0);
}

void stopRobot() {
  analogWrite(leftMotor, 0);
  analogWrite(rightMotor, 0);
}`,
      tips: [
        "Konkrétní zapojení závisí na typu motorového driveru.",
        "Ověř logiku výstupů IR senzorů.",
        "Motory nenapájej přímo z výstupů Arduina.",
        "Tento ukázkový kód předpokládá vhodný driver a kompatibilní PWM piny."
      ],
      tags: ["robotika", "Arduino", "motory", "IR senzory"],
      date: "2026-11-15",
      featured: true
    },

    {
      id: "3d-tisk-drzak",
      title: "Vlastní 3D tištěný držák elektroniky",
      category: "3d-printing",
      description: "Navrhni a vytiskni jednoduchý držák pro Arduino nebo ESP32.",
      difficulty: "Začátečník",
      icon: "box",
      image: "assets/images/project-drzak.jpg",
      components: [
        "3D tiskárna",
        "PLA filament",
        "Program pro 3D modelování",
        "Posuvné měřítko",
        "Šroubky podle konstrukce"
      ],
      wiring: [
        "Tento projekt nevyžaduje elektrické zapojení.",
        "Před návrhem změř rozměry desky a polohu montážních otvorů."
      ],
      instructions: [
        "Změř rozměry desky.",
        "Vytvoř základní model držáku.",
        "Přidej otvory pro šroubky.",
        "Exportuj model do formátu STL.",
        "Otevři model ve sliceru.",
        "Nastav tisk a vytiskni prototyp.",
        "Ověř, zda deska do držáku správně zapadá."
      ],
      code: `// Doporučené parametry pro první prototyp:
// Materiál: PLA
// Výška vrstvy: 0,2 mm
// Výplň: 20 %
// Podpěry: podle geometrie
// Obvodové stěny: 3`,
      tips: [
        "Nezapomeň na prostor pro USB konektor.",
        "Ověř průměry montážních otvorů.",
        "Při prvním tisku může být potřeba rozměry upravit."
      ],
      tags: ["3D tisk", "PLA", "Arduino", "modelování"],
      date: "2026-11-15",
      featured: false
    }

  ];

})();
