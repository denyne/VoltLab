# VoltLab
Moderní responzivní webový portál v čistém HTML, CSS a JavaScriptu. Bez build procesu a bez závislostí. Připraveno pro GitHub Pages.

## Spuštění

1. Nahraj celý obsah této složky do kořenového adresáře GitHub repozitáře.
2. Otevři **Settings → Pages**.
3. V části **Build and deployment** zvol **Deploy from a branch**.
4. Vyber `main` a složku `/ (root)`, ulož.
5. Po nasazení otevři adresu, kterou GitHub Pages zobrazí.

Lokální náhled: otevři `index.html` v prohlížeči. Pro nejlepší testování lze použít VS Code rozšíření Live Server.

## Přidání článku

Články lze spravovat dvěma způsoby:

### A) Přes MOD MENU
- Dole v patičce klikni na `MOD ACCESS`.
- Demo přístupový kód je `zmen-me-2026`.
- Kód změň v `config.js` ještě před zveřejněním.
- Po odemčení lze články přidávat, upravovat a mazat.
- Změny se ukládají do `localStorage` daného prohlížeče. Ostatní návštěvníci je neuvidí a po vymazání dat prohlížeče mohou zmizet.
- JSON export/import slouží k záloze a přenosu obsahu.

### B) Přímo v souboru `articles.js`
Přidej objekt do pole `window.VOLTLAB_ARTICLES`:

```js
{
  id: "a007",                 // unikátní ID
  category: "Arduino",        // Arduino, Elektronika, Robotika, Automatizace, IoT
  read: "5 min",
  date: "15.11.2026",
  symbol: "A",                // krátký znak na kartě
  title: "Název článku",
  excerpt: "Krátký popis článku.",
  body: "Text článku. Odstavce odděluj prázdným řádkem."
}
```

Při úpravě souboru `articles.js` se změny projeví všem návštěvníkům po nasazení na GitHub Pages. Pokud má prohlížeč lokálně uložený obsah z MOD MENU, může mít přednost lokální kopie. Pro návrat k obsahu repozitáře smaž klíč `voltLabArticles_v1` z Local Storage prohlížeče.

## Změna nastavení

V `config.js` uprav:
- `siteName` — název projektu.
- `adminCode` — demo kód pro MOD MENU.
- `storageKey` a `themeKey` — klíče lokálního úložiště.

## Rozšířené MOD MENU

Vlastnická zóna má tři části:

- **Články:** vytváření, úpravy a mazání článků.
- **Projekty:** samostatná správa projektů, jejich kategorií, štítků, popisů a detailních postupů.
- **Texty a názvy:** úprava názvu webu, popisku loga, hlavního nadpisu, úvodního textu a vybraných nadpisů sekcí i textu „O webu“.

Záloha nyní exportuje společně články, projekty i textová nastavení do jednoho JSON souboru. Import podporuje tento nový formát i starší export článků.

**Pozor:** úpravy z MOD MENU jsou stále lokální prohlížečová data. Pro publikování obsahu všem návštěvníkům je nutné přenést data do `articles.js` / zdrojových souborů a změny pushnout na GitHub, nebo web napojit na CMS či backend.

## Přidání kategorie

1. Přidej kategorii do filtračních tlačítek v `index.html`.
2. Přidej ji také do `<select id="editCategory">` v MOD MENU.
3. U článků použij přesně stejný název kategorie.

## Přidání widgetu

V `index.html` vlož další kartu do `.tools-grid`. V `app.js` doplň logiku widgetu a případné styly přidej do `style.css`. Existující kalkulačka Ohmova zákona a převodník odporu jsou jednoduché příklady.

## Bezpečnost — důležité

Tento projekt je statický web. MOD MENU je pouze pohodlný editor obsahu v prohlížeči, nikoliv bezpečná administrace:
- přístupový kód je uložen v souboru `config.js` a každý návštěvník si jej může zobrazit,
- změny z editoru jsou uloženy jen v `localStorage` konkrétního prohlížeče,
- MOD MENU neposílá změny do GitHub repozitáře.

**Nepoužívej tento mechanismus pro ochranu citlivého obsahu ani jako skutečné přihlášení.** Pro více správců a publikování článků všem návštěvníkům doporučujeme napojit autentizaci a databázi, například Supabase (Auth + Database), případně vlastní backend. Alternativně lze redakční workflow řešit přes Decap CMS s GitHub OAuth. Tajné klíče nikdy nevkládej do frontendového JavaScriptu.

## Struktura projektu

```text
volt-lab/
├── index.html
├── style.css
├── app.js
├── articles.js
├── config.js
├── README.md
├── LICENSE
└── assets/
    └── favicon.svg
```

## Technologie
- HTML5, CSS3, Vanilla JavaScript
- Local Storage pro motiv a lokální demo obsah
- GitHub Pages pro bezplatné statické hostování
- Google Fonts (Manrope, DM Mono); při nedostupnosti se použijí systémové fonty

## Licence
MIT — podrobnosti v souboru `LICENSE`.
