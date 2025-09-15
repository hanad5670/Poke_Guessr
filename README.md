# Pokémon Guessing Game

This project is a Pokémon guessing game with a React frontend (Vite) and a Node/Python backend using PostgreSQL. The backend includes scripts to fetch Pokémon data, seed the database, and generate Pokémon images with silhouettes.

---

## Table of Contents

- [Project Setup](#project-setup)
- [Frontend Setup](#frontend-setup)
- [Backend Setup](#backend-setup)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Backend](#running-the-backend)
- [Running the Frontend](#running-the-frontend)

---

## Project Setup

Clone the repository:

```bash
git clone https://github.com/your-username/your-project.git
cd your-project
```

## Frontend Setup

Install the frontend dependencies:

```bash
cd frontend
npm install
```

Copy the frontend .env:

```bash
cp .env.example .env # Unix/macOS
copy .env.example .env # Windows
```

Start the frontend development server:

```bash
npm run dev
```

By default, this runs http://localhost:5173

## Backend Setup

Install Python dependcies to run the scripts:

```bash
pip install -r requirements.txt
```

Copy the example .env file:

```bash
cp .env.example .env # Unix/macOS
copy .env.example .env # Windows
```

## Environment Variables

Edit .env with your local PostgreSQL config:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/pokemon_db
POKEMON_BASE_URL=https://pokeapi.co/api/v2/
POKEMON_LIMIT=1025
```

## Database Setup

- Make sure PostgreSQL is installed and running locally
- Create a database for the project

```sql
CREATE DATABASE pokemon_db;
```

Run the `backend/data/setup_db.sh` shell script that will use the Python scripts to populate the database:

```bash
cd backend/data
chmod +x setup_db.sh
./setup_db.sh
```

Alternatively, you can run each python script in order:

```bash
python3 fetch_pokemon.py
python3 seed_pokemon.py
python3 pokemon_images.py
python3 daily_pokemon.py
```

- `fetch_pokemon.py` gets the pokemon info from PokeAPI (https://pokeapi.co/) and organizes it into a csv
- `seed_pokemon.py` takes the organized pokemon data and populates a pokemon table in the database
- `pokemon_images.py` pulls pokemon sprites from PokeAPI, creates silhouettes from them, then stores sprites and silhouettes in the database
- `daily_pokemon.py` Creates the daily_pokemon table to store each pokemon of the day`

## Running the Backend

Start your backend server:

```bash
npm run dev
```

- Make sure the backend reads DATABASE_URL from .env
- Backend default port: http://localhost:5000

# Running the Frontend

```bash
cd frontend
npm run dev
```

- The frontend should now communicate with the backend at http://localhost:5000 by default
- Update VITE_API_BASE_URL in fronted/.env if your backend port is different
