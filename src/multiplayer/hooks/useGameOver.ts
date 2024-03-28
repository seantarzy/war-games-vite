import { useEffect, useState } from "react";

function useGameOver(
  gamewinner: string | null,
  battleReady: boolean
): [boolean, (gameOverModelOpen: boolean) => void] {
  const [gameOverModelOpen, setGameOverModelOpen] = useState(false);

  useEffect(() => {
    if (gamewinner && battleReady) {
      setGameOverModelOpen(true);
    }
  }, [gamewinner, battleReady]);

  return [gameOverModelOpen, setGameOverModelOpen];
}

export default useGameOver;
