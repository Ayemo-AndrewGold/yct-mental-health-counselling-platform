// Single source of truth for the backend API URL.
// In development: reads from .env.local (NEXT_PUBLIC_API_URL)
// Fallback: local Django dev server
// For production deployment: set NEXT_PUBLIC_API_URL in your hosting env vars

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api/auth';
