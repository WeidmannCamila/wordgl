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

    "Engfa tiene un talento oculto impresionante para leer la fortuna a través de las cartas del Tarot.",
    "Charlotte es de ascendencia tailandesa y británica, lo que le da sus rasgos característicos y su fluidez con el idioma inglés.",
    "El icónico beso en la mejilla que Engfa le dio a Charlotte durante los ensayos de Miss Grand Tailandia 2022 fue el momento exacto en que el 'ship' explotó en las redes sociales.",
    "A Engfa le aterrorizan los insectos, especialmente las cucarachas, y Charlotte suele ser la que mantiene la calma en esas situaciones.",
    "El apodo cariñoso que los fans usan para Engfa es 'Daddy', debido a su aura protectora, madura y coqueta.",
    "Charlotte ha confesado en varias ocasiones que su comida favorita absoluta es el salmón, especialmente en sashimi.",
    "Antes de entrar al mundo de los certámenes de belleza, Engfa era una reconocida cantante de Likay (teatro tradicional tailandés) y música folclórica desde que era muy joven.",
    "El fandom tiene un chiste interno muy famoso sobre los 'celos' de Engfa cada vez que Charlotte interactúa de manera muy cercana con otras compañeras de Miss Grand.",
    "Charlotte estudió la carrera de Gestión Hotelera y de Turismo antes de que su vida diera un giro radical hacia el entretenimiento.",
    "A pesar de sus agendas increíblemente llenas, ambas comparten una fuerte adicción a hacer transmisiones en vivo (Live streams) a altas horas de la madrugada para interactuar de forma casual con sus fans.",
    "Engfa tiene una risa súper contagiosa y ruidosa que sus fans aman imitar, la cual suele desatar las risas de Charlotte en plena entrevista.",
    "Charlotte es una gran fanática de la música K-Pop y en varias ocasiones se le ha visto recreando coreografías virales en sus redes sociales.",
    "Durante las grabaciones de 'Show Me Love', el director reveló que muchas de las escenas de flirteo y miradas intensas entre ellas no estaban en el guion, sino que surgieron de la química natural del EngLot.",
    "Engfa ha mencionado que si no fuera artista, le habría encantado dedicarse profesionalmente al diseño de modas o a algo relacionado con la estética.",
    "El peluche favorito de Charlotte (un tiburón de IKEA) se volvió un objeto de culto entre el fandom después de que Engfa bromeara con él en un stream.",
    "A ambas les encanta viajar a la playa, y los fans siempre colapsan las redes cuando suben fotos sutilmente combinadas o en el mismo spot frente al mar."
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
    "El impacto de LMSY en 'Affair' fue masivo; lograron transmitir a la perfección la angustia, la tensión y el amor profundo de dos amigas de la infancia (Pleng y Wan Jai) que terminan cruzando la línea.",
    "Sonya Saranphat tiene raíces tailandesas y danesas, lo que le otorga esa belleza tan única y característica que hipnotiza a la cámara en cada primer plano.",
    "Lookmhee Punyapat destaca muchísimo por su carisma natural y esa vibra 'cool' y protectora, la cual contrasta a la perfección con la elegancia magnética de Sonya.",
    "A pesar del intenso drama y las lágrimas que nos hacen derramar en sus series, los detrás de escena de proyectos como 'Harmony Secrets' y 'Hometown Romance' demuestran que en la vida real son súper juguetonas y no paran de reír juntas.",
    "Los fans suelen bromear con que Lookmhee tiene una 'mirada letal' súper expresiva que solo activa cuando está compartiendo escena con Sonya.",
    "Una de las cosas que más valora el fandom es la confianza absoluta que se tienen; ambas han mencionado cómo se cuidan y se dan apoyo moral antes de grabar las escenas más emocionales o íntimas.",
    "Su versatilidad actoral es increíble: pueden pasar de la vibra cálida y nostálgica de un romance de pueblo natal a la intensidad de un amor prohibido o un secreto profundo sin perder ni un gramo de química."
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
