const base = (import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000").replace(/\/+$/, "");
export const api = (path, opts = {}) => {
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;
  return fetch(url, { mode: "cors", ...opts });
};
console.log("API ->", base);
