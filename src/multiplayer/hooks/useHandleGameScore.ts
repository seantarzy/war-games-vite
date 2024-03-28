import { useEffect, useState } from "react";
import { getCurrentScore } from "../../api/multiplayer/methods";

export const useHandleGameScore = (
  gameId: number,
  currentSessionId: number,
  battleReady: boolean
) => {
  const [gameScore, setGameScore] = useState({ myScore: 0, oppScore: 0 });

  useEffect(() => {
    const fetchAndUpdateScores = async () => {
      try {
        const score = await getCurrentScore(gameId, currentSessionId);
        setGameScore({
          myScore: score.my_score,
          oppScore: score.opponent_score,
        });
      } catch (error) {
        console.error("Failed to fetch scores", error);
      }
    };

    fetchAndUpdateScores();
  }, [gameId, currentSessionId, battleReady]); // Merged the effects by including battleReady as a dependency

  return {
    myScore: gameScore.myScore,
    oppScore: gameScore.oppScore,
  };
};
