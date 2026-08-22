# Technischer Befund: Drittdienste, Zustellweg, Speicherung

- **Issue:** JUL-9 (aus JUL-8, Abschnitt B3)
- **Stand:** 2026-08-22, 17:30 Uhr
- **Autor:** Ada Reinhardt (Founding Engineer)
- **Adressat:** Manfred Lensch — Grundlage für die Formulierung der Datenschutzerklärung

> **Abgrenzung.** Dieses Dokument enthält keine Rechtstexte und keine rechtliche
> Bewertung. Es beschreibt ausschließlich, was technisch passiert. Wo eine
> juristische Einordnung nötig wäre, steht das ausdrücklich als offene Frage da,
> statt dass ich sie beantworte.

> **Zwei Stände.** Öffentlich erreichbar ist derzeit nur eine Platzhalterseite
> (Stand 15:16 UTC). Die fünf echten Seiten liegen fertig im Arbeitsverzeichnis
> und werden in JUL-4 veröffentlicht. Geprüft habe ich **beides** — die Live-URL
> und den lokalen Build aller sechs Routen. Befund identisch.

---

## 1. Die abgefragten Angaben

### 1.1 Hosting-Anbieter, Serverstandort, AVV

| | |
|---|---|
| **Anbieter** | GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA — Tochtergesellschaft der Microsoft Corporation |
| **Produkt** | GitHub Pages, kostenloser persönlicher Account `JFK100611` |
| **Vertragsverhältnis** | GitHub Terms of Service, Gratis-Tarif. **Kein individuell abgeschlossener oder unterzeichneter AVV.** |
| **Auslieferung** | über CDN. GitHub nennt Fastly und Cloudflare als CDN-Subprozessoren, beide mit Sitz USA |
| **Beobachteter Serverstandort** | Der ausliefernde Edge-Knoten stand in Frankfurt |
| **AVV-Angebot** | <https://github.com/customer-terms/github-data-protection-agreement> |
| **Subprozessorenliste** | <https://docs.github.com/en/site-policy/privacy-policies/github-subprocessors> |
| **Datenschutzerklärung GitHub** | <https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement> |

Beleg für den Edge-Standort — Antwort-Header der Live-Seite:

```
server: GitHub.com
via: 1.1 varnish
x-served-by: cache-fra-etou8220047-FRA
x-github-edge-region: fra
x-fastly-request-id: fda6788eef5b4822ce88fe1257d1888366ed35ff
```

`fra` ist Frankfurt. **Das ist eine Laufzeitbeobachtung von einem deutschen
Anschluss aus, keine vertragliche Zusage.** Ein Besucher aus einer anderen
Region wird von einem anderen Knoten bedient. Einen garantierten oder
konfigurierbaren Serverstandort gibt es bei GitHub Pages nicht.

Was GitHub selbst zusagt: Verarbeitung findet unter anderem in den USA statt;
für Transfers aus dem EWR stützt sich GitHub auf die Standardvertragsklauseln
nach Durchführungsbeschluss 2021/914 und auf die Selbstzertifizierung im
EU-US Data Privacy Framework.

**Offene Frage an dich — ich bewerte sie nicht:** Der GitHub-DPA regelt
„Customer Personal Data", also Daten, die *wir* GitHub zur Verarbeitung
übergeben. Die IP-Adressen unserer Seitenbesucher protokolliert GitHub dagegen
nach eigener Aussage „for security purposes" — also für eigene Zwecke. Ob
GitHub bezüglich dieser Logs unser Auftragsverarbeiter oder ein eigener
Verantwortlicher ist, ist die Frage, an der die Formulierung hängt. Für einen
Gratis-Account ohne Enterprise-Vertrag halte ich die Antwort für nicht
offensichtlich.

### 1.2 Server-Logfiles: Inhalt und Speicherdauer

**Kurz: nicht belegbar, und wir haben keinen Zugriff.**

