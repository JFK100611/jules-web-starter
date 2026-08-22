# Seitenplan JUL-4 — Landing- und Angebotsseite

- **Stand:** 2026-08-22
- **Autor:** Ada Reinhardt
- **Quelle für alle Angebotsinhalte:** Dokument `offer-packages` an **JUL-3**, Teil A
- **Status:** Vorarbeit. Gebaut wird erst, wenn JUL-2 und JUL-3 geschlossen sind
  und die offenen CEO-Entscheidungen vorliegen.

## Harte Regel aus JUL-3

Das Quelldokument hat zwei Teile. **Nur Teil A geht auf die Website.**

Teil B — Stundensätze (85 / 95 / 70 € netto), Kalkulationsraster je Paket, die
Rabattregel für zwei Referenzprojekte — ist ausdrücklich als *nicht
veröffentlichen* markiert. Das steht hier an erster Stelle, damit es beim
Übernehmen der Texte nicht verrutscht: die interne Kalkulation öffentlich zu
machen wäre der teuerste denkbare Fehler auf dieser Seite.

## Seitenstruktur

| Route          | Inhalt                                                              | Quelle                                                            |
| -------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `/`            | Landingpage: wer wir sind, zwei Geschäftsfelder, für wen, Erstgespräch | abgeleitet aus A1/A2-Intros und A4 — siehe Annahme unten          |
| `/angebot`     | Angebotsseite mit allen Paketen                                      | A0 Kopf, A1 (S1–S3), A2 (K1–K3), A3 öffentliche Auftraggeber, A4, A5 |
| `/kontakt`     | Anfrageformular, Hinweis auf kostenloses Erstgespräch                | Zustellweg offen, siehe unten                                      |
| `/impressum`   | Platzhalter, sichtbar als solcher markiert                           | CEO                                                                |
| `/datenschutz` | Platzhalter, sichtbar als solcher markiert                           | CEO                                                                |

Die Angebotsseite wird **eine** Seite mit Ankernavigation, nicht sechs
Unterseiten. Sechs Pakete auf sechs Routen zwingen den Kunden zum Klicken,
bevor er vergleichen kann.

## Annahme, selbst aufgelöst

`offer-packages` liefert Texte für die Angebotsseite (A0–A5), aber keine
Landingpage-Texte. JUL-4 verbietet eigene Leistungsversprechen. Auflösung: Die
Landingpage wird ausschließlich aus vorhandenen Bausteinen zusammengesetzt —
den Intros aus A1 und A2, den „Für wen"-Sätzen der Pakete und den Punkten aus
A4. Kein Satz auf der Landingpage ohne Entsprechung in Teil A. Wenn der CEO das
anders will, korrigiere ich nach seinem Kommentar.

## Was Teil A erzwingt

- Der Netto-Hinweis und der Satz zum verbindlichen Preis stehen **über** den
  Paketen, nicht im Fußbereich.
- Der KI-Transparenzhinweis aus A2 steht sichtbar am Content-Block.
- Jede „Nicht enthalten"-Liste wird vollständig ausgegeben. Sie ist in diesem
  Dokument ein Verkaufsargument, keine Fußnote — sie zu kürzen hieße, den Text
  zu verändern.

## Technische Konsequenz aus 0001-tech-stack

Statischer Output ohne Server. Ein Anfrageformular braucht deshalb einen
externen Endpunkt. Das war in `0001-tech-stack.md` bereits als der erste zu
erwartende Konflikt benannt und ist jetzt fällig. Die Auswahl (Web3Forms /
Formspree / Cloudflare-Account / vorerst kein Formular) liegt als Interaktion am
Issue JUL-4 beim CEO — Drittanbieter, die personenbezogene Daten verarbeiten,
entscheide ich nicht selbst.

## Blockiert durch

1. **CEO-Entscheidungen** — Zustellweg, Zieladresse für Anfragen, öffentliche
   Adresse der Seite. Interaktion an JUL-4.
2. **JUL-3** — inhaltlich fertig, Issue noch `in_progress`. Texte werden erst
   nach Statuswechsel übernommen, damit keine Fassung eingebaut wird, die sich
   noch ändert.
3. **JUL-2** — Deploy-Weg steht, aber die Firmenseite ist nicht der Starter.
   Ob eigenes Repo oder eigene Route entscheide ich beim Bau.
