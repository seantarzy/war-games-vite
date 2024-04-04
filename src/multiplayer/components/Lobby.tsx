import { createGame, joinGame } from "../../api/multiplayer/methods";
import { FormEvent, useEffect, useState } from "react";
import useGameChannelWebsocket from "../hooks/useGameChannelWebsocket";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { sessionType } from "../types";
import { destroyGame } from "../../api/game/methods";
import { BaseballButton } from "./ui_components/Button";

export default function MultiplayerLobby({
  startGame,
}: {
  startGame: (gameId: number) => void;
}) {
  const [clickedJoin, setClickedJoin] = useState(false);
  const [gameCode, setGameCode] = useLocalStorage("gameCode", "");
  const [gameId, setGameId] = useLocalStorage<number | null>("gameId", null);
  const [sessionId, setSessionId] = useLocalStorage("sessionId", 0);
  const [sessionType, setSessionType] = useLocalStorage<sessionType | null>(
    "sessionType",
    null
  );

  const { gameStarted, gameReady, exitLobby } = useGameChannelWebsocket({
    currentPlayerSessionId: sessionId,
    gameId: gameId,
    sessionType: sessionType,
  });

  useEffect(() => {
    if (gameId && gameReady) {
      debugger;
      startGame(gameId);
    }
  }, [gameReady]);

  const handleGameCreate = () => {
    // create a new game
    // subscribe to the game channel
    createGame().then((res) => {
      window.localStorage.clear();
      setGameId(res.game.id);
      setGameCode(res.game.invite_code);
      setSessionId(res.session.id);
      setSessionType("host");
    });
  };

  const handleJoinGame = (event: FormEvent) => {
    event.preventDefault();
    joinGame(gameCode).then((res) => {
      window.localStorage.clear();
      setGameId(res.game.id);
      setSessionId(res.session.id);
      setSessionType("guest");
    });
    // join an existing game
    // subscribe to the game channel
  };

  const backFromJoin = (e: FormEvent) => {
    e.preventDefault();
    setClickedJoin(false);
    setGameCode("");
  };

  function InitialLobby() {
    return (
      <div className="flex flex-col items-center justify-center">
        {
          // if the user clicks join game
          // we show a form to enter the game code
          clickedJoin ? (
            <form onSubmit={(e) => handleJoinGame(e)}>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Enter game code"
                  value={gameCode}
                  onChange={(e) => setGameCode(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
                <BaseballButton disabled={false} type="submit" className="h-14">
                  Join Game
                </BaseballButton>

                <BaseballButton
                  disabled={false}
                  onClick={backFromJoin}
                  className="h-14"
                >
                  Back
                </BaseballButton>
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-4 w-1/3 items-center justify-center self-center">
              <BaseballButton
                onClick={handleGameCreate}
                disabled={false}
                className="w-72"
              >
                Create Game
              </BaseballButton>
              <BaseballButton
                disabled={false}
                onClick={() => setClickedJoin(true)}
                className="w-72"
              >
                Join Game
              </BaseballButton>
            </div>
          )
        }
      </div>
    );
  }

  const endGame = () => {
    if (!gameId) return;
    setGameCode("");
    setSessionType(null);
    exitLobby();
    destroyGame(gameId);
    window.localStorage.removeItem("gameCode");
  };

  function WaitingLobby() {
    const [copied, setCopied] = useState(false);
    const copyToClipboard = () => {
      navigator.clipboard.writeText(gameCode).then(() => {
        setCopied(true);
        let timeout = setTimeout(() => {
          setCopied(false);
          clearTimeout(timeout);
        }, 2000);
      });
    };
    return (
      <div className="flex flex-col gap-4 items-center justify-center self-center align-middle">
        <BaseballButton onClick={endGame} disabled={false} className="w-48">
          Back
        </BaseballButton>
        <div className="bg-slate-700 rounded-lg py-6 px-12 text-center">
          <h1 className="text-lg mb-4">
            Game Started! Send this invite code to your friend:
          </h1>
          <div className="flex justify-center items-center gap-4">
            <h2 className="text-xl font-bold">{gameCode}</h2>
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-950 transition duration-150 ease-in-out min-w-14 text-lg"
            >
              {/* unicode for check mark? */}
              {copied ? "✔" : "📋︎"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {gameStarted && sessionType == "host" ? <WaitingLobby /> : InitialLobby()}
    </div>
  );
}
