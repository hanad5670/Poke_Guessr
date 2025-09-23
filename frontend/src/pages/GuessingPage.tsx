import { useEffect, useRef, useState } from "react";
import GuessList from "../components/GuessList";
import SearchBar from "../components/SearchBar/SearchBar";
import { type GameState, type GuessRound } from "../types";
import Silhouette from "../components/Silhouette";
import GameStatusBox from "../components/GameStatusBox";
import Timer from "../components/Timer";
import PrevGameSelector from "../components/PrevGameSelector";
import { api } from "../lib/api";

const MAX_GUESS_DEFAULT = 8;

// Load today's result if it exists
const loadGameState = (): GameState => {
  const userLocalDate = new Date().toLocaleDateString("en-CA");
  const saved = localStorage.getItem("gameState");
  if (saved) {
    try {
      const parsed: GameState = JSON.parse(saved);
      if (parsed.lastPlayed == userLocalDate) {
        return parsed;
      }
    } catch (e) {
      console.log("Error parsing gameState:", e);
    }
  }

  return {
    gameOver: false,
    isWon: false,
    guessesLeft: MAX_GUESS_DEFAULT,
    guessList: [],
    maxGuesses: MAX_GUESS_DEFAULT,
    usedSilhouette: false,
    timeElapsed: 0,
    lastPlayed: userLocalDate,
    currentStreak: 0,
  };
};

const GuessingPage: React.FC = () => {
  const userLocalDate = new Date().toLocaleDateString("en-CA");
  const initialGameState = loadGameState();
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [selectedDate, setSelectedDate] = useState<string>(userLocalDate);
  const [silhoutte, setSilhoutte] = useState<string>("");
  const [showSilhouette, setShowSilhouette] = useState(false);
  const [disableSearchBar, setDisableSearchBar] = useState(false);
  const timeRef = useRef(gameState.timeElapsed);

  const playingTodaysGame = selectedDate === userLocalDate;

  // Setting up the game
  useEffect(() => {
    setSelectedDate(userLocalDate);
    getNumGuesses();
    getSilhouette(userLocalDate);
  }, []);

  // Check if the user has won or lost the game
  useEffect(() => {
    if (gameState.isWon || gameState.guessesLeft == 0) {
      setGameState((prev) => {
        const newState = {
          ...prev,
          gameOver: true,
          timeElapsed: timeRef.current,
          lastPlayed: userLocalDate,
        };

        // Update only if the user is playing today's game
        if (playingTodaysGame) {
          localStorage.setItem("gameState", JSON.stringify(newState));
        }
        return newState;
      });
      setDisableSearchBar(true);
      // Replace silhouette with pokemon sprite
      getPokeImage(selectedDate);
      setShowSilhouette(true);
    }
  }, [gameState.isWon, gameState.guessesLeft]);

  // Resets the game state for a new game
  const resetGame = () => {
    setShowSilhouette(false);
    setSilhoutte("");
    setDisableSearchBar(false);
    setGameState((prev) => ({
      ...prev,
      gameOver: false,
      isWon: false,
      guessesLeft: MAX_GUESS_DEFAULT,
      guessList: [],
      maxGuesses: MAX_GUESS_DEFAULT,
      usedSilhouette: false,
    }));
  };

  const handlePrevDateSelect = (date: string) => {
    resetGame();
    setSelectedDate(date);
    getSilhouette(date);
  };

  const getNumGuesses = async () => {
    try {
      const res = await api.get("/pokemon/guessNum");
      const guessesAllowed = res.data.maxGuesses;
      setGameState((prev) => ({
        ...prev,
        guessesLeft: guessesAllowed - prev.guessList.length,
        maxGuesses: guessesAllowed,
      }));
    } catch (err) {
      console.log("Error trying to get number of guesses:", err);
    }
  };

  const getSilhouette = async (date: string) => {
    try {
      const res = await api.get(`/pokemon/daily/silhouette?date=${date}`);
      setSilhoutte(res.data);
    } catch (err) {
      console.log("There was an error trying to load the silhouette:", err);
    }
  };

  const getPokeImage = async (date: string) => {
    try {
      const res = await api.get(`/pokemon/daily/sprite?date=${date}`);
      setSilhoutte(res.data);
    } catch (err) {
      console.log("There was an error gettign the Pokemon image", err);
    }
  };

  const sendGuess = async (guess: string) => {
    try {
      const response = await api.post(`/pokemon/guess?date=${selectedDate}`, {
        guess,
      });
      const guessFeedback = response.data as GuessRound;

      setGameState((prev) => {
        const newIsWon =
          guessFeedback.guessHint.name === "correct" ? true : prev.isWon;
        const newGuessList = [...prev.guessList, guessFeedback];
        const newGuessesLeft = prev.guessesLeft < 1 ? 0 : prev.guessesLeft - 1;

        const newState = {
          ...prev,
          guessList: newGuessList,
          guessesLeft: newGuessesLeft,
          isWon: newIsWon,
        };

        // store state if today's game
        if (playingTodaysGame) {
          localStorage.setItem("gameState", JSON.stringify(newState));
        }

        return newState;
      });
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
              {playingTodaysGame
                ? "Who's Today's Pokémon?"
                : `Flashback: ${selectedDate}`}
            </div>
          </div>
        </div>

        {/* Pokemon Display */}
        <Silhouette
          pokemonSil={silhoutte}
          showSilhouette={showSilhouette}
          changeShowStatus={setShowSilhouette}
          isGameOver={gameState.gameOver}
        />

        {/* Game Status */}
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center gap-6 mb-8">
            <PrevGameSelector
              disabled={!gameState.gameOver}
              currentDate={selectedDate}
              onPrevDateSelect={handlePrevDateSelect}
            />
            <Timer timeRef={timeRef} isRunning={!gameState.gameOver} />
          </div>
          <GameStatusBox
            isGameOver={gameState.gameOver}
            isWon={gameState.isWon}
            guessCount={gameState.maxGuesses - gameState.guessesLeft}
            maxGuesses={gameState.maxGuesses}
            timeElapsed={timeRef.current}
          />
        </div>

        {/* Search Bar */}
        {!gameState.gameOver && (
          <div className="mb-8">
            <SearchBar onGuess={sendGuess} isDisabled={disableSearchBar} />
          </div>
        )}

        {/*Guess List */}
        <GuessList
          guessRounds={gameState.guessList}
          maxGuesses={gameState.maxGuesses}
        />
      </div>
    </div>
  );
};

export default GuessingPage;
