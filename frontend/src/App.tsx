import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="p-4 text-center text-lg font-bold text-blue-500">
        Hello Football World 🌍
      </div>
    </>
  );
}

export default App;
