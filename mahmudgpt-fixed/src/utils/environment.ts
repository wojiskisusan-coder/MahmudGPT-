/**
 * Environment detection utility for multi-deployment compatibility.
 * Detects whether the app is running in Lovable's environment or externally (e.g., Vercel).
 */

export function isLovableEnvironment(): boolean {
  const hostname = window.location.hostname;
  return (
    hostname.includes("lovable.app") ||
    hostname.includes("lovableproject.com") ||
    hostname === "localhost" ||
    hostname === "127.0.0.1"
  );
}

export function getRedirectUrl(path = "/"): string {
  return `${window.location.origin}${path}`;
}

/**
 * Returns the Supabase URL, preferring VITE env vars but allowing override.
 */
export function getSupabaseUrl(): string {
  return import.meta.env.VITE_SUPABASE_URL || "";
}

/**
 * Returns the Supabase anon/publishable key.
 */
export function getSupabaseAnonKey(): string {
  return import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";
}
