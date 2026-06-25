import { renderGameLinks } from "./shared.js";
import { getRandomThaiGlWord } from "./dictionaries/thaiGlDictionary.js";
import { createLocalRanking } from "./ranking.js";

const MAX_ATTEMPTS = 7;

const boardEl = document.getElementById("board");
const statusTextEl = document.getElementById("statusText");
const attemptTextEl = document.getElementById("attemptText");
const shareBtnEl = document.getElementById("shareBtn");
const newGameBtnEl = document.getElementById("newGameBtn");
const hintBtnEl = document.getElementById("hintBtn");
const hintPanelEl = document.getElementById("hintPanel");
const gameLinksEl = document.getElementById("gameLinks");
const helpTextEl = document.querySelector(".help p");
const appEl = document.querySelector(".app");

const basePath = document.body.dataset.basePath || "./";

let secretEntry = pickSecretEntry();
let secretWord = secretEntry.normalized.toUpperCase();
let currentRow = 0;
let currentCol = 0;
let wordLength = secretWord.length;
let guesses = emptyGrid(MAX_ATTEMPTS, wordLength);
let results = emptyGrid(MAX_ATTEMPTS, wordLength);
let gameOver = false;
let won = false;
let hintsUsed = 0;

document.title = "WordGL - Juego 1";
helpTextEl.innerHTML = `<strong>Reglas:</strong> Verde = letra correcta y bien ubicada, Amarillo = letra correcta en otra posicion, Gris = letra no esta. La palabra actual tiene ${wordLength} caracteres.`;

updateBoardLayout();
buildBoard();
paintBoard();
renderGameLinks(gameLinksEl, "juego_1", basePath);
gameLinksEl.hidden = true;

const ranking = createLocalRanking({
  appRoot: document.querySelector(".app"),
  gameId: "juego_1",
  storageKey: "wordgl:juego_1:ranking",
  title: "Ranking Local - Juego 1",
  description:
    "No hace falta cuenta. Al terminar, escribe tu nombre (opcional) y guarda tu puntaje.",
  isGameOver: () => gameOver,
  getCurrentResult: () => ({
    score: buildGame1Score(),
    detail: won
      ? `${secretEntry.label} en ${currentRow + 1} intentos`
      : `No adivino ${secretEntry.label}`,
    won,
  }),
  formatDetail: (entry) => entry.detail,
});

window.addEventListener("keydown", onKeyDown);
shareBtnEl.addEventListener("click", shareResult);
newGameBtnEl.addEventListener("click", resetGame);
hintBtnEl.addEventListener("click", giveHint);

function pickSecretEntry() {
  return getRandomThaiGlWord({ minLength: 3 });
}

function emptyGrid(rows, cols) {
  return Array.from({ length: rows }, () => Array(cols).fill(""));
}

function updateBoardLayout() {
  appEl.classList.add("dynamic-board");
  appEl.style.setProperty("--board-columns", `${wordLength}`);
}

function buildBoard() {
  boardEl.innerHTML = "";

  for (let row = 0; row < MAX_ATTEMPTS; row += 1) {
    const rowEl = document.createElement("div");
    rowEl.className = "row";

    for (let col = 0; col < wordLength; col += 1) {
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.id = `tile-${row}-${col}`;
      
      tile.addEventListener("click", () => {
        if (!gameOver && row === currentRow) {
          currentCol = col;
          paintBoard();
        }
      });
      
      rowEl.appendChild(tile);
    }

    boardEl.appendChild(rowEl);
  }
}

function paintBoard() {
  for (let row = 0; row < MAX_ATTEMPTS; row += 1) {
    for (let col = 0; col < wordLength; col += 1) {
      const tile = document.getElementById(`tile-${row}-${col}`);
      const letter = guesses[row][col];
      const state = results[row][col];

      tile.textContent = letter;
      tile.classList.remove("active", "correct", "present", "absent");

      if (!gameOver && row === currentRow && col === currentCol) {
        tile.classList.add("active");
      }

      if (state) {
        tile.classList.add(state);
      }
    }
  }

  attemptTextEl.textContent = `Intento ${Math.min(currentRow + 1, MAX_ATTEMPTS)} de ${MAX_ATTEMPTS}`;
}

function onKeyDown(event) {
  if (gameOver) {
    return;
  }

  const key = event.key.toUpperCase();

  if (key === "BACKSPACE") {
    removeLetter();
    paintBoard();
    return;
  }

  if (key === "ENTER") {
    submitGuess();
    paintBoard();
    return;
  }

  if (/^[A-Z0-9]$/.test(key) && currentCol < wordLength) {
    guesses[currentRow][currentCol] = key;
    
    let nextCol = currentCol + 1;
    while (nextCol < wordLength && guesses[currentRow][nextCol] !== "") {
      nextCol++;
    }
    if (nextCol === wordLength) {
       nextCol = guesses[currentRow].findIndex(val => val === "");
       if (nextCol === -1) nextCol = wordLength;
    }
    currentCol = nextCol;
    paintBoard();
  }
}

