const STORAGE_KEY_MODE = "wordgl:mode";
const STORAGE_KEY_SHIP = "wordgl:ship";

const SHIPS = [
  { key: "default", label: "Default", color: "#0f62fe", image: null },
  {
    key: "englot",
    label: "Englot",
    color: "#7c3aed",
    image: "/images/themes/englot.png",
  },
  {
    key: "freenbecky",
    label: "FreenBecky",
    color: "#e11d48",
    image: "/images/themes/freenbecky.jpg",
  },
  {
    key: "lingorm",
    label: "LingOrm",
    color: "#9333ea",
    image: "/images/themes/lingorm.jpg",
  },
  {
    key: "milklove",
    label: "MilkLove",
    color: "#ec4899",
    image: "/images/themes/milklove.jpg",
  },
  {
    key: "viewjune",
    label: "ViewJune",
    color: "#06b6d4",
    image: "/images/themes/viewjune.jpg",
  },
  {
    key: "namtanfilm",
    label: "NamtanFilm",
    color: "#38bdf8",
    image: "/images/themes/namtanfilm.jpg",
  },
  {
    key: "lmsy",
    label: "LMSY",
    color: "#f59e0b",
    image: "/images/themes/lmsy.png",
  },
];

function getSavedMode() {
  return localStorage.getItem(STORAGE_KEY_MODE) || "light";
}

function getSavedShip() {
  return localStorage.getItem(STORAGE_KEY_SHIP) || "default";
}

function applyMode(mode) {
  document.documentElement.dataset.mode = mode;
  localStorage.setItem(STORAGE_KEY_MODE, mode);
}

let themeInterval = null;

const SHIP_INFO = {
  englot: [
    "Protagonizan Show Me Love 👑",
    "Se conocieron en Miss Grand",
    "Estelarizan Petrichor 🌧️",
    "Fandom: Englot",
    "Ambas están en GrandTV",
    "Engfa es cantante y actriz",
    "Charlotte tiene ascendencia británica",
    "Protagonizarán Love Bully",
    "Su primera colaboración actoral fue en 2023",
    "Realizan giras y conciertos masivos"
  ],
  freenbecky: [
    "Protagonistas de GAP The Series 💖",
    "Estelarizan The Loyal Pin 🎀",
    "Uranus 2324 🌌",
    "Freen nació en 1998",
    "Becky estudió leyes",
    "Fandom: FreenBecky",
    "Pertenecen a IdolFactory",
    "Fueron pioneras en grandes GLs en Tailandia",
    "Ambas tienen mascotas famosas",
    "Comparten escenas memorables"
  ],
  lingorm: [
    "Protagonistas de The Secret of Us 👩‍⚕️",
    "Pertenecen a CH3",
    "Only You es su próximo proyecto ✨",
    "Fandom: LingOrm",
    "Orm es hija de la actriz Koy Naruemon",
    "Lingling tiene raíces de Hong Kong",
    "En la serie son Doctora Fahlada y Earn",
    "Tienen un proyecto llamado In Love Forever",
    "Primera pareja GL de CH3",
    "Su popularidad creció rapidísimo"
  ],
  milklove: [
    "Conocidas por 23.5 🌎",
    "Aparecieron en Bad Buddy juntas",
    "Son actrices de GMMTV",
    "Fandom: MilkLove",
    "En 23.5 son Ongsa y Sun",
    "Tienen su propio evento Ditto",
    "Pioneras GL de GMMTV",
    "Participan en Girls Rules",
    "Comparten agencia con otras parejas",
    "Tienen gran química cómica"
  ],
  viewjune: [
    "Aparecen en 23.5 👽",
    "Son parte de GMMTV",
    "Su ship secundario es muy querido",
    "En 23.5 interpretan a Aylin y Luna",
    "View es conocida por The Jungle",
    "June tiene muchos talentos y fans fieles",
    "Fandom suele ser ViewJune",
    "Interactúan muchísimo con fans",
    "Aparecen frecuentemente juntas",
    "También actuaron en otros proyectos juntas"
  ],
  namtanfilm: [
    "Protagonizan Pluto 🪐",
    "Ambas de GMMTV",
    "Actúan en The Girls Rules",
    "Namtan es Tipnaree Weerawatnodom",
    "Film es Rachanun Mahawan",
    "En Pluto hacen de gemelas y enamoradas",
    "Fandom: NamtanFilm",
    "Namtan tiene gran trayectoria actoral",
    "Participan en la serie Her",
    "Tienen una estética visual increíble"
  ],
  lmsy: [
    "Protagonizan Affair 🎬",
    "IdolFactory",
    "Harmony Secret 🎵",
    "Fandom: LMSY",
    "Lookmhee actúa en Hometown Romance",
    "Sonya estudió en Australia",
    "El ship brilla por su gran química",
    "Lookmhee tiene mucha presencia escénica",
    "En Affair tienen escenas muy emotivas",
    "Son de la misma productora que FreenBecky"
  ]
};

