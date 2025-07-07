CREATE TABLE IF NOT EXISTS daily_pokemon (
    date DATE PRIMARY KEY,
    pokemon_id INTEGER NOT NULL REFERENCES pokemon(pokedex_number)
)
