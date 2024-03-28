import { useEffect, useState } from "react";
import { getRefreshesLeft } from "../../api/sessions/methods";

function useRefreshesLeft(
  currentPlayerSessionId: number
): [number, (refreshesLeft: number) => void] {
  const [refreshesLeft, setRefreshesLeft] = useState<number>(0);

  useEffect(() => {
    getRefreshesLeft(currentPlayerSessionId).then((res) => {
      setRefreshesLeft(res.refreshes);
    });
  }, [currentPlayerSessionId]);

  return [refreshesLeft, setRefreshesLeft];
}

export default useRefreshesLeft;
