import { useEffect, useState } from "react";
import GuessList from "../components/GuessList";
import SearchBar from "../components/SearchBar/SearchBar";
import { guessRoundListSample, type Pokemon } from "../types";
import axios from "axios";

const MAX_GUESS_DEFAULT = 8;

const GuessingPage: React.FC = () => {
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [guessesLeft, setGuessesLeft] = useState<number>(MAX_GUESS_DEFAULT);
  const [maxGuesses, setMaxGuesses] = useState<number>(MAX_GUESS_DEFAULT);
  const [guessList, setGuessList] = useState<Pokemon[]>([]);

  useEffect(() => {
    getNumGuesses();
  }, []);

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
  const sendGuess = async (guess: string) => {
    try {
      console.log(guess);
      const response = await axios.post("/api/pokemon/guess", { guess });
      console.log(response);
    } catch (err) {
      console.log("There was an error sending the guess:", err);
    }
  };
  return (
    <>
      <SearchBar onGuess={sendGuess} />
      <GuessList guessRounds={guessRoundListSample} maxGuesses={maxGuesses} />
    </>
  );
};

export default GuessingPage;
