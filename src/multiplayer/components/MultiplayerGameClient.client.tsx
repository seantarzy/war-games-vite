import React, { useState, useEffect, useMemo, useRef, memo } from "react";
import { getRandomPlayer } from "../../api/players/methods";
import useGameChannelWebsocket from "../hooks/useGameChannelWebsocket";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Card } from "../types";
import { dealCard } from "../../api/multiplayer/methods";
import { animated } from "@react-spring/web";
import { BaseballButton } from "./ui_components/Button";
import { PlayerCard } from "./ui_components/PlayerCard";
import RainingDeck, { TIME_TO_MAKE_IT_RAIN } from "./ui_components/RainingDeck";
import { destroySession } from "../../api/sessions/methods";
import { useMakeItRain } from "../hooks/useMakeItRain";
import { useHandleGameScore } from "../hooks/useHandleGameScore";
import { useCardSlideSpring } from "../hooks/useCardSlideSpring";

const CARD_SLIDE_TIME_DURATION: number = 800;

const CARD_BATTLE_TIME_DURATION: number = 1500;
export default function MultiplayerGame({ gameId }: { gameId: number }) {
  const [currentPlayerSessionId] = useLocalStorage("sessionId", 0);
  const [sessionType] = useLocalStorage("sessionType", null);

  const [cardSlideReady, setcardSlideReady] = useState(false);
  const [oppCardInMiddle, setOppCardInMiddle] = useState(false);
  const [currentCardInMiddle, setCurrentCardInMiddle] = useState(false);

  const [cardDrawn, setCardDrawn] = useState<Card | null>(null);
  const {
    currentSessionCard,
    oppSessionCard,
    currentSessionScore,
    oppSessionScore,
    invalidateCardRound,
  } = useGameChannelWebsocket({
    gameId: gameId,
    currentPlayerSessionId: currentPlayerSessionId,
    sessionType: sessionType,
  });

  // state variables for holding scores when we're ready to show them
  // 'current session' is whoever is currently interacting with the client
  // 'opp session' is the other player

  const drawRando = () => {
    getRandomPlayer().then((card: Card) => {
      setCardDrawn(card);
    });
  };

  const [oppFlipped, setOppFlipped] = useState(true);
  const [currentFlipped, setCurrentFlipped] = useState(true);

  const { makeItRain, toggleMakeItRain } = useMakeItRain(TIME_TO_MAKE_IT_RAIN);

  let opponentReady = !!oppSessionCard;
  let currentReady = !!currentSessionCard;
  let battleReady =
    !!currentSessionCard &&
    !!oppSessionCard &&
    !!oppCardInMiddle &&
    !!currentCardInMiddle;

  const { readyCurrentScore, readyOppScore } = useHandleGameScore(
    currentSessionScore,
    oppSessionScore,
    battleReady
  );
  if (currentPlayerSessionId === 0) {
    console.error("No session id found");
  }

  const sendMove = () => {
    if (!cardDrawn) {
      return;
    }
    const playerId = parseInt(cardDrawn.id);

    dealCard(gameId, currentPlayerSessionId, playerId).then((res) => {
      setcardSlideReady(true);
    });
  };

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
          toggleMakeItRain();
        }, CARD_BATTLE_TIME_DURATION);
      }, CARD_SLIDE_TIME_DURATION);

      return () => {
        clearTimeout(tomeoutId);
        clearTimeout(secondTimeoutId);
      };
    }
  }, [battleReady]);

  // slide baby slide

  const { currentSlideIn, opponentSlideIn } = useCardSlideSpring({
    currentReady: cardSlideReady,
    opponentReady: !!oppSessionCard,
    timeToSlide: CARD_SLIDE_TIME_DURATION,
  });

  useEffect(() => {
    if (cardDrawn) {
      setCurrentFlipped(false);
    }
  }, [cardDrawn]);

  const MySide = memo(() => {
    function MyButtonSet() {
      return (
        <div className="flex flex-col gap-4 self-center max-w-64">
          <BaseballButton
            onClick={drawRando}
            disabled={false}
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
            <RainingDeck raining={makeItRain} />
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
            <RainingDeck raining={makeItRain} />
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
      <div className="bg-black rounded text-lg justify-center w-1/2">
        <div>Your score: {readyCurrentScore}</div>
        <div>Opponent score: {readyOppScore}</div>
      </div>
    );
  }

  function BattleField() {
    return (
      <div>
        {battleReady ? (
          <div>
            <h2>Battle!</h2>
          </div>
        ) : null}
      </div>
    );
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
          window.alert(
            "Are you sure you want to exit? This will end the game."
          );
          exitGame();
        }}
        disabled={false}
        className="w-24 h-12"
      >
        Exit
      </BaseballButton>
    );
  }

  return (
    <div className="flex flex-col h-full flex-1">
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
        <div className="fixed bottom-0 flex justify-between w-full">
          <div className="self-end m-8">
            <ExitButton />
          </div>
          <div className="self-end fkex-1 right-0">
            <MySide />
          </div>
        </div>
      </div>
    </div>
  );
}