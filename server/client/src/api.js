const PROD_API = "https://bkportfolio-1.onrender.com";

const BASE =
  (import.meta.env.VITE_API_BASE && import.meta.env.VITE_API_BASE.replace(/\/$/, "")) ||
  (location.hostname.includes("localhost") ? "http://127.0.0.1:5000" : PROD_API);

export const api = (path, init) => fetch(`${BASE}${path}`, init);
