const BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");
export const api = (path, opts) => fetch(`${BASE}${path}`, opts);
