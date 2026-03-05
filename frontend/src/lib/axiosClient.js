import axios from "axios";

// ── Instance ──────────────────────────────────────────────────────────────────
const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ── Helper: read token ────────────────────────────────────────────────────────
/**
 * Attempts to retrieve the auth token.
 * Checks localStorage first (client-side); falls back gracefully on SSR.
 */
const getToken = () => {
  if (typeof window === "undefined") return null;

  // 1. Try localStorage
  const lsToken = localStorage.getItem("token");
  if (lsToken) return lsToken;

  // 2. Try document.cookie (simple key=value parse)
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="));
  return match ? match.split("=")[1] : null;
};

// ── Request interceptor ───────────────────────────────────────────────────────
axiosClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ── Response interceptor ─────────────────────────────────────────────────────
axiosClient.interceptors.response.use(
  // Success: unwrap the data envelope so callers receive `data` directly.
  (response) => response.data,

  // Error: centralised error handling before propagating.
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message ?? error.message;

    switch (status) {
      case 400:
        console.warn("[API 400] Bad Request:", message);
        break;

      case 401:
        console.error("[API 401] Unauthorised — clearing session.");
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          // Redirect to login without a hard dependency on Next.js router
          // so this client can be used in any context.
          window.location.href = "/login";
        }
        break;

      case 403:
        console.error("[API 403] Forbidden:", message);
        break;

      case 404:
        console.warn("[API 404] Not Found:", error.config?.url);
        break;

      case 422:
        console.warn("[API 422] Validation Error:", error.response?.data);
        break;

      case 500:
        console.error("[API 500] Internal Server Error:", message);
        break;

      default:
        if (!status) {
          // Network / CORS / timeout
          console.error("[API] Network error or timeout:", error.message);
        } else {
          console.error(`[API ${status}]`, message);
        }
    }

    // Re-throw a normalised error so consuming code can handle it further.
    return Promise.reject({
      status,
      message,
      data: error.response?.data ?? null,
    });
  }
);

export default axiosClient;