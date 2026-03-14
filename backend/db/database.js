const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Railway: gắn volume tại /data rồi set DB_PATH=/data/aff.db
// Local:   dùng ./data/aff.db mặc định
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../data/aff.db');
const DATA_DIR = path.dirname(DB_PATH);

let db;

function getDB() {
  if (!db) {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
  }
  return db;
}

function initDB() {
  const db = getDB();
  db.exec(`
    CREATE TABLE IF NOT EXISTS links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      original_url TEXT NOT NULL,
      affiliate_url TEXT NOT NULL,
      short_code TEXT UNIQUE NOT NULL,
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      clicks INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS admin_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT UNIQUE NOT NULL,
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT DEFAULT (datetime('now', 'localtime'))
    );
  `);
  console.log('Database initialized');
}

module.exports = { getDB, initDB };
