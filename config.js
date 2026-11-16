```html
<!DOCTYPE html>
<html lang="cs" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#0b0f0e">
  <meta name="description" content="VoltLab – cozy technologická dílna plná elektroniky, Arduina, robotiky, 3D tisku, projektů a praktických nástrojů.">
  <meta name="keywords" content="VoltLab, elektronika, Arduino, ESP32, robotika, 3D tisk, programování, kalkulačky">
  <meta name="author" content="VoltLab">
  <meta name="color-scheme" content="dark light">

  <title>VoltLab — Your cozy tech lab</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="style.css">

  <script src="config.js" defer></script>
  <script src="articles.js" defer></script>
  <script src="projects.js" defer></script>
  <script src="widgets.js" defer></script>
  <script src="app.js" defer></script>
  <script src="admin.js" defer></script>
</head>

<body>
  <a class="skip-link" href="#main-content">Přeskočit na obsah</a>

  <!-- Ambient background -->
  <div class="ambient-background" aria-hidden="true">
    <div class="ambient-glow ambient-glow-one"></div>
    <div class="ambient-glow ambient-glow-two"></div>
    <div class="ambient-grid"></div>
    <div class="ambient-noise"></div>
  </div>

  <!-- Reading progress -->
  <div class="reading-progress" id="reading-progress" aria-hidden="true">
    <span id="reading-progress-bar"></span>
  </div>

  <!-- Top information bar -->
  <div class="topbar">
    <div class="container topbar-inner">
      <div class="topbar-status">
        <span class="status-indicator"></span>
        <span>LAB ONLINE</span>
        <span class="topbar-divider">/</span>
        <span class="topbar-message">Nápady se mění v projekty.</span>
      </div>

      <div class="topbar-right">
        <span class="topbar-version">VOLTLAB <span data-site-version>4.0</span></span>
        <span class="topbar-divider">/</span>
        <span class="topbar-clock" id="live-clock">--:--:--</span>
      </div>
    </div>
  </div>

  <!-- Header -->
  <header class="site-header" id="site-header">
    <div class="container header-inner">

      <a href="#home" class="brand" aria-label="VoltLab – domů">
        <span class="brand-symbol" aria-hidden="true">
          <svg viewBox="0 0 48 48" fill="none">
            <path d="M27.5 3L9 26.5H22L19.5 45L39 19.5H26L27.5 3Z"
              fill="currentColor"/>
            <path d="M27.5 3L9 26.5H22L19.5 45L39 19.5H26L27.5 3Z"
              stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          </svg>
        </span>

        <span class="brand-copy">
          <strong>Volt<span>Lab</span></strong>
          <small>YOUR COZY TECH LAB</small>
        </span>
      </a>

      <nav class="main-navigation" id="main-nav" aria-label="Hlavní navigace">
        <a href="#home" class="nav-link active">Domů</a>
        <a href="#categories" class="nav-link">Oblasti</a>
        <a href="#articles" class="nav-link">Články</a>
        <a href="#projects" class="nav-link">Projekty</a>
        <a href="#tools" class="nav-link">Nástroje</a>
        <a href="#about" class="nav-link">O VoltLabu</a>
      </nav>

      <div class="header-actions">
        <button class="icon-button" id="global-search-toggle" type="button"
          aria-label="Otevřít vyhledávání" title="Vyhledávání">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" stroke-width="1.7"/>
            <path d="M16 16L21 21" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
          </svg>
        </button>

        <button class="icon-button" id="theme-toggle" type="button"
          aria-label="Přepnout vzhled" title="Přepnout vzhled">
          <svg id="theme-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.7"/>
            <path d="M12 2V4M12 20V22M4.93 4.93L6.35 6.35M17.65 17.65L19.07 19.07M2 12H4M20 12H22M4.93 19.07L6.35 17.65M17.65 6.35L19.07 4.93"
              stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
          </svg>
        </button>

        <a href="#tools" class="button button-small button-primary header-cta">
          Otevřít dílnu <span aria-hidden="true">↗</span>
        </a>

        <button class="mobile-menu-toggle" id="mobile-menu-toggle" type="button"
          aria-label="Otevřít navigaci" aria-expanded="false" aria-controls="main-nav">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>

  <main id="main-content">

    <!-- HERO -->
    <section class="hero-section section" id="home">
      <div class="container hero-layout">

        <div class="hero-content">
          <div class="eyebrow">
            <span class="eyebrow-line"></span>
            <span>VÍTEJ VE SVÉ DIGITÁLNÍ DÍLNĚ</span>
          </div>

          <h1>
            Tvoř. Objevuj.
            <span class="hero-title-accent">Rozsvěcuj nápady.</span>
          </h1>

          <p class="hero-description">
            Místo, kde se potkává elektronika, programování, robotika
            a kreativita. Najdi inspiraci, nauč se něco nového a postav
            něco, co ještě včera existovalo jen v tvé hlavě.
          </p>

          <div class="hero-actions">
            <a href="#projects" class="button button-primary">
              Prozkoumat projekty <span>↗</span>
            </a>
            <a href="#categories" class="button button-secondary">
              Objevovat oblasti
            </a>
          </div>

          <div class="hero-social-proof">
            <div class="hero-avatar-stack" aria-hidden="true">
              <span>ϟ</span>
              <span>⌘</span>
              <span>◎</span>
            </div>
            <div>
              <strong>Malé nápady. Velké možnosti.</strong>
              <small>Každý projekt začíná zvědavostí.</small>
            </div>
          </div>
        </div>

        <div class="hero-visual">
          <div class="hero-visual-glow"></div>

          <div class="hero-orbit hero-orbit-outer">
            <span class="orbit-node orbit-node-one">⚡</span>
            <span class="orbit-node orbit-node-two">⌘</span>
            <span class="orbit-node orbit-node-three">◎</span>
          </div>

          <div class="hero-orbit hero-orbit-inner"></div>

          <div class="hero-core">
            <div class="hero-core-top">
              <span class="core-dot"></span>
              <span>VOLTLAB CORE</span>
              <span class="core-live">LIVE</span>
            </div>

            <div class="hero-core-logo">
              <svg viewBox="0 0 100 120" fill="none" aria-hidden="true">
                <path d="M59 5L17 66H46L39 115L84 48H55L59 5Z"
                  fill="currentColor"/>
              </svg>
            </div>

            <div class="hero-core-bottom">
              <span>IDEAS IN PROGRESS</span>
              <strong>01 — ∞</strong>
            </div>
          </div>

          <div class="floating-card floating-card-top">
            <span class="floating-card-icon">⌘</span>
            <span><strong>Arduino</strong><small>Make it work</small></span>
            <span class="floating-card-check">✓</span>
          </div>

          <div class="floating-card floating-card-bottom">
            <span class="floating-card-icon">ϟ</span>
            <span><strong>Electronics</strong><small>Understand energy</small></span>
            <span class="floating-card-check">✓</span>
          </div>

          <div class="hero-visual-caption">
            <span class="caption-dot"></span>
            <span>CREATIVITY IS ALWAYS ON</span>
          </div>
        </div>
      </div>

      <div class="container hero-bottom">
        <div class="hero-scroll-hint">
          <span class="scroll-mouse"><span></span></span>
          <span>SCROLL TO EXPLORE</span>
        </div>

        <div class="hero-bottom-note">
          <span>DESIGNED FOR CURIOUS MINDS</span>
          <span>✳</span>
          <span>BUILT WITH CURIOSITY</span>
        </div>
      </div>
    </section>

    <!-- QUICK ACCESS -->
    <section class="quick-access-section">
      <div class="container">
        <div class="quick-access-grid">

          <a href="#articles" class="quick-access-item">
            <span class="quick-access-icon">▤</span>
            <span class="quick-access-copy">
              <strong>Učit se</strong>
              <small>Články a návody</small>
            </span>
            <span class="quick-access-arrow">↗</span>
          </a>

          <a href="#projects" class="quick-access-item">
            <span class="quick-access-icon">⌘</span>
            <span class="quick-access-copy">
              <strong>Stavět</strong>
              <small>DIY projekty</small>
            </span>
            <span class="quick-access-arrow">↗</span>
          </a>

          <a href="#tools" class="quick-access-item">
            <span class="quick-access-icon">∑</span>
            <span class="quick-access-copy">
              <strong>Počítat</strong>
              <small>Praktické kalkulačky</small>
            </span>
            <span class="quick-access-arrow">↗</span>
          </a>

          <a href="#favorites" class="quick-access-item">
            <span class="quick-access-icon">♡</span>
            <span class="quick-access-copy">
              <strong>Uložené</strong>
              <small>Oblíbený obsah</small>
            </span>
            <span class="quick-access-arrow">↗</span>
          </a>

        </div>
      </div>
    </section>

    <!-- CATEGORIES -->
    <section class="section categories-section" id="categories">
      <div class="container">

        <div class="section-heading">
          <div>
            <div class="eyebrow">
              <span class="eyebrow-line"></span>
              <span>NAJDI SVŮJ SMĚR</span>
            </div>
            <h2>Co tě dneska <span class="text-accent">zajímá?</span></h2>
            <p>Vyber si oblast a ponoř se do světa technologií.</p>
          </div>

          <a href="#articles" class="text-link">
            Všechny články <span>↗</span>
          </a>
        </div>

        <div class="category-grid" id="category-grid">

          <a href="#articles" class="category-card" data-category-link="arduino">
            <div class="category-card-top">
              <span class="category-icon">⌘</span>
              <span class="category-index">01</span>
            </div>
            <h3>Arduino</h3>
            <p>Mikrokontroléry, senzory a vlastní elektronické konstrukce.</p>
            <span class="category-card-bottom">PROZKOUMAT <span>↗</span></span>
          </a>

          <a href="#articles" class="category-card" data-category-link="electronics">
            <div class="category-card-top">
              <span class="category-icon">ϟ</span>
              <span class="category-index">02</span>
            </div>
            <h3>Elektronika</h3>
            <p>Obvody, součástky, měření a základy elektrotechniky.</p>
            <span class="category-card-bottom">PROZKOUMAT <span>↗</span></span>
          </a>

          <a href="#articles" class="category-card" data-category-link="robotics">
            <div class="category-card-top">
              <span class="category-icon">◎</span>
              <span class="category-index">03</span>
            </div>
            <h3>Robotika</h3>
            <p>Roboti, motory, automatizace a chytré mechanismy.</p>
            <span class="category-card-bottom">PROZKOUMAT <span>↗</span></span>
          </a>

          <a href="#articles" class="category-card" data-category-link="3d-printing">
            <div class="category-card-top">
              <span class="category-icon">▦</span>
              <span class="category-index">04</span>
            </div>
            <h3>3D tisk</h3>
            <p>Modelování, tisk a výroba vlastních součástek.</p>
            <span class="category-card-bottom">PROZKOUMAT <span>↗</span></span>
          </a>

          <a href="#articles" class="category-card" data-category-link="smart-home">
            <div class="category-card-top">
              <span class="category-icon">⌂</span>
              <span class="category-index">05</span>
            </div>
            <h3>Smart Home</h3>
            <p>Chytrá domácnost, ESP32 a automatizace.</p>
            <span class="category-card-bottom">PROZKOUMAT <span>↗</span></span>
          </a>

          <a href="#articles" class="category-card" data-category-link="programming">
            <div class="category-card-top">
              <span class="category-icon">&lt;/&gt;</span>
              <span class="category-index">06</span>
            </div>
            <h3>Programování</h3>
            <p>Kód, logika, weby a software pro vlastní projekty.</p>
            <span class="category-card-bottom">PROZKOUMAT <span>↗</span></span>
          </a>

        </div>
      </div>
    </section>

    <!-- FEATURED CONTENT -->
    <section class="section featured-section">
      <div class="container">
        <div class="featured-panel">
          <div class="featured-content">
            <div class="eyebrow">
              <span class="eyebrow-line"></span>
              <span>VOLT LAB PICK</span>
            </div>

            <span class="featured-label">DNEŠNÍ INSPIRACE</span>
            <h2>Nečekej na dokonalý okamžik. <span>Zapoj první kabel.</span></h2>
            <p>
              Nejlepší způsob, jak se něco naučit, je začít tvořit.
              Vyber si malý projekt, experimentuj a postupně ho vylepšuj.
            </p>

            <a href="#projects" class="button button-primary">
              Najít inspiraci <span>↗</span>
            </a>
          </div>

          <div class="featured-art" aria-hidden="true">
            <div class="featured-art-ring featured-art-ring-one"></div>
            <div class="featured-art-ring featured-art-ring-two"></div>
            <div class="featured-art-center">ϟ</div>
            <span class="featured-art-label">START<br>BUILDING</span>
            <span class="featured-art-coordinate">49° 12' 00" N</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ARTICLES -->
    <section class="section articles-section" id="articles">
      <div class="container">

        <div class="section-heading">
          <div>
            <div class="eyebrow">
              <span class="eyebrow-line"></span>
              <span>KNOWLEDGE DATABASE</span>
            </div>
            <h2>Malé lekce, <span class="text-accent">velké objevy.</span></h2>
            <p>Návody, vysvětlení a praktické znalosti bez zbytečné omáčky.</p>
          </div>

          <div class="section-heading-meta">
            <span class="mono-label">01 / LEARN</span>
          </div>
        </div>

        <div class="content-toolbar">
          <div class="filter-list" id="article-filters">
            <button class="filter-button active" data-filter="all" type="button">Vše</button>
            <button class="filter-button" data-filter="arduino" type="button">Arduino</button>
            <button class="filter-button" data-filter="electronics" type="button">Elektronika</button>
            <button class="filter-button" data-filter="robotics" type="button">Robotika</button>
            <button class="filter-button" data-filter="3d-printing" type="button">3D tisk</button>
            <button class="filter-button" data-filter="smart-home" type="button">Smart Home</button>
            <button class="filter-button" data-filter="programming" type="button">Programování</button>
          </div>

          <label class="search-field">
            <span class="search-field-icon">⌕</span>
            <input type="search" id="article-search" placeholder="Hledat článek..." autocomplete="off">
            <kbd>⌕</kbd>
          </label>
        </div>

        <div class="articles-list content-grid" id="articles-list"></div>

        <div class="empty-state" id="articles-empty" hidden>
          <span class="empty-state-icon">⌕</span>
          <h3>Nic jsme nenašli</h3>
          <p>Zkus jiné klíčové slovo nebo vyber jinou kategorii.</p>
          <button class="button button-secondary" type="button" data-clear-article-search>
            Zobrazit vše
          </button>
        </div>

        <div class="section-bottom-action">
          <span class="mono-label">END OF KNOWLEDGE STREAM</span>
          <span class="section-bottom-line"></span>
          <span class="mono-label">KEEP LEARNING ↗</span>
        </div>

      </div>
    </section>

    <!-- PROJECTS -->
    <section class="section projects-section" id="projects">
      <div class="container">

        <div class="section-heading">
          <div>
            <div class="eyebrow">
              <span class="eyebrow-line"></span>
              <span>MAKER WORKSHOP</span>
            </div>
            <h2>Od nápadu <span class="text-accent">k realitě.</span></h2>
            <p>Projekty, které tě provedou od prvního zapojení až po hotový výsledek.</p>
          </div>

          <span class="section-heading-icon">⌘</span>
        </div>

        <div class="content-toolbar">
          <div class="filter-list" id="project-filters">
            <button class="filter-button active" data-filter="all" type="button">Vše</button>
            <button class="filter-button" data-filter="arduino" type="button">Arduino</button>
            <button class="filter-button" data-filter="electronics" type="button">Elektronika</button>
            <button class="filter-button" data-filter="robotics" type="button">Robotika</button>
            <button class="filter-button" data-filter="3d-printing" type="button">3D tisk</button>
            <button class="filter-button" data-filter="smart-home" type="button">Smart Home</button>
          </div>

          <label class="search-field">
            <span class="search-field-icon">⌕</span>
            <input type="search" id="project-search" placeholder="Hledat projekt..." autocomplete="off">
            <kbd>⌕</kbd>
          </label>
        </div>

        <div class="projects-list content-grid" id="projects-list"></div>

        <div class="empty-state" id="projects-empty" hidden>
          <span class="empty-state-icon">⌘</span>
          <h3>Žádné projekty nenalezeny</h3>
          <p>Zkus změnit hledání nebo filtr.</p>
          <button class="button button-secondary" type="button" data-clear-project-search>
            Zobrazit vše
          </button>
        </div>

      </div>
    </section>

    <!-- WORKBENCH / CALCULATORS -->
    <section class="section tools-section" id="tools">
      <div class="container">

        <div class="section-heading">
          <div>
            <div class="eyebrow">
              <span class="eyebrow-line"></span>
              <span>INTERACTIVE WORKBENCH</span>
            </div>
            <h2>Tvoje digitální <span class="text-accent">pracovní plocha.</span></h2>
            <p>Rychlé výpočty a převody pro každodenní bastlení.</p>
          </div>

          <div class="workbench-status">
            <span class="status-indicator"></span>
            <span>ALL SYSTEMS READY</span>
          </div>
        </div>

        <div class="tools-intro">
          <div>
            <span class="tools-intro-icon">∑</span>
            <div>
              <strong>Výpočty bez hledání tabulek.</strong>
              <p>Vyplň hodnoty, zvol jednotky a nech výpočty na VoltLabu.</p>
            </div>
          </div>
          <span class="mono-label">06 AVAILABLE TOOLS</span>
        </div>

        <div class="calculator-grid">

          <!-- OHM -->
          <article class="calculator-card" id="calculator-ohm">
            <div class="calculator-card-header">
              <div class="calculator-icon">Ω</div>
              <div>
                <span class="calculator-category-label">ELEKTRONIKA / 01</span>
                <h3>Ohmův zákon</h3>
              </div>
              <span class="calculator-live">READY</span>
            </div>

            <p class="calculator-intro">Vypočítej napětí, proud nebo odpor podle Ohmova zákona.</p>

            <div class="calculator-fields">
              <label class="field-group">
                <span>Napětí (U)</span>
                <div class="input-with-unit">
                  <input id="ohm-voltage" type="number" step="any" placeholder="5">
                  <select id="ohm-voltage-unit" aria-label="Jednotka napětí">
                    <option value="1">V</option>
                    <option value="0.001">mV</option>
                    <option value="1000">kV</option>
                  </select>
                </div>
              </label>

              <label class="field-group">
                <span>Proud (I)</span>
                <div class="input-with-unit">
                  <input id="ohm-current" type="number" step="any" placeholder="0.02">
                  <select id="ohm-current-unit" aria-label="Jednotka proudu">
                    <option value="1">A</option>
                    <option value="0.001" selected>mA</option>
                    <option value="0.000001">µA</option>
                  </select>
                </div>
              </label>

              <label class="field-group">
                <span>Odpor (R)</span>
                <div class="input-with-unit">
                  <input id="ohm-resistance" type="number" step="any" placeholder="250">
                  <select id="ohm-resistance-unit" aria-label="Jednotka odporu">
                    <option value="1">Ω</option>
                    <option value="1000">kΩ</option>
                    <option value="1000000">MΩ</option>
                  </select>
                </div>
              </label>
            </div>

            <button class="button button-primary calculator-button" id="ohm-calculate" type="button">
              Vypočítat <span>→</span>
            </button>

            <div class="calculator-result" id="ohm-result" aria-live="polite">
              <span class="result-label">VÝSLEDEK</span>
              <strong>Čekám na hodnoty…</strong>
            </div>

            <div class="calculator-footer">
              <span>U = R × I</span>
              <span>OHM'S LAW</span>
            </div>
          </article>

          <!-- POWER -->
          <article class="calculator-card" id="calculator-power">
            <div class="calculator-card-header">
              <div class="calculator-icon">ϟ</div>
              <div>
                <span class="calculator-category-label">ELEKTRONIKA / 02</span>
                <h3>Elektrický výkon</h3>
              </div>
              <span class="calculator-live">READY</span>
            </div>

            <p class="calculator-intro">Spočítej elektrický výkon, napětí nebo proud.</p>

            <div class="calculator-fields">
              <label class="field-group">
                <span>Co chceš vypočítat?</span>
                <select id="power-target">
                  <option value="power">Výkon (P)</option>
                  <option value="voltage">Napětí (U)</option>
                  <option value="current">Proud (I)</option>
                </select>
              </label>

              <label class="field-group">
                <span>Napětí (U)</span>
                <div class="input-with-unit">
                  <input id="power-voltage" type="number" step="any" placeholder="12">
                  <select id="power-voltage-unit" aria-label="Jednotka napětí">
                    <option value="1">V</option>
                    <option value="0.001">mV</option>
                    <option value="1000">kV</option>
                  </select>
                </div>
              </label>

              <label class="field-group">
                <span>Proud (I)</span>
                <div class="input-with-unit">
                  <input id="power-current" type="number" step="any" placeholder="2">
                  <select id="power-current-unit" aria-label="Jednotka proudu">
                    <option value="1">A</option>
                    <option value="0.001" selected>mA</option>
                    <option value="0.000001">µA</option>
                  </select>
                </div>
              </label>

              <label class="field-group">
                <span>Výkon (P)</span>
                <div class="input-with-unit">
                  <input id="power-watts" type="number" step="any" placeholder="24">
                  <select id="power-watts-unit" aria-label="Jednotka výkonu">
                    <option value="1">W</option>
                    <option value="1000">kW</option>
                    <option value="0.001">mW</option>
                  </select>
                </div>
              </label>
            </div>

            <button class="button button-primary calculator-button" id="power-calculate" type="button">
              Vypočítat <span>→</span>
            </button>

            <div class="calculator-result" id="power-result" aria-live="polite">
              <span class="result-label">VÝSLEDEK</span>
              <strong>Čekám na hodnoty…</strong>
            </div>

            <div class="calculator-footer">
              <span>P = U × I</span>
              <span>POWER</span>
            </div>
          </article>

          <!-- LED -->
          <article class="calculator-card" id="calculator-led">
            <div class="calculator-card-header">
              <div class="calculator-icon">◉</div>
              <div>
                <span class="calculator-category-label">KOMPONENTY / 03</span>
                <h3>LED rezistor</h3>
              </div>
              <span class="calculator-live">READY</span>
            </div>

            <p class="calculator-intro">Najdi vhodný předřadný rezistor pro LED diodu.</p>

            <div class="calculator-fields">
              <label class="field-group">
                <span>Napájecí napětí (V)</span>
                <input id="led-supply" type="number" step="any" placeholder="5">
              </label>

              <label class="field-group">
                <span>Úbytek LED (V)</span>
                <input id="led-forward" type="number" step="any" placeholder="2">
              </label>

              <label class="field-group">
                <span>Požadovaný proud (mA)</span>
                <input id="led-current" type="number" step="any" placeholder="20">
              </label>
            </div>

            <button class="button button-primary calculator-button" id="led-calculate" type="button">
              Navrhnout rezistor <span>→</span>
            </button>

            <div class="calculator-result" id="led-result" aria-live="polite">
              <span class="result-label">DOPORUČENÍ</span>
              <strong>Čekám na hodnoty…</strong>
            </div>

            <div class="calculator-footer">
              <span>R = (U − ULED) / I</span>
              <span>LED DESIGN</span>
            </div>
          </article>

          <!-- CONVERTER -->
          <article class="calculator-card" id="calculator-converter">
            <div class="calculator-card-header">
              <div class="calculator-icon">⇄</div>
              <div>
                <span class="calculator-category-label">PŘEVODY / 04</span>
                <h3>Převodník jednotek</h3>
              </div>
              <span class="calculator-live">READY</span>
            </div>

            <p class="calculator-intro">Rychle převáděj běžné elektrické a technické jednotky.</p>

            <div class="calculator-fields">
              <label class="field-group">
                <span>Typ převodu</span>
                <select id="convert-type">
                  <option value="voltage">Napětí</option>
                  <option value="current">Proud</option>
                  <option value="power">Výkon</option>
                  <option value="resistance">Odpor</option>
                  <option value="capacitance">Kapacita</option>
                  <option value="time">Čas</option>
                  <option value="frequency">Frekvence</option>
                </select>
              </label>

              <label class="field-group">
                <span>Hodnota</span>
                <input id="convert-value" type="number" step="any" placeholder="1000">
              </label>

              <div class="field-row">
                <label class="field-group">
                  <span>Z jednotky</span>
                  <select id="convert-from"></select>
                </label>
                <label class="field-group">
                  <span>Na jednotku</span>
                  <select id="convert-to"></select>
                </label>
              </div>
            </div>

            <button class="button button-primary calculator-button" id="convert-calculate" type="button">
              Převést <span>→</span>
            </button>

            <div class="calculator-result" id="convert-result" aria-live="polite">
              <span class="result-label">VÝSLEDEK</span>
              <strong>Čekám na hodnotu…</strong>
            </div>

            <div class="calculator-footer">
              <span>UNIT CONVERTER</span>
              <span>CONVERSION</span>
            </div>
          </article>

          <!-- RESISTOR NETWORK -->
          <article class="calculator-card" id="calculator-resistor">
            <div class="calculator-card-header">
              <div class="calculator-icon">⌁</div>
              <div>
                <span class="calculator-category-label">OBVODY / 05</span>
                <h3>Síť rezistorů</h3>
              </div>
              <span class="calculator-live">READY</span>
            </div>

            <p class="calculator-intro">Spočítej výsledný odpor sériového nebo paralelního zapojení.</p>

            <div class="calculator-fields">
              <label class="field-group">
                <span>Typ zapojení</span>
                <select id="resistor-mode">
                  <option value="series">Sériové zapojení</option>
                  <option value="parallel">Paralelní zapojení</option>
                </select>
              </label>

              <label class="field-group">
                <span>Hodnoty rezistorů (Ω)</span>
                <textarea id="resistor-values" rows="3"
                  placeholder="Např. 100, 220, 330"></textarea>
                <small class="field-hint">Hodnoty odděl čárkou nebo mezerou. Desetinné čárky odděluj středníkem.</small>
              </label>
            </div>

            <button class="button button-primary calculator-button" id="resistor-calculate" type="button">
              Spočítat odpor <span>→</span>
            </button>

            <div class="calculator-result" id="resistor-result" aria-live="polite">
              <span class="result-label">VÝSLEDEK</span>
              <strong>Čekám na hodnoty…</strong>
            </div>

            <div class="calculator-footer">
              <span>R TOTAL</span>
              <span>RESISTOR NETWORK</span>
            </div>
          </article>

          <!-- CAPACITOR ENERGY -->
          <article class="calculator-card" id="calculator-cap-energy">
            <div class="calculator-card-header">
              <div class="calculator-icon">▱</div>
              <div>
                <span class="calculator-category-label">KOMPONENTY / 06</span>
                <h3>Energie kondenzátoru</h3>
              </div>
              <span class="calculator-live">READY</span>
            </div>

            <p class="calculator-intro">Zjisti energii uloženou v nabitém kondenzátoru.</p>

            <div class="calculator-fields">
              <label class="field-group">
                <span>Kapacita (µF)</span>
                <input id="cap-energy-capacitance" type="number" step="any" placeholder="1000">
              </label>

              <label class="field-group">
                <span>Napětí (V)</span>
                <input id="cap-energy-voltage" type="number" step="any" placeholder="12">
              </label>
            </div>

            <button class="button button-primary calculator-button" id="cap-energy-calculate" type="button">
              Vypočítat energii <span>→</span>
            </button>

            <div class="calculator-result" id="cap-energy-result" aria-live="polite">
              <span class="result-label">ULOŽENÁ ENERGIE</span>
              <strong>Čekám na hodnoty…</strong>
            </div>

            <div class="calculator-footer">
              <span>E = ½ × C × U²</span>
              <span>CAPACITOR</span>
            </div>
          </article>

        </div>

        <div class="tools-disclaimer">
          <span>ⓘ</span>
          <p>
            Výpočty slouží jako pomůcka při návrhu a učení. Před skutečným zapojením
            vždy ověř parametry součástek, jejich tolerance, výkonové limity
            a bezpečnostní požadavky.
          </p>
        </div>
      </div>
    </section>

    <!-- FAVORITES -->
    <section class="section favorites-section" id="favorites">
      <div class="container">

        <div class="section-heading">
          <div>
            <div class="eyebrow">
              <span class="eyebrow-line"></span>
              <span>YOUR PERSONAL SPACE</span>
            </div>
            <h2>Věci, které si chceš <span class="text-accent">nechat.</span></h2>
            <p>Ukládej si zajímavé články a projekty na později.</p>
          </div>

          <span class="favorites-counter" id="favorites-count">0 ULOŽENÝCH</span>
        </div>

        <div class="favorites-panel">
          <div class="favorites-panel-icon">♡</div>
          <div class="favorites-panel-content">
            <h3>Tvoje osobní sbírka</h3>
            <p id="favorites-description">
              Zatím tu nic není. U článků a projektů můžeš kliknout na ikonu srdce
              a uložit si je sem.
            </p>
          </div>
          <div class="favorites-panel-action">
            <button class="button button-secondary" type="button" id="favorites-show-all">
              Prohlédnout uložené <span>→</span>
            </button>
          </div>
        </div>

        <div class="favorites-list content-grid" id="favorites-list"></div>
      </div>
    </section>

    <!-- PERSONAL NOTES -->
    <section class="section notes-section" id="notes">
      <div class="container">
        <div class="notes-layout">

          <div class="notes-intro">
            <div class="eyebrow">
              <span class="eyebrow-line"></span>
              <span>MAKER'S NOTEBOOK</span>
            </div>
            <h2>Myšlenky, které <span class="text-accent">nechceš ztratit.</span></h2>
            <p>
              Rychlé poznámky k projektům, nápady na vylepšení nebo hodnoty,
              které si chceš zapamatovat.
            </p>
            <span class="notes-private-label">✳ Ukládá se lokálně v tomto prohlížeči.</span>
          </div>

          <div class="notes-widget">
            <div class="notes-widget-header">
              <div>
                <span class="notes-widget-dot"></span>
                <strong>MY WORKBENCH NOTES</strong>
              </div>
              <span class="mono-label" id="notes-save-status">READY</span>
            </div>

            <label class="visually-hidden" for="personal-notes">Osobní poznámky</label>
            <textarea id="personal-notes" rows="7"
              placeholder="Nápad: postavit automatické zavlažování pomocí ESP32…"></textarea>

            <div class="notes-widget-footer">
              <span id="notes-character-count">0 znaků</span>
              <div>
                <button class="text-button" id="notes-clear" type="button">Vymazat</button>
                <button class="button button-primary button-small" id="notes-save" type="button">
                  Uložit poznámky
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ABOUT -->
    <section class="section about-section" id="about">
      <div class="container">

        <div class="about-layout">
          <div class="about-visual">
            <div class="about-orbit about-orbit-one"></div>
            <div class="about-orbit about-orbit-two"></div>
            <div class="about-orbit about-orbit-three"></div>

            <div class="about-emblem">
              <svg viewBox="0 0 100 120" fill="none" aria-hidden="true">
                <path d="M59 5L17 66H46L39 115L84 48H55L59 5Z"
                  fill="currentColor"/>
              </svg>
            </div>

            <span class="about-coordinate about-coordinate-one">VL / 004</span>
            <span class="about-coordinate about-coordinate-two">EST. BY CURIOSITY</span>
            <span class="about-dot about-dot-one"></span>
            <span class="about-dot about-dot-two"></span>
          </div>

          <div class="about-content">
            <div class="eyebrow">
              <span class="eyebrow-line"></span>
              <span>THE STORY BEHIND THE LAB</span>
            </div>

            <h2>Technologie jsou nejlepší, když <span class="text-accent">si s nimi hraješ.</span></h2>

            <p>
              VoltLab je digitální prostor pro všechny, které baví objevovat,
              experimentovat a vytvářet vlastní věci. Od jednoduchých obvodů
              přes mikrokontroléry až po komplexnější projekty.
            </p>

            <p>
              Nejde o to vědět všechno. Jde o to nebát se zkoušet,
              dělat chyby a postupně přicházet na to, jak věci fungují.
            </p>

            <div class="about-values">
              <div class="about-value">
                <span>01</span>
                <strong>Zvědavost</strong>
                <small>Ptát se proč.</small>
              </div>
              <div class="about-value">
                <span>02</span>
                <strong>Kreativita</strong>
                <small>Zkoušet nové cesty.</small>
              </div>
              <div class="about-value">
                <span>03</span>
                <strong>Experiment</strong>
                <small>Učit se praxí.</small>
              </div>
            </div>

            <a href="#categories" class="text-link">
              Pojď něco objevit <span>↗</span>
            </a>
          </div>
        </div>

      </div>
    </section>

    <!-- FINAL CTA -->
    <section class="section final-cta-section">
      <div class="container">
        <div class="final-cta">
          <div class="final-cta-decoration" aria-hidden="true">ϟ</div>
          <div class="eyebrow">
            <span class="eyebrow-line"></span>
            <span>YOUR NEXT IDEA STARTS HERE</span>
          </div>
          <h2>Máš nápad? <span class="text-accent">Pojď ho oživit.</span></h2>
          <p>Vyber si projekt, otevři kalkulačku a pusť se do toho.</p>
          <div class="final-cta-actions">
            <a href="#projects" class="button button-primary">Začít tvořit <span>↗</span></a>
            <a href="#tools" class="button button-secondary">Otevřít nástroje</a>
          </div>
        </div>
      </div>
    </section>

  </main>

  <!-- FOOTER -->
  <footer class="site-footer">
    <div class="container">

      <div class="footer-main">
        <div class="footer-brand-column">
          <a href="#home" class="brand footer-brand">
            <span class="brand-symbol" aria-hidden="true">
              <svg viewBox="0 0 48 48" fill="none">
                <path d="M27.5 3L9 26.5H22L19.5 45L39 19.5H26L27.5 3Z"
                  fill="currentColor"/>
              </svg>
            </span>
            <span class="brand-copy">
              <strong>Volt<span>Lab</span></strong>
              <small>YOUR COZY TECH LAB</small>
            </span>
          </a>

          <p>Digitální dílna pro zvědavé hlavy a kreativní ruce.</p>
          <span class="footer-status"><span class="status-indicator"></span> SYSTEM OPERATIONAL</span>
        </div>

        <div class="footer-column">
          <h3>Prozkoumat</h3>
          <a href="#categories">Oblasti</a>
          <a href="#articles">Články</a>
          <a href="#projects">Projekty</a>
          <a href="#tools">Nástroje</a>
        </div>

        <div class="footer-column">
          <h3>Osobní prostor</h3>
          <a href="#favorites">Oblíbené</a>
          <a href="#notes">Poznámky</a>
          <a href="#about">O VoltLabu</a>
          <button type="button" class="footer-link-button" id="footer-search-toggle">
            Vyhledávání
          </button>
        </div>

        <div class="footer-column footer-column-status">
          <h3>Lab status</h3>
          <div class="footer-status-row">
            <span>Verze</span>
            <strong data-site-version>4.0</strong>
          </div>
          <div class="footer-status-row">
            <span>Rozhraní</span>
            <strong>ONLINE</strong>
          </div>
          <div class="footer-status-row">
            <span>Rok</span>
            <strong id="current-year">2026</strong>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <span>© <span id="footer-year">2026</span> VOLTLAB. MADE WITH CURIOSITY.</span>
        <span class="footer-bottom-center">KEEP BUILDING <span>ϟ</span></span>
        <button type="button" class="admin-access" id="admin-access">ADMIN ACCESS ↗</button>
      </div>

    </div>
  </footer>

  <!-- GLOBAL SEARCH -->
  <div class="overlay-layer" id="search-overlay" aria-hidden="true">
    <div class="search-dialog" role="dialog" aria-modal="true" aria-labelledby="global-search-title">
      <div class="search-dialog-header">
        <div>
          <span class="mono-label">VOLTLAB SEARCH ENGINE</span>
          <h2 id="global-search-title">Co hledáš?</h2>
        </div>
        <button class="icon-button" type="button" id="global-search-close" aria-label="Zavřít vyhledávání">✕</button>
      </div>

      <label class="global-search-input">
        <span>⌕</span>
        <input type="search" id="global-search-input" placeholder="Zadej název, téma nebo klíčové slovo..." autocomplete="off">
        <kbd>ESC</kbd>
      </label>

      <div class="global-search-results" id="global-search-results">
        <div class="search-suggestion">
          <span class="search-suggestion-icon">⌘</span>
          <span><strong>Arduino</strong><small>Prozkoumat kategorii</small></span>
          <kbd>↵</kbd>
        </div>
        <div class="search-suggestion">
          <span class="search-suggestion-icon">ϟ</span>
          <span><strong>Ohmův zákon</strong><small>Otevřít kalkulačku</small></span>
          <kbd>↵</kbd>
        </div>
        <div class="search-suggestion">
          <span class="search-suggestion-icon">▤</span>
          <span><strong>Články</strong><small>Procházet znalostní databázi</small></span>
          <kbd>↵</kbd>
        </div>
      </div>

      <div class="search-dialog-footer">
        <span><kbd>ESC</kbd> Zavřít</span>
        <span><kbd>↵</kbd> Otevřít výsledek</span>
      </div>
    </div>
  </div>

  <!-- CONTENT DIALOG -->
  <div class="overlay-layer" id="content-dialog" aria-hidden="true">
    <div class="content-dialog-panel" role="dialog" aria-modal="true"
      aria-labelledby="dialog-title" tabindex="-1">
      <div class="content-dialog-header">
        <span class="mono-label">VOLTLAB CONTENT VIEWER</span>
        <button class="icon-button" id="dialog-close" type="button" aria-label="Zavřít okno">✕</button>
      </div>
      <div id="dialog-content" class="dialog-content"></div>
    </div>
  </div>

  <!-- COMMAND PALETTE -->
  <div class="overlay-layer" id="command-overlay" aria-hidden="true">
    <div class="command-dialog" role="dialog" aria-modal="true" aria-labelledby="command-title">
      <div class="command-search">
        <span>⌘</span>
        <label class="visually-hidden" for="command-input">Vyhledat příkaz</label>
        <input id="command-input" type="text" placeholder="Co chceš udělat?">
        <kbd>ESC</kbd>
      </div>

      <div class="command-content">
        <span class="mono-label" id="command-title">QUICK ACTIONS</span>

        <button type="button" class="command-item" data-command="home">
          <span class="command-item-icon">⌂</span>
          <span><strong>Přejít na domovskou stránku</strong><small>Hlavní obrazovka</small></span>
          <kbd>↵</kbd>
        </button>

        <button type="button" class="command-item" data-command="articles">
          <span class="command-item-icon">▤</span>
          <span><strong>Otevřít články</strong><small>Znalostní databáze</small></span>
          <kbd>↵</kbd>
        </button>

        <button type="button" class="command-item" data-command="projects">
          <span class="command-item-icon">⌘</span>
          <span><strong>Otevřít projekty</strong><small>Maker workshop</small></span>
          <kbd>↵</kbd>
        </button>

        <button type="button" class="command-item" data-command="tools">
          <span class="command-item-icon">∑</span>
          <span><strong>Otevřít kalkulačky</strong><small>Digitální pracovní plocha</small></span>
          <kbd>↵</kbd>
        </button>

        <button type="button" class="command-item" data-command="theme">
          <span class="command-item-icon">◐</span>
          <span><strong>Přepnout vzhled</strong><small>Světlý / tmavý režim</small></span>
          <kbd>↵</kbd>
        </button>

        <button type="button" class="command-item" data-command="favorites">
          <span class="command-item-icon">♡</span>
          <span><strong>Moje oblíbené</strong><small>Uložený obsah</small></span>
          <kbd>↵</kbd>
        </button>
      </div>

      <div class="command-footer">
        <span>VOLT LAB COMMAND CENTER</span>
        <span>POWERED BY CURIOSITY</span>
      </div>
    </div>
  </div>

  <!-- TOASTS -->
  <div class="toast-region" id="toast-region" aria-live="polite" aria-atomic="true"></div>

  <!-- BACK TO TOP -->
  <button class="back-to-top" id="back-to-top" type="button"
    aria-label="Zpět nahoru" title="Zpět nahoru">
    ↑
  </button>

  <!-- KEYBOARD SHORTCUT HINT -->
  <div class="keyboard-hint" id="keyboard-hint">
    <span>Tip:</span> stiskni <kbd>Ctrl</kbd> + <kbd>K</kbd> pro rychlé příkazy
    <button type="button" id="keyboard-hint-close" aria-label="Zavřít tip">×</button>
  </div>

</body>
</html>
```
