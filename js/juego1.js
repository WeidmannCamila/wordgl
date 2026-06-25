import { renderGameLinks } from "./shared.js";
import { getDailyThaiGlWord } from "./dictionaries/thaiGlDictionary.js";
import { createLocalRanking } from "./ranking.js";

const boardEl = document.getElementById("board");
const statusTextEl = document.getElementById("statusText");
const attemptTextEl = document.getElementById("attemptText");
const shareBtnEl = document.getElementById("shareBtn");
const surrenderBtnEl = document.getElementById("surrenderBtn");
const hintBtnEl = document.getElementById("hintBtn");
const hintPanelEl = document.getElementById("hintPanel");
const gameLinksEl = document.getElementById("gameLinks");
const helpTextEl = document.querySelector(".help p");
const appEl = document.querySelector(".app");

const basePath = document.body.dataset.basePath || "./";
const todayStr = new Date().toDateString();

let secretEntry = getDailyThaiGlWord({ gameId: "juego_1" });
let secretWord = secretEntry.normalized.toUpperCase();
let currentRow = 0;
let currentCol = 0;
let wordLength = secretWord.length;
let guesses = [Array(wordLength).fill("")];
let results = [Array(wordLength).fill("")];
let gameOver = false;
let won = false;
let hintsUsed = 0;

checkDailyState();

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
if (surrenderBtnEl) surrenderBtnEl.addEventListener("click", surrenderGame);
hintBtnEl.addEventListener("click", giveHint);

function checkDailyState() {
  const savedStr = localStorage.getItem("wordgl:juego_1:daily");
  if (savedStr) {
    const saved = JSON.parse(savedStr);
    if (saved.date === todayStr && saved.finished) {
      gameOver = true;
      won = saved.won;
      currentRow = saved.attempts - 1;
      guesses = saved.guesses || guesses;
      results = saved.results || results;
      
      statusTextEl.textContent = won 
        ? `Ya ganaste hoy. Adivinaste ${secretEntry.label} en ${saved.attempts} intentos.` 
        : `Ya jugaste hoy. La palabra era ${secretEntry.label}.`;
        
      shareBtnEl.disabled = false;
      if (surrenderBtnEl) surrenderBtnEl.disabled = true;
      hintBtnEl.disabled = true;
      gameLinksEl.hidden = false;
      
      if (won) {
        showWinCard();
      }
    }
  }
}

function saveDailyState() {
  localStorage.setItem("wordgl:juego_1:daily", JSON.stringify({
    date: todayStr,
    finished: true,
    won,
    attempts: currentRow + 1,
    guesses,
    results
  }));
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

  for (let row = 0; row <= currentRow; row += 1) {
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
  for (let row = 0; row <= currentRow; row += 1) {
    for (let col = 0; col < wordLength; col += 1) {
      const tile = document.getElementById(`tile-${row}-${col}`);
      if (!tile) continue;
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

  attemptTextEl.textContent = `Intento ${currentRow + 1}`;
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
    return;
  }
  
  if (key === "ARROWLEFT") {
    if (currentCol > 0) {
      currentCol -= 1;
      paintBoard();
    }
    return;
  }
  
  if (key === "ARROWRIGHT") {
    if (currentCol < wordLength - 1) {
      currentCol += 1;
      paintBoard();
    }
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
    if (surrenderBtnEl) surrenderBtnEl.disabled = true;
    gameLinksEl.hidden = false;
    saveDailyState();
    showWinCard();
    return;
  }

  statusTextEl.textContent = `Tu palabra tiene ${exactCount} caracteres en posicion correcta.`;

  currentRow += 1;
  currentCol = 0;
  
  guesses.push(Array(wordLength).fill(""));
  results.push(Array(wordLength).fill(""));

  if (!gameOver) {
    buildBoard();
    paintBoard();
    window.scrollTo(0, document.body.scrollHeight);
  }
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
    // 500 base points minus 10 per attempt over 1, plus word length bonus
    score = Math.max(10, 500 - (currentRow * 10)) + wordLength * 5;
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

function getShareText() {
  const usedAttempts = currentRow + (won && !gameOver ? 1 : (gameOver && won && currentRow < guesses.length && guesses[currentRow].join("") === secretWord ? 1 : 0));
  // Si ya es gameOver y ganó, `currentRow` se queda en el último intento, o en el siguiente?
  // `currentRow` es el índice del array (0 basado), el num de intentos es `currentRow + 1`.
  const realAttempts = won ? currentRow + 1 : currentRow;
  const emojiRows = results
    .slice(0, realAttempts)
    .map((row) => row.map(toEmoji).join(""))
    .join("\n");
  return `WordGL (Clásico) - ${realAttempts} intentos\nPalabra: ${secretEntry.label}\nPuntaje: ${buildGame1Score()}\n${emojiRows}\n\nJuega tú también en: ${window.location.origin}${window.location.pathname}`;
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
    url = `https://t.me/share/url?url=${encodeURIComponent(window.location.origin + window.location.pathname)}&text=${encodeURIComponent(`WordGL (Clásico) - Palabra: ${secretEntry.label}\nPuntaje: ${buildGame1Score()}\n`)}`;
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
    } catch (error) {
    }
  }
  copyResult();
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

let winTimerInterval;

function showWinCard() {
  const overlay = document.getElementById("winOverlay");
  if (!overlay) return;

  const epoch = new Date("2024-01-01T00:00:00").getTime();
  const now = new Date().getTime();
  const diffDays = Math.floor((now - epoch) / (1000 * 60 * 60 * 24));
  document.getElementById("winDayNumber").textContent = `#${diffDays}`;

  const miniBoard = document.getElementById("winMiniBoard");
  miniBoard.innerHTML = "";
  miniBoard.style.gridTemplateColumns = `repeat(${wordLength}, 1fr)`;
  
  const realAttempts = won ? currentRow + 1 : currentRow;
  for (let r = 0; r < realAttempts; r++) {
    for (let c = 0; c < wordLength; c++) {
      const state = results[r][c];
      const block = document.createElement("div");
      block.className = `win-mini-block ${state || 'absent'}`;
      miniBoard.appendChild(block);
    }
  }

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

