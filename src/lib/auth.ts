/** Session token helpers. */

/** Generates a session token using the platform CSPRNG (Web Crypto).
 * 256 bit of entropy, hex-encoded — not predictable from observed output. */
export function newSessionToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