let currentShipInfo = [];
let activeCardsCount = 0;
const MAX_CARDS = 5;

function spawnSingleCard(ship) {
  if (activeCardsCount >= MAX_CARDS || currentShipInfo.length === 0) return;
  
  const randomIndex = Math.floor(Math.random() * currentShipInfo.length);
  const fact = currentShipInfo[randomIndex];
  
  const card = document.createElement('div');
  card.className = 'theme-info-card';
  card.innerHTML = `<strong>Dato</strong>${fact}`;
  
  // Posicionamiento aleatorio en los bordes
  const isLeft = Math.random() > 0.5;
  const isTop = Math.random() > 0.5;
  
  if (isLeft) {
    card.style.left = (Math.random() * 15 + 2) + 'vw';
  } else {
    card.style.right = (Math.random() * 15 + 2) + 'vw';
  }
  
  if (isTop) {
    card.style.top = (Math.random() * 30 + 10) + 'vh';
  } else {
    card.style.bottom = (Math.random() * 30 + 10) + 'vh';
  }
  
  card.style.animationDelay = (Math.random() * 2) + 's';
  
  card.addEventListener('click', () => {
    card.remove();
    activeCardsCount--;
    setTimeout(() => spawnSingleCard(ship), 400);
  });
  
  document.body.appendChild(card);
  activeCardsCount++;
}

function applyThemeInfoCards(ship) {
  document.querySelectorAll('.theme-info-card').forEach((el) => el.remove());
  activeCardsCount = 0;
  
  if (ship === 'default' || !SHIP_INFO[ship]) return;
  
  currentShipInfo = [...SHIP_INFO[ship]];
  const numCards = Math.min(MAX_CARDS, currentShipInfo.length);
  
  for (let i = 0; i < numCards; i++) {
    setTimeout(() => spawnSingleCard(ship), i * 300);
  }
}

function applyThemeDecorations(ship) {
  if (themeInterval) {
    clearInterval(themeInterval);
    themeInterval = null;
  }
  document.querySelectorAll('.theme-decoration').forEach((el) => el.remove());

  const shipConfigs = {
    englot: { icon: ['🤍'], interval: 400 },
    freenbecky: { icon: ['✨', '💫'], interval: 350 },
    lingorm: { icon: ['💜'], interval: 400 },
    milklove: { icon: ['💚', '🩷'], interval: 350 },
    namtanfilm: { icon: ['🩵', '💛'], interval: 350 },
    lmsy: { icon: ['🩵', '💛', '✨'], interval: 350 },
    viewjune: { icon: ['🌸', '🦋'], interval: 450 },
  };

  const config = shipConfigs[ship];
  if (config) {
    themeInterval = setInterval(() => {
      const particle = document.createElement('div');
      particle.className = `theme-decoration ${ship}-particle`;
      // Pick random icon from array
      particle.textContent = config.icon[Math.floor(Math.random() * config.icon.length)];
      particle.style.left = Math.random() * 100 + 'vw';
      particle.style.animationDuration = (Math.random() * 3 + 4) + 's';
      particle.style.fontSize = (Math.random() * 12 + 16) + 'px';
      document.body.appendChild(particle);

      setTimeout(() => {
        if (particle.parentNode) particle.remove();
      }, 7000);
    }, config.interval);
  }
}

