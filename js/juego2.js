import { renderGameLinks } from "./shared.js";
import {
  findThaiGlWordByNormalized,
  getRandomThaiGlWord,
  getThaiGlWordBank, // Necesitamos exportar la lista entera para calcular las redes
} from "./dictionaries/thaiGlDictionary.js";
import { createLocalRanking } from "./ranking.js";

const MAX_ATTEMPTS = 7; // Puedes subirlo si quieres, ya que al ser por relaciones puede llevar más intentos.

const statusTextEl = document.getElementById("statusText");
const attemptTextEl = document.getElementById("attemptText");
const shareBtnEl = document.getElementById("shareBtn");
const newGameBtnEl = document.getElementById("newGameBtn");
const submitBtnEl = document.getElementById("submitBtn");
const guessInputEl = document.getElementById("guessInput");
const feedbackListEl = document.getElementById("feedbackList");
const gameLinksEl = document.getElementById("gameLinks");
const helpTextEl = document.querySelector("#help p");

const basePath = document.body.dataset.basePath || "./";

// Ahora secretEntry guarda el objeto completo, no solo la palabra
let secretEntry = pickSecretWord();
let attempts = [];
let gameOver = false;
let won = false;

document.title = "WordGL - Juego por Conexiones";
helpTextEl.innerHTML =
  "<strong>Reglas:</strong> Encuentra la palabra secreta. La barra se llenará dependiendo de las series, actrices o ships que tengan en común tu intento y el objetivo.";

renderGameLinks(gameLinksEl, "juego_2", basePath);
gameLinksEl.hidden = true;
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
newGameBtnEl.addEventListener("click", resetGame);

guessInputEl.focus();

function pickSecretWord() {
  return getRandomThaiGlWord({ minLength: 3 });
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
    gameLinksEl.hidden = false;
    paintStatus();
    return;
  }

  if (attempts.length >= MAX_ATTEMPTS) {
    gameOver = true;
    statusTextEl.textContent = `Sin intentos. La palabra era ${secretEntry.label}.`;
    gameLinksEl.hidden = false;
  } else {
    statusTextEl.textContent = `Tu palabra está ${score}% cerca en universo compartido.`;
  }

  guessInputEl.value = "";
  guessInputEl.focus();
  paintStatus();
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
  attemptTextEl.textContent = `Intento ${Math.min(attempts.length + 1, MAX_ATTEMPTS)} de ${MAX_ATTEMPTS}`;
  if (!gameOver) {
    shareBtnEl.disabled = true;
  }
}

function getBestAffinityScore() {
  return attempts.reduce((best, attempt) => Math.max(best, attempt.score), 0);
}

function buildGame2Score() {
  const bestScore = getBestAffinityScore();
  if (won) {
    return 200 + (MAX_ATTEMPTS - attempts.length) * 20 + bestScore;
  }

  return bestScore;
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

async function shareResult() {
  if (!won) return;
  const lastAttempt = attempts[attempts.length - 1];
  const message = `WordGL (Semántico) ${attempts.length}/${MAX_ATTEMPTS}\n${lastAttempt.label} -> ${lastAttempt.score}%`;

  if (navigator.share) {
    try {
      await navigator.share({ text: message });
      statusTextEl.textContent = "Resultado compartido.";
      return;
    } catch {}
  }
  try {
    await navigator.clipboard.writeText(message);
    statusTextEl.textContent = "Resultado copiado al portapapeles.";
  } catch {
    statusTextEl.textContent = "No se pudo compartir.";
  }
}

function resetGame() {
  secretEntry = pickSecretWord();
  attempts = [];
  gameOver = false;
  won = false;

  guessInputEl.value = "";
  shareBtnEl.disabled = true;
  gameLinksEl.hidden = true;
  feedbackListEl.innerHTML = "";
  statusTextEl.textContent = "Escribe una palabra y presiona Enter.";
  paintStatus();
  guessInputEl.focus();
  ranking.markRoundStart();
}
