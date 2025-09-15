#!/bin/bash
set -e  # Stop immediately if any command exits with a non-zero status

echo "Starting Pokémon setup scripts..."

# 1. Fetch Pokémon CSV
echo "Running fetch_pokemon.py..."
python3 -B fetch_pokemon.py

# 2. Seed Pokémon into database
echo "Running seed_pokemon.py..."
python3 -B seed_pokemon.py

# 3. Fetch Pokémon images and create silhouettes
echo "Running pokemon_images.py..."
python3 -B pokemon_images.py

# 4. Create daily_pokemon table if it doesn't already exist
echo "Running daily_pokemon.py..."
python3 -B daily_pokemon.py

echo "All scripts executed successfully!"
