/** false par défaut — passer VITE_USE_MOCK=true pour le mode démo sans backend */
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK === 'true';

export const API_URL = import.meta.env.VITE_API_URL ?? '/api';

/** Client ID Google Cloud Console (OAuth 2.0 — type « Application Web ») */
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';

export const IS_GOOGLE_AUTH_ENABLED = GOOGLE_CLIENT_ID.length > 0;
