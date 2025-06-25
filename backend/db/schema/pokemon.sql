CREATE TABLE IF NOT EXISTS pokemon (
  pokedex_number INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  height_cm INTEGER,
  weight_kg REAL,
  types TEXT,
  total_base_stats INTEGER,
  generation TEXT
);