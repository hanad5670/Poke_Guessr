import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import AutoCompleteList from "./AutoCompleteList";
interface Props {
  onGuess: (pokemonName: string) => void;
  isDisabled: boolean;
}

const DEBOUNCE_TIMEOUT = 200;

const SearchBar: React.FC<Props> = ({ onGuess, isDisabled }) => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropDown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const debounceTimeout = useRef<number | null>(null);

  const fetchSuggestions = useCallback((query: string) => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = window.setTimeout(async () => {
      try {
        const res = await axios.get(`/api/pokemon/search`, {
          params: { q: query },
        });
        setSuggestions(res.data);
        setShowDropdown(true);
      } catch (err) {
        console.log("Error Fetching Search Results:", err);
      }
    }, DEBOUNCE_TIMEOUT);
  }, []);

  // logic for fetching search query suggestions
  useEffect(() => {
    if (input.length < 1) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    fetchSuggestions(input);
  }, [input]);

  const handleSelect = (name: string) => {
    onGuess(name);
    setInput("");
    setShowDropdown(false);
    setSuggestions([]);
    setActiveIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && suggestions.length > 0) {
      e.preventDefault();
      onGuess(suggestions[0]);
      setInput("");
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto my-4">
      <input
        id="pokemon-guess-input"
        type="text"
        placeholder="Guess a Pokemon..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`${
          isDisabled ? "bg-gray-200" : ""
        } w-full border-2 border-gray-800 rounded px-4 py-2 text-lg shadow`}
        disabled={isDisabled}
      />
      {showDropDown && (
        <AutoCompleteList
          suggestions={suggestions}
          activeIndex={activeIndex}
          onSelect={handleSelect}
          onHover={setActiveIndex}
        />
      )}
    </div>
  );
};

export default SearchBar;
