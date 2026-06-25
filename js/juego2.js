import { renderGameLinks } from "./shared.js";
import {
  findThaiGlWordByNormalized,
  getDailyThaiGlWord,
  getThaiGlWordBank,
} from "./dictionaries/thaiGlDictionary.js";
import { createLocalRanking } from "./ranking.js";

const statusTextEl = document.getElementById("statusText");
const attemptTextEl = document.getElementById("attemptText");
const shareBtnEl = document.getElementById("shareBtn");
const surrenderBtnEl = document.getElementById("surrenderBtn");
const submitBtnEl = document.getElementById("submitBtn");
const guessInputEl = document.getElementById("guessInput");
const feedbackListEl = document.getElementById("feedbackList");
const gameLinksEl = document.getElementById("gameLinks");
const hintBtnEl = document.getElementById("hintBtn");
const hintPanelEl = document.getElementById("hintPanel");
const helpTextEl = document.querySelector("#help p");

const basePath = document.body.dataset.basePath || "./";
const todayStr = new Date().toDateString();

let secretEntry = getDailyThaiGlWord({ gameId: "juego_2" });
let attempts = [];
let gameOver = false;
let won = false;
let hintsUsed = 0;

document.title = "WordGL - Juego por Conexiones";
helpTextEl.innerHTML =
  "<strong>Reglas:</strong> Encuentra la palabra secreta. La barra se llenará dependiendo de las series, actrices o ships que tengan en común tu intento y el objetivo.";

renderGameLinks(gameLinksEl, "juego_2", basePath);
gameLinksEl.hidden = true;
checkDailyState();
paintStatus();

const ranking = createLocalRanking({
  appRoot: document.querySelector(".app"),
  gameId: "juego_2",
  storageKey: "wordgl:juego_2:ranking",
  title: "Ranking Local - Juego 2",
  description:
    "Sin cuenta: guarda tu nombre y puntaje al terminar. Se almacena solo en este navegador.",
  isGameOver: () => gameOver,
  getCurrentResult: () => ({
    score: buildGame2Score(),
    detail: won
      ? `${secretEntry.label} en ${attempts.length} intentos`
      : `Max ${getBestAffinityScore()}% (${secretEntry.label})`,
    won,
  }),
  formatDetail: (entry) => entry.detail,
});

guessInputEl.addEventListener("keydown", onInputKeyDown);
submitBtnEl.addEventListener("click", submitGuess);
shareBtnEl.addEventListener("click", shareResult);
if (surrenderBtnEl) surrenderBtnEl.addEventListener("click", surrenderGame);
hintBtnEl.addEventListener("click", giveHint);

guessInputEl.focus();

function checkDailyState() {
  const savedStr = localStorage.getItem("wordgl:juego_2:daily");
  if (savedStr) {
    const saved = JSON.parse(savedStr);
    if (saved.date === todayStr && saved.finished) {
      gameOver = true;
      won = saved.won;
      attempts = saved.attempts || attempts;
      
      statusTextEl.textContent = won 
        ? `Ya ganaste hoy. Encontraste ${secretEntry.label} en ${attempts.length} intentos.` 
        : `Ya jugaste hoy. La palabra era ${secretEntry.label}.`;
        
      shareBtnEl.disabled = false;
      if (surrenderBtnEl) surrenderBtnEl.disabled = true;
      hintBtnEl.disabled = true;
      gameLinksEl.hidden = false;
      renderAttempts();
      
      if (won) {
        showWinCard();
      }
    }
  }
}

function saveDailyState() {
  localStorage.setItem("wordgl:juego_2:daily", JSON.stringify({
    date: todayStr,
    finished: true,
    won,
    attempts
  }));
}

function onInputKeyDown(event) {
  if (event.key === "Enter") {
    submitGuess();
  }
}

function submitGuess() {
  if (gameOver) return;

  const rawGuess = guessInputEl.value.trim();

  if (!rawGuess) {
    statusTextEl.textContent = "Escribe una palabra para probarla.";
    return;
  }

  const matchingEntry = findThaiGlWordByNormalized(rawGuess);

  // En los juegos semánticos, el jugador SÍ O SÍ debe poner una palabra que exista en el diccionario.
  if (!matchingEntry) {
    statusTextEl.textContent =
      "La palabra no está en nuestro diccionario de GLs.";
    return;
  }

  const guess = matchingEntry.normalized.toUpperCase();
  const allEntries = getThaiGlWordBank();

  // Usamos el nuevo algoritmo semántico
  const score = getSemanticSimilarityScore(
    secretEntry,
    matchingEntry,
    allEntries,
  );

  attempts.push({
    guess,
    score,
    label: matchingEntry.label,
  });
  renderAttempts();

  if (matchingEntry.key === secretEntry.key) {
    won = true;
    gameOver = true;
    statusTextEl.textContent = `¡Correcto! La palabra era ${matchingEntry.label}.`;
    shareBtnEl.disabled = false;
    if (surrenderBtnEl) surrenderBtnEl.disabled = true;
    gameLinksEl.hidden = false;
    paintStatus();
    saveDailyState();
    showWinCard();
    return;
  }

  statusTextEl.textContent = `Tu palabra está ${score}% cerca en universo compartido.`;

  guessInputEl.value = "";
  guessInputEl.focus();
  paintStatus();
}

