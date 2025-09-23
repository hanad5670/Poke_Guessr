import React, { useState } from "react";

interface Props {
  disabled: boolean;
  currentDate: string;
  onPrevDateSelect: (date: string) => void;
}

const PrevGameSelector: React.FC<Props> = ({
  disabled,
  currentDate,
  onPrevDateSelect,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const generatePreviousDays = (numDays: number): Date[] => {
    const days: Date[] = [];
    const today = new Date();

    for (let i = 1; i < numDays + 1; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push(date);
    }

    return days;
  };

  const formatDisplayDate = (date: Date): string => {
    return date.toLocaleDateString("en-CA", {
      month: "short",
      day: "numeric",
    });
  };

  const previousDays = generatePreviousDays(30); // Last 30 days

  const handleDateSelect = (date: string) => {
    setShowDatePicker(false);
    onPrevDateSelect(date);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDatePicker(!showDatePicker)}
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

      {showDatePicker && (
        <div
          className="absolute top-full right-0 mt-2 bg-pokemon-gray border-4 border-gray-900 
                      rounded-lg shadow-xl z-50 w-96 max-h-96 overflow-y-auto"
        >
          <div className="p-4">
            <div className="text-pokemon-yellow font-bold text-lg mb-4 text-center">
              Select a Previous Day
            </div>

            {/* Dates Grid Layout */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              {previousDays.map((date) => {
                const dateString = date.toLocaleDateString("en-CA");
                const isSelected = dateString === currentDate;
                return (
                  <button
                    key={dateString}
                    onClick={() => handleDateSelect(dateString)}
                    className={`
                      p-2 rounded-lg border-2 font-bold text-xs transition-all duration-200
                      flex flex-col items-center justify-center min-h-[50px]
                      ${
                        isSelected
                          ? "bg-pokemon-red border-red-700 text-white shadow-lg scale-105"
                          : "bg-pokemon-dark border-gray-600 text-white hover:bg-gray-600 hover:border-gray-500"
                      }
                    `}
                    disabled={isSelected}
                  >
                    <div className="font-bold text-center leading-tight">
                      {formatDisplayDate(date)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="p-4 border-t-2 border-gray-900">
            <button
              onClick={() => setShowDatePicker(false)}
              className="w-full bg-pokemon-red text-pokemon-white font-bold py-2 px-4 rounded-lg 
                       hover:bg-pokemon-yellow hover:text-pokemon-black transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrevGameSelector;
