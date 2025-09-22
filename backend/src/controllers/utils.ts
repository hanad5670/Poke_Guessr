import {
  CLOSE_VALUES,
  GAME_CONFIG,
  GuessHint,
  GuessRound,
  Pokemon,
  PokemonDB,
} from "../config/gameConfig";
import { query } from "../db";
import crypto from "crypto";

// This function generates a number according to the current date between 1 and the largest number in the pokedex
export const getPokemonFromDate = (date: string) => {
  const hash = crypto.createHash("sha256").update(date).digest("hex");
  const outputNum = parseInt(hash.substring(0, 8), 16);
  return (outputNum % GAME_CONFIG.TOTAL_POKEDEX) + 1;
};

// This function is for transforming the pokemon from the db to the Pokemon type
export const transformDbPokemon = (pokemon: PokemonDB): Pokemon => {
  const typeArr = pokemon.types.split(", ");
  const pokemonSprite = pokemon.sprite
    ? `data:image/png;base64,${(pokemon.sprite as Buffer).toString("base64")}`
    : "";

  return {
    name: pokemon.name,
    pokedex: pokemon.pokedex_number,
    types: typeArr,
    height: pokemon.height_cm,
    weight: pokemon.weight_kg,
    region: pokemon.generation,
    sprite: pokemonSprite,
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
    switch (key) {
      case "pokedex":
        const targetPokedex = t as number;
        const guessPokedex = g as number;
        guessHint[key] = compareValues(
          targetPokedex,
          guessPokedex,
          CLOSE_VALUES.pokedex
        );
        break;

      case "height":
        const targetHeight = t as number;
        const guessHeight = g as number;
        guessHint[key] = compareValues(
          targetHeight,
          guessHeight,
          CLOSE_VALUES.height
        );
        break;

      case "weight":
        const targetWeight = t as number;
        const guessWeight = g as number;
        guessHint[key] = compareValues(
          targetWeight,
          guessWeight,
          CLOSE_VALUES.weight
        );
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

export const compareValues = (
  val1: number,
  val2: number,
  closeRange: number
): GuessHint => {
  if (val1 === val2) {
    return "correct";
  }

  const areClose = Math.abs(val1 - val2) < closeRange;

  if (val1 > val2) {
    return areClose
      ? { accuracy: "close", direction: "higher" }
      : { accuracy: "far", direction: "higher" };
  }

  return areClose
    ? { accuracy: "close", direction: "lower" }
    : { accuracy: "far", direction: "lower" };
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

  return commonTypes === types1.length && commonTypes === types2.length
    ? "correct"
    : commonTypes > 0
    ? { accuracy: "close" }
    : { accuracy: "far" };
};
