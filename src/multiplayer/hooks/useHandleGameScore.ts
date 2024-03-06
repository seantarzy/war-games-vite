import React, { useEffect, useState } from "react";

export const useHandleGameScore = (
  currentSessionScore: number,
  oppSessionScore: number,
  battleReady: boolean
) => {
  const [gameScore, setGameScore] = useState({
    currentSessionScore,
    oppSessionScore,
  });

  useEffect(() => {
    if ((currentSessionScore || oppSessionScore) && battleReady) {
      setGameScore({ currentSessionScore, oppSessionScore });
    }
  }, [currentSessionScore, oppSessionScore, battleReady]);

  return {
    readyCurrentScore: gameScore.currentSessionScore,
    readyOppScore: gameScore.oppSessionScore,
  };
};
