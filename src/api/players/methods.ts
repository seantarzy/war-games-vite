import { baseUrl } from "../base";
export async function getRandomPlayer(gameId: number, sessionId: number) {
  const res = await fetch(`${baseUrl}/draw_card`, {
    method: "POST",
    body: JSON.stringify({
      game_id: gameId,
      session_id: sessionId,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to get random player");
  }
  return res.json();
}
