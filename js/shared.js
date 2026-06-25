const GAME_LINKS = [
  {
    id: "juego_1",
    label: "Juego 1",
    title: "Adivina la palabra",
    description: "El juego clásico con tablero y 7 intentos.",
  },
  {
    id: "juego_2",
    label: "Juego 2",
    title: "Barra de proximidad",
    description: "Ingresas palabras y ves que tan cerca estás.",
  },
  {
    id: "juego_3",
    label: "Juego 3",
    title: "Ranking de series",
    description: "Busca series en TMDB y arma tu top personal.",
  },
];

export function getGameById(gameId) {
  return GAME_LINKS.find((game) => game.id === gameId) || GAME_LINKS[0];
}

export function getOtherGames(gameId) {
  return GAME_LINKS.filter((game) => game.id !== gameId);
}

export function getGameHref(basePath, gameId) {
  return `${basePath}${gameId}/`;
}

export function renderGameLinks(container, currentGameId, basePath = "./") {
  if (!container) {
    return;
  }

  const otherGames = getOtherGames(currentGameId);
  container.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = "Otros juegos";

  const description = document.createElement("p");
  description.textContent =
    "Cuando terminas, puedes saltar a otro modo de juego.";

  const list = document.createElement("div");
  list.className = "game-links-list";

  otherGames.forEach((game) => {
    const link = document.createElement("a");
    link.className = "game-link";
    link.href = getGameHref(basePath, game.id);
    link.innerHTML = `${game.label}<small>${game.title}</small>`;
    list.appendChild(link);
  });

  container.append(title, description, list);
}
