import { CLOSE_VALUES, GuessRound, Pokemon } from "../config/gameConfig";
import { query } from "../db";

export const storeDailyPokemon = async (
  pokeid: number,
  day: string
): Promise<void> => {
  const result = await query(
    "INSERT INTO daily_pokemon (date, pokemon_id) VALUES ($1, $2)",
    [day, pokeid]
  );
};

export const getDailyPokemon = async (day: string): Promise<number> => {
  const dailyPokemon = await query(
    "SELECT p.pokedex_number FROM daily_pokemon dp JOIN pokemon p ON dp.pokemon_id = p.pokedex_number WHERE dp.date = $1",
    [day]
  );

  if (dailyPokemon.rows.length > 0) {
    // The daily is already stored in the db:
    return dailyPokemon.rows[0].pokedex_number;
  }

  // Create new hash and add pokemon to db if nothing came from first search:
  const newDailyPokemon = await addNewDailyPokemon(day);
  return newDailyPokemon;
};

export const addNewDailyPokemon = async (day: string): Promise<number> => {
  const hash = [...day].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const countResult = await query("SELECT COUNT(*) FROM pokemon");
  const totalPokemon = parseInt(countResult.rows[0].count, 10);

  const pokeId = (hash % totalPokemon) + 1;

  storeDailyPokemon(pokeId, day);

  return pokeId;
};

// This function gets the daily pokemon for today's date:
export const getTodaysPokemon = async (): Promise<number> => {
  const todaysPokemon = await getDailyPokemon(
    new Date().toISOString().slice(0, 10)
  );
  return todaysPokemon;
};

// HELPER FUNCTIONS FOR COMPARING POKEMON

export const compareGuessedPokemon = (
  guessedPokemon: Pokemon,
  targetPokemon: Pokemon
): GuessRound => {
  if (guessedPokemon.name === targetPokemon.name) {
    return { pokemon: guessedPokemon, guessHint: { name: "correct" } };
  }

  const guessHint: GuessRound["guessHint"] = {};

  (Object.keys(targetPokemon) as (keyof Pokemon)[]).forEach((key) => {
    const t = targetPokemon[key];
    const g = guessedPokemon[key];

    switch (key) {
      case "name":
        guessHint[key] = t === g ? "correct" : "wrong";

      case "height":
        const targetHeight = t as number;
        const guessHeight = g as number;
        guessHint[key] =
          t === g
            ? "correct"
            : Math.abs(targetHeight - guessHeight) < CLOSE_VALUES.height
            ? { accuracy: "close" }
            : { accuracy: "far" };

      case "weight":
        const targetWeight = t as number;
        const guessWeight = g as number;
        guessHint[key] =
          t === g
            ? "correct"
            : Math.abs(targetWeight - guessWeight)
            ? { accuracy: "close" }
            : { accuracy: "far" };
    }
  });

  return { pokemon: guessedPokemon, guessHint: guessHint };
};
