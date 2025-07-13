import type { GuessRound } from "../types";
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
        className="flex items-center border-b border-dashed"
      >
        <label className="border-r border-dashed px-6 py-2 ">Name</label>
        <label className="border-r border-dashed px-6 py-2">Name</label>
        <label className="border-r border-dashed px-4 py-2">Name</label>
        <label className="border-r border-dashed px-4 py-2">Name</label>
        <label className="border-r border-dashed px-4 py-2">Name</label>
        <label className="border-r border-dashed px-4 py-2">Name</label>
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