Was dokumentiert ist — wörtlich aus der GitHub-Pages-Dokumentation:

> „When a GitHub Pages site is visited, the visitor's IP address is logged and
> stored for security purposes, regardless of whether the visitor has signed
> into GitHub or not."

Quelle: <https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages>

| Angabe | Stand |
|---|---|
| Erfasste IP-Adresse | ja, dokumentiert |
| Weitere Felder (User-Agent, Zeitstempel, URL, Referrer) | **nicht dokumentiert**, von uns nicht überprüfbar |
| Speicherdauer | **nicht veröffentlicht.** Die Privacy Statement nennt nur „as long as your account is active and as needed to fulfill contractual obligations…" — keine Frist in Tagen |
| Unser Zugriff auf die Logs | **keiner.** Nicht einsehbar, nicht exportierbar, nicht löschbar, nicht konfigurierbar |
| Zusätzliche Logs bei Fastly | nicht offengelegt |

**Konsequenz für dich:** Der übliche Satz „Die Logfiles werden nach X Tagen
gelöscht" lässt sich beim aktuellen Hosting nicht wahrheitsgemäß schreiben. Das
ist aus meiner Sicht das handfesteste Argument für einen Hosting-Wechsel — es
ist kein Auslegungsproblem, sondern eine fehlende Information, die wir uns nicht
beschaffen können. Siehe Abschnitt 2.1.

### 1.3 Zustellweg des Formulars

**Heute: es gibt keinen. Es wird nichts abgesendet und nichts an Dritte
übermittelt.**

`contact.endpoint` in `src/config/site.ts` ist leer. Dadurch rendert
`/kontakt` kein Formular, sondern einen sichtbar markierten Hinweis, dass der
Anfrageweg noch eingerichtet wird. Das Formular-Markup existiert, wird aber
nicht ausgegeben. Absichtlich so gebaut: ein Formular, das ins Leere sendet,
wäre schlimmer als keines.

Die Entscheidung liegt seit dem 22.08.2026, 15:11 UTC als offene Interaktion an
**JUL-4** bei dir. Vier Optionen stehen zur Wahl. Was sie für die
Datenschutzerklärung bedeuten:

| Option | Anbieter | Protokoll | Folge für die Erklärung |
|---|---|---|---|
| Web3Forms Free | US-Anbieter | HTTPS POST vom Browser des Besuchers direkt an `api.web3forms.com` | Auftragsverarbeiter + Drittlandtransfer zu nennen |
| Formspree Free | US-Anbieter | HTTPS POST an Formspree | dito, DPA vorhanden |
| Cloudflare Pages + Function | US-Anbieter, EU-Verarbeitung steuerbar | HTTPS POST an eigene Function | Anbieterwechsel nötig, kein Formular-Drittanbieter |
| kein Formular in v1 | — | `mailto:`-Link | null Drittanbieter, null Formularabsatz |

**Zielpostfach:** offen, ebenfalls Teil derselben Interaktion (bestehende
Adresse `t.czarny@living-edition.de` oder neue Firmenadresse).

**Punkt, den ich nicht geprüft habe und der vor Aktivierung geprüft gehört:**
Web3Forms und Formspree erfassen serverseitig üblicherweise mehr als die
Formularfelder — mindestens IP-Adresse, Zeitstempel und User-Agent des
Absenders. Das steht nicht in unserem Markup und ist deshalb aus dem Code nicht
ableitbar. Ich habe es bewusst nicht als Tatsache aufgeschrieben, solange kein
Anbieter feststeht. Sobald du einen wählst, hole ich den Punkt aus den
Anbieterunterlagen nach — er gehört in die Erklärung.

**SMTP von unserer Seite gibt es in keiner dieser Optionen.** Begründung in
Abschnitt 2.4.

### 1.4 Alle Felder des Formulars

Stand des gebauten Formulars (`src/pages/kontakt.astro`), noch nicht scharf
geschaltet:

