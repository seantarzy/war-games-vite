import { useEffect, useState } from "react";

const CARD_SLIDE_TIME_DURATION = 1000;
function useCardMiddleState(
  opponentReady: boolean,
  currentReady: boolean
): {
  oppCardInMiddle: boolean;
  currentCardInMiddle: boolean;
  setOppCardInMiddle: (arg0: boolean) => void;
  setCurrentCardInMiddle: (arg0: boolean) => void;
} {
  const [oppCardInMiddle, setOppCardInMiddle] = useState(false);
  const [currentCardInMiddle, setCurrentCardInMiddle] = useState(false);

  useEffect(() => {
    if (opponentReady) {
      const timerId = setTimeout(
        () => setOppCardInMiddle(true),
        CARD_SLIDE_TIME_DURATION
      );
      return () => clearTimeout(timerId);
    }
  }, [opponentReady]);

  useEffect(() => {
    if (currentReady) {
      const timerId = setTimeout(
        () => setCurrentCardInMiddle(true),
        CARD_SLIDE_TIME_DURATION
      );
      return () => clearTimeout(timerId);
    }
  }, [currentReady]);

  return {
    oppCardInMiddle,
    currentCardInMiddle,
    setOppCardInMiddle,
    setCurrentCardInMiddle,
  };
}

export default useCardMiddleState;
