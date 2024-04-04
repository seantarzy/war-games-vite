export const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const getHealthCheck = async () => {
  const res = await fetch(`${baseUrl}/up`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to get health check");
  }
  return res;
};
