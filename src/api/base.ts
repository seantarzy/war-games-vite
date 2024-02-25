export const baseUrl =
  import.meta.env.NODE_ENV === "production"
    ? "heroku"
    : "http://127.0.0.1:3001";
