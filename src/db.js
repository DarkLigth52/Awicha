// Conexión a SQLite, tablas y usuario inicial
const Database = require('better-sqlite3'), path = require('path'), bcrypt = require('bcryptjs');
const db = new Database(require('./config').dbPath);

db.exec(`
CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, user TEXT UNIQUE, hash TEXT, role TEXT DEFAULT 'admin');
CREATE TABLE IF NOT EXISTS movements(id INTEGER PRIMARY KEY, date TEXT, type TEXT, account TEXT, category TEXT, description TEXT, amount REAL, currency TEXT DEFAULT 'Bs');
CREATE TABLE IF NOT EXISTS debts(id INTEGER PRIMARY KEY, kind TEXT, party TEXT, description TEXT, amount REAL, paid REAL DEFAULT 0, due TEXT);
CREATE TABLE IF NOT EXISTS products(id INTEGER PRIMARY KEY, name TEXT, unit TEXT DEFAULT 'unid', sku TEXT, stock REAL DEFAULT 0, min REAL DEFAULT 0, buy REAL DEFAULT 0, sell REAL DEFAULT 0);
CREATE TABLE IF NOT EXISTS parties(id INTEGER PRIMARY KEY, name TEXT, type TEXT, phone TEXT, email TEXT);
CREATE TABLE IF NOT EXISTS dishes(id INTEGER PRIMARY KEY, name TEXT, category TEXT, price REAL, recipe TEXT DEFAULT '[]');
CREATE TABLE IF NOT EXISTS sales(id INTEGER PRIMARY KEY, date TEXT, dish TEXT, qty REAL, total REAL, cost REAL, account TEXT);
CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY, at TEXT, user TEXT, action TEXT);
CREATE TABLE IF NOT EXISTS settings(k TEXT PRIMARY KEY, v TEXT);`);

// Migración para bases de datos creadas con versiones anteriores
for (const s of ["ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'admin'", "ALTER TABLE movements ADD COLUMN currency TEXT DEFAULT 'Bs'", "ALTER TABLE products ADD COLUMN unit TEXT DEFAULT 'unid'"])
  try { db.exec(s); } catch {}

if (!db.prepare('SELECT 1 FROM users').get())
  db.prepare('INSERT INTO users(user,hash) VALUES(?,?)').run('admin', bcrypt.hashSync('admin123', 10));

module.exports = db;
