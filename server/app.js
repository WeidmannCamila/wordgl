import express from "express";
import morgan from "morgan";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { addRankingEntry, getRanking } from "./db.js";
import { getThaiGlWordBank } from "../js/dictionaries/thaiGlDictionary.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

function loadEnvFile() {
  const envPath = path.join(projectRoot, ".env");
  if (!existsSync(envPath)) {
    return;
  }

  const contents = readFileSync(envPath, "utf8");
  const lines = contents.split(/\r?\n/);

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }

    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex < 0) {
      return;
    }

    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  });
}

loadEnvFile();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(express.json({ limit: "64kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "wordgl-api" });
});

app.get("/api/dictionary", (req, res) => {
  const kindFilter = `${req.query.kind || ""}`.trim();
  const entries = getThaiGlWordBank();

  if (!kindFilter) {
    res.json({ entries });
    return;
  }

  const filtered = entries.filter((entry) => entry.kind === kindFilter);
  res.json({ entries: filtered });
});

app.get("/api/tmdb/tv/search", async (req, res) => {
  const query = `${req.query.query || ""}`.trim();
  const page = Number.parseInt(`${req.query.page || "1"}`, 10);
  const tmdbListId = "8661015-gl";

  if (query.length < 2) {
    res.status(400).json({ error: "query debe tener al menos 2 caracteres" });
    return;
  }

  const apiKey = `${process.env.TMDB_API_KEY || ""}`.trim();
  const readAccessToken =
    `${process.env.TMDB_API_READ_ACCESS_TOKEN || ""}`.trim();

  if (!apiKey && !readAccessToken) {
    res.status(503).json({
      error:
        "TMDB no configurado. Define TMDB_API_KEY o TMDB_API_READ_ACCESS_TOKEN en variables de entorno.",
    });
    return;
  }

  const searchParams = new URLSearchParams({
    language: "es-ES",
    page: Number.isNaN(page) ? "1" : `${Math.max(1, page)}`,
  });

  if (apiKey) {
    searchParams.set("api_key", apiKey);
  }

  const headers = { Accept: "application/json" };
  if (readAccessToken) {
    headers.Authorization = `Bearer ${readAccessToken}`;
  }

  try {
    const tmdbResponse = await fetch(
      `https://api.themoviedb.org/3/list/${tmdbListId}?${searchParams.toString()}`,
      { headers },
    );

    if (!tmdbResponse.ok) {
      const details = await tmdbResponse.text();
      const authHint =
        tmdbResponse.status === 401
          ? " Tu credencial no tiene permisos para /3/list. Configura TMDB_API_READ_ACCESS_TOKEN (Bearer v4) en .env."
          : "";

      res.status(tmdbResponse.status).json({
        error: `TMDB devolvio un error.${authHint}`,
        details,
      });
      return;
    }

    const payload = await tmdbResponse.json();
    const listItems = Array.isArray(payload.items) ? payload.items : [];
    const normalizedQuery = query.toLowerCase();
    const results = listItems.filter((item) => {
      const name = `${item.name || item.title || ""}`.toLowerCase();
      const originalName =
        `${item.original_name || item.original_title || ""}`.toLowerCase();

      return (
        item.media_type === "tv" &&
        (name.includes(normalizedQuery) ||
          originalName.includes(normalizedQuery))
      );
    });

    const mapped = results.map((show) => ({
      id: show.id,
      name: show.name || show.title,
      originalName: show.original_name || show.original_title,
      overview: show.overview,
      firstAirDate: show.first_air_date,
      voteAverage: show.vote_average,
      posterPath: show.poster_path,
      posterUrl: show.poster_path
        ? `https://image.tmdb.org/t/p/w342${show.poster_path}`
        : null,
    }));

    res.json({
      page: payload.page || 1,
      totalPages: payload.total_pages || 1,
      totalResults: mapped.length,
      results: mapped,
    });
  } catch (error) {
    res.status(500).json({
      error: "No se pudo consultar TMDB",
      details: error instanceof Error ? error.message : "Error desconocido",
    });
  }
});

app.get("/api/ranking/:gameId", (req, res) => {
  const gameId = `${req.params.gameId || ""}`.trim();
  if (!gameId) {
    res.status(400).json({ error: "gameId requerido" });
    return;
  }

  const limit = Number.parseInt(`${req.query.limit || "10"}`, 10);
  const entries = getRanking(gameId, Number.isNaN(limit) ? 10 : limit);
  res.json({ entries });
});

app.post("/api/ranking/:gameId", (req, res) => {
  const gameId = `${req.params.gameId || ""}`.trim();
  if (!gameId) {
    res.status(400).json({ error: "gameId requerido" });
    return;
  }

  addRankingEntry(gameId, req.body || {});
  res.status(201).json({ ok: true });
});

app.use(express.static(projectRoot));

app.get("/", (_req, res) => {
  res.sendFile(path.join(projectRoot, "index.html"));
});

app.listen(PORT, () => {
  console.log(`WordGL server escuchando en http://localhost:${PORT}`);
});