| Feldname | Typ | Beschriftung | Pflicht |
|---|---|---|---|
| `name` | Text | Name | **ja** |
| `email` | E-Mail | E-Mail | **ja** |
| `organisation` | Text | Unternehmen oder Einrichtung | nein |
| `interesse` | Auswahl | „Worum geht es?" — Paketauswahl, Vorgabe „Noch offen" | nein |
| `nachricht` | Textfeld | Ihr Vorhaben | **ja** |
| `einwilligung` | Checkbox | Einverständnis zur Verarbeitung, verlinkt auf `/datenschutz` | **ja** |

Technische Felder, die mitgesendet werden, aber keine Eingabe des Besuchers
sind:

| Feldname | Inhalt | Zweck |
|---|---|---|
| `subject` | fester Betreff | Betreffzeile der Benachrichtigungsmail |
| `redirect` / `_next` | URL der Danke-Seite | Weiterleitung nach dem Absenden |
| `access_key` | öffentlicher Schlüssel | nur falls Web3Forms gewählt wird |
| `botcheck`, `_gotcha` | leer | Honeypot gegen Bots; für Menschen unsichtbar, bleibt leer |

Anmerkung zur Einwilligungs-Checkbox: Ich habe sie eingebaut, weil sie üblich
ist — nicht, weil ich beurteilt hätte, ob die Rechtsgrundlage hier Einwilligung
oder vorvertragliche Maßnahme ist. Falls du das anders siehst, ist die Checkbox
ein Löschvorgang von acht Zeilen.

### 1.5 Weitere Domains beim Seitenaufruf

**Keine. Null.**

Geprüft mit echtem Browser und mitgeschriebenem Netzwerkverkehr, nicht aus dem
Code abgeleitet. Methode in Abschnitt 4.

Vollständige Liste aller Anfragen, die das Dokument auslöst — je Route:

| Route | Angeforderte Ressourcen |
|---|---|
| `/` | Dokument, `_astro/Base.Cx51xXeo.css`, `favicon.svg` |
| `/angebot` | Dokument, `_astro/Base.Cx51xXeo.css`, `favicon.svg` |
| `/kontakt` | Dokument, `_astro/Base.Cx51xXeo.css` |
| `/impressum` | Dokument, `_astro/Base.Cx51xXeo.css` |
| `/datenschutz` | Dokument, `_astro/Base.Cx51xXeo.css` |
| `/danke` | Dokument, `_astro/Base.Cx51xXeo.css` |

Alles davon liegt auf derselben Herkunft wie die Seite selbst. Es gibt **keine**
zweite Domain. Keine Schrift, kein Skript, kein Bild, kein Pixel, keine
Karte, kein Video, kein Einbettungsdienst.

Die Seite enthält außerdem **kein einziges `<script>`-Tag**. Es läuft im Browser
kein JavaScript von uns.

### 1.6 Cookies und localStorage

**Keine. Weder noch.**

| Prüfung | Ergebnis |
|---|---|
| `Set-Cookie` in der HTTP-Antwort der Live-Seite | nicht vorhanden |
| Cookies in der Browser-Datenbank nach dem Aufruf | kein Eintrag für die Herkunft der Seite |
| `localStorage` | leer |
| `sessionStorage` | leer |
| JavaScript, das etwas setzen könnte | nicht vorhanden |

Nach meinem technischen Verständnis ist damit die Voraussetzung erfüllt, unter
der du auf ein Einwilligungsbanner verzichten wolltest. Ob der Verzicht
rechtlich trägt, entscheidest du.

### 1.7 Bundesland des Firmensitzes

Zur Kenntnis genommen, liegt bei dir. Berührt nichts an der Technik.

---

## 2. Die vier Vorgaben — Status

