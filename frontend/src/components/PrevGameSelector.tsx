import React, { useState } from "react";

interface Props {
  disabled: boolean;
}

const PrevGameSelector: React.FC<Props> = ({ disabled }) => {
  return (
    <div className="relative">
      <button
        disabled={disabled}
        className="bg-pokemon-yellow text-pokemon-black font-bold py-4 px-8 rounded-lg 
                 border-4 border-gray-900 hover:bg-pokemon-red hover:text-pokemon-white 
                 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                 transform hover:scale-105 active:scale-95 shadow-lg"
      >
        <div className="flex items-center gap-3">
          <span className="font-extrabold">Previous Games</span>
        </div>
      </button>
    </div>
  );
};

export default PrevGameSelector;
