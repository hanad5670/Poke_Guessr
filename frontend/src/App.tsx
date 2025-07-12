import SearchBar from "./components/SearchBar/SearchBar";

function App() {
  return (
    <>
      <SearchBar
        onGuess={(name) => {
          console.log(`User Guessed: ${name}`);
        }}
      />
    </>
  );
}

export default App;
