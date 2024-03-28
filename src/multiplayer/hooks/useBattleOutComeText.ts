import { useEffect, useState } from "react";

function useBattleOutComeText(
  battleReady: boolean,
  roundWinner: "tie" | boolean | null
) {
  const [animatedText, setAnimatedText] = useState("");
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

  return animatedText;
}

export default useBattleOutComeText;