| # | Vorgabe | Status |
|---|---|---|
| 1 | Hosting in der EU, Anbieter mit AVV | **Abweichung** |
| 2 | Schriften selbst hosten | **eingehalten** (mit einer technischen Fußnote) |
| 3 | Kein Analytics, Tracking, Karten, Videos | **eingehalten**, empirisch belegt |
| 4 | Formularzustellung per SMTP über EU-Anbieter | **nicht eingehalten, mit heutigem Stack nicht erreichbar** |

### 2.1 Abweichung: Hosting nicht in der EU

**Was abweicht:** GitHub Pages ist ein US-Dienst. Kein wählbarer Serverstandort,
kein individueller AVV, keine Angabe zur Logfile-Speicherdauer, kein Zugriff auf
die Logs.

**Warum es so gekommen ist:** Die Stack-Entscheidung (`docs/decisions/0001-tech-stack.md`,
JUL-2) fiel unter der Vorgabe „keine kostenpflichtigen Dienste ohne
CEO-Freigabe" und „heute eine öffentliche URL". GitHub Pages war der einzige
Weg, der beides erfüllt. Die Vorgabe „Hosting in der EU" kam später aus JUL-8.
Die beiden Vorgaben schließen einander im kostenlosen Bereich praktisch aus:
Jeder mir bekannte Anbieter mit EU-Serverstandort, AVV zum Selbstabschluss und
Postfach kostet Geld.

**Was ein Wechsel löst — und zwar in einem Schritt:** Ein gewöhnliches
Webhosting-Paket bei einem deutschen Anbieter bringt gleichzeitig
(a) EU-Serverstandort, (b) AVV zum Abschluss im Kundenkonto, (c) Zugriff auf die
Logfiles inklusive einstellbarer Löschfrist — womit Abschnitt 1.2 überhaupt
beantwortbar wird — und (d) ein Postfach mit SMTP, das Vorgabe 4 löst und
nebenbei eine Firmen-E-Mail-Adresse liefert.

**Größenordnung:** einstelliger Euro-Betrag im Monat. Ich habe bewusst keine
Preise recherchiert und nenne keine, weil das kaufmännische Zusagen streift und
tagesaktuell ohnehin geprüft werden müsste. **Jede Ausgabe braucht deine
Freigabe — ich habe nichts bestellt und nichts angelegt.**

**Aufwand für die Migration, wenn du sie willst:** 2–4 Stunden. Der Astro-Build
ändert sich nicht, nur das Ziel des Deploys. Unsicher nach oben, weil ich den
Deploy-Weg des jeweiligen Anbieters nicht kenne (SFTP oder Git-Deploy). Sollte
das kommen, lege ich ein eigenes Issue an, statt es in JUL-4 zu verstecken.

**Bis dahin bleibt es bei GitHub Pages** — die Seite steht ohnehin auf
`noindex, nofollow`, `robots.txt` sperrt alle Crawler, und die Pflichtseiten
sind noch Platzhalter. Öffentlich beworben wird sie also nicht.

### 2.2 Eingehalten, mit Fußnote: Schriften

Es wird **keine Schrift geladen** — weder von Google noch von einem anderen CDN
noch von unserem eigenen Server. Kein `@font-face`, keine Schriftdatei im
Build-Output, kein Request im Netzwerkmitschnitt. Für die Datenschutzerklärung
ist der Punkt damit erledigt.

Die technische Fußnote, die dich nicht betrifft, aber im Repo stehen soll:
`src/styles/global.css` nennt `'Inter'` als erste Familie der Schriftliste, ohne
dass die Schrift jemals ausgeliefert wird. Auf Rechnern, auf denen Inter lokal
installiert ist, sieht die Seite deshalb anders aus als auf allen anderen. Zwei
saubere Auflösungen: Inter als `woff2` selbst ausliefern, oder den Namen aus der
Liste streichen und bei der Systemschrift bleiben. Beides ist eine
Gestaltungsfrage, keine Datenschutzfrage — ich habe die Datei deshalb nicht
angefasst und notiere den Punkt für JUL-4 bzw. das Starterkit in JUL-7.

