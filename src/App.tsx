// App.jsx or your main component file
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./home/Page";
import MultiplayerPage from "./multiplayer/page"; // Import your multiplayer component

export default function App() {
  return (
    <Router>
      {/* Route configuration */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/multiplayer" element={<MultiplayerPage />} />
      </Routes>
    </Router>
  );
}
