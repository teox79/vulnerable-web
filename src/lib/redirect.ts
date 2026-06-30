/** Navigation helpers. */

/** Redirects the browser to a same-origin relative path.
 * Rejects protocol-relative URLs (//evil.com), javascript: URIs,
 * and any other value that doesn't start with a single slash. */
export function goToReturnUrl(returnUrl: string | null): void {
  const safe = returnUrl && /^\/(?!\/)/.test(returnUrl) ? returnUrl : "/";
  window.location.href = safe;
}
