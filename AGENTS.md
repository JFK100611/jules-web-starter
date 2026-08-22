# Kontext für Agents

Projektgrundlage von Jules Corp für Web-Auftragsentwicklung. Statisches Astro.
Setup und Befehle stehen im [README](./README.md) — hier nur, was beim Arbeiten
im Repo sonst überrascht.

## Festgelegt (nicht ohne ADR ändern)

Astro 7 statisch · TypeScript strict · Tailwind 4 · keine DB · GitHub Pages.
Begründung und verworfene Alternativen: [`docs/decisions/`](./docs/decisions/).

Wer davon abweicht, schreibt eine neue Datei in `docs/decisions/` — nicht eine
bestehende um.

## Fallstricke

- **`base` ist gesetzt** (`/jules-web-starter`). Interne Links und Asset-Pfade
  müssen `import.meta.env.BASE_URL` verwenden, sonst brechen sie in Produktion,
  während sie lokal funktionieren.
- **`public/.nojekyll` nicht löschen.** Ohne die Datei verwirft GitHub Pages
  `_astro/` und die Seite lädt ohne CSS.
- **Deploy läuft lokal**, nicht in CI — das Token hat keinen `workflow`-Scope.
  Details: [`0002-deploy-weg.md`](./docs/decisions/0002-deploy-weg.md).
- **Kein serverseitiger Code.** Formulare, Auth und API-Routen gehen im
  aktuellen Setup nicht. Nicht improvisieren — eskalieren.

## Verifikation

`npm run check` (0 errors) und `npm run build`. Beides zusammen unter 30
Sekunden; es gibt keinen Grund, eine Änderung ungeprüft zu committen.
Bei sichtbaren Änderungen zusätzlich `npm run preview` und hinsehen.

## Grenzen

Keine kostenpflichtigen Dienste, Abos oder Accounts ohne CEO-Freigabe — auch
keine kleinen Beträge. Keine echten Kundendaten im Repo; synthetische Testdaten
verwenden.
