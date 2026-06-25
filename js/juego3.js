import { renderGameLinks } from "./shared.js";

const STORAGE_KEY = "wordgl:juego_3:series_ranking";

const statusTextEl = document.getElementById("statusText");
const attemptTextEl = document.getElementById("attemptText");
const searchFormEl = document.getElementById("searchForm");
const searchInputEl = document.getElementById("searchInput");
const searchBtnEl = document.getElementById("searchBtn");
const resultsGridEl = document.getElementById("resultsGrid");
const rankingListEl = document.getElementById("rankingList");
const clearBtnEl = document.getElementById("clearBtn");
const gameLinksEl = document.getElementById("gameLinks");

const basePath = document.body.dataset.basePath || "./";

let searchResults = [];
let ranking = loadRanking();

renderGameLinks(gameLinksEl, "juego_3", basePath);
renderResults();
renderRanking();
searchInputEl.focus();

searchFormEl.addEventListener("submit", onSearchSubmit);
clearBtnEl.addEventListener("click", onClearRanking);

async function onSearchSubmit(event) {
  event.preventDefault();

  const query = searchInputEl.value.trim();
  if (query.length < 2) {
    statusTextEl.textContent = "Escribe al menos 2 caracteres para buscar.";
    return;
  }

  setSearching(true);
  statusTextEl.textContent = `Buscando \"${query}\" en TMDB...`;

  try {
    const response = await fetch(
      `/api/tmdb/tv/search?query=${encodeURIComponent(query)}`,
    );
    const payload = await parseApiResponse(response);

    if (!response.ok) {
      throw new Error(payload.error || "No se pudo buscar en TMDB");
    }

    searchResults = Array.isArray(payload.results) ? payload.results : [];

    if (searchResults.length === 0) {
      statusTextEl.textContent = "No se encontraron series para esa busqueda.";
    } else {
      statusTextEl.textContent = `Se encontraron ${searchResults.length} series.`;
    }
  } catch (error) {
    statusTextEl.textContent =
      error instanceof Error
        ? error.message
        : "Ocurrio un error buscando series.";
    searchResults = [];
  } finally {
    setSearching(false);
    renderResults();
  }
}

async function parseApiResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  const snippet = text.slice(0, 120).replace(/\s+/g, " ").trim();
  return {
    error:
      "La API de TMDB no respondio JSON. Reinicia el servidor y revisa TMDB_API_KEY.",
    details: snippet,
  };
}

function setSearching(isSearching) {
  searchBtnEl.disabled = isSearching;
  searchBtnEl.textContent = isSearching ? "Buscando..." : "Buscar";
}

function renderResults() {
  resultsGridEl.innerHTML = "";

  if (searchResults.length === 0) {
    resultsGridEl.innerHTML =
      '<p class="tmdb-empty">Todavia no hay resultados. Usa el buscador.</p>';
    return;
  }

  searchResults.forEach((series) => {
    const card = document.createElement("article");
    card.className = "tmdb-card";

    const poster = document.createElement("div");
    poster.className = "tmdb-poster-wrap";

    if (series.posterUrl) {
      const img = document.createElement("img");
      img.className = "tmdb-poster";
      img.src = series.posterUrl;
      img.alt = `Poster de ${series.name}`;
      img.loading = "lazy";
      poster.appendChild(img);
    } else {
      const fallback = document.createElement("div");
      fallback.className = "tmdb-poster-fallback";
      fallback.textContent = "Sin imagen";
      poster.appendChild(fallback);
    }

    const body = document.createElement("div");
    body.className = "tmdb-card-body";

    const title = document.createElement("h3");
    title.textContent = series.name || "Serie sin nombre";

    const meta = document.createElement("p");
    meta.className = "tmdb-meta";
    const year = series.firstAirDate ? series.firstAirDate.slice(0, 4) : "-";
    const rating =
      typeof series.voteAverage === "number" && series.voteAverage > 0
        ? series.voteAverage.toFixed(1)
        : "-";
    meta.textContent = `Ano: ${year} | TMDB: ${rating}`;

    const actions = document.createElement("div");
    actions.className = "tmdb-card-actions";

    const positionInput = document.createElement("input");
    positionInput.type = "number";
    positionInput.min = "1";
    positionInput.max = `${ranking.length + 1}`;
    positionInput.value = `${ranking.length + 1}`;
    positionInput.className = "tmdb-position-input";
    positionInput.setAttribute("aria-label", `Puesto para ${series.name}`);

    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "share-btn";
    addBtn.textContent = "Agregar";
    addBtn.addEventListener("click", () => {
      const desiredPosition = Number.parseInt(positionInput.value, 10);
      addSeriesToRanking(series, desiredPosition);
    });

    actions.append(positionInput, addBtn);

    body.append(title, meta, actions);
    card.append(poster, body);
    resultsGridEl.appendChild(card);
  });
}

