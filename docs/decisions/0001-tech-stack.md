# 0001 — Tech-Stack für Web-Auftragsentwicklung

- **Status:** akzeptiert
- **Datum:** 2026-08-22
- **Entscheider:** Ada Reinhardt (Founding Engineer)
- **Issue:** JUL-2

## Kontext

Jules Corp hatte keine technische Basis. Gesucht war der Stack für
Web-Auftragsentwicklung (private Auftraggeber, öffentliche Stellen). Kriterium
laut Auftrag: **Liefergeschwindigkeit und Betreibbarkeit zu geringen Fixkosten**,
ausdrücklich nicht technische Eleganz.

Randbedingungen, die die Auswahl real eingeschränkt haben:

- Nur kostenlose Tiers. Jede Ausgabe braucht CEO-Freigabe.
- Keine bestehenden Accounts außer GitHub (`JFK100611`).
- Das erwartete Arbeitsvolumen der nächsten Monate ist überwiegend
  Content-lastig: Landingpages, Angebotsseiten, Demo-Artefakte für die
  KI-Content-Pipeline. Nicht: Dashboards mit Login, Realtime, komplexe Formulare.

## Entscheidung

| Ebene         | Wahl                              |
| ------------- | --------------------------------- |
| Sprache       | TypeScript (strict)               |
| Framework     | Astro 7, statischer Output        |
| Styling       | Tailwind CSS 4 (Vite-Plugin)      |
| Datenhaltung  | keine per Default                 |
| Hosting       | GitHub Pages                      |
| Deploy        | `npm run deploy` → Branch `gh-pages` |
| Fixkosten     | 0 €/Monat                         |

### Begründung im Einzelnen

**Astro, statisch.** Das erwartete Arbeitsvolumen ist Content, und dafür ist
Astro der kürzeste Weg von Briefing zu ausgelieferter Seite: Komponenten ohne
Client-Runtime, MDX/Content-Collections eingebaut, Build unter einer Sekunde.
Statischer Output heißt außerdem: kein Server, der nachts umfällt — das ist
Priorität "Betreibbarkeit ohne Dauerbetreuung", nicht Ästhetik. Wenn ein
Kundenprojekt später doch Server-Rendering braucht, ist ein Astro-Adapter ein
Konfigurationsschritt, kein Rewrite.

**Tailwind.** Beschleunigt die zweite und dritte Seite spürbar, weil kein
CSS-Namensschema erfunden werden muss. Die Marken-Tokens liegen gesammelt in
`src/styles/global.css` — ein Kundenprojekt ändert im Regelfall nur diesen Block.

**Keine Datenbank per Default.** Eine Landingpage braucht keine. Eine Datenbank
einzuführen, die niemand befüllt, wäre genau die vorzeitige Abstraktion, die der
Auftrag ausschließt. Festlegung für den Bedarfsfall, damit die Frage nicht jedes
Mal neu diskutiert wird: **SQLite** (Datei im Repo/Volume) bei lesenden
Workloads, **Neon Postgres Free Tier** bei mehrschreibenden. Beides erst, wenn
ein Projekt es konkret verlangt.

**GitHub Pages.** Der einzige Hosting-Weg, der ohne neuen Account, ohne
Zahlungsmittel und ohne CEO-Freigabe *heute* eine öffentliche URL liefert. Das
war der ausschlaggebende Punkt: Die Alternative wäre gewesen, das Issue auf
`blocked` zu setzen und auf eine Account-Freigabe zu warten.

## Verworfene Alternativen

**Next.js auf Vercel.** Der naheliegende Default und für Formulare/API-Routen
stärker. Verworfen, weil (a) ein Vercel-Account angelegt werden müsste — nicht
möglich in diesem Lauf, und der Free Tier untersagt kommerzielle Nutzung, was bei
Kundenprojekten direkt zur Kostenfrage führt; (b) Next.js für eine Landingpage
deutlich mehr Laufzeit und Konfiguration mitbringt als der Nutzen rechtfertigt.
Bleibt die erste Option, falls ein Kundenprojekt echtes SSR/Auth braucht.

**Cloudflare Pages/Workers.** Technisch das beste Gesamtpaket (statisch + Functions
+ D1 im Free Tier, kommerzielle Nutzung erlaubt). Verworfen **nur** wegen des
fehlenden Accounts. Das ist die dokumentierte Migrationsrichtung, sobald der CEO
einen Cloudflare-Account freigibt — der Astro-Build bleibt dabei unverändert.

**WordPress / Baukasten (Webflow, Framer).** Verworfen: laufende Kosten pro
Kundenprojekt, und Wiederverwendung findet in einem Baukasten nicht als Code
statt. Widerspricht Priorität "jede zweite Umsetzung günstiger als die erste".

**Deploy über GitHub Actions.** Der eigentlich richtige Weg (Push auf `main`
baut und veröffentlicht). **Aktuell nicht möglich:** Das verfügbare
`gh`-Token hat die Scopes `gist, read:org, repo` — ohne `workflow` lehnt GitHub
das Anlegen von Dateien unter `.github/workflows/` ab. Deshalb vorerst
Deploy vom Entwicklungsrechner per `npm run deploy`. Siehe
[0002-deploy-weg.md](./0002-deploy-weg.md).

## Konsequenzen

**Gut:** 0 € Fixkosten. Deploy in ~10 Sekunden. Clone → laufender Dev-Server in
unter einer Minute. Kein Betrieb, der überwacht werden muss.

**Preis:** Kein serverseitiger Code. Ein Kontaktformular braucht deshalb einen
externen Endpunkt — das ist der erste zu erwartende Konflikt mit dem Kostenrahmen
und muss bei JUL-3 (Landingpage) entschieden werden, nicht hier.
GitHub Pages ist außerdem nicht für hohe Lasten oder SLA-Zusagen gedacht; für
Kundenprojekte mit Zusagen ist Cloudflare Pages der Zielzustand.

**Nicht festgelegt:** Analytics, Fehler-Monitoring, Custom Domains. Alles
kostenpflichtig oder account-gebunden — separat eskalieren.
