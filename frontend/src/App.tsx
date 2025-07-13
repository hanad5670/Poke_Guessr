import GuessBox from "./components/GuessBox";
import GuessList from "./components/GuessList";
import SearchBar from "./components/SearchBar/SearchBar";
import {
  guessAccSample,
  guessRoundListSample,
  pokemonSample,
  type Pokemon,
} from "./types";

function App() {
  return (
    <>
      <SearchBar
        onGuess={(name) => {
          console.log(`User Guessed: ${name}`);
        }}
      />
      <GuessList guessRounds={guessRoundListSample} maxGuesses={8} />
    </>
  );
}

export default App;
