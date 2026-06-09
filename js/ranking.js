const DEFAULT_MAX_ENTRIES = 10;
const API_BASE = window.WORDGL_API_BASE || "";

function normalizeName(value) {
  const cleaned = `${value || ""}`.trim().replace(/\s+/g, " ");
  return cleaned.slice(0, 22);
}

function safeParseRanking(rawValue) {
  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadRanking(storageKey) {
  return safeParseRanking(localStorage.getItem(storageKey));
}

function saveRanking(storageKey, entries) {
  localStorage.setItem(storageKey, JSON.stringify(entries));
}

function sortRanking(entries) {
  return [...entries].sort((left, right) => {
    if (right.score !== left.score) {
      return right.score - left.score;
    }

    return left.createdAt - right.createdAt;
  });
}

async function fetchRemoteRanking(gameId, maxEntries) {
  const response = await fetch(
    `${API_BASE}/api/ranking/${encodeURIComponent(gameId)}?limit=${maxEntries}`,
    {
      method: "GET",
      headers: { Accept: "application/json" },
    },
  );

  if (!response.ok) {
    throw new Error("No se pudo leer ranking remoto");
  }

  const data = await response.json();
  return Array.isArray(data.entries) ? data.entries : [];
}

async function postRemoteRanking(gameId, entry) {
  const response = await fetch(
    `${API_BASE}/api/ranking/${encodeURIComponent(gameId)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(entry),
    },
  );

  if (!response.ok) {
    throw new Error("No se pudo guardar ranking remoto");
  }
}

export function createLocalRanking(options) {
  const {
    appRoot,
    storageKey,
    gameId,
    title,
    description,
    maxEntries = DEFAULT_MAX_ENTRIES,
    isGameOver,
    getCurrentResult,
    formatDetail,
  } = options;

  const sectionEl = document.createElement("section");
  sectionEl.className = "ranking-panel";

  const titleEl = document.createElement("h2");
  titleEl.textContent = title;

  const descriptionEl = document.createElement("p");
  descriptionEl.className = "ranking-description";
  descriptionEl.textContent = description;

  const controlsEl = document.createElement("div");
  controlsEl.className = "ranking-controls";

  const nameInputEl = document.createElement("input");
  nameInputEl.className = "ranking-input";
  nameInputEl.type = "text";
  nameInputEl.maxLength = 22;
  nameInputEl.placeholder = "Tu nombre (opcional)";

  const saveButtonEl = document.createElement("button");
  saveButtonEl.type = "button";
  saveButtonEl.className = "new-btn";
  saveButtonEl.textContent = "Guardar puntaje";

  controlsEl.append(nameInputEl, saveButtonEl);

  const messageEl = document.createElement("p");
  messageEl.className = "ranking-message";

  const listEl = document.createElement("ol");
  listEl.className = "ranking-list";

  sectionEl.append(titleEl, descriptionEl, controlsEl, messageEl, listEl);

  const helpSection = appRoot.querySelector(".help");
  if (helpSection) {
    appRoot.insertBefore(sectionEl, helpSection);
  } else {
    appRoot.appendChild(sectionEl);
  }

  let alreadySavedThisRound = false;
  let usingRemote = false;

  function setMessage(text) {
    messageEl.textContent = text;
  }

  function paintEntries(entries) {
    listEl.innerHTML = "";

    if (entries.length === 0) {
      const emptyEl = document.createElement("li");
      emptyEl.className = "ranking-item ranking-item-empty";
      emptyEl.textContent = "Todavia no hay puntajes guardados.";
      listEl.appendChild(emptyEl);
      return;
    }

    entries.forEach((entry, index) => {
      const itemEl = document.createElement("li");
      itemEl.className = "ranking-item";

      const rankEl = document.createElement("strong");
      rankEl.textContent = `#${index + 1}`;

      const nameEl = document.createElement("span");
      nameEl.className = "ranking-name";
      nameEl.textContent = entry.name;

      const scoreEl = document.createElement("span");
      scoreEl.className = "ranking-score";
      scoreEl.textContent = `${entry.score} pts`;

      const detailEl = document.createElement("small");
      detailEl.className = "ranking-detail";
      detailEl.textContent = formatDetail(entry);

      itemEl.append(rankEl, nameEl, scoreEl, detailEl);
      listEl.appendChild(itemEl);
    });
  }

  async function render() {
    let entries = [];

    if (gameId) {
      try {
        entries = sortRanking(
          await fetchRemoteRanking(gameId, maxEntries),
        ).slice(0, maxEntries);
        usingRemote = true;
      } catch {
        usingRemote = false;
      }
    }

    if (!usingRemote) {
      entries = sortRanking(loadRanking(storageKey)).slice(0, maxEntries);
    }

    paintEntries(entries);
  }

  async function handleSave() {
    if (!isGameOver()) {
      setMessage("Termina la partida antes de guardar puntaje.");
      return;
    }

    if (alreadySavedThisRound) {
      setMessage("Este puntaje ya fue guardado en esta partida.");
      return;
    }

    const result = getCurrentResult();
    if (!result) {
      setMessage("No hay resultado disponible para guardar.");
      return;
    }

    const name = normalizeName(nameInputEl.value) || "Anonimo";

    const newEntry = {
      name,
      score: Number(result.score) || 0,
      detail: result.detail,
      won: Boolean(result.won),
      createdAt: Date.now(),
    };

    if (gameId) {
      try {
        await postRemoteRanking(gameId, newEntry);
        usingRemote = true;
      } catch {
        usingRemote = false;
      }
    }

    if (!usingRemote) {
      const currentEntries = loadRanking(storageKey);
      const nextEntries = sortRanking([...currentEntries, newEntry]).slice(
        0,
        maxEntries,
      );
      saveRanking(storageKey, nextEntries);
      setMessage("Servidor no disponible. Guardado solo en este navegador.");
    } else {
      setMessage("Puntaje guardado en ranking del servidor.");
    }

    alreadySavedThisRound = true;
    await render();
  }

  saveButtonEl.addEventListener("click", () => {
    handleSave();
  });

  render();

  return {
    markRoundStart() {
      alreadySavedThisRound = false;
      setMessage("");
    },
    render,
  };
}
