
window.VOLTLAB_DEFAULT_PROJECTS = [
  {
    id: "led-blink",
    title: "Blikající LED",
    category: "arduino",
    icon: "◉",
    difficulty: "Začátečník",
    time: "20 minut",
    description: "Jednoduchý projekt, se kterým začneš svou Arduino cestu.",
    components: ["Arduino Uno", "LED", "Rezistor 220 Ω", "Propojovací vodiče"],
    steps: ["Propoj anodu LED s digitálním pinem přes rezistor.", "Katodu LED připoj na GND.", "Nahraj program pro blikání.", "Sleduj, jak LED pravidelně bliká."],
    code: `void setup() {
  pinMode(8, OUTPUT);
}
void loop() {
  digitalWrite(8, HIGH);
  delay(1000);
  digitalWrite(8, LOW);
  delay(1000);
}`,
    note: "Vždy použij vhodný rezistor pro omezení proudu LED."
  },
  {
    id: "temperature-sensor",
    title: "Teploměr s čidlem",
    category: "arduino",
    icon: "🌡",
    difficulty: "Začátečník",
    time: "45 minut",
    description: "Změř teplotu pomocí digitálního senzoru.",
    components: ["Arduino", "DS18B20", "Rezistor 4,7 kΩ", "Vodiče"],
    steps: ["Připoj napájení senzoru.", "Datový vodič připoj k digitálnímu pinu.", "Přidej pull-up rezistor 4,7 kΩ.", "Načítej hodnoty v programu."],
    code: `// Ukázka zapojení a čtení:
// Pro DS18B20 použij knihovny OneWire
// a DallasTemperature.`,
    note: "Před použitím ukázkového kódu nainstaluj potřebné knihovny."
  },
  {
    id: "esp32-webserver",
    title: "ESP32 webový server",
    category: "smart-home",
    icon: "⌂",
    difficulty: "Pokročilý",
    time: "90 minut",
    description: "Vytvoř jednoduchou webovou stránku běžící na ESP32.",
    components: ["ESP32", "USB kabel", "Wi-Fi síť"],
    steps: ["Připoj ESP32 k počítači.", "Nastav přihlašovací údaje Wi-Fi.", "Spusť webový server.", "Otevři IP adresu zařízení v prohlížeči."],
    code: `#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "NAZEV_WIFI";
const char* password = "HESLO_WIFI";
WebServer server(80);

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) delay(300);
  server.on("/", []() {
    server.send(200, "text/plain", "Ahoj z VoltLabu!");
  });
  server.begin();
}

void loop() {
  server.handleClient();
}`,
    note: "Ukázka vyžaduje doplnění údajů Wi-Fi. Nepoužívej citlivé přihlašovací údaje ve veřejném kódu."
  },
  {
    id: "robot-car",
    title: "Robotické autíčko",
    category: "robotics",
    icon: "🚗",
    difficulty: "Střední",
    time: "2–3 hodiny",
    description: "Postav jednoduché vozítko se dvěma motory.",
    components: ["Podvozek", "2 DC motory", "Motorový driver", "Arduino", "Baterie"],
    steps: ["Sestav podvozek a upevni motory.", "Zapoj motory do driveru.", "Propoj driver s Arduinem.", "Naprogramuj pohyb vpřed a zatáčení."],
    code: `// Příklad ovládání jednoho motoru
const int IN1 = 5;
const int IN2 = 6;

void setup() {
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
}

void loop() {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  delay(1000);
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  delay(1000);
}`,
    note: "Motory nenapájej přímo z GPIO pinů Arduina. Použij motorový driver a vhodný zdroj."
  },
  {
    id: "3d-holder",
    title: "Vlastní 3D držák",
    category: "3d-printing",
    icon: "▧",
    difficulty: "Začátečník",
    time: "60 minut",
    description: "Navrhni a vytiskni praktický držák pro elektroniku.",
    components: ["3D tiskárna", "PLA filament", "CAD software", "Posuvné měřítko"],
    steps: ["Změř rozměry součástky.", "Vytvoř jednoduchý 3D model.", "Exportuj model do STL.", "Připrav tisk ve sliceru.", "Vytiskni a otestuj držák."],
    code: "// Model vytvoř v CAD programu\n// a exportuj jako STL soubor.",
    note: "Nezapomeň na malou vůli mezi součástkou a držákem."
  }
];
