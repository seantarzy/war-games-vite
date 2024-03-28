import MultiplayerGame from "./components/Game";
import MultiplayerLobby from "./components/Lobby";
import "./styles.css";
import { useLocalStorage } from "./hooks/useLocalStorage";

function MultiplayerPage() {
  const [gameId, setGameId] = useLocalStorage<number | null>("gameId", null);
  const [gameStarted, setGameStarted] = useLocalStorage<boolean>(
    "gameStarted",
    false
  );
  const startGame = (gameId: number) => {
    setGameId(gameId);
    setGameStarted(true);
  };

  return (
    <div className="h-full w-full flex flex-col text-center background-image text-white  ">
      <div className="bg-slate-300 text-black rounded-lg px-16 py-4">
        <h1>Multiplayer</h1>
      </div>
      <br />
      <br />
      <div className="flex flex-col justify-center flex-1">
        <div className="flex flex-col align-middle justify-center flex-1">
          {gameId && gameStarted ? (
            <MultiplayerGame gameId={gameId} />
          ) : (
            <MultiplayerLobby startGame={startGame} />
          )}
        </div>
      </div>
    </div>
  );
}

export default MultiplayerPage;
