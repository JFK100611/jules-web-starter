# 0002 — Deploy-Weg: Branch-Deploy statt GitHub Actions

- **Status:** akzeptiert, mit bekanntem Ablaufdatum
- **Datum:** 2026-08-22
- **Entscheider:** Ada Reinhardt (Founding Engineer)
- **Issue:** JUL-2

## Kontext

Der gewünschte Deploy-Weg ist der übliche: Push auf `main` → GitHub Actions baut
→ GitHub Pages veröffentlicht. Kein Entwicklungsrechner in der Kette.

Das ist mit den aktuell verfügbaren Zugangsdaten nicht möglich. Das
`gh`-Token des Accounts `JFK100611` hat die Scopes `gist, read:org, repo`.
GitHub lehnt Pushes ab, die Dateien unter `.github/workflows/` anlegen oder
ändern, wenn der `workflow`-Scope fehlt.

Empirisch geprüft, nicht angenommen — Ausgabe des Versuchs:

```
$ git push -u origin main
To https://github.com/JFK100611/jules-web-starter.git
 ! [remote rejected] main -> main (refusing to allow an OAuth App to create or
   update workflow `.github/workflows/probe.yml` without `workflow` scope)
error: failed to push some refs to 'https://github.com/JFK100611/jules-web-starter.git'
```

## Entscheidung

Deploy vorerst clientseitig über das npm-Paket `gh-pages`:

```
npm run deploy    # = astro build && gh-pages -d dist --dotfiles
```

Das baut nach `dist/` und pusht den Ordnerinhalt als Commit auf den Branch
`gh-pages`. GitHub Pages ist auf diesen Branch konfiguriert (Quelle: Branch,
nicht Actions) und veröffentlicht ihn.

`--dotfiles` ist erforderlich, damit `.nojekyll` mitgeht. Ohne diese Datei
ignoriert der Jekyll-Vorprozessor von GitHub Pages den Ordner `_astro/` — die
Seite lädt dann ohne CSS.

## Verworfene Alternativen

**Auf Scope-Erweiterung warten und Issue blockieren.** Verworfen: Das Issue
verlangt einen einmal *echt durchgeführten* Deploy. Ein blockiertes Issue mit
Actions-YAML im Repo, das nie gelaufen ist, erfüllt das nicht. Branch-Deploy
liefert dasselbe Ergebnis für den Kunden — eine erreichbare URL — heute.

**`git subtree push --prefix dist origin gh-pages`.** Kommt ohne
zusätzliche Abhängigkeit aus, verlangt aber, `dist/` einzuchecken. Verworfen:
Build-Output im Quell-Branch erzeugt bei jedem Deploy Merge-Konflikte.

**Deploy-Key / Fine-grained PAT selbst anlegen.** Wäre eine Umgehung der
Scope-Beschränkung an der Freigabe vorbei. Nicht gemacht — Zugangsdaten
erweitert der CEO, nicht ich.

## Konsequenzen

**Preis:** Der Deploy hängt an einem Rechner mit Repo-Checkout und
`gh`-Login. Kein Vier-Augen-Prinzip, kein Build-Log, keine Reproduzierbarkeit auf
neutraler Umgebung. Für eine Firmen-Landingpage tragbar, für ein Kundenprojekt
mit Verfügbarkeitszusage nicht.

**Ablaufdatum:** Sobald der CEO dem Token den `workflow`-Scope gibt
(GitHub → Settings → Developer settings, bzw. `gh auth refresh -h github.com -s workflow`),
wird das hier ersetzt durch `.github/workflows/deploy.yml` mit
`actions/deploy-pages`. Der Astro-Build ändert sich dabei nicht — nur, wer ihn
ausführt. Nachverfolgt als eigenes Issue.
