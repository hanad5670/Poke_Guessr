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
      <div id={`guess-box-${guessNumber}-unactivated`} className="mb-3">
        <div
          className="grid grid-cols-1 rounded-lg overflow-hidden border-4 border-gray-800 
                        bg-gray-900 shadow-lg"
        >
          <div className="p-4 text-center text-gray-500 flex items-center justify-center min-h-[80px]">
            <div className="text-4xl font-bold opacity-50">{guessNumber}</div>
          </div>
        </div>
      </div>
    );
  }

  const getDirection = (key: keyof Pokemon) => {
    const hint = guessAccuracy[key];

    if (typeof hint === "string" || !hint?.direction) {
      return "";
    }

    return hint.direction === "higher" ? `↗` : `↙`;
  };

  const getCellClass = (key: keyof Pokemon) => {
    // If the name is guessed correctly, no need for styles
    if (key === "name" && guessAccuracy[key] === "correct") {
      return "";
    }

    const hint = guessAccuracy[key];
    const baseClass = "px-4 py-2 flex-1";

    if (hint === "correct") {
      return `${baseClass} bg-green-500 border-3 border-green-700 text-white rounded-lg`;
    }
    if (typeof hint === "object") {
      const accuracy = hint.accuracy;

      const bg =
        accuracy === "close"
          ? "bg-yellow-600 rounded-lg border-3 border-yellow-900 text-black-500"
          : "";
      return `${baseClass} ${bg}`;
    }

    return baseClass;
  };

  const renderValue = (key: keyof Pokemon) => {
    const value = pokemonGuessed[key];

    switch (key) {
      case "pokedex":
        const pokedex = value as number;
        return `#${pokedex.toString().padStart(4, "0")}`;

      case "height":
        const height = value as number;
        return `${(height / 100).toFixed(1)}m`;

      case "weight":
        const weight = value as number;
        return `${weight.toFixed(1)}kg`;

      case "types":
        const types = value as string[];
        const typesString = types
          .map((type) => type.charAt(0).toUpperCase() + type.slice(1))
          .join(" / ");
        return typesString;

      default:
        return value;
    }
  };
  return (
    <div className="animate-slide-in mb-3">
      <div
        id={`guess-box-${guessNumber}-activated`}
        className={`grid grid-cols-6 rounded-lg overflow-hidden border-4 shadow-lg ${
          guessAccuracy.name == "correct"
            ? "bg-green-500 text-white border-green-700"
            : "bg-gray-700 text-white border-gray-800"
        }`}
      >
        {Object.values(PokemonGuessingKeys).map((key) => {
          const k = key as keyof Pokemon;
          return (
            <div
              id={key}
              key={key}
              className={`p-4 text-center font-bold flex flex-col items-center justify-center min-h-[80px] ${getCellClass(
                k
              )}`}
            >
              {key === "name" && (
                <img
                  className="w-15 h-15 pixelated"
                  src={pokemonGuessed.sprite}
                />
              )}
              <div className="text-sm font-bold"> {renderValue(k)}</div>
              {getDirection(k) && (
                <div className="text-xl font-bold">{getDirection(k)}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GuessBox;
