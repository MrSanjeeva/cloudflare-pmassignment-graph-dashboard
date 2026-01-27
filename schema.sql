DROP TABLE IF EXISTS nodes;
CREATE TABLE nodes (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  label TEXT NOT NULL,
  x REAL NOT NULL,
  y REAL NOT NULL,
  metadata TEXT
);

DROP TABLE IF EXISTS edges;
CREATE TABLE edges (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,
  target TEXT NOT NULL,
  type TEXT
);

DROP TABLE IF EXISTS tickets;
CREATE TABLE tickets (
  id TEXT PRIMARY KEY,
  node_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'open',
  ai_suggestions TEXT,
  created_at INTEGER
);
