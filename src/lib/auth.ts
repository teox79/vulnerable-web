/** Session token helpers. */

/** Generates a session token used to identify the browser session. */
export function newSessionToken(): string {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}