function removeLetter() {
  if (currentCol === wordLength) {
    currentCol -= 1;
    guesses[currentRow][currentCol] = "";
    return;
  }
  
  if (guesses[currentRow][currentCol] !== "") {
    guesses[currentRow][currentCol] = "";
    return;
  }

  if (currentCol > 0) {
    currentCol -= 1;
    guesses[currentRow][currentCol] = "";
  }
}

function submitGuess() {
  if (currentCol < wordLength) {
    statusTextEl.textContent = `Completa los ${wordLength} caracteres antes de enviar.`;
    return;
  }

  const guess = guesses[currentRow].join("");
  const { states, exactCount } = evaluateGuess(guess);
  results[currentRow] = states;

  if (guess === secretWord) {
    gameOver = true;
    won = true;
    statusTextEl.textContent = `Correcto. Adivinaste ${secretEntry.label} en ${currentRow + 1} intentos.`;
    shareBtnEl.disabled = false;
    gameLinksEl.hidden = false;
    return;
  }

  statusTextEl.textContent = `Tu palabra tiene ${exactCount} caracteres en posicion correcta.`;

  currentRow += 1;
  currentCol = 0;

  if (currentRow >= MAX_ATTEMPTS) {
    gameOver = true;
    statusTextEl.textContent = `Sin intentos. La palabra era ${secretEntry.label}.`;
    shareBtnEl.disabled = true;
    gameLinksEl.hidden = false;
  }
}

function evaluateGuess(guess) {
  const states = Array(wordLength).fill("absent");
  const counts = {};

  for (const letter of secretWord) {
    counts[letter] = (counts[letter] || 0) + 1;
  }

  let exactCount = 0;

  for (let i = 0; i < wordLength; i += 1) {
    if (guess[i] === secretWord[i]) {
      states[i] = "correct";
      counts[guess[i]] -= 1;
      exactCount += 1;
    }
  }

  for (let i = 0; i < wordLength; i += 1) {
    if (states[i] === "correct") {
      continue;
    }

    const letter = guess[i];
    if (counts[letter] > 0) {
      states[i] = "present";
      counts[letter] -= 1;
    }
  }

  return { states, exactCount };
}

function buildGame1Score() {
  let score = 0;
  if (won) {
    score = (MAX_ATTEMPTS - currentRow) * 100 + wordLength * 5;
  } else {
    const bestExact = results.reduce((best, row) => {
      const exact = row.filter((state) => state === "correct").length;
      return Math.max(best, exact);
    }, 0);
    score = bestExact * 10;
  }
  
  return Math.max(0, score - (hintsUsed * 15));
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
    
    hintPanelEl.innerHTML = `<strong>Pista 1:</strong> La palabra es de tipo <em>${type}</em>.`;
  } else if (hintsUsed === 2) {
    let rel = secretEntry.relations && secretEntry.relations.length > 0 
      ? secretEntry.relations[Math.floor(Math.random() * secretEntry.relations.length)]
      : "algo secreto";
      
    hintPanelEl.innerHTML += `<br><strong>Pista 2:</strong> Está relacionada con <em>${rel}</em>.`;
    hintBtnEl.disabled = true;
  }
}

async function shareResult() {
  if (!won) {
    return;
  }

  const usedAttempts = currentRow + 1;
  const emojiRows = results
    .slice(0, usedAttempts)
    .map((row) => row.map(toEmoji).join(""))
    .join("\n");

  const message = `WordGL ${usedAttempts}/${MAX_ATTEMPTS}\n${emojiRows}`;

  if (navigator.share) {
    try {
      await navigator.share({ text: message });
      statusTextEl.textContent = "Resultado compartido.";
      return;
    } catch (error) {
      // Si el usuario cancela, seguimos con copiar al portapapeles.
    }
  }

  try {
    await navigator.clipboard.writeText(message);
    statusTextEl.textContent = "Resultado copiado al portapapeles.";
  } catch {
    statusTextEl.textContent = "No se pudo compartir ni copiar el resultado.";
  }
}

function toEmoji(state) {
  if (state === "correct") {
    return "🟩";
  }

  if (state === "present") {
    return "🟨";
  }

  return "⬜";
}

function resetGame() {
  secretEntry = pickSecretEntry();
  secretWord = secretEntry.normalized.toUpperCase();
  wordLength = secretWord.length;
  currentRow = 0;
  currentCol = 0;
  guesses = emptyGrid(MAX_ATTEMPTS, wordLength);
  results = emptyGrid(MAX_ATTEMPTS, wordLength);
  gameOver = false;
  won = false;
  hintsUsed = 0;

  shareBtnEl.disabled = true;
  hintBtnEl.disabled = false;
  hintPanelEl.hidden = true;
  hintPanelEl.innerHTML = "";
  gameLinksEl.hidden = true;
  helpTextEl.innerHTML = `<strong>Reglas:</strong> Verde = letra correcta y bien ubicada, Amarillo = letra correcta en otra posicion, Gris = letra no esta. La palabra actual tiene ${wordLength} caracteres.`;
  statusTextEl.textContent = "Escribe tu palabra y presiona Enter.";
  attemptTextEl.textContent = `Intento 1 de ${MAX_ATTEMPTS}`;

  updateBoardLayout();
  buildBoard();
  paintBoard();
  ranking.markRoundStart();
}
