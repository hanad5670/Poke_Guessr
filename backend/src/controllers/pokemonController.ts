import { Request, Response } from "express";
import { query } from "../db";
import { storeDailyPokemon } from "./utils";

// Search pokemon by name:
export const searchPokemonByName = async (
  req: Request,
  res: Response
): Promise<void> => {
  const searchQuery = req.query.q as string;

  if (!searchQuery || searchQuery.length < 1) {
    res.status(400).json({ error: "Query parameter is required" });
    return;
  }

  try {
    const result = await query(
      "SELECT name FROM pokemon WHERE LOWER(name) LIKE $1 LIMIT 10",
      [`%${searchQuery.toLowerCase()}%`]
    );
    console.log(result);
    res.status(200).json(result.rows.map((row) => row.name));
  } catch (err) {
    console.log("Error searching Pokemon:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get a pokemon by their name
export const getPokemonByName = async (
  req: Request,
  res: Response
): Promise<void> => {
  const name = req.params.name as string;

  try {
    const result = await query("SELECT * FROM pokemon WHERE LOWER(name) = $1", [
      name,
    ]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: `No Pokemon with name ${name} was found` });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (err) {
    console.log("Error finding Pokemon:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get the pokemon of the day
export const pokemonOfTheDay = async (
  req: Request,
  res: Response
): Promise<void> => {
  const today = new Date().toISOString().slice(0, 10);

  try {
    // Check daily_pokemon db if the value exists, otherwise we will make it and store it in the db
    const existing = await query(
      "SELECT p.* FROM daily_pokemon dp JOIN pokemon p ON dp.pokemon_id = p.pokedex_number WHERE dp.date = $1",
      [today]
    );

    if (existing.rows.length > 0) {
      console.log("Found the daily pokemon in db");
      res.status(200).json(existing.rows[0]);
      return;
    }

    const hash = [...today].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const countResult = await query("SELECT COUNT(*) FROM pokemon");
    const totalPokemon = parseInt(countResult.rows[0].count, 10);
    console.log(totalPokemon);

    const pokeId = (hash % totalPokemon) + 1;

    const result = await query(
      "SELECT * FROM pokemon WHERE pokedex_number = $1",
      [pokeId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "No Pokemon found for the day" });
    } else {
      await storeDailyPokemon(pokeId, today);
      res.status(200).json(result.rows[0]);
    }
  } catch (err) {
    console.log("Error fetching pokemon", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
