import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./home/Page";
import MultiplayerPage from "./multiplayer/page"; // Import your multiplayer component
import { ComputerPage } from "./computer/Page";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/multiplayer" element={<MultiplayerPage />} />
        <Route path="/singleplayer" element={<ComputerPage />} />
      </Routes>
    </Router>
  );
}
