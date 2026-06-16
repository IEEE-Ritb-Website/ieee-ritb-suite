/**
 * Safely determines if the active environment is production.
 * Handles both Node.js (process.env.NODE_ENV) and bundler environments (import.meta.env.PROD).
 * This entrypoint is safe to import in browser environments.
 */
export function isProduction(): boolean {
  try {
    if (typeof process !== "undefined" && process.env && process.env.NODE_ENV === "production") {
      return true;
    }
  } catch (e) {}
  try {
    if (typeof import.meta !== "undefined" && (import.meta as any).env && (import.meta as any).env.PROD) {
      return true;
    }
  } catch (e) {}
  return false;
}
