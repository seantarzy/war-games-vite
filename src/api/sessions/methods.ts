import { baseUrl } from "../base";

export function destroySession(sessionId: number) {
  return fetch(`${baseUrl}/sessions/${sessionId}`, {
    method: "DELETE",
  });
}

export function getRefreshesLeft(sessionId: number) {
  return fetch(`${baseUrl}/sessions/${sessionId}/refreshes_left`).then((res) =>
    res.json()
  );
}
