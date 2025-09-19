import React from "react";

interface Props {
  isGameOver: boolean;
  isWon: boolean;
  guessCount: number;
  maxGuesses: number;
  timeElapsed: number;
}

const GameStatusBox: React.FC<Props> = ({
  isGameOver,
  isWon,
  guessCount,
  maxGuesses,
  timeElapsed,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (!isGameOver) {
    return (
      <div className="bg-pokemon-gray border-4 border-gray-900 rounded-lg p-6 text-center shadow-lg">
        <div className="text-pokemon-yellow font-bold text-xl mb-3">
          Game in Progress
        </div>
        <div className="text-pokemon-white font-bold">
          Guesses: {guessCount}/{maxGuesses}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`border-4 rounded-lg p-8 text-center animate-bounce-in shadow-lg mb-6 ${
        isWon ? "bg-green-500 border-green-700" : "bg-red-600 border-red-900"
      }`}
    >
      <div className="text-white font-bold text-3xl mb-6">
        {isWon ? "You won!" : "Sorry! You didn't get today's Pokémon"}
      </div>

      <div className="text-white text-xl mb-3 font-bold">
        {isWon
          ? `You got it in ${guessCount} ${
              guessCount === 1 ? "guess" : "guesses"
            }`
          : "You used all your guesses"}
      </div>

      <div className="text-white mb-6 font-bold">
        Time: {formatTime(timeElapsed)}
      </div>
    </div>
  );
};

export default GameStatusBox;
