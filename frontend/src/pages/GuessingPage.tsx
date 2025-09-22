import { useEffect, useRef, useState } from "react";
import GuessList from "../components/GuessList";
import SearchBar from "../components/SearchBar/SearchBar";
import { type GuessRound } from "../types";
import axios from "axios";
import Silhouette from "../components/Silhouette";
import GameStatusBox from "../components/GameStatusBox";
import Timer from "../components/Timer";
import PrevGameSelector from "../components/PrevGameSelector";

const MAX_GUESS_DEFAULT = 8;

const GuessingPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [guessesLeft, setGuessesLeft] = useState<number>(MAX_GUESS_DEFAULT);
  const [maxGuesses, setMaxGuesses] = useState<number>(MAX_GUESS_DEFAULT);
  const [guessList, setGuessList] = useState<GuessRound[]>([]);
  const [silhoutte, setSilhoutte] = useState<string>("");
  const [showSilhouette, setShowSilhouette] = useState(false);
  const [disableSearchBar, setDisableSearchBar] = useState(false);
  const timeRef = useRef(0);

  // Setting up the game
  useEffect(() => {
    const userLocalDate = new Date().toLocaleDateString("en-CA");
    setSelectedDate(userLocalDate);
    getNumGuesses();
    getSilhouette(userLocalDate);
  }, []);

  // Check if the user has won or lost the game
  useEffect(() => {
    if (isWon || guessesLeft == 0) {
      setGameOver(true);
      setDisableSearchBar(true);
      // Replace silhouette with pokemon sprite
      getPokeImage();
      setShowSilhouette(true);

      // Get the dates of previous games
    }
  }, [isWon, guessesLeft]);

  // Resets the game state for a new game
  const resetGame = () => {
    setGameOver(false);
    setIsWon(false);
    setSilhoutte("");
    setShowSilhouette(false);
    setDisableSearchBar(false);
    setGuessList([]);
    setGuessesLeft(maxGuesses);
  };

  const handlePrevDateSelect = (date: string) => {
    resetGame();
    setSelectedDate(date);
    getSilhouette(date);
  };

  const getNumGuesses = async () => {
    try {
      const res = await axios.get("/api/pokemon/guessNum");
      const guessesAllowed = res.data.maxGuesses;
      setMaxGuesses(guessesAllowed);
      setGuessesLeft(guessesAllowed - guessList.length);
    } catch (err) {
      console.log("Error trying to get number of guesses:", err);
    }
  };

  const getSilhouette = async (date: string) => {
    try {
      const res = await axios.get(`/api/pokemon/daily/silhouette?date=${date}`);
      setSilhoutte(res.data);
    } catch (err) {
      console.log("There was an error trying to load the silhouette:", err);
    }
  };

  const getPokeImage = async () => {
    try {
      const res = await axios.get(
        `/api/pokemon/daily/sprite?date=${selectedDate}`
      );
      setSilhoutte(res.data);
    } catch (err) {
      console.log("There was an error gettign the Pokemon image", err);
    }
  };

  const sendGuess = async (guess: string) => {
    try {
      const response = await axios.post(
        `/api/pokemon/guess?date=${selectedDate}`,
        { guess }
      );
      const guessFeedback = response.data as GuessRound;
      setGuessList((currList) => [...currList, guessFeedback]);

      // If user guessed correctly, end the game
      if (guessFeedback.guessHint.name === "correct") {
        setIsWon(true);
      }

      setGuessesLeft((prev) => (prev < 1 ? 0 : prev - 1));
    } catch (err) {
      console.log("There was an error sending the guess:", err);
    }
  };
  return (
    <div className="min-h-screen bg-pokemon-black">
      {/* Header */}
      <div className="bg-pokemon-dark border-b-8 border-gray-900 py-8 shadow-xl">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-5xl font-extrabold text-pokemon-yellow">
              PokéGuessr
            </h1>
            <span className="text-pokemon-white text-xl font-bold">
              A Pokémon Guessing Game!
            </span>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <div className="bg-pokemon-gray border-4 border-gray-900 rounded-lg p-4 max-w-md mx-auto shadow-lg">
            <div className="text-pokemon-yellow font-bold text-lg">
              Who's that Pokémon?
            </div>
          </div>
        </div>

        {/* Pokemon Display */}
        <Silhouette
          pokemonSil={silhoutte}
          showSilhouette={showSilhouette}
          changeShowStatus={setShowSilhouette}
          isGameOver={gameOver}
        />

        {/* Game Status */}
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center gap-6 mb-8">
            <PrevGameSelector
              disabled={!gameOver}
              currentDate={selectedDate}
              onPrevDateSelect={handlePrevDateSelect}
            />
            <Timer timeRef={timeRef} isRunning={!gameOver} />
          </div>
          <GameStatusBox
            isGameOver={gameOver}
            isWon={isWon}
            guessCount={maxGuesses - guessesLeft}
            maxGuesses={maxGuesses}
            timeElapsed={timeRef.current}
          />
        </div>

        {/* Search Bar */}
        {!gameOver && (
          <div className="mb-8">
            <SearchBar onGuess={sendGuess} isDisabled={disableSearchBar} />
          </div>
        )}

        {/*Guess List */}
        <GuessList guessRounds={guessList} maxGuesses={maxGuesses} />
      </div>
    </div>
  );
};

export default GuessingPage;
