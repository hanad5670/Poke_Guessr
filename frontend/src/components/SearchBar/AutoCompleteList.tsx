import React, { useEffect } from "react";

interface Props {
  suggestions: string[];
  onSelect: (name: string) => void;
  activeIndex: number;
  onHover: (index: number) => void;
}

const AutoCompleteList: React.FC<Props> = ({
  suggestions,
  onSelect,
  activeIndex,
  onHover,
}) => {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div
      className="absolute z-10 w-full mt-2 bg-pokemon-gray border-4 border-gray-900 
                      rounded-lg shadow-xl max-h-60 overflow-y-auto"
    >
      {suggestions.map((name, index) => (
        <button
          className={`w-full px-4 py-3 text-left hover:bg-pokemon-red/20 
                        transition-colors duration-150 border-b-2 border-gray-900/50 
                        last:border-b-0 font-bold ${
                          activeIndex === index ? "bg-pokemon-red/30" : ""
                        }`}
          key={index}
          onMouseOver={() => onHover(index)}
          onMouseLeave={() => onHover(-1)}
          onClick={() => onSelect(name)}
        >
          <div className="text-pokemon-yellow font-bold text-xl mb-3">
            {name}
          </div>
        </button>
      ))}
    </div>
  );
};

export default AutoCompleteList;
