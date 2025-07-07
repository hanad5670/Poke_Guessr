import { query } from "../db";

export const storeDailyPokemon = async (pokeid: number, day: string) => {
  const result = await query(
    "INSERT INTO daily_pokemon (date, pokemon_id) VALUES ($1, $2)",
    [day, pokeid]
  );
  console.log("Stored new pokemon in the daily db");
};
