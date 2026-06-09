import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const dataDir = path.resolve(process.cwd(), "server", "data");
const dbPath = path.join(dataDir, "wordgl.db");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS ranking_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id TEXT NOT NULL,
    player_name TEXT NOT NULL,
    score INTEGER NOT NULL,
    detail TEXT NOT NULL,
    won INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_ranking_game ON ranking_entries (game_id);
  CREATE INDEX IF NOT EXISTS idx_ranking_score ON ranking_entries (game_id, score DESC, id ASC);
`);

const selectRankingStmt = db.prepare(`
  SELECT player_name AS name, score, detail, won, created_at AS createdAt
  FROM ranking_entries
  WHERE game_id = ?
  ORDER BY score DESC, id ASC
  LIMIT ?
`);

const insertRankingStmt = db.prepare(`
  INSERT INTO ranking_entries (game_id, player_name, score, detail, won)
  VALUES (?, ?, ?, ?, ?)
`);

export function getRanking(gameId, limit = 10) {
  const safeLimit = Number.isFinite(limit)
    ? Math.min(Math.max(limit, 1), 50)
    : 10;
  return selectRankingStmt.all(gameId, safeLimit);
}

export function addRankingEntry(gameId, payload) {
  const name = `${payload?.name || "Anonimo"}`.trim().slice(0, 22) || "Anonimo";
  const score = Number.isFinite(payload?.score)
    ? Math.max(0, Math.round(payload.score))
    : 0;
  const detail =
    `${payload?.detail || "Sin detalle"}`.trim().slice(0, 160) || "Sin detalle";
  const won = payload?.won ? 1 : 0;

  insertRankingStmt.run(gameId, name, score, detail, won);
}
