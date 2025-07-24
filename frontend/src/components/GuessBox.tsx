import { PokemonGuessingKeys, type GuessHint, type Pokemon } from "../types";

interface Props {
  guessNumber: number;
  pokemonGuessed?: Pokemon;
  guessAccuracy?: Partial<Record<keyof Pokemon, GuessHint>>;
}

const GuessBox: React.FC<Props> = ({
  guessNumber,
  pokemonGuessed,
  guessAccuracy,
}) => {
  if (!pokemonGuessed || !guessAccuracy) {
    return (
      <div
        id={`guess-box-${guessNumber}-unactivated`}
        className="relative w-full max-w-lg mx-auto my-4 text-center border-2 rounded border-gray-800 border-dashed"
      >
        {guessNumber}
      </div>
    );
  }

  const getCellClass = (key: keyof Pokemon) => {
    const hint = guessAccuracy[key];
    const baseClass = "px-4 py-2 flex-1";

    if (hint === "correct") {
      return `${baseClass} bg-green-100 font-bold`;
    }

    if (typeof hint === "object") {
      const accuracy = hint.accuracy;

      const bg = accuracy === "close" ? "bg-yellow-100" : "";
      return `${baseClass} ${bg}`;
    }

    return baseClass;
  };

  const renderValue = (key: keyof Pokemon) => {
    const hint = guessAccuracy[key];
    const value = pokemonGuessed[key];

    if (typeof hint === "string" || !hint?.direction) {
      return value;
    }

    return hint.direction === "higher" ? `${value}↑` : `${value}↓`;
  };
  return (
    <div
      id={`guess-box-${guessNumber}-activated`}
      className="flex items-center overflow-hidden relative w-full max-w-lg mx-auto my-4 border-2 border-gray-800 rounded"
    >
      {Object.values(PokemonGuessingKeys).map((key) => {
        const k = key as keyof Pokemon;
        return (
          <div
            id={key}
            className={`${getCellClass(k)} ${
              k === "name" ? "px-6 border-r border-dashed" : ""
            }`}
          >
            {renderValue(k)}
          </div>
        );
      })}
    </div>
  );
};

export default GuessBox;
