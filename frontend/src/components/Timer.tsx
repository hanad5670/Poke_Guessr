import React, { useEffect, useState } from "react";

interface Props {
  isRunning: boolean;
  timeRef: React.RefObject<number>;
}

export const Timer: React.FC<Props> = ({ isRunning, timeRef }) => {
  const [time, setTime] = useState(0);

  // useEffect resetting timer
  useEffect(() => {
    if (!isRunning) {
      setTime(0);
    }
  }, [isRunning]);

  useEffect(() => {
    let interval: number;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1;

          // Update the ref
          if (timeRef) {
            timeRef.current = newTime;
          }
          return newTime;
        });
      }, 1000) as unknown as number;
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="bg-pokemon-gray border-4 border-gray-900 rounded-lg px-6 py-4 shadow-lg">
      <div className="text-pokemon-yellow font-mono text-xl font-bold text-center">
        {formatTime(isRunning ? time : timeRef.current)}
      </div>
    </div>
  );
};

export default Timer;
