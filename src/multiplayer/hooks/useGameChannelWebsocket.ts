import {
  hostInGame,
  guestInGame,
  getCurrentSessionsState,
} from "../../api/multiplayer/methods";
import { useEffect, useState } from "react";
import { Card, sessionType } from "../types";

const useGameChannelWebsocket = ({
  currentPlayerSessionId,
  gameId,
  sessionType,
}: {
  currentPlayerSessionId: number;
  gameId: number | null;
  sessionType: sessionType | null;
}): {
  websocket: WebSocket | null;
  gameReady: boolean;
  gameStarted: boolean;
  battleReady: boolean;
  currentSessionCard: Card | null;
  oppSessionCard: Card | null;
  invalidateCardRound: () => void;
  exitLobby: () => void;
  roundWinner: boolean | "tie" | null;
  gamewinner: "you" | "them" | null;
  finalWinnerScore: number;
  finalLoserScore: number;
  rematchRequestReceived: boolean;
} => {
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [gameReady, setGameReady] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentSessionCard, setCurrentSessionCard] = useState<Card | null>(
    null
  );

  const [rematchRequestReceived, setRematchRequestReceived] =
    useState<boolean>(false);
  const [roundWinner, setRoundWinner] = useState<boolean | "tie" | null>(null);

  const [gameWinner, setGameWinner] = useState<"you" | "them" | null>(null);
  const [finalWinnerScore, setfinalWinnerScore] = useState<number>(0);
  const [finalLoserScore, setFinalLoserScore] = useState<number>(0);
  const [oppSessionCard, setOppSessionCard] = useState<Card | null>(null);

  const battleReady = currentSessionCard && oppSessionCard ? true : false;

  useEffect(() => {
    // stuff to check on mount:
    //  1. if the game is over
    //  2. did we draw a card
    //  3. did we deal a card
    // 4. did the opponent deal a card
    if (gameId && currentPlayerSessionId) {
      getCurrentSessionsState(gameId).then((res) => {
        const session1 = res.session1;
        const session2 = res.session2;
        const mySession =
          session1.id === currentPlayerSessionId ? session1 : session2;
        const oppSession =
          session1.id === currentPlayerSessionId ? session2 : session1;
        if (oppSession.card && oppSession.dealt) {
          setOppSessionCard(oppSession.card);
        }
        if (mySession.card && mySession.dealt) {
          setCurrentSessionCard(mySession.card);
        }
      });
    }
  }, [gameId]);
  const handleCardPlayed = (message: any) => {
    // when we know it's the current session that played, we animate current sessions card sliding face up to the center
    // when we know it's the opp session that played, we animate opp sessions card sliding face down to the center
    // at the end of the animation,
    // if it was the current session's animation that just finished, we flip the opp session card face up
    // if it was the opp session's animation that just finished, we flip the opp session card face up
    // either way, it's the opp session's card that flips over, when both cards are ready.

    if (message.session.id === currentPlayerSessionId) {
      setCurrentSessionCard(message.player);
    } else {
      setOppSessionCard(message.player);
    }
  };

  const invalidateCardRound = () => {
    setCurrentSessionCard(null);
    setOppSessionCard(null);
  };

  const handleRoundWinner = (message: any) => {
    const winner = message.winner;
    if (winner === "tie") {
      setRoundWinner("tie");
    }
    switch (winner.id) {
      case currentPlayerSessionId:
        setRoundWinner(true);
        break;
      default:
        setRoundWinner(false);
    }
  };
  function handleGameWinner(message: any) {
    const winner = message.winner;
    const winnerScore = message.winner_score;
    const loserScore = message.loser_score;
    setfinalWinnerScore(winnerScore);
    setFinalLoserScore(loserScore);
    if (winner.id === currentPlayerSessionId) {
      setGameWinner("you");
    } else {
      setGameWinner("them");
    }
  }

  function handleGameRestart() {
    window.location.reload();
  }

  function handleRematchRequest(message: any) {
    if (message.requesting_session.id === currentPlayerSessionId) return;
    setRematchRequestReceived(true);
  }
  function handleInvalidGame() {
    setGameReady(false);
    window.alert("The game has been invalidated. Exiting game.");
    window.localStorage.clear();
    window.location.href = "/"; // Redirect home
  }

  function exitLobby() {
    setGameReady(false);
  }

  useEffect(() => {
    let ws: WebSocket;

    if (gameId) {
      ws = new WebSocket(`${import.meta.env.VITE_API_BASE_WS_URL}/cable`);
      ws.onopen = () => {
        console.log("Connected to WebSocket");
        const subscription = {
          command: "subscribe",
          identifier: JSON.stringify({
            channel: `GameChannel`,
            id: gameId,
          }),
        };
        ws.send(JSON.stringify(subscription));
        switch (sessionType) {
          case "host":
            hostInGame(gameId);
            break;
          case "guest":
            guestInGame(gameId);
            break;
        }
      };

      ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        const { message } = response;
        // Assuming your custom messages are encapsulated in another key like `data`
        if (response.type !== "ping") {
          // Check the custom `action` key
          if (message) {
            switch (message.action) {
              case "game_ready":
                setGameReady(true);
                break;
              case "card_dealt":
                handleCardPlayed(message);
                break;
              case "round_winner":
                handleRoundWinner(message);
                break;
              case "game_initiated":
                setGameStarted(true);
                break;
              case "invalid_game":
                handleInvalidGame();
                break;
              case "game_winner":
                handleGameWinner(message);
                break;
              case "game_restart":
                handleGameRestart();
                break;
              case "rematch_requested":
                handleRematchRequest(message);
                break;
              default:
                console.log("No action found");

              // Add more cases as needed
            }
          }
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket Error: ", error);
      };

      setWebsocket(ws);
    }

    const closeWebSocket = () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };

    return closeWebSocket;
    // setTimeout(closeWebSocket, 1000);
  }, [gameId]);

  return {
    gameStarted,
    websocket,
    gameReady,
    battleReady,
    currentSessionCard,
    oppSessionCard,
    invalidateCardRound,
    exitLobby,
    roundWinner,
    gamewinner: gameWinner,
    rematchRequestReceived,
    finalWinnerScore,
    finalLoserScore,
  };
};

export default useGameChannelWebsocket;
