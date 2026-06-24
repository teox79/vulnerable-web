# vulnerable-web (demo profilo utente)

⚠️ **Progetto deliberatamente vulnerabile.** Fixture per testare il processo di
analisi/lifecycle/dedup di ORBIT. Non usare in produzione: contiene
vulnerabilità intenzionali e nessun segreto reale.

## Cos'è
Piccola SPA React + Vite che mostra il profilo di un utente: bio e commenti
renderizzati da input dell'utente, redirect post-azione, valutazione di una
piccola espressione, token di sessione lato client.

```
src/
  App.tsx               # compone la pagina, legge input dalla query string
  components/
    Comment.tsx         # render commento (HTML)
    Profile.tsx         # render bio (HTML)
  lib/
    config.ts           # configurazione (token analytics)
    auth.ts             # token di sessione
    redirect.ts         # redirect post-azione
    run.ts              # valutazione espressione utente
```

## Avvio
```bash
npm install
npm run dev   # http://localhost:5173
```

## Trust boundary
Tutti gli input arrivano dalla query string del browser (`bio`, `comment`,
`returnUrl`, `expr`) e fluiscono verso il DOM, `window.location` ed `eval`.

## Answer key — vulnerabilità piantate

| # | File | Tipo | CWE | OWASP |
|---|------|------|-----|-------|
| 1 | src/components/Profile.tsx | XSS via dangerouslySetInnerHTML (`bio`) | CWE-79 | A03 |
| 2 | src/components/Comment.tsx | XSS via dangerouslySetInnerHTML (`comment`) | CWE-79 | A03 |
| 3 | src/lib/config.ts | Token/segreto hardcoded | CWE-798 | A07 |
| 4 | src/lib/auth.ts | Randomness insicura per token (Math.random) | CWE-330 | A02 |
| 5 | src/lib/redirect.ts | Open redirect (`returnUrl`) | CWE-601 | A01 |
| 6 | src/lib/run.ts | Code injection (`eval` su input) | CWE-95 | A03 |

### Dipendenze vulnerabili (SCA)
Pinnate in `package.json` a versioni con advisory note:

| Pacchetto | Versione | CVE / advisory |
|-----------|----------|----------------|
| lodash | 4.17.11 | CVE-2019-10744 (prototype pollution) |
| axios | 0.21.0 | CVE-2020-28168 (SSRF), CVE-2021-3749 (ReDoS) |
| minimist | 1.2.0 | CVE-2020-7598 (prototype pollution) |
| marked | 0.3.9 | ReDoS / XSS (advisory multiple) |

`axios` è usato in `src/lib/api.ts` (con il token hardcoded di `config.ts`):
SCA + SAST sullo stesso flusso.

### Caso DEDUP cross-file
I finding **1/2** condividono la stessa root cause: render di HTML non
sanitizzato via `dangerouslySetInnerHTML`. Sono su file diversi → l'intra-run
dedup dovrebbe **consolidarli** (una sola remediation: sanitizzare/escapare
l'HTML prima del render). Utili per verificare dedup cross-file + matching cross-run.

### Suggerimenti per testare il lifecycle
- **Fix → retest**: sostituisci un `dangerouslySetInnerHTML` con testo
  escapato e ri-scansiona → il finding dovrebbe passare a `pending_retest`/`fixed`.
- **Regressione**: reintroduci la vuln → dovrebbe tornare `regressed`.
