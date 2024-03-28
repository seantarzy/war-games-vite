import { useEffect, useState } from "react";
import { TIME_TO_MAKE_IT_RAIN } from "../components/ui_components/RainingDeck";
function useDeckRaining(
  toggleRain: boolean,
  gameId: number
): {
  myDeckRaining: boolean;
  oppDeckRaining: boolean;
} {
  const [myDeckRaining, setMyDeckRaining] = useState(false);
  const [oppDeckRaining, setOppDeckRaining] = useState(false);

  useEffect(() => {
    setMyDeckRaining(true);
    const timerId = setTimeout(
      () => setMyDeckRaining(false),
      TIME_TO_MAKE_IT_RAIN
    );

    setOppDeckRaining(true);
    const oppTimerId = setTimeout(
      () => setOppDeckRaining(false),
      TIME_TO_MAKE_IT_RAIN
    );

    return () => {
      clearTimeout(timerId);
      clearTimeout(oppTimerId);
    };
  }, [gameId, toggleRain]);

  return { myDeckRaining, oppDeckRaining };
}

export default useDeckRaining;
