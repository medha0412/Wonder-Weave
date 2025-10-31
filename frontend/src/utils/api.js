// Simple API base helper to avoid dev proxies
const DEFAULT_API_BASE = 'http://localhost:5000/api';
const PRODUCTION_API_BASE = 'https://wonder-weave-1.onrender.com/api';

export const API_BASE = (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL)
  ? import.meta.env.VITE_API_BASE_URL
  : (import.meta.env.PROD ? PRODUCTION_API_BASE : DEFAULT_API_BASE);

export const api = (path) => {
  if (!path) return API_BASE;
  return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
};


