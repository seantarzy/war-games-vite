import { baseUrl } from "../base";

// specific to a game
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

// not tied to a specific game, public endpoint
export async function publicGetRandomPlayer() {
  const res = await fetch(`${baseUrl}/random_player`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to get random player");
  }
  return res.json();
}

export async function refreshCard(gameId: number, sessionId: number) {
  const res = await fetch(`${baseUrl}/refresh_card`, {
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
    throw new Error("Failed to refresh card");
  }
  return res.json();
}

export async function getAllPlayers() {
  const res = await fetch(`${baseUrl}/players`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to get all players");
  }
  return res.json();
}
