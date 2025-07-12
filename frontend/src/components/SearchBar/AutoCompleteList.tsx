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

  useEffect(() => {
    console.log(suggestions);
  }, []);

  return (
    <div className="border-gray-800 border-2">
      <ul>
        {suggestions.map((name, index) => (
          <li
            className={`${
              activeIndex === index ? "bg-gray-100 font-semibold" : ""
            }`}
            key={index}
            onMouseOver={() => onHover(index)}
            onMouseLeave={() => onHover(0)}
            onClick={() => onSelect(name)}
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AutoCompleteList;
