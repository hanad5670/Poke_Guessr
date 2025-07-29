export const PokemonGuessingKeys = {
  NAME: "name",
  POKEDEX: "pokedex",
  HEIGHT: "height",
  WEIGHT: "weight",
  TYPES: "types",
  REGION: "region",
} as const;

export type PokemonGuessingKey =
  (typeof PokemonGuessingKeys)[keyof typeof PokemonGuessingKeys];

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

export const pokemonSample: Pokemon = {
  name: "Pikachu",
  pokedex: 100,
  region: "Kanto",
  types: "Electric",
  height: 10,
  weight: 20,
};

export const guessAccSample: Partial<Record<keyof Pokemon, GuessHint>> = {
  name: "wrong",
  pokedex: { accuracy: "close", direction: "lower" },
  types: { accuracy: "close" },
  region: { accuracy: "close" },
  height: { accuracy: "far", direction: "higher" },
  weight: { accuracy: "far", direction: "higher" },
};

export const guessRoundListSample: GuessRound[] = [
  {
    pokemon: {
      name: "Pikachu",
      pokedex: 100,
      height: 10,
      weight: 20,
      region: "Kanto",
      types: "Electric",
    },
    guessHint: {
      name: "wrong",
      pokedex: { accuracy: "close", direction: "lower" },
      types: { accuracy: "close" },
      region: { accuracy: "close" },
      height: { accuracy: "far", direction: "higher" },
      weight: { accuracy: "far", direction: "higher" },
    },
  },

  {
    pokemon: {
      name: "Pikachu",
      pokedex: 100,
      height: 10,
      weight: 20,
      region: "Kanto",
      types: ["Electric", "Fairy"],
    },
    guessHint: {
      name: "wrong",
      pokedex: { accuracy: "close", direction: "lower" },
      types: { accuracy: "close" },
      region: { accuracy: "close" },
      height: { accuracy: "far", direction: "higher" },
      weight: { accuracy: "far", direction: "higher" },
    },
  },
];
