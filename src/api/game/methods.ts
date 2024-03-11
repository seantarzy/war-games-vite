import { baseUrl } from "../base";

export const destroyGame = async (gameId: number) => {
  fetch(`${baseUrl}/games/${gameId}`, {
    method: "DELETE",
  });
};

export const restartGame = async (gameId: number, session_id: number) => {
  fetch(`${baseUrl}/games/${gameId}/restart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ session_id }),
  });
};
