export const GAME_CONFIG = {
  MAX_GUESSES: 8,
  TOTAL_POKEDEX: 1025,
};

export const CLOSE_VALUES = {
  height: 20,
  weight: 10,
  pokedex: 10,
};

export interface Pokemon {
  name: string;
  pokedex: number;
  height: number;
  weight: number;
  types: string[] | string;
  region: string;
  sprite?: string;
  silhouette?: string;
}

export interface PokemonDB {
  name: string;
  pokedex_number: number;
  height_cm: number;
  weight_kg: number;
  types: string;
  total_base_stats: number;
  generation: string;
  sprite: string | Buffer;
  silhoutte: string;
}

export type GuessHint =
  | "correct"
  | "wrong"
  | { accuracy: "close" | "far"; direction?: "higher" | "lower" };

export interface GuessRound {
  pokemon: Pokemon;
  guessHint: Partial<Record<keyof Pokemon, GuessHint>>;
}
