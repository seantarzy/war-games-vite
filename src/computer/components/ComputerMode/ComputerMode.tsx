import { useEffect, useState } from "react";
import OpponentArea from "../OpponentArea/OpponentArea";
import FeedbackText from "../FeedbackText/FeedbackText";
import UserArea from "../UserArea/UserArea";
import BattleField from "../BattleField/BattleField";
import { publicGetRandomPlayer } from "../../../api/players/methods";
import { Card } from "../../../multiplayer/types";
import { getHealthCheck } from "../../../api/base";
import { ScoreBoard } from "../../../shared/components/Scoreboard";
import GameOverModal from "../../../shared/components/GameOverModal";
import { BaseballButton } from "../../../multiplayer/components/ui_components/Button";

function ComputerMode() {
  const [feedbackText, setfeedbackText] = useState(false);
  const [userScore, setuserScore] = useState(0);
  const [opponentScore, setopponentScore] = useState(0);
  const [userPlayer, setUserPlayer] = useState<Card | null>(null);
  const [compPlayer, setCompPlayer] = useState<Card | null>(null);
  const [battleInSession, setBattleInSession] = useState(false);
  const [flip, setFlip] = useState(false);
  const [userWinsBattle, setUserWinsBattle] = useState(false);
  const [cardsRevealed, setCardsRevealed] = useState(false);
  const [gameStart, setGameStart] = useState(false);
  const [appUp, setAppUp] = useState<boolean | null>(null);
  const [gameWinner, setGameWinner] = useState<string | null>(null);
  const dealCard = () => {
    setGameStart(true);
    setCardsRevealed(false);
    setFlip(false);
    setBattleInSession(false);
    setUserPlayer(null);
    setCompPlayer(null);
    drawRandomPlayer("user");
    drawRandomPlayer("opponent");
  };

  useEffect(() => {
    getHealthCheck().then((res) => {
      setAppUp(res.ok);
    });
  }, []);

  useEffect(() => {
    if (userPlayer && compPlayer) {
      setTimeout(() => {
        let userPlayerWar = userPlayer["war"];
        let compPlayerWar = compPlayer["war"];
        let userPlayerWarFloat = parseFloat(userPlayerWar);
        let compPlayerWarFloat = parseFloat(compPlayerWar);
        handleBattle(userPlayerWarFloat, compPlayerWarFloat);
      }, 100);
    }
  }, [userPlayer, compPlayer]);

  function refreshPage() {
    setGameWinner(null);
    window.location.reload();
  }

  const handleWinner = (winner: "user" | "opponent") => {
    setGameWinner(winner);
  };

  const handleBattlePoint = (
    userPlayerWar: number,
    opponentPlayerWar: number
  ) => {
    if (userPlayerWar > opponentPlayerWar) {
      setUserWinsBattle(true);
      setuserScore(userScore + 1);
      if (userScore === 9) {
        handleWinner("user");
      }
    } else if (userPlayerWar < opponentPlayerWar) {
      setopponentScore(opponentScore + 1);
      if (opponentScore === 9) {
        handleWinner("opponent");
      }
    }
  };

  const handleBattle = (userPlayerWar: number, compPlayerWar: number) => {
    setBattleInSession(true);
    setTimeout(() => {
      if (userPlayerWar > compPlayerWar) {
        setUserWinsBattle(true);
      } else if (userPlayerWar < compPlayerWar) {
        setUserWinsBattle(false);
      }
      setfeedbackText(true);
      setFlip(true);
    }, 2000);

    setTimeout(() => {
      setCardsRevealed(true);
    }, 3000);

    setTimeout(() => {
      handleBattlePoint(userPlayerWar, compPlayerWar);
      setfeedbackText(false);
    }, 4100);
  };

  const drawRandomPlayer = (side: "user" | "opponent"): void => {
    publicGetRandomPlayer().then((res: Card) => {
      if (side === "user") {
        setUserPlayer(res);
      } else {
        setCompPlayer(res);
      }
    });
  };
  return (
    <div className="h-full w-full">
      {appUp ? (
        <>
          <div className="fixed top-16 left-16 hidden md:block ">
            <BaseballButton
              disabled={false}
              className="w-40 h-12"
              onClick={() => {
                window.location.href = "/";
              }}
            >
              Home
            </BaseballButton>
          </div>
          <div className="flex justify-center">
            <ScoreBoard myScore={userScore} oppScore={opponentScore} />
          </div>
          {feedbackText ? (
            <FeedbackText userWinsBattle={userWinsBattle} />
          ) : null}
          <OpponentArea
            compPlayer={compPlayer}
            battleInSession={battleInSession}
            flip={flip}
          />
          <BattleField />
          <UserArea
            onDealCard={dealCard}
            userPlayer={userPlayer as Card}
            battleInSession={battleInSession}
            flip={flip}
            score={userScore + opponentScore}
            cardsRevealed={cardsRevealed}
            gameStart={gameStart}
            gameOver={!!gameWinner}
          />
        </>
      ) : appUp === false ? (
        <div className="loading">
          <h2>App is down for maintenance</h2>
        </div>
      ) : (
        <div className="loading-blank"></div>
      )}
      <GameOverModal
        isOpen={gameWinner !== null}
        winner={gameWinner || ""}
        onRestart={refreshPage}
        onExit={refreshPage}
        onClose={() => setGameWinner(null)}
        winnerScore={userScore}
        loserScore={opponentScore}
      />
    </div>
  );
}

export default ComputerMode;
