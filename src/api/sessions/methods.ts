import { baseUrl } from "../base";

export function destroySession(sessionId: number) {
  return fetch(`${baseUrl}/sessions/${sessionId}`, {
    method: "DELETE",
  });
}
