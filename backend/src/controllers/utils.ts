import {
  CLOSE_VALUES,
  GuessHint,
  GuessRound,
  Pokemon,
  PokemonDB,
} from "../config/gameConfig";
import { query } from "../db";

export const storeDailyPokemon = async (
  pokeid: number,
  day: string
): Promise<void> => {
  const result = await query(
    "INSERT INTO daily_pokemon (date, pokemon_id) VALUES ($1, $2) ON CONFLICT (date) DO NOTHING",
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
  const countResult = await query("SELECT COUNT(*) FROM pokemon");
  const totalPokemon = parseInt(countResult.rows[0].count, 10);

  const pokeId = Math.floor(Math.random() * totalPokemon) + 1;

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

// This function is for transforming the pokemon from the db to the Pokemon type
export const transformDbPokemon = (pokemon: PokemonDB): Pokemon => {
  const typeArr = pokemon.types.split(", ");

  return {
    name: pokemon.name,
    pokedex: pokemon.pokedex_number,
    types: typeArr,
    height: pokemon.height_cm,
    weight: pokemon.weight_kg,
    region: pokemon.generation,
    sprite: pokemon.sprite,
    silhouette: pokemon.silhoutte,
  };
};

// HELPER FUNCTIONS FOR COMPARING POKEMON

export const compareGuessedPokemon = (
  guessedPokemon: Pokemon,
  targetPokemon: Pokemon
): GuessRound => {
  // If names are the same, we do not need to compare anything else
  if (guessedPokemon.name === targetPokemon.name) {
    return { pokemon: guessedPokemon, guessHint: { name: "correct" } };
  }

  const guessHint: GuessRound["guessHint"] = {};

  (Object.keys(targetPokemon) as (keyof Pokemon)[]).forEach((key) => {
    const t = targetPokemon[key];
    const g = guessedPokemon[key];
    console.log(key);
    switch (key) {
      case "pokedex":
        const targetPokedex = t as number;
        const guessPokedex = g as number;
        guessHint[key] =
          t === g
            ? "correct"
            : Math.abs(targetPokedex - guessPokedex) < CLOSE_VALUES.pokedex
            ? { accuracy: "close" }
            : { accuracy: "far" };
        break;

      case "height":
        const targetHeight = t as number;
        const guessHeight = g as number;
        guessHint[key] =
          t === g
            ? "correct"
            : Math.abs(targetHeight - guessHeight) < CLOSE_VALUES.height
            ? { accuracy: "close" }
            : { accuracy: "far" };
        break;

      case "weight":
        const targetWeight = t as number;
        const guessWeight = g as number;
        guessHint[key] =
          t === g
            ? "correct"
            : Math.abs(targetWeight - guessWeight) < CLOSE_VALUES.weight
            ? { accuracy: "close" }
            : { accuracy: "far" };
        break;

      case "types":
        const targetTypes = t as string[];
        const guessTypes = g as string[];
        guessHint[key] = haveCommonType(guessTypes, targetTypes);
        break;

      case "region":
        guessHint[key] = t === g ? "correct" : "wrong";
        break;

      default:
    }

    return guessHint;
  });

  return { pokemon: guessedPokemon, guessHint: guessHint };
};

export const haveCommonType = (
  types1: string[],
  types2: string[]
): GuessHint => {
  let commonTypes = 0;

  types2.forEach((type) => {
    if (types1.includes(type)) {
      commonTypes += 1;
    }
  });

  console.log("Common type counter: ", commonTypes);

  return commonTypes === types1.length && commonTypes === types2.length
    ? "correct"
    : commonTypes > 0
    ? { accuracy: "close" }
    : { accuracy: "far" };
};
