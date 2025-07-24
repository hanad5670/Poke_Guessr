import { PokemonGuessingKeys, type GuessRound } from "../types";
import GuessBox from "./GuessBox";

interface Props {
  maxGuesses: number;
  guessRounds: GuessRound[];
}

const GuessList: React.FC<Props> = ({ maxGuesses, guessRounds }) => {
  return (
    <div className="flex-col">
      <div
        id="column-labels"
        className="flex items-center border-b border-dashed justify-center w-full"
      >
        {Object.values(PokemonGuessingKeys).map((key, index) => {
          const k = key as string;
          const first = index === 0;
          return (
            <label
              key={k}
              className={`border-r ${
                first ? "border-l" : ""
              } border-dashed px-6 py-2`}
            >
              {k.charAt(0).toUpperCase() + k.slice(1)}
            </label>
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
