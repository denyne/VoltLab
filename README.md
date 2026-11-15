
# ⚡ VoltLab V3

**VoltLab – Elektronika v praxi**

Moderní technický web zaměřený na elektroniku, Arduino, robotiku a automatizaci.

---

## 🚀 Funkce

- Moderní responzivní design
- Tmavý a světlý režim
- Technické články
- Projekty a návody
- Arduino kódové ukázky
- Kopírování zdrojového kódu
- Galerie obrázků
- Ohmův zákon – kalkulačka
- Převodník jednotek
- Kalkulačka barevného kódu rezistorů
- Vyhledávání článků
- Kategorie a štítky
- Administrační MOD MENU
- Správa článků a projektů
- Správa galerie
- Vlastní kategorie
- Správa widgetů
- Úprava textů hlavní stránky
- Statistiky
- Import a export JSON záloh

---

## 📁 Struktura projektu

```text
VoltLab/
│
├── index.html
├── style.css
├── config.js
├── articles.js
├── projects.js
├── widgets.js
├── app.js
├── admin.js
│
└── README.md
```

---

## 🛠️ Instalace

1. Stáhni nebo naklonuj celý repozitář.
2. Otevři složku projektu.
3. Zkontroluj, že jsou všechny JavaScriptové soubory ve stejné složce jako `index.html`.
4. Otevři `index.html` v prohlížeči.

Pro lokální vývoj můžeš použít například rozšíření Live Server ve Visual Studio Code.

---

## 🔐 Administrační MOD MENU

Výchozí demonstrační heslo:

```text
zmen-me-2026
```

Heslo můžeš změnit v souboru `config.js`:

```javascript
admin: {
  enabled: true,
  demoPassword: "TVOJE-NOVE-HESLO"
}
```

**Bezpečnostní upozornění:**

Toto přihlašování je pouze demonstrační. Heslo uložené v JavaScriptu může návštěvník webu zjistit.

Pro ostrý provoz je potřeba serverová autentizace a databáze.

---

## 💾 Ukládání dat

VoltLab V3 v této verzi používá `localStorage`.

To znamená:

- Data se ukládají do konkrétního prohlížeče.
- Jiný návštěvník neuvidí tvoje lokální změny.
- Data se automaticky nesynchronizují mezi zařízeními.
- Smazání dat prohlížeče může způsobit jejich ztrátu.

Pravidelně používej export záloh v MOD MENU.

Galerie ukládá obrázky jako data URL. Velké množství obrázků může zaplnit dostupné úložiště prohlížeče.

---

## 🌐 Publikování přes GitHub Pages

1. Přihlas se na GitHub.
2. Vytvoř nový veřejný repozitář, například `voltlab`.
3. Nahraj všechny soubory projektu.
4. Otevři nastavení repozitáře.
5. Vyber **Pages**.
6. V části Build and deployment zvol:
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)
7. Ulož nastavení.
8. Počkej na dokončení publikování.

Web bude dostupný na adrese:

```text
https://TVUJ-GITHUB-UCET.github.io/voltlab/
```

Adresa se může lišit podle názvu repozitáře a nastavení GitHubu.

---

## 🧩 Technologie

- HTML5
- CSS3
- Vanilla JavaScript
- LocalStorage
- GitHub Pages

Projekt nevyžaduje instalaci Node.js ani sestavovací nástroje.

---

## 🔮 Možnosti dalšího rozvoje

- Připojení databáze
- Skutečné uživatelské účty
- Role administrátorů a redaktorů
- Cloudové ukládání obrázků
- Centrální správa obsahu
- Rozšířené statistiky
- API pro externí služby
- PWA a offline režim

---

## 📜 Licence

Určeno pro osobní a vzdělávací použití.

Před dalším šířením projektu si ověř práva k použitým obrázkům, ikonám a externím knihovnám.

---

**VoltLab V3 – Technologie začíná nápadem. ⚡**
