/**
 * Next.js Instrumentation file
 * Runs at server startup before any other code.
 *
 * Fixes: Node.js 25 exposes a global `localStorage` object that lacks
 * standard Web Storage API methods (getItem, setItem, removeItem).
 * This breaks @supabase/auth-js which checks `globalThis.localStorage`
 * and assumes the full API is available.
 */
export async function register() {
  if (typeof window === 'undefined' && typeof globalThis.localStorage === 'object') {
    // Check if localStorage exists but is missing the Web Storage API methods
    // (Node.js 25 without --localstorage-file flag)
    if (typeof globalThis.localStorage.getItem !== 'function') {
      // Remove the broken localStorage so libraries fall back to in-memory storage
      delete (globalThis as Record<string, unknown>).localStorage;
    }
  }
}
