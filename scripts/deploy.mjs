// Veroeffentlicht dist/ auf dem Branch gh-pages.
//
// Ohne das uebliche npm-Paket "gh-pages": dessen Cache-Clone liegt unterhalb
// von node_modules/ und ueberschreitet unter Windows das Pfadlaengenlimit, was
// jeden Deploy in tief liegenden Arbeitsverzeichnissen abbrechen laesst. Ein
// temporaeres Repo im Temp-Verzeichnis umgeht das und spart die Abhaengigkeit.
//
// gh-pages ist ein reiner Artefakt-Branch: er wird bei jedem Deploy neu
// geschrieben, nicht fortgeschrieben. Der Quellstand steckt in main.

import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BRANCH = 'gh-pages';
const DIST = 'dist';

const run = (cwd, ...args) =>
  execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

if (!existsSync(DIST)) {
  console.error(`Fehler: ${DIST}/ fehlt. Erst "npm run build" ausfuehren.`);
  process.exit(1);
}

const remote = run(process.cwd(), 'remote', 'get-url', 'origin');
const sha = run(process.cwd(), 'rev-parse', '--short', 'HEAD');
const staging = mkdtempSync(join(tmpdir(), 'deploy-'));

try {
  cpSync(DIST, staging, { recursive: true });

  run(staging, 'init', '-q', '-b', BRANCH);
  run(staging, 'config', 'user.name', run(process.cwd(), 'config', 'user.name'));
  run(staging, 'config', 'user.email', run(process.cwd(), 'config', 'user.email'));
  run(staging, 'add', '-A');
  run(staging, 'commit', '-q', '-m', `deploy: build aus main@${sha}`);

  console.log(`Veroeffentliche ${DIST}/ nach ${BRANCH} ...`);
  run(staging, 'push', '--force', '--quiet', remote, `HEAD:refs/heads/${BRANCH}`);

  const page = remote
    .replace(/^git@github\.com:/, 'https://github.com/')
    .replace(/\.git$/, '')
    .replace(/^https:\/\/github\.com\/([^/]+)\/(.+)$/, 'https://$1.github.io/$2/');
  console.log(`Fertig. In ca. 30-60 Sekunden erreichbar: ${page}`);
} catch (error) {
  console.error('Deploy fehlgeschlagen:');
  console.error(error.stderr?.toString().trim() || error.message);
  process.exit(1);
} finally {
  rmSync(staging, { recursive: true, force: true });
}
