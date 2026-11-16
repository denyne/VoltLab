# VoltLab V5 — Premium Technology & Electronics Platform

VoltLab V5 je moderní, modulární technologická platforma zaměřená na elektroniku, embedded vývoj, hardware, software, laboratorní experimenty a interaktivní inženýrské nástroje. Projekt je navržen pro bezproblémový běh na statickém hostingu (**GitHub Pages**) bez nutnosti vlastního Node.js serveru, s volitelnou integrací **Supabase** pro produkční autentizaci a databázi.

## Architektura projektu

```text
voltlab-v5/
├── index.html               # Hlavní SPA rozhraní, sémantické sekce, modály, administrace
├── css/
│   ├── variables.css        # Design tokens, barevná paleta (Dark/Light), typografie, stíny
│   ├── layout.css           # Grid systémy, navigace, responsivní kontejnery, hero layout
│   └── components.css       # Karty, kalkulačky, modály, toast notifikace, admin dashboard
├── js/
│   ├── store.js             # Správa stavu, localStorage persistence, volitelný Supabase adaptér
│   ├── tools.js             # Interaktivní inženýrské kalkulačky a převodníky
│   ├── admin.js             # Zabezpečené rozhraní administrace, CRUD operace, JSON import/export
│   └── app.js               # Hlavní řídicí logika, renderování, vyhledávání, filtry, modalita
├── data/
│   └── seed.json            # Výchozí datová sada (články, projekty, kategorie)
├── assets/
│   └── favicon.svg          # Vektorové logo VoltLab V5
└── README.md                # Dokumentace projektu a nasazení na GitHub Pages
```

## Nasazení na GitHub Pages

1. Nahrajte obsah složky `voltlab-v5` do kořenového adresáře svého GitHub repozitáře (nebo do složky `/docs`).
2. V nastavení repozitáře přejděte do **Settings → Pages**.
3. Jako zdroj (Source) vyberte větev `main` a složku `/ (root)`.
4. Po uložení bude web dostupný na `https://<uzivatel>.github.io/<repozitar>/`.

## Bezpečnost a administrace (Supabase)

Protože GitHub Pages hostuje pouze statické soubory:
- V kódu **nejsou uložena žádná hesla ani tajné API klíče**.
- Ve výchozím režimu bez připojeného backendu je administrace zřetelně označena jako **Lokální náhled (Sandbox režim)** — úpravy se ukládají pouze do `localStorage` daného prohlížeče a neovlivňují veřejná data ostatních uživatelů.
- Pro plnohodnotnou produkční správu obsahu zadejte v sekci *Administrace → Konfigurace backendu* svou veřejnou `SUPABASE_URL` a `SUPABASE_ANON_KEY`. Ověření probíhá přes **Supabase Auth** a zápis do databáze je chráněn pomocí **Row Level Security (RLS)**.

### Doporučené SQL schéma pro Supabase (RLS)

```sql
create table voltlab_content (
  id text primary key,
  type text not null check (type in ('article', 'project')),
  payload jsonb not null,
  updated_at timestamptz default now()
);

alter table voltlab_content enable row level security;

create policy "Veřejné čtení obsahu"
  on voltlab_content for select using (true);

create policy "Zápis pouze pro přihlášené administrátory"
  on voltlab_content for all using (auth.role() = 'authenticated');
```
