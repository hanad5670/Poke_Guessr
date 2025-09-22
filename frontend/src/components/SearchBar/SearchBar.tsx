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
  const [activeIndex, setActiveIndex] = useState(-1);

  const debounceTimeout = useRef<number | null>(null);

  const fetchSuggestions = useCallback((query: string) => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = window.setTimeout(async () => {
      try {
        const res = await axios.get(`/pokemon/search`, {
          params: { q: query },
        });
        setSuggestions(res.data);
        setShowDropdown(true);
      } catch (err) {
        console.log("Error Fetching Search Results:", err);
      }
    }, DEBOUNCE_TIMEOUT);
  }, []);

  const handleClickOutside = () => {
    setTimeout(() => {
      setShowDropdown(false);
    }, 150);
  };

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
    setActiveIndex(-1);
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
      <div className="relative">
        <input
          id="pokemon-guess-input"
          type="text"
          placeholder="Guess a Pokemon..."
          value={input}
          onBlur={handleClickOutside}
          onFocus={() => input.length > 0 && setShowDropdown(true)}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
          className="w-full px-4 py-4 text-lg bg-pokemon-gray border-4 border-gray-900 
                   rounded-lg text-pokemon-white placeholder-gray-400 font-bold
                   focus:outline-none focus:border-pokemon-yellow focus:ring-4 
                   focus:ring-pokemon-yellow/20 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-200 shadow-lg"
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
    </div>
  );
};

export default SearchBar;
