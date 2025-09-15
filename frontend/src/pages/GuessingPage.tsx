import { useEffect, useState } from "react";
import GuessList from "../components/GuessList";
import SearchBar from "../components/SearchBar/SearchBar";
import { guessRoundListSample, type GuessRound, type Pokemon } from "../types";
import axios from "axios";
import Silhouette from "../components/Silhouette";

const MAX_GUESS_DEFAULT = 8;

const GuessingPage: React.FC = () => {
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [guessesLeft, setGuessesLeft] = useState<number>(MAX_GUESS_DEFAULT);
  const [maxGuesses, setMaxGuesses] = useState<number>(MAX_GUESS_DEFAULT);
  const [guessList, setGuessList] = useState<GuessRound[]>([]);
  const [silhoutte, setSilhoutte] = useState<string>("");
  const [showSilhouette, setShowSilhouette] = useState(false);
  const [disableSearchBar, setDisableSearchBar] = useState(false);

  useEffect(() => {
    getNumGuesses();
    getSilhouette();
  }, []);

  // Check if the user has won the game
  useEffect(() => {
    if (isWon) {
      setDisableSearchBar(true);
      setShowSilhouette(true);

      // Replace silhouette with pokemon sprite
      getPokeImage();
    }
  }, [isWon]);

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

  const getSilhouette = async () => {
    try {
      const res = await axios.get("/api/pokemon/daily/silhouette");
      console.log(res);
      setSilhoutte(res.data);
    } catch (err) {
      console.log("There was an error trying to load the silhouette:", err);
    }
  };

  const getPokeImage = async () => {
    try {
      const res = await axios.get("/api/pokemon/daily/sprite");
      console.log(res);
      setSilhoutte(res.data);
    } catch (err) {
      console.log("There was an error gettign the Pokemon image", err);
    }
  };
  const sendGuess = async (guess: string) => {
    try {
      console.log(guess);
      const response = await axios.post("/api/pokemon/guess", { guess });
      const guessFeedback = response.data as GuessRound;
      setGuessList((currList) => [...currList, guessFeedback]);

      // If user guessed correctly, end the game
      if (guessFeedback.guessHint.name === "correct") {
        setIsWon(true);
      }
    } catch (err) {
      console.log("There was an error sending the guess:", err);
    }
  };
  return (
    <div>
      <Silhouette
        pokemonSil={silhoutte}
        showSilhouette={showSilhouette}
        changeShowStatus={setShowSilhouette}
      />
      <SearchBar onGuess={sendGuess} isDisabled={disableSearchBar} />
      <GuessList guessRounds={guessList} maxGuesses={maxGuesses} />
    </div>
  );
};

export default GuessingPage;
