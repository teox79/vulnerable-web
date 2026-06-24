import { Comment } from "./components/Comment";
import { Profile } from "./components/Profile";
import { runUserScript } from "./lib/run";
import { goToReturnUrl } from "./lib/redirect";
import { newSessionToken } from "./lib/auth";

export function App() {
  const params = new URLSearchParams(window.location.search);
  const bio = params.get("bio") ?? "<b>Nessuna bio</b>";
  const comment = params.get("comment") ?? "Primo commento";

  return (
    <main style={{ fontFamily: "sans-serif", padding: 24 }}>
      <h1>Demo profilo utente</h1>
      <p>Token di sessione: {newSessionToken()}</p>
      <Profile bioHtml={bio} />
      <Comment html={comment} />
      <button onClick={() => goToReturnUrl(params.get("returnUrl"))}>Continua</button>
      <button onClick={() => runUserScript(params.get("expr"))}>Calcola</button>
    </main>
  );
}