function applyShip(ship) {
  document.documentElement.dataset.ship = ship;
  document.body.dataset.ship = ship;
  localStorage.setItem(STORAGE_KEY_SHIP, ship);

  const selectedShip = SHIPS.find((entry) => entry.key === ship);
  if (selectedShip?.image) {
    document.documentElement.style.setProperty(
      "--theme-image",
      `url("${selectedShip.image}")`,
    );
  } else {
    document.documentElement.style.setProperty("--theme-image", "none");
  }
  
  applyThemeDecorations(ship);
  applyThemeInfoCards(ship);
}

function buildPanel() {
  const html = `
    <div class="settings-section">
      <p class="settings-section-label">Modo</p>
      <div class="settings-mode-row">
        <button class="settings-mode-btn" data-mode="light" aria-label="Modo claro">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          Claro
        </button>
        <button class="settings-mode-btn" data-mode="dark" aria-label="Modo oscuro">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          Oscuro
        </button>
      </div>
    </div>

    <div class="settings-divider"></div>

    <div class="settings-section">
      <p class="settings-section-label">Tema GL</p>
      <div class="settings-ships-grid">
        ${SHIPS.map(
          (ship) => `
          <button
            class="settings-ship-btn"
            data-ship="${ship.key}"
            aria-label="Tema ${ship.label}"
            title="${ship.label}"
          >
            <span class="settings-ship-dot" style="background:${ship.color}"></span>
            <span class="settings-ship-name">${ship.label}</span>
          </button>
        `,
        ).join("")}
      </div>
    </div>
  `;

  return html;
}

function init() {
  applyMode(getSavedMode());
  applyShip(getSavedShip());

  const btnEl = document.createElement("button");
  btnEl.type = "button";
  btnEl.className = "settings-toggle";
  btnEl.setAttribute("aria-label", "Ajustes");
  btnEl.setAttribute("aria-expanded", "false");
  btnEl.innerHTML = `
    <svg class="settings-icon-gear" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  `;

  const panelEl = document.createElement("div");
  panelEl.className = "settings-panel";
  panelEl.setAttribute("role", "dialog");
  panelEl.setAttribute("aria-label", "Ajustes del sitio");
  panelEl.innerHTML = buildPanel();

  document.body.appendChild(btnEl);
  document.body.appendChild(panelEl);

  function syncActive() {
    const currentMode = getSavedMode();
    const currentShip = getSavedShip();

    panelEl.querySelectorAll(".settings-mode-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.mode === currentMode);
    });

    panelEl.querySelectorAll(".settings-ship-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.ship === currentShip);
    });
  }

  function openPanel() {
    panelEl.classList.add("open");
    btnEl.classList.add("open");
    btnEl.setAttribute("aria-expanded", "true");
    syncActive();
  }

  function closePanel() {
    panelEl.classList.remove("open");
    btnEl.classList.remove("open");
    btnEl.setAttribute("aria-expanded", "false");
  }

  btnEl.addEventListener("click", (event) => {
    event.stopPropagation();
    if (panelEl.classList.contains("open")) {
      closePanel();
    } else {
      openPanel();
    }
  });

  document.addEventListener("click", (event) => {
    if (!panelEl.contains(event.target) && event.target !== btnEl) {
      closePanel();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePanel();
    }
  });

  panelEl.addEventListener("click", (event) => {
    const modeBtn = event.target.closest(".settings-mode-btn[data-mode]");
    if (modeBtn) {
      applyMode(modeBtn.dataset.mode);
      syncActive();
      return;
    }

    const shipBtn = event.target.closest(".settings-ship-btn[data-ship]");
    if (shipBtn) {
      applyShip(shipBtn.dataset.ship);
      syncActive();
    }
  });

  syncActive();
}

init();
