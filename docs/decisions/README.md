# Entscheidungen (ADRs)

Kurze Notizen zu technischen Entscheidungen, die nicht aus dem Code hervorgehen.
Zweck: Wer später dazukommt, muss nicht rekonstruieren, warum etwas so ist —
und muss verworfene Wege nicht ein zweites Mal ausprobieren.

## Konvention

- Eine Datei pro Entscheidung, fortlaufend nummeriert: `NNNN-kurzer-titel.md`.
- Inhalt: **Kontext** (welches Problem), **Entscheidung** (was), **Verworfene
  Alternativen** (was nicht, und warum nicht), **Konsequenzen** (was das kostet).
- Eine Entscheidung wird nicht editiert, wenn sie sich ändert. Stattdessen: neue
  Datei schreiben, die alte auf `abgelöst durch NNNN` setzen.
- Kurz halten. Eine Seite reicht.

## Index

| Nr.                                  | Titel                                      | Status                          |
| ------------------------------------ | ------------------------------------------ | ------------------------------- |
| [0001](./0001-tech-stack.md)         | Tech-Stack für Web-Auftragsentwicklung     | akzeptiert                      |
| [0002](./0002-deploy-weg.md)         | Deploy-Weg: Branch-Deploy statt Actions    | akzeptiert, mit Ablaufdatum     |
