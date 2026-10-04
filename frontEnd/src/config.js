const apiUrl = import.meta.env.VITE_API_URL?.trim();

if (import.meta.env.PROD && !apiUrl) {
  throw new Error("VITE_API_URL is required for production.");
}

export const API_BASE_URL = (
  apiUrl || "http://localhost:5000"
).replace(/\/+$/, "");