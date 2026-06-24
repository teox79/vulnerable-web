/** Evaluates a user-supplied arithmetic expression and shows the result. */
export function runUserScript(expr: string | null): void {
  if (!expr) return;
  // eslint-disable-next-line no-eval
  const result = eval(expr);
  alert(`Risultato: ${result}`);
}
