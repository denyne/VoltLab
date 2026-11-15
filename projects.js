
(() => {
  "use strict";

  window.VOLTLAB_DEFAULT_PROJECTS = [

    {
      id: "led-blink",
      title: "Blikající LED s Arduinem",
      category: "arduino",
      icon: "💡",
      difficulty: "Začátečník",
      time: "15 minut",
      description: "První projekt, na kterém si vyzkoušíš programování Arduina a ovládání digitálního výstupu.",
      components: [
        "Arduino Uno nebo kompatibilní deska",
        "LED dioda",
        "Rezistor 220–330 Ω",
        "Propojovací vodiče",
        "USB kabel"
      ],
      steps: [
        "Připoj delší nožičku LED přes rezistor na pin 13.",
        "Kratší nožičku LED připoj na GND.",
        "Připoj Arduino k počítači.",
        "Otevři Arduino IDE a vlož ukázkový program.",
        "Nahraj program do desky a sleduj blikání LED."
      ],
      code: `const int ledPin = 13;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  digitalWrite(ledPin, HIGH);
  delay(1000);

  digitalWrite(ledPin, LOW);
  delay(1000);
}`,
      note: "U některých Arduino desek je LED na pinu 13 již vestavěná. Při použití externí LED vždy použij rezistor."
    },

    {
      id: "temperature-sensor",
      title: "Teploměr DS18B20",
      category: "arduino",
      icon: "🌡️",
      difficulty: "Mírně pokročilý",
      time: "30–45 minut",
      description: "Postav si digitální teploměr s čidlem DS18B20 a zobrazuj teplotu přes sériový monitor.",
      components: [
        "Arduino Uno",
        "Senzor DS18B20",
        "Rezistor 4,7 kΩ",
        "Propojovací vodiče",
        "USB kabel"
      ],
      steps: [
        "Připoj GND senzoru na GND Arduina.",
        "Připoj VDD senzoru na 5 V.",
        "Připoj datový vodič na digitální pin 2.",
        "Mezi datový vodič a napájení vlož rezistor 4,7 kΩ.",
        "Nainstaluj knihovny OneWire a DallasTemperature.",
        "Nahraj program a otevři sériový monitor."
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

  if (temperature != DEVICE_DISCONNECTED_C) {
    Serial.print("Teplota: ");
    Serial.print(temperature);
    Serial.println(" °C");
  } else {
    Serial.println("Senzor nenalezen!");
  }

  delay(1000);
}`,
      note: "Ukázka je určena pro běžné třívodičové zapojení DS18B20. Před připojením ověř pořadí vývodů konkrétního senzoru."
    },

    {
      id: "esp32-webserver",
      title: "Jednoduchý webserver na ESP32",
      category: "smart-home",
      icon: "🌐",
      difficulty: "Mírně pokročilý",
      time: "45 minut",
      description: "Vytvoř jednoduchou webovou stránku přímo na ESP32, kterou otevřeš v prohlížeči.",
      components: [
        "ESP32 DevKit",
        "USB kabel",
        "Wi-Fi síť",
        "Počítač nebo telefon"
      ],
      steps: [
        "Připrav ESP32 a otevři Arduino IDE.",
        "Vyber správnou desku ESP32.",
        "V programu doplň název a heslo Wi-Fi.",
        "Nahraj program.",
        "Otevři sériový monitor a zjisti IP adresu.",
        "Zadej IP adresu ESP32 do prohlížeče zařízení ve stejné síti."
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
    "<h1>VoltLab ESP32</h1>"
    "<p>Webserver funguje!</p>"
  );
}

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);

  Serial.print("Pripojovani");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.print("IP adresa: ");
  Serial.println(WiFi.localIP());

  server.on("/", handleRoot);
  server.begin();
}

void loop() {
  server.handleClient();
}`,
      note: "Použij pouze vlastní Wi-Fi síť. Přístup k webserveru je v této ukázce nechráněný, proto ho nevystavuj přímo do internetu."
    },

    {
      id: "robot-car",
      title: "Dvoukolový robot",
      category: "robotics",
      icon: "🤖",
      difficulty: "Pokročilý začátečník",
      time: "2–3 hodiny",
      description: "Postav jednoduché robotické vozítko s dvojicí motorů a ovládáním pomocí motorového driveru.",
      components: [
        "Arduino Uno",
        "Dvoukolový podvozek",
        "2× DC motor",
        "Motorový driver L298N",
        "Vhodné napájení motorů",
        "Propojovací vodiče"
      ],
      steps: [
        "Sestav podvozek a upevni motory.",
        "Připoj motory k výstupům motorového driveru.",
        "Připoj řídicí vstupy driveru k Arduinu.",
        "Propoj společnou zem Arduina a driveru.",
        "Připrav vhodné napájení motorů.",
        "Nahraj testovací program a ověř směr otáčení."
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

void stopRobot() {
  analogWrite(leftA, 0);
  analogWrite(leftB, 0);
  analogWrite(rightA, 0);
  analogWrite(rightB, 0);
}

void forward() {
  analogWrite(leftA, 180);
  analogWrite(leftB, 0);
  analogWrite(rightA, 180);
  analogWrite(rightB, 0);
}

void loop() {
  forward();
  delay(2000);

  stopRobot();
  delay(1000);
}`,
      note: "Zapojení a směr motorů závisí na konkrétním driveru. Ověř pinout a proudové limity. L298N má nezanedbatelné napěťové ztráty."
    },

    {
      id: "3d-holder",
      title: "3D tištěný držák elektroniky",
      category: "3d-printing",
      icon: "🧩",
      difficulty: "Začátečník",
      time: "1–2 hodiny",
      description: "Navrhni a vytiskni jednoduchý držák pro Arduino nebo jinou elektronickou desku.",
      components: [
        "3D tiskárna",
        "PLA filament",
        "Program pro 3D modelování",
        "Posuvné měřítko",
        "Montážní šrouby podle návrhu"
      ],
      steps: [
        "Změř rozměry elektronické desky.",
        "Vytvoř základní model držáku.",
        "Přidej otvory pro montážní šrouby.",
        "Zkontroluj, zda držák nezakrývá konektory.",
        "Exportuj model do STL.",
        "Otevři model ve sliceru a připrav tisk.",
        "Vytiskni model a vyzkoušej usazení desky."
      ],
      code: "",
      note: "Při návrhu nech dostatečný prostor pro konektory, vodiče a chlazení. Elektroniku nikdy nepokládej na vodivé části držáku."
    }

  ];

})();
