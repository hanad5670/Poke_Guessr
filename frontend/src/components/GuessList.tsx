import { PokemonGuessingKeys, type GuessRound } from "../types";
import GuessBox from "./GuessBox";

interface Props {
  maxGuesses: number;
  guessRounds: GuessRound[];
}

const GuessList: React.FC<Props> = ({ maxGuesses, guessRounds }) => {
  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <div
        id="column-headers"
        className="grid grid-cols-6 mb-6 text-sm font-bold text-pokemon-yellow bg-pokemon-gray 
                    rounded-lg border-4 border-gray-900 overflow-hidden shadow-lg"
      >
        {Object.values(PokemonGuessingKeys).map((key) => {
          const k = key as string;
          return (
            <div key={k} className="text-center py-4">
              {k.charAt(0).toUpperCase() + k.slice(1)}
            </div>
          );
        })}
      </div>
      {/* Render the Guesses that Already Exist */}
      {guessRounds.map((round, i) => (
        <GuessBox
          key={i}
          guessNumber={i + 1}
          pokemonGuessed={round.pokemon}
          guessAccuracy={round.guessHint}
        />
      ))}
      {/* Render the Empty Guess Boxes */}
      {Array.from({ length: maxGuesses - guessRounds.length }).map(
        (_, index) => {
          const emptyIndex = guessRounds.length + index + 1;
          return (
            <GuessBox key={`empty-${emptyIndex}`} guessNumber={emptyIndex} />
          );
        }
      )}
    </div>
  );
};

export default GuessList;