### 2.3 Eingehalten: kein Analytics, kein Tracking, keine Einbettungen

Belegt in Abschnitt 1.5 und 1.6 über alle sechs Routen. Nichts davon ist
verbaut, und es ist auch nichts vorbereitet.

**Damit das so bleibt**, liegt ab jetzt ein Prüfscript im Repo:

```
node scripts/check-third-party.mjs
```

Es liest den Build-Output und bricht mit Fehler ab, sobald eine ausgelieferte
Datei den Browser dazu bringen würde, eine fremde Domain zu kontaktieren —
`src`, `srcset`, ladende `<link rel=…>`, `url()` und `@import` in CSS,
`<form action>`, `<iframe>`. Reine Textvorkommen lösen keinen Fehlalarm aus.

Nachweis, dass es beides kann — aktueller Build und ein Build, in den ich
testweise eine Google-Schrift und ein Analytics-Skript eingesetzt habe:

```
$ node scripts/check-third-party.mjs
Geprueft: 8 Datei(en) unter "dist".
OK — keine Verbindung zu Fremd-Domains im Build-Output.

$ node scripts/check-third-party.mjs <testkopie-mit-eingebauten-verstoessen>
FEHLER — der Build kontaktiert Fremd-Domains:
  index.html
    src -> plausible.io
    https://plausible.io/js/script.js
  index.html
    link rel="stylesheet" -> fonts.googleapis.com
    https://fonts.googleapis.com/css2?family=Inter
```

Praktischer Nebeneffekt: Sobald das Anfrageformular scharf geschaltet wird,
schlägt dieses Script an — die `<form action>` zeigt dann auf den Endpunkt des
gewählten Anbieters. Das ist so gewollt. Es zwingt dazu, den Anbieter bewusst
in die Ausnahmeliste einzutragen und die Erklärung nachzuziehen, statt ihn
unbemerkt live gehen zu lassen.

### 2.4 Nicht eingehalten: SMTP über EU-Anbieter

**Das geht mit dem heutigen Stack nicht, und zwar nicht aus Bequemlichkeit.**

Die Seite ist statisch. Es gibt keinen Server, auf dem Code läuft — nur Dateien,
die ausgeliefert werden. SMTP setzt einen Prozess voraus, der eine Verbindung zu
einem Mailserver aufbaut. Diesen Prozess gibt es nicht und kann es auf GitHub
Pages auch nicht geben. Aus dem Browser heraus lässt sich kein SMTP sprechen,
und Zugangsdaten zu einem Postfach in eine öffentlich ausgelieferte Seite zu
legen, wäre die Preisgabe des Postfachs.

Es bleiben genau zwei Wege zu einem SMTP-Versand aus der EU:

1. **Ein Server, der uns gehört** — also das Webhosting aus Abschnitt 2.1. Löst
   Vorgabe 1 und Vorgabe 4 mit derselben Entscheidung.
2. **Kein Formular in v1**, nur ein `mailto:`-Link. Dann verlässt keine
   Anfrage jemals einen Dritten, weil das Mailprogramm des Besuchers die
   Zustellung übernimmt. Kostet nichts, wirkt aber im Verkaufsgespräch dünner
   und geht auf Mobilgeräten häufiger verloren.

Die dritte reale Möglichkeit ist die Abweichung: ein US-Formulardienst, den du
mit einem zusätzlichen Absatz in der Erklärung abdeckst. Genau das steht als
Option in der Interaktion an JUL-4.

---

## 3. Was ich von dir brauche

Nichts davon blockiert den Bau der Seite. Alles davon blockiert das Go-live.

1. **Interaktion an JUL-4 beantworten** — Zustellweg, Zielpostfach, öffentliche
   Adresse. Ohne das bleibt `/kontakt` ein Platzhalter.
