import express from "express";
import morgan from "morgan";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { addRankingEntry, getRanking } from "./db.js";
import { getThaiGlWordBank } from "../js/dictionaries/thaiGlDictionary.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

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
