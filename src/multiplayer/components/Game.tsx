import React, { useState, useEffect, memo } from "react";
import { getRandomPlayer } from "../../api/players/methods";
import useGameChannelWebsocket from "../hooks/useGameChannelWebsocket";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Card } from "../types";
import {
  dealCard,
  getCurrentSessionsState,
} from "../../api/multiplayer/methods";
import { animated } from "@react-spring/web";
import { BaseballButton } from "./ui_components/Button";
import { PlayerCard } from "./ui_components/PlayerCard";
import RainingDeck, { TIME_TO_MAKE_IT_RAIN } from "./ui_components/RainingDeck";
import { destroySession, getRefreshesLeft } from "../../api/sessions/methods";
import { useHandleGameScore } from "../hooks/useHandleGameScore";
import { useCardSlideSpring } from "../hooks/useCardSlideSpring";
import ScoreIcon from "../../assets/war-games-score-icon.png";
import GameOverModal from "../../shared/components/GameOverModal";
import { AnimatedText } from "./ui_components/AnimationText";
import { restartGame } from "../../api/game/methods";
import { Toast } from "./ui_components/Toast";
const CARD_SLIDE_TIME_DURATION: number = 800;

const CARD_BATTLE_TIME_DURATION: number = 1500;
export default function MultiplayerGame({ gameId }: { gameId: number }) {
  const [currentPlayerSessionId] = useLocalStorage("sessionId", 0);
  const [sessionType] = useLocalStorage("sessionType", null);
  const [gameOverModelOpen, setGameOverModelOpen] = useState(false);
  const [cardSlideReady, setcardSlideReady] = useState(false);
  const [oppCardInMiddle, setOppCardInMiddle] = useState(false);
  const [currentCardInMiddle, setCurrentCardInMiddle] = useState(false);
  const [animatedText, setAnimatedText] = useState("");
  const [cardDrawn, setCardDrawn] = useState<Card | null>(null);
  const [refreshesLeft, setRefreshesLeft] = useState(0);
  const [myDeckRaining, setMyDeckRaining] = useState(false);
  const [oppDeckRaining, setOppDeckRaining] = useState(false);
  const [toggleRain, setToggleRain] = useState(false);
  const {
    currentSessionCard,
    oppSessionCard,
    invalidateCardRound,
    roundWinner,
    gamewinner,
    finalWinnerScore,
    finalLoserScore,
    rematchRequestReceived,
  } = useGameChannelWebsocket({
    gameId: gameId,
    currentPlayerSessionId: currentPlayerSessionId,
    sessionType: sessionType,
  });

  // state variables for holding scores when we're ready to show them
  // 'current session' is whoever is currently interacting with the client
  // 'opp session' is the other player

  const drawRando = () => {
    getRandomPlayer(gameId, currentPlayerSessionId).then(
      ({
        player,
        refreshes_left,
      }: {
        player: Card;
        refreshes_left: number;
      }) => {
        setCardDrawn(player);
        if (refreshesLeft > 0) {
          setRefreshesLeft(refreshes_left);
        }
      }
    );
  };

  const [oppFlipped, setOppFlipped] = useState(true);
  const [currentFlipped, setCurrentFlipped] = useState(true);

  let opponentReady = !!oppSessionCard;
  let currentReady = !!currentSessionCard;
  let battleReady =
    !!currentSessionCard &&
    !!oppSessionCard &&
    !!oppCardInMiddle &&
    !!currentCardInMiddle;

  const { myScore, oppScore } = useHandleGameScore(
    gameId,
    currentPlayerSessionId,
    battleReady
  );
  if (currentPlayerSessionId === 0) {
    console.error("No session id found");
  }

  const sendMove = () => {
    if (!cardDrawn || !currentPlayerSessionId || !gameId) {
      return;
    }
    const playerId = parseInt(cardDrawn.id);
    dealCard(gameId, currentPlayerSessionId, playerId).then((res) => {
      setcardSlideReady(true);
    });
  };

  useEffect(() => {
    if (!gameId) return;
    if (!currentPlayerSessionId) return;
    getCurrentSessionsState(gameId).then((res) => {
      const session1 = res.session1;
      const session2 = res.session2;
      const mySession =
        session1.id === currentPlayerSessionId ? session1 : session2;
      if (mySession.card) {
        setCardDrawn(mySession.card);
      }
      if (mySession.card && mySession.dealt) {
        setcardSlideReady(true);
      }
    });
  }, [gameId]);

  useEffect(() => {
    setMyDeckRaining(true);
    setTimeout(() => {
      setMyDeckRaining(false);
    }, TIME_TO_MAKE_IT_RAIN);
    setOppDeckRaining(true);
    setTimeout(() => {
      setOppDeckRaining(false);
    }, TIME_TO_MAKE_IT_RAIN);
  }, [gameId, toggleRain]);

  useEffect(() => {
    getRefreshesLeft(currentPlayerSessionId).then((res) => {
      setRefreshesLeft(res.refreshes);
    });
  }, [currentPlayerSessionId]);

  useEffect(() => {
    if (!!gamewinner && battleReady) {
      setGameOverModelOpen(true);
    }
  }, [gamewinner, battleReady]);

  useEffect(() => {
    if (opponentReady) {
      setTimeout(() => {
        setOppCardInMiddle(true);
      }, CARD_SLIDE_TIME_DURATION);
    }
  }, [opponentReady]);

  useEffect(() => {
    if (currentReady) {
      let tomeoutId: number;
      setTimeout(() => {
        setCurrentCardInMiddle(true);
      }, CARD_SLIDE_TIME_DURATION);

      return () => {
        clearTimeout(tomeoutId);
      };
    }
  }, [currentReady]);

  useEffect(() => {
    if (battleReady) {
      let tomeoutId: number;
      let secondTimeoutId: number;
      tomeoutId = setTimeout(() => {
        secondTimeoutId = setTimeout(() => {
          setOppCardInMiddle(false);
          setcardSlideReady(false);
          invalidateCardRound();
          setCardDrawn(null);
          setCurrentCardInMiddle(false);
          setOppFlipped(true);
          setToggleRain(!toggleRain);
        }, CARD_BATTLE_TIME_DURATION);
      }, CARD_SLIDE_TIME_DURATION);

      return () => {
        clearTimeout(tomeoutId);
        clearTimeout(secondTimeoutId);
      };
    }
  }, [battleReady]);

  useEffect(() => {
    if (battleReady && roundWinner !== null) {
      if (roundWinner === "tie") {
        setAnimatedText("Tie!");
      } else {
        if (roundWinner) {
          setAnimatedText("You win!");
        } else {
          setAnimatedText("You lose!");
        }
      }
    }
  }, [roundWinner, battleReady]);

  // slide baby slide

  const { currentSlideIn, opponentSlideIn } = useCardSlideSpring({
    currentReady: cardSlideReady,
    opponentReady: !!oppSessionCard,
    timeToSlide: CARD_SLIDE_TIME_DURATION,
  });

  // need a useEffect that grabs
  //   a) the card drawn
  //     i. whether this card drawn was dealt
  //   b) the card the opponent drew and dealt

  // if we're drawn but not dealt,

  useEffect(() => {
    if (cardDrawn) {
      setCurrentFlipped(false);
    }
  }, [cardDrawn]);

  const MySide = memo(() => {
    function MyButtonSet() {
      return (
        <div className="flex flex-col gap-4 self-center max-w-64">
          <div className="text-white text-center">
            Refreshes left: {refreshesLeft}
          </div>
          <BaseballButton
            onClick={drawRando}
            disabled={!!cardDrawn && refreshesLeft === 0}
            className="h-14 w-42"
          >
            {cardDrawn ? "Redraw" : "Draw Player"}
          </BaseballButton>

          <BaseballButton
            onClick={sendMove}
            disabled={!cardDrawn}
            className="h-14 w-42"
          >
            Send Move
          </BaseballButton>
        </div>
      );
    }

    return (
      <div className="flex m-5 self-end justify-between">
        {!currentSessionCard && <MyButtonSet />}
        {cardDrawn ? (
          <div className="ml-20">
            <animated.div style={currentSlideIn}>
              <PlayerCard
                player={cardDrawn}
                side="current"
                flipped={currentFlipped}
              />
            </animated.div>
          </div>
        ) : (
          <div className="mr-20">
            <RainingDeck
              key={`my-side-${gameId}`}
              whoseSide="mine"
              initiallyRaining={myDeckRaining}
            />
          </div>
        )}
      </div>
    );
  });

  useEffect(() => {
    if (oppSessionCard && oppCardInMiddle && battleReady) {
      setOppFlipped(false);
    }
  }, [oppSessionCard, oppCardInMiddle, battleReady]);

  const TheirSide = memo(() => {
    return (
      <div className="flex flex-col m-5">
        {!oppSessionCard ? (
          // not even ready yet, maybe has drawn a card at most
          <div className="relative ml-[-48px]">
            <RainingDeck
              key={`their-deck-${gameId}`}
              whoseSide="theirs"
              initiallyRaining={oppDeckRaining}
            />
          </div>
        ) : (
          <animated.div style={opponentSlideIn}>
            <PlayerCard
              player={oppSessionCard}
              side="opponent"
              flipped={oppFlipped}
            />
          </animated.div>
        )}
      </div>
    );
  });

  function ScoreBoard() {
    return (
      <div className="bg-slate-950 text-lg justify-center w-1/2 md:w-2/5 m-2 rounded-lg">
        <div className="flex justify-between border-b-2 p-2 md:p-4 h-16 md:h-20 w-full items-center">
          <div className="flex h-full w-full items-center gap-2">
            <img src={ScoreIcon} alt="score icon" className="h-4/5" />
            <div className="text-xl">Your Score</div>
          </div>
          <div className="mr-4 text-xl">{myScore}</div>
        </div>
        <div className="flex justify-between p-2 md:p-4 h-16 md:h-20 w-full items-center">
          <div className="flex h-full w-full items-center gap-2">
            <img src={ScoreIcon} alt="score icon" className="h-4/5" />
            <div className="text-xl">Opponent Score</div>
          </div>
          <div className="mr-4 text-xl">{oppScore}</div>
        </div>
      </div>
    );
  }

  function BattleField() {
    return <div>{battleReady && <AnimatedText text={animatedText} />}</div>;
  }

  function exitGame() {
    try {
      destroySession(currentPlayerSessionId);
      window.localStorage.clear();
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  }

  function ExitButton() {
    return (
      <BaseballButton
        onClick={() => {
          const confirmExit = window.confirm(
            "Are you sure you want to exit? This will end the game."
          );
          if (confirmExit) {
            exitGame();
          }
        }}
        disabled={false}
        className="w-24 h-12"
      >
        Exit
      </BaseballButton>
    );
  }

  function onRestart() {
    restartGame(gameId, currentPlayerSessionId);
  }

  function onModalClose() {
    setGameOverModelOpen(false);
  }

  return (
    <>
      <GameOverModal
        isOpen={gameOverModelOpen && !rematchRequestReceived}
        winner={gamewinner as string}
        onRestart={onRestart}
        onExit={exitGame}
        winnerScore={finalWinnerScore}
        loserScore={finalLoserScore}
        onClose={onModalClose}
      />
      <div className="flex flex-col h-full flex-1 ">
        <div className="flex align-top items-start justify-center">
          <ScoreBoard />
        </div>
        <div className="flex flex-col align-middle justify-between h-full">
          <div className="self-start ml-6">
            <TheirSide />
          </div>
          {/* battle field */}
          <BattleField />
          <div>{battleReady ? <div id="battle-field"></div> : null}</div>
          <div className="fixed bottom-0 flex justify-right md:justify-between w-full">
            <div className="hidden md:top-0 md:relative md:block md:self-end md:m-8">
              <ExitButton />
            </div>
            <div className="self-end fkex-1 right-0">
              <MySide />
            </div>
            <Toast
              rematchRequestReceived={rematchRequestReceived}
              onAccept={() => {
                onRestart();
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
