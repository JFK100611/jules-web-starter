#!/usr/bin/env node
/**
 * Prueft den Build-Output auf Verbindungen zu Fremd-Domains.
 *
 * Hintergrund: JUL-9. Die Datenschutzerklaerung der Firmenseite steht auf der
 * Aussage "die Seite laedt nichts von Dritten nach, setzt keine Cookies und
 * braucht deshalb kein Einwilligungsbanner". Diese Aussage ist heute wahr —
 * empirisch geprueft mit offenem Netzwerk-Tab. Sie bleibt es nur, solange
 * niemand versehentlich eine Schriftart von Google, ein eingebettetes Video
 * oder ein Analytics-Snippet einbaut.
 *
 * Genau das faengt dieses Script ab. Es laeuft gegen `dist/` und bricht mit
 * Exit-Code 1 ab, sobald im ausgelieferten HTML/CSS eine absolute URL steht,
 * die der Browser beim Seitenaufruf kontaktieren wuerde.
 *
 * Aufruf:
 *   node scripts/check-third-party.mjs            # prueft ./dist
 *   node scripts/check-third-party.mjs <ordner>
 *
 * Bewusste Abgrenzung: geprueft wird, was einen *Request* ausloest — src,
 * srcset, <link href>, url() in CSS, @import, <iframe>, <form action>. Ein
 * <a href> auf eine fremde Seite ist ein Link, kein Verbindungsaufbau, und
 * wird nur informativ gelistet. Reine Textvorkommen (z. B. der
 * Lizenzkommentar "tailwindcss.com" im generierten CSS) sind kein Befund;
 * deshalb wird geparst statt volltextgesucht.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';

const root = process.argv[2] ?? 'dist';

/**
 * Hosts, die eine Verbindung aufbauen duerfen. Leer ist Absicht: die Seite
 * liefert alles aus eigener Herkunft aus. Wer hier etwas eintraegt, aendert
 * damit die Datenschutzerklaerung — der Eintrag gehoert deshalb zusammen mit
 * einer Notiz in docs/legal/drittdienste-und-zustellweg.md gepflegt.
 */
const ALLOWED_HOSTS = [];

/** Schemata, die keinen Netzwerk-Request an Dritte ausloesen. */
const HARMLESS_SCHEME = /^(data:|blob:|about:|mailto:|tel:|#|\/|\.)/i;

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

/** Alle Stellen, an denen ein Dokument den Browser zu einem Request bewegt. */
const REQUEST_PATTERNS = [
  { kind: 'src', re: /\bsrc\s*=\s*["']([^"']+)["']/gi },
  { kind: 'srcset', re: /\bsrcset\s*=\s*["']([^"']+)["']/gi },
  { kind: 'form action', re: /<form\b[^>]*?\baction\s*=\s*["']([^"']+)["']/gi },
  { kind: 'poster', re: /\bposter\s*=\s*["']([^"']+)["']/gi },
  { kind: 'css url()', re: /url\(\s*["']?([^"')]+)["']?\s*\)/gi },
  { kind: 'css @import', re: /@import\s+(?:url\(\s*)?["']([^"']+)["']/gi },
];

/**
 * <link> nur dann, wenn das `rel` den Browser wirklich zu einer Verbindung
 * bewegt. `canonical`, `alternate` oder `me` sind Metadaten — sie stehen als
 * absolute URL im Markup, ohne dass je etwas geladen wird. Die ohne diese
 * Unterscheidung gemeldete eigene Canonical-URL waere ein Dauer-Fehlalarm,
 * und ein Pruefscript, das immer rot ist, wird abgeschaltet statt gelesen.
 */
const FETCHING_LINK_RELS = new Set([
  'stylesheet',
  'icon',
  'shortcut icon',
  'apple-touch-icon',
  'mask-icon',
  'manifest',
  'preload',
  'prefetch',
  'preconnect',
  'dns-prefetch',
  'prerender',
  'modulepreload',
]);

const LINK_TAG = /<link\b[^>]*>/gi;

const LINK_PATTERN = /<a\b[^>]*?\bhref\s*=\s*["'](https?:\/\/[^"']+)["']/gi;

function hostOf(value) {
  if (HARMLESS_SCHEME.test(value.trim())) return null;
  const candidate = value.trim().startsWith('//') ? `https:${value.trim()}` : value.trim();
  try {
    return new URL(candidate).host;
  } catch {
    return null; // relative Pfade ohne fuehrenden Slash
  }
}

const findings = [];
const externalLinks = [];
let scanned = 0;

let files;
try {
  files = walk(root);
} catch {
  console.error(`Kein Build-Output unter "${root}". Erst "npm run build" ausfuehren.`);
  process.exit(2);
}

for (const file of files) {
  if (!['.html', '.css', '.js', '.svg', '.xml'].includes(extname(file))) continue;
  scanned += 1;
  const text = readFileSync(file, 'utf8');
  const where = relative(process.cwd(), file);

  for (const { kind, re } of REQUEST_PATTERNS) {
    re.lastIndex = 0;
    let match;
    while ((match = re.exec(text)) !== null) {
      // srcset kann mehrere Kandidaten enthalten: "a.png 1x, b.png 2x"
      const values = kind === 'srcset' ? match[1].split(',').map((v) => v.trim().split(/\s+/)[0]) : [match[1]];
      for (const value of values) {
        const host = hostOf(value);
        if (host && !ALLOWED_HOSTS.includes(host)) {
          findings.push({ where, kind, host, value: value.trim() });
        }
      }
    }
  }

  LINK_TAG.lastIndex = 0;
  let tag;
  while ((tag = LINK_TAG.exec(text)) !== null) {
    const rel = /\brel\s*=\s*["']([^"']+)["']/i.exec(tag[0])?.[1]?.toLowerCase().trim();
    const href = /\bhref\s*=\s*["']([^"']+)["']/i.exec(tag[0])?.[1];
    if (!rel || !href || !FETCHING_LINK_RELS.has(rel)) continue;
    const host = hostOf(href);
    if (host && !ALLOWED_HOSTS.includes(host)) {
      findings.push({ where, kind: `link rel="${rel}"`, host, value: href.trim() });
    }
  }

  LINK_PATTERN.lastIndex = 0;
  let link;
  while ((link = LINK_PATTERN.exec(text)) !== null) {
    const host = hostOf(link[1]);
    if (host && !ALLOWED_HOSTS.includes(host)) externalLinks.push({ where, host });
  }
}

console.log(`Geprueft: ${scanned} Datei(en) unter "${root}".`);

if (externalLinks.length > 0) {
  const hosts = [...new Set(externalLinks.map((l) => l.host))].sort();
  console.log(`Hinweis: externe Links (kein Verbindungsaufbau beim Laden): ${hosts.join(', ')}`);
}

if (findings.length === 0) {
  console.log('OK — keine Verbindung zu Fremd-Domains im Build-Output.');
  process.exit(0);
}

console.error('\nFEHLER — der Build kontaktiert Fremd-Domains:\n');
for (const f of findings) {
  console.error(`  ${f.where}\n    ${f.kind} -> ${f.host}\n    ${f.value}\n`);
}
console.error(
  'Das aendert die Datenschutzerklaerung (Empfaenger, ggf. Drittlandtransfer,\n' +
    'ggf. Einwilligungsbanner). Vor dem Go-live mit dem CEO klaeren und\n' +
    'docs/legal/drittdienste-und-zustellweg.md nachziehen. Ist die Verbindung\n' +
    'gewollt und abgestimmt: Host in ALLOWED_HOSTS in diesem Script eintragen.',
);
process.exit(1);
