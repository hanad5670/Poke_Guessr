export const GAME_CONFIG = {
  MAX_GUESSES: 8,
};

export const CLOSE_VALUES = {
  height: 20,
  weight: 10,
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

export type GuessHint =
  | "correct"
  | "wrong"
  | { accuracy: "close" | "far"; direction?: "higher" | "lower" };

export interface GuessRound {
  pokemon: Pokemon;
  guessHint: Partial<Record<keyof Pokemon, GuessHint>>;
}
