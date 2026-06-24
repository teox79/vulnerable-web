/** Evaluates a user-supplied arithmetic expression and shows the result.
 *
 * The expression is parsed by a small recursive-descent evaluator that only
 * understands numbers and the operators + - * / and parentheses. It never uses
 * eval()/Function(), so attacker-controlled input cannot execute arbitrary
 * JavaScript (CWE-95). */
export function runUserScript(expr: string | null): void {
  if (!expr) return;
  const result = evalArithmetic(expr);
  if (result === null) {
    alert("Espressione non valida");
    return;
  }
  alert(`Risultato: ${result}`);
}

/** Safe arithmetic evaluator. Returns the numeric result, or null if the input
 * is malformed or contains anything other than numbers and + - * / ( ). */
export function evalArithmetic(input: string): number | null {
  const tokens = input.match(/\d+(?:\.\d+)?|[+\-*/()]/g);
  // Reject any input that contains characters outside the allowed token set.
  if (!tokens || tokens.join("") !== input.replace(/\s+/g, "")) return null;

  let pos = 0;

  const parseFactor = (): number | null => {
    const tok = tokens[pos];
    if (tok === "+") {
      pos++;
      return parseFactor();
    }
    if (tok === "-") {
      pos++;
      const value = parseFactor();
      return value === null ? null : -value;
    }
    if (tok === "(") {
      pos++;
      const value = parseExpr();
      if (value === null || tokens[pos] !== ")") return null;
      pos++;
      return value;
    }
    if (tok !== undefined && /^\d/.test(tok)) {
      pos++;
      return Number(tok);
    }
    return null;
  };

  const parseTerm = (): number | null => {
    let value = parseFactor();
    if (value === null) return null;
    while (tokens[pos] === "*" || tokens[pos] === "/") {
      const op = tokens[pos++];
      const rhs = parseFactor();
      if (rhs === null) return null;
      value = op === "*" ? value * rhs : value / rhs;
    }
    return value;
  };

  const parseExpr = (): number | null => {
    let value = parseTerm();
    if (value === null) return null;
    while (tokens[pos] === "+" || tokens[pos] === "-") {
      const op = tokens[pos++];
      const rhs = parseTerm();
      if (rhs === null) return null;
      value = op === "+" ? value + rhs : value - rhs;
    }
    return value;
  };

  const result = parseExpr();
  // Reject trailing/unconsumed tokens (e.g. "1 2" or "(1+2").
  return result !== null && pos === tokens.length ? result : null;
}
