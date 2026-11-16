
# ⚡ VoltLab V3

**Moderní technický web zaměřený na elektroniku, Arduino, robotiku, 3D tisk a chytrou domácnost.**

VoltLab je projekt pro všechny technické nadšence, bastlíře, studenty a kutily. Nabízí články, praktické projekty, návody, kalkulačky a další užitečné nástroje.

---

## 🚀 Funkce

- 📚 Technické články a návody
- 🔧 Praktické elektronické projekty
- 🤖 Arduino a robotika
- 🏠 Chytrá domácnost a ESP32
- 🖨️ 3D tisk
- 🧮 Elektronické kalkulačky
- ⚡ Ohmův zákon
- 🔌 Převodník jednotek
- 🎨 Výpočet hodnoty rezistorů
- 🖼️ Galerie projektů
- 🌙 Tmavý a světlý režim
- 🛠️ Administrace obsahu
- 💾 Export a import dat ve formátu JSON

---

## 📁 Struktura projektu

```text
VoltLab-V3/
│
├── index.html
├── style.css
├── config.js
├── articles.js
├── projects.js
├── widgets.js
├── app.js
├── admin.js
├── README.md
│
└── assets/
    └── images/
        ├── arduino.jpg
        ├── electronics.jpg
        ├── robotics.jpg
        └── projects/
```

Obrázky v adresáři `assets/images/` jsou připravené jako očekávané cesty. Vlastní obrázky je potřeba do projektu doplnit.

---

## 🧰 Použité technologie

| Technologie | Využití |
|---|---|
| HTML5 | Struktura webu |
| CSS3 | Vzhled a responzivní design |
| JavaScript | Funkce a interaktivita |
| LocalStorage | Ukládání dat v prohlížeči |
| SessionStorage | Dočasná administrační relace |
| JSON | Záloha a obnovení dat |

Projekt nevyžaduje instalaci Node.js ani dalších balíčků.

---

## 💻 Spuštění projektu

### 1. Stažení projektu

Naklonuj repozitář:

```bash
git clone https://github.com/TVUJ-UCET/VoltLab-V3.git
```

Přejdi do složky:

```bash
cd VoltLab-V3
```

### 2. Otevření webu

Otevři soubor `index.html` ve webovém prohlížeči.

Pro pohodlnější vývoj doporučujeme použít rozšíření Live Server ve Visual Studio Code.

### 3. Úprava nastavení

Základní nastavení webu najdeš v souboru:

```text
config.js
```

Výchozí články:

```text
articles.js
```

Výchozí projekty:

```text
projects.js
```

Kalkulačky a nástroje:

```text
widgets.js
```

Hlavní aplikační logika:

```text
app.js
```

Administrace:

```text
admin.js
```

---

## 🔗 Pořadí načítání JavaScriptu

Soubory musí být v `index.html` načteny ve správném pořadí:

```html
<script src="config.js"></script>
<script src="articles.js"></script>
<script src="projects.js"></script>
<script src="widgets.js"></script>
<script src="app.js"></script>
<script src="admin.js"></script>
```

Pokud pořadí změníš, některé funkce nemusí být dostupné.

---

## 🛠️ Administrace

Administrace umožňuje:

- Spravovat články
- Spravovat projekty
- Spravovat galerii
- Přidávat a upravovat kategorie
- Zapínat a vypínat widgety
- Upravovat texty úvodní stránky
- Exportovat a importovat data

Administraci otevřeš tlačítkem pro správu webu.

### Bezpečnostní upozornění

Současná administrace je pouze demonstrační.

Přihlašovací údaj uložený v JavaScriptu lze zobrazit ve zdrojovém kódu. Nepoužívej proto tuto verzi jako zabezpečenou administraci veřejného webu.

Pro skutečné uživatelské účty, bezpečné přihlášení a společné ukládání dat je potřeba doplnit backend, databázi a autentizaci.

---

## 💾 Ukládání dat

VoltLab V3 používá LocalStorage.

To znamená:

- Data zůstávají uložená v konkrétním prohlížeči.
- Jiný návštěvník automaticky neuvidí tvoje změny.
- Vymazáním dat prohlížeče může dojít ke ztrátě uloženého obsahu.
- Pro přenos dat mezi zařízeními použij export a import JSON.

Pravidelně si vytvářej zálohy.

---

## 🌐 Publikování na GitHub Pages

1. Vytvoř nový GitHub repository.
2. Nahraj všechny soubory projektu.
3. Otevři nastavení repozitáře.
4. Vyber **Pages**.
5. V části Build and deployment zvol nasazení z větve.
6. Vyber větev `main` a složku `/root`.
7. Ulož nastavení.

Po dokončení bude web dostupný na adrese podobné této:

```text
https://TVUJ-UCET.github.io/VoltLab-V3/
```

Skutečná adresa závisí na názvu účtu a repozitáře.

---

## 📱 Responzivní design

Web je navržený pro:

- Stolní počítače
- Notebooky
- Tablety
- Mobilní telefony

---

## 🔮 Plánovaný vývoj

- [ ] Kompletní editor článků
- [ ] Pokročilý editor projektů
- [ ] Rozšířená galerie
- [ ] Vyhledávání článků a projektů
- [ ] Další elektronické kalkulačky
- [ ] Schémata zapojení
- [ ] Lepší mobilní administrace
- [ ] Backend a databáze
- [ ] Bezpečné uživatelské účty
- [ ] Sdílení obsahu mezi zařízeními

---

## 🤝 Přispívání

Máš nápad na vylepšení?

1. Forkni repozitář.
2. Vytvoř novou větev.
3. Proveď změny.
4. Odešli Pull Request.

Uvítáme nové návody, projekty, opravy a nápady.

---

## 📜 Licence

Licenci projektu je potřeba doplnit podle toho, jakým způsobem chce autor VoltLab zveřejňovat a povolovat další používání zdrojového kódu.

---

**VoltLab V3 – Tvoř. Objevuj. Programuj.**