function surrenderGame() {
  if (gameOver) return;
  gameOver = true;
  won = false;
  statusTextEl.textContent = `Te rendiste. La palabra era ${secretEntry.label}.`;
  shareBtnEl.disabled = true;
  if (surrenderBtnEl) surrenderBtnEl.disabled = true;
  gameLinksEl.hidden = false;
  saveDailyState();
}

function renderAttempts() {
  feedbackListEl.innerHTML = "";

  const sortedAttempts = [...attempts]
    .map((attempt, index) => ({ ...attempt, index }))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.index - right.index;
    });

  sortedAttempts.forEach((attempt) => {
    const item = document.createElement("article");
    item.className = "feedback-item";

    const header = document.createElement("div");
    header.className = "feedback-item-header";

    const word = document.createElement("span");
    word.className = "feedback-word";
    word.textContent = attempt.label;

    const chip = document.createElement("span");
    chip.className = "score-chip";
    chip.textContent = `${attempt.score}%`;

    header.append(word, chip);

    const bar = document.createElement("div");
    bar.className = "score-bar";

    const fill = document.createElement("div");
    fill.className = "score-bar-fill";
    fill.style.width = `${attempt.score}%`;
    fill.style.filter = `hue-rotate(${attempt.score * 1.1}deg)`;
    bar.appendChild(fill);

    const meta = document.createElement("div");
    meta.className = "score-bar-meta";

    const label = document.createElement("span");
    label.textContent = "Afinidad de universo";

    const detail = document.createElement("span");
    detail.textContent =
      attempt.score >= 80
        ? "Muy cerca"
        : attempt.score >= 40
          ? "Cerca"
          : attempt.score >= 15
            ? "Misma órbita"
            : "Lejos";

    meta.append(label, detail);
    item.append(header, bar, meta);
    feedbackListEl.appendChild(item);
  });
}

function paintStatus() {
  attemptTextEl.textContent = `Intento ${attempts.length + 1}`;
  if (!gameOver) {
    shareBtnEl.disabled = true;
  }
}

function getBestAffinityScore() {
  return attempts.reduce((best, attempt) => Math.max(best, attempt.score), 0);
}

function buildGame2Score() {
  const bestScore = getBestAffinityScore();
  let baseScore = bestScore;
  if (won) {
    baseScore = 500 - (attempts.length * 10) + bestScore;
  }
  return Math.max(0, baseScore - (hintsUsed * 15));
}

function giveHint() {
  if (gameOver || hintsUsed >= 2) return;
  
  hintsUsed += 1;
  hintPanelEl.hidden = false;
  
  if (hintsUsed === 1) {
    let type = secretEntry.kind;
    if (type === "persona") type = "Actriz/Persona";
    else if (type === "ship") type = "Ship / Pareja";
    else if (type === "serie") type = "Serie / Película";
    else if (type === "productora") type = "Agencia / Productora";
    
    hintPanelEl.innerHTML = `<strong>Pista 1:</strong> Es de tipo <em>${type}</em>.`;
  } else if (hintsUsed === 2) {
    let rel = secretEntry.relations && secretEntry.relations.length > 0 
      ? secretEntry.relations[Math.floor(Math.random() * secretEntry.relations.length)]
      : "algo secreto";
      
    hintPanelEl.innerHTML += `<br><strong>Pista 2:</strong> Está conectada con <em>${rel}</em>.`;
    hintBtnEl.disabled = true;
  }
}

// 🧠 EL NUEVO MOTOR: Cálculo de similitud por relaciones e intersección (Jaccard Index)
function getSemanticSimilarityScore(secret, guess, allEntries) {
  if (secret.key === guess.key) return 100;

  // Función interna que "expande" las relaciones (conexiones directas y de 2do grado)
  function getExpandedRelations(entry) {
    let expanded = new Map();

    // 1. Conexiones Directas (Ej: Freen pertenece a GAP). Tienen peso fuerte: 1.0
    expanded.set(entry.key, 1.0);
    if (entry.relations) {
      entry.relations.forEach((r) => expanded.set(r, 1.0));
    }

    // 2. Misma categoría (Bonus pequeño por ser ambas personas o ambas series: peso 0.2)
    if (entry.kind) {
      expanded.set(`kind:${entry.kind}`, 0.2);
    }

    // 3. Conexiones Indirectas / 2do grado (Ej: ShowMeLove -> Engfa -> 4 Elements -> Freen)
    // Tienen un peso débil: 0.2
    if (entry.relations) {
      entry.relations.forEach((r) => {
        const relatedEntry = allEntries.find((e) => e.key === r);
        if (relatedEntry && relatedEntry.relations) {
          relatedEntry.relations.forEach((indirect) => {
            if (!expanded.has(indirect)) {
              expanded.set(indirect, 0.2);
            }
          });
        }
      });
    }
    return expanded;
  }

  const secretSet = getExpandedRelations(secret);
  const guessSet = getExpandedRelations(guess);

  let intersectionScore = 0;
  let unionScore = 0;

  // Juntamos todos los elementos relacionados de ambas palabras
  const allKeys = new Set([...secretSet.keys(), ...guessSet.keys()]);

  // Vemos cuántos coinciden entre las dos redes de datos
  allKeys.forEach((key) => {
    const val1 = secretSet.get(key) || 0;
    const val2 = guessSet.get(key) || 0;
    intersectionScore += Math.min(val1, val2);
    unionScore += Math.max(val1, val2);
  });

  if (unionScore === 0) return 0;

  // Calculamos el % de coincidencia (capeado a 95% máximo si no es la palabra exacta)
  let score = Math.round((intersectionScore / unionScore) * 100);
  return Math.min(95, score);
}

