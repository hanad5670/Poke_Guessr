import { Request, Response } from "express";
import { query } from "../db";
import { getTodaysPokemon } from "./utils";
import { GAME_CONFIG } from "../config/gameConfig";

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
      "SELECT name FROM pokemon WHERE LOWER(name) LIKE $1 ORDER BY LOWER(name) LIKE LOWER($1) || '%' DESC, name ASC LIMIT 10",
      [`%${searchQuery.toLowerCase()}%`]
    );
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

// Get silhouette of today's daily pokemon
export const getSilhouette = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Check daily_pokemon db if the value exists, otherwise we will make it and store it in the db

    const dailyPokemonId = await getTodaysPokemon();
    console.log("Daily Pokemon Number", dailyPokemonId);

    const result = await query(
      "SELECT silhouette FROM pokemon WHERE pokedex_number = $1",
      [dailyPokemonId]
    );

    if (result.rows.length < 0) {
      res.status(404).json({ error: "No Pokemon found for the day" });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (err) {
    console.log("Error fetching pokemon", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMaxGuesses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("getting max");
    res.status(200).json({ maxGuesses: GAME_CONFIG.MAX_GUESSES });
  } catch (err) {
    console.log("Error getting guess number", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// TODO: FIX LOGIC FOR GETTING DAILY POKEMON TO SEPERATE FROM GETTING SILHOUETTE
export const handlePokemonGuess = async (
  req: Request,
  res: Response
): Promise<void> => {
  const guess = req.body.guess.toLowerCase();

  try {
    // First get the guessed pokemon from db
    const guessResults = await query(
      "SELECT * FROM pokemon WHERE LOWER(name) = $1",
      [guess]
    );

    if (guessResults.rows.length < 0) {
      res.status(404).json({ error: `Pokemon of name ${guess} was not found` });
    }

    console.log(guessResults);
    const guessedPokemon = guessResults.rows[0];

    // Now get the pokemon of the day to commpare with
    const dailyPokemonId = await getTodaysPokemon();

    const result = await query(
      "SELECT * FROM pokemon WHERE pokedex_number = $1",
      [dailyPokemonId]
    );

    if (result.rows.length < 0) {
      res.status(404).json({ error: "No Pokemon of the day found" });
    } else {
      const dailyPokemon = result.rows[0];
      console.log("Guessed Pokemon:", guessedPokemon);
    }
  } catch (err) {
    console.log("Error comparing guessed pokemon:", err);
  }
};
