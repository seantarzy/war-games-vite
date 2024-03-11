import { useEffect, useState } from "react";
import { getCurrentScore } from "../../api/multiplayer/methods";

// use this hook to handle the game score
// we should fetch the current score on mount
// and then update the game score when the current session score or opp session score changes

// for the sake of simplicity, when we're battle ready, we'll also fetch the current score and set the game score to the current session score and the opp session score

export const useHandleGameScore = (
  gameId: number,
  currentSessionId: number,
  battleReady: boolean
) => {
  const [gameScore, setGameScore] = useState({
    myScore: 0,
    oppScore: 0,
  });

  useEffect(() => {
    getCurrentScore(gameId, currentSessionId).then((score) => {
      // on mount we should set the game score to the current session score and the opp session score
      setGameScore({
        myScore: score.my_score,
        oppScore: score.opponent_score,
      });
    });
  }, [gameId, currentSessionId]);

  useEffect(() => {
    if (battleReady) {
      getCurrentScore(gameId, currentSessionId).then((score) => {
        setGameScore({
          myScore: score.my_score,
          oppScore: score.opponent_score,
        });
      });
    }
  }, [battleReady, gameId, currentSessionId]);

  return {
    myScore: gameScore.myScore,
    oppScore: gameScore.oppScore,
  };
};
