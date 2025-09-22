#!/bin/bash
set -e  # Stop immediately if any command exits with a non-zero status

echo "Starting database setup..."
if [-z "$DATABASE_URL" ]; then
    echo "DATABASE_URL not found"
    exit 1
fi

echo "Starting Pokémon setup scripts..."

# 1. Fetch Pokémon CSV
echo "Running fetch_pokemon.py..."
python -B fetch_pokemon.py

# 2. Seed Pokémon into database
echo "Running seed_pokemon.py..."
python -B seed_pokemon.py

# 3. Fetch Pokémon images and create silhouettes
echo "Running pokemon_images.py..."
python -B pokemon_images.py

# 4. Create daily_pokemon table if it doesn't already exist
echo "Running daily_pokemon.py..."
python -B daily_pokemon.py

echo "All scripts executed successfully!"
