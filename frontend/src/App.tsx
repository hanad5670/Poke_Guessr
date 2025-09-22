import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GuessingPage from "./pages/GuessingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GuessingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