function addSeriesToRanking(series, desiredPosition) {
  const alreadyIndex = ranking.findIndex((entry) => entry.id === series.id);
  if (alreadyIndex >= 0) {
    ranking.splice(alreadyIndex, 1);
  }

  const item = {
    id: series.id,
    name: series.name,
    firstAirDate: series.firstAirDate,
    voteAverage: series.voteAverage,
    posterUrl: series.posterUrl,
  };

  const clampedPosition = clampPosition(desiredPosition, ranking.length + 1);
  ranking.splice(clampedPosition - 1, 0, item);

  saveRanking();
  renderRanking();
  renderResults();

  statusTextEl.textContent = `${series.name} agregado en el puesto #${clampedPosition}.`;
}

function renderRanking() {
  rankingListEl.innerHTML = "";

  if (ranking.length === 0) {
    rankingListEl.innerHTML =
      '<p class="tmdb-empty">Tu ranking esta vacio por ahora.</p>';
    attemptTextEl.textContent = "Tu lista tiene 0 series.";
    return;
  }

  ranking.forEach((entry, index) => {
    const position = index + 1;

    const row = document.createElement("article");
    row.className = "ranking-series-item";

    const positionBadge = document.createElement("span");
    positionBadge.className = "ranking-position-badge";
    positionBadge.textContent = `#${position}`;

    const poster = document.createElement("div");
    poster.className = "ranking-thumb-wrap";
    if (entry.posterUrl) {
      const img = document.createElement("img");
      img.className = "ranking-thumb";
      img.src = entry.posterUrl;
      img.alt = `Poster de ${entry.name}`;
      img.loading = "lazy";
      poster.appendChild(img);
    } else {
      const fallback = document.createElement("div");
      fallback.className = "ranking-thumb-fallback";
      fallback.textContent = "N/A";
      poster.appendChild(fallback);
    }

    const info = document.createElement("div");
    info.className = "ranking-series-info";

    const name = document.createElement("h3");
    name.textContent = entry.name;

    const meta = document.createElement("p");
    const year = entry.firstAirDate ? entry.firstAirDate.slice(0, 4) : "-";
    const rating =
      typeof entry.voteAverage === "number" && entry.voteAverage > 0
        ? entry.voteAverage.toFixed(1)
        : "-";
    meta.textContent = `Ano: ${year} | TMDB: ${rating}`;

    info.append(name, meta);

    const controls = document.createElement("div");
    controls.className = "ranking-series-controls";

    const moveInput = document.createElement("input");
    moveInput.type = "number";
    moveInput.min = "1";
    moveInput.max = `${ranking.length}`;
    moveInput.value = `${position}`;
    moveInput.className = "tmdb-position-input";
    moveInput.setAttribute("aria-label", `Mover ${entry.name} al puesto`);

    const moveBtn = document.createElement("button");
    moveBtn.type = "button";
    moveBtn.className = "new-btn";
    moveBtn.textContent = "Mover";
    moveBtn.addEventListener("click", () => {
      moveSeries(entry.id, Number.parseInt(moveInput.value, 10));
    });

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "new-btn";
    removeBtn.textContent = "Quitar";
    removeBtn.addEventListener("click", () => {
      ranking = ranking.filter((item) => item.id !== entry.id);
      saveRanking();
      renderRanking();
      renderResults();
      statusTextEl.textContent = `${entry.name} se quito del ranking.`;
    });

    controls.append(moveInput, moveBtn, removeBtn);

    row.append(positionBadge, poster, info, controls);
    rankingListEl.appendChild(row);
  });

  attemptTextEl.textContent = `Tu lista tiene ${ranking.length} series.`;
}

function moveSeries(seriesId, desiredPosition) {
  const currentIndex = ranking.findIndex((entry) => entry.id === seriesId);
  if (currentIndex < 0) {
    return;
  }

  const [item] = ranking.splice(currentIndex, 1);
  const target = clampPosition(desiredPosition, ranking.length + 1);
  ranking.splice(target - 1, 0, item);

  saveRanking();
  renderRanking();
  renderResults();
  statusTextEl.textContent = `${item.name} movida al puesto #${target}.`;
}

function onClearRanking() {
  if (ranking.length === 0) {
    statusTextEl.textContent = "Tu ranking ya estaba vacio.";
    return;
  }

  const confirmed = window.confirm(
    "Se va a borrar tu ranking completo de series. Quieres continuar?",
  );

  if (!confirmed) {
    return;
  }

  ranking = [];
  saveRanking();
  renderRanking();
  renderResults();
  statusTextEl.textContent = "Ranking reiniciado.";
}

function loadRanking() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((entry) => typeof entry?.id === "number");
  } catch {
    return [];
  }
}

function saveRanking() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ranking));
}

function clampPosition(position, max) {
  if (Number.isNaN(position)) {
    return max;
  }

  return Math.min(Math.max(position, 1), max);
}
