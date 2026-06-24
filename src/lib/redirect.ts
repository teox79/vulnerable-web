/** Navigation helpers. */

/** Redirects the browser to the URL provided by the caller. */
export function goToReturnUrl(returnUrl: string | null): void {
  window.location.href = returnUrl ?? "/";
}
