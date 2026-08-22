# jules-web-starter

Technische Projektgrundlage von **Jules Corp** für Web-Auftragsentwicklung.
Statische Seiten mit Astro, TypeScript und Tailwind. Fixkosten: 0 €/Monat.

**Live:** https://jfk100611.github.io/jules-web-starter/

Dieses Repo ist zweierlei: der Nachweis, dass der Deploy-Weg funktioniert, und
die Vorlage, aus der neue Projekte starten.

## Voraussetzungen

- **Node.js ≥ 22.12** (`node --version`) — sonst nichts. Kein Docker, keine
  Datenbank, kein globales CLI.
- Für den Deploy zusätzlich: `git` und ein GitHub-Zugang mit Schreibrecht.

## Loslegen

```bash
git clone https://github.com/JFK100611/jules-web-starter.git
cd jules-web-starter
npm install
npm run dev
```

Dev-Server läuft auf http://localhost:4321. Änderungen erscheinen sofort.

## Befehle

| Befehl           | Wirkung                                                  |
| ---------------- | -------------------------------------------------------- |
| `npm run dev`    | Dev-Server mit Hot Reload auf Port 4321                   |
| `npm run build`  | Produktions-Build nach `dist/`                            |
| `npm run preview`| `dist/` lokal ausliefern — prüft den Build, nicht die Quellen |
| `npm run check`  | TypeScript- und Astro-Diagnose (`0 errors` = grün)        |
| `npm run deploy` | Build + Veröffentlichung auf GitHub Pages                 |

## Deploy

```bash
npm run deploy
```

Baut nach `dist/` und pusht das Ergebnis auf den Branch `gh-pages`, den GitHub
Pages ausliefert. Nach ca. 30–60 Sekunden ist die neue Fassung online.

Der Deploy läuft derzeit vom Entwicklungsrechner, nicht in CI. Grund und
geplante Ablösung: [`docs/decisions/0002-deploy-weg.md`](docs/decisions/0002-deploy-weg.md).

## Neues Kundenprojekt aufsetzen

```bash
gh repo create JFK100611/<projektname> --private --clone
# Inhalt dieses Repos hineinkopieren (ohne .git/ und node_modules/)
cd <projektname>
npm install
```

Dann anpassen:

1. **`package.json`** → `name`.
2. **`.env`** aus `.env.example` anlegen und `SITE_URL` / `BASE_PATH` setzen.
   Für ein GitHub-Pages-Projekt: `BASE_PATH=/<projektname>`. Für eine eigene
   Domain: `BASE_PATH=/`.
3. **`src/styles/global.css`** → Marken-Tokens (`--color-brand-*`, `--font-sans`).
   Im Normalfall die einzige Stelle, an der Design angefasst wird.
4. **`src/pages/index.astro`** → Inhalt.
5. GitHub Pages im neuen Repo aktivieren: Settings → Pages → Source: `gh-pages` / `/`.
   Beachte: Pages für **private** Repos setzt einen kostenpflichtigen Plan voraus —
   für kostenfreies Hosting muss das Repo öffentlich sein. Sonst vorher mit dem
   CEO klären.

Zielzeit von leer bis live: unter einer Stunde.

## Struktur

```
src/
  layouts/Base.astro     HTML-Grundgerüst, Meta-Tags, Canonical-URL
  pages/                 eine Datei = eine Route
  styles/global.css      Tailwind-Import + Marken-Tokens
public/                  wird unverändert ausgeliefert (Bilder, favicon, .nojekyll)
docs/decisions/          warum der Stack so ist, wie er ist
```

## Konfiguration

`astro.config.mjs` liest zwei Umgebungsvariablen, damit dasselbe Repo ohne
Code-Änderung unter einem Unterpfad (GitHub Pages) und auf einer eigenen Domain
laufen kann:

| Variable    | Default                        | Bedeutung                              |
| ----------- | ------------------------------ | -------------------------------------- |
| `SITE_URL`  | `https://jfk100611.github.io`  | Basis für Canonical-URLs und Sitemap    |
| `BASE_PATH` | `/jules-web-starter`           | Unterpfad, unter dem die Seite liegt    |

## Was hier bewusst fehlt

Keine Datenbank, kein Backend, keine UI-Framework-Integration (React/Vue), kein
CMS, kein Analytics. Nichts davon wird bisher gebraucht; jedes davon lässt sich
gezielt nachrüsten, wenn ein Projekt es verlangt.
Begründung: [`docs/decisions/0001-tech-stack.md`](docs/decisions/0001-tech-stack.md).

**Formulare** brauchen serverseitigen Code, den ein statischer Build nicht hat.
Das ist offen und wird bei der Landingpage entschieden, nicht hier.