// [El código de shareResult y resetGame se mantiene casi igual, solo actualizando variables si hace falta]

function getShareText() {
  const lastAttempt = attempts[attempts.length - 1];
  return `WordGL (Semántico) - ${attempts.length} intentos\nPalabra: ${secretEntry.label}\nPuntaje: ${buildGame2Score()}\nCercanía máxima: ${getBestAffinityScore()}%\n\nJuega tú también en: ${window.location.origin}${window.location.pathname}`;
}

async function copyResult() {
  const message = getShareText();
  try {
    await navigator.clipboard.writeText(message);
    statusTextEl.textContent = "Resultado copiado al portapapeles.";
  } catch {
    statusTextEl.textContent = "No se pudo copiar el resultado.";
  }
}

function shareToPlatform(platform) {
  const message = getShareText();
  const encodedMessage = encodeURIComponent(message);
  let url = '';

  if (platform === 'x') {
    url = `https://twitter.com/intent/tweet?text=${encodedMessage}`;
  } else if (platform === 'whatsapp') {
    url = `https://wa.me/?text=${encodedMessage}`;
  } else if (platform === 'telegram') {
    url = `https://t.me/share/url?url=${encodeURIComponent(window.location.origin + window.location.pathname)}&text=${encodeURIComponent(`WordGL (Semántico) - Palabra: ${secretEntry.label}\nPuntaje: ${buildGame2Score()}\n`)}`;
  }

  if (url) {
    window.open(url, '_blank');
  }
}

async function shareResult() {
  if (!won) return;
  const message = getShareText();

  if (navigator.share) {
    try {
      await navigator.share({ text: message });
      statusTextEl.textContent = "Resultado compartido.";
      return;
    } catch {}
  }
  copyResult();
}

let winTimerInterval;

function showWinCard() {
  const overlay = document.getElementById("winOverlay");
  if (!overlay) return;

  const epoch = new Date("2024-01-01T00:00:00").getTime();
  const now = new Date().getTime();
  const diffDays = Math.floor((now - epoch) / (1000 * 60 * 60 * 24));
  document.getElementById("winDayNumber").textContent = `#${diffDays}`;

  // En juego 2 ocultamos el mini tablero porque no tiene sentido de cuadrícula
  const miniBoard = document.getElementById("winMiniBoard");
  if (miniBoard) miniBoard.style.display = "none";

  const closeBtn = document.getElementById("closeWinCardBtn");
  if (closeBtn) {
    closeBtn.onclick = () => {
      overlay.hidden = true;
      if (winTimerInterval) clearInterval(winTimerInterval);
    };
  }

  const shareMain = document.getElementById("winShareMainBtn");
  if (shareMain) shareMain.onclick = shareResult;
  
  const shareCopyTop = document.getElementById("winShareCopyTop");
  if (shareCopyTop) shareCopyTop.onclick = copyResult;

  const shareX = document.getElementById("winShareX");
  if (shareX) shareX.onclick = () => shareToPlatform('x');

  const shareWa = document.getElementById("winShareWa");
  if (shareWa) shareWa.onclick = () => shareToPlatform('whatsapp');

  const shareTg = document.getElementById("winShareTg");
  if (shareTg) shareTg.onclick = () => shareToPlatform('telegram');

  const shareCopy = document.getElementById("winShareCopy");
  if (shareCopy) shareCopy.onclick = copyResult;

  overlay.hidden = false;
  startWinTimer();
}

function startWinTimer() {
  const timerEl = document.getElementById("winTimer");
  if (!timerEl) return;
  if (winTimerInterval) clearInterval(winTimerInterval);

  function update() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setHours(24, 0, 0, 0);
    const diff = tomorrow - now;
    
    if (diff <= 0) {
      timerEl.textContent = "00:00:00";
      clearInterval(winTimerInterval);
      return;
    }
    
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24).toString().padStart(2, "0");
    const m = Math.floor((diff / 1000 / 60) % 60).toString().padStart(2, "0");
    const s = Math.floor((diff / 1000) % 60).toString().padStart(2, "0");
    
    timerEl.textContent = `${h}:${m}:${s}`;
  }

  update();
  winTimerInterval = setInterval(update, 1000);
}