2. **Entscheidung zum Hosting.** Bleibt es bei GitHub Pages, brauchst du in der
   Erklärung einen Absatz zu US-Verarbeitung und musst zur Logfile-Speicherdauer
   etwas schreiben, das ich dir nicht belegen kann. Soll die EU-Vorgabe halten,
   brauche ich deine Freigabe für ein Hosting-Paket — dann liefere ich dir zu
   Abschnitt 1.1 und 1.2 belastbare Angaben statt der jetzigen Lücken.
3. **Wenn du dich für einen Formularanbieter entscheidest:** sag mir kurz
   Bescheid, dann hole ich nach, welche Daten der Anbieter über die
   Formularfelder hinaus erhebt. Diese Angabe fehlt heute bewusst, siehe 1.3.

---

## 4. Wie geprüft wurde

Damit du das Ergebnis nicht glauben musst, sondern nachstellen kannst.

**Werkzeug:** Google Chrome 151.0.7922.138, Headless-Modus, jeweils mit frischem,
leerem Browserprofil. Statt des Netzwerk-Tabs der DevTools wurde Chromes
Netzwerkprotokoll mitgeschrieben (`--log-net-log`) — dieselbe Datenquelle, aber
vollständig auswertbar und ohne, dass man beim Zusehen einen Eintrag übersieht.

**Geprüfte Ziele:**
- die veröffentlichte Seite <https://jfk100611.github.io/jules-web-starter/>
- der lokale Build aller sechs Routen (`/`, `/angebot`, `/kontakt`,
  `/impressum`, `/datenschutz`, `/danke`)

**Auswertung:** Aus dem Protokoll wurden alle `URL_REQUEST_START_JOB`-Ereignisse
gelesen und nach Herkunft getrennt. Übrig bleiben genau die in Abschnitt 1.5
gelisteten Ressourcen.

**Ein Hinweis zur Ehrlichkeit des Befunds:** Im Protokoll tauchen zusätzlich
Anfragen an `clients2.google.com`, `accounts.google.com`, `www.google.com` und
`www.gstatic.com` auf. Das ist **Chrome selbst** — Zeitabgleich,
Safe-Browsing-Schlüssel und die eigene Startseite des Browsers. Erkennbar
daran, dass diese Anfragen keinen auslösenden Ursprung haben („initiator: not an
origin") und in einem anderen Isolationskontext laufen als unsere Seite. Sie
treten identisch auf, wenn man den Browser auf eine leere Seite zeigen lässt.
**Sie gehören nicht zu unserer Seite und dürfen nicht in die Erklärung.** Ich
schreibe das hier hin, weil derselbe Befund bei einer späteren Nachprüfung
wieder auftauchen wird und dann ohne diese Notiz nach einem Widerspruch aussieht.

**Cookies und Speicher:** Nach jedem Aufruf wurden Cookie-Datenbank,
`Local Storage` und `Session Storage` des frischen Profils auf Einträge zur
Herkunft der Seite durchsucht. Keine gefunden.

**Dauerhafte Absicherung:** `scripts/check-third-party.mjs`, siehe 2.3.

---

## 5. Was bewusst offen bleibt

- **Welche Daten ein Formularanbieter serverseitig zusätzlich erhebt.** Erst
  belegbar, wenn ein Anbieter feststeht. Siehe 1.3.
- **Speicherdauer der Logfiles.** Bei GitHub Pages nicht beschaffbar. Löst sich
  nur über einen Hosting-Wechsel, nicht über besseres Suchen. Siehe 1.2.
- **Ob GitHub für die Besucher-Logs Auftragsverarbeiter oder eigener
  Verantwortlicher ist.** Juristische Frage, gehört nicht mir. Siehe 1.1.
- **Rechtsgrundlage der Einwilligungs-Checkbox im Formular.** Eingebaut, weil
  üblich; nicht bewertet. Siehe 1.4.
