/* Compiles the TypeScript the tests need, then runs the suite.
 *
 * The handlers and the routing helpers are TypeScript, and the node test
 * runner only loads JavaScript — hence this step. Type errors are caught by
 * `tsc -b` at build time (tsconfig.api.json); the compile here is about
 * producing something runnable, and fails on type errors as a bonus. */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmp = path.join(root, 'node_modules', '.tmp');
/* invoke tsc's JS entry point rather than the .cmd shim: node refuses to
   spawn .cmd without a shell on Windows, and this needs no quoting anywhere */
const tsc = path.join(root, 'node_modules', 'typescript', 'bin', 'tsc');

function compile(label, files, rootDir, outDir) {
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  console.log(`[test] type-checking and compiling ${label}`);
  execFileSync(
    process.execPath,
    [
      tsc,
      ...files,
      '--rootDir', rootDir,
      '--outDir', outDir,
      '--target', 'es2022',
      '--module', 'esnext',
      '--moduleResolution', 'bundler',
      '--strict',
      '--skipLibCheck',
      '--types', 'node',
    ],
    { cwd: root, stdio: 'inherit' },
  );
  /* tsc emits ESM syntax into .js — mark the folder so node reads it as ESM */
  fs.writeFileSync(path.join(outDir, 'package.json'), '{"type":"module"}\n');
}

compile('api/', ['api/contact.ts', 'api/verify-phone.ts', 'api/newsletter.ts', 'api/_origin.ts'], 'api', path.join(tmp, 'api'));
compile('src/i18n/routing.ts', ['src/i18n/routing.ts'], 'src/i18n', path.join(tmp, 'i18n'));
compile('src/lib/citations.ts', ['src/lib/citations.ts'], 'src/lib', path.join(tmp, 'citations'));
compile('src/lib/calendar-links.ts', ['src/lib/calendar-links.ts'], 'src/lib', path.join(tmp, 'calendar-links'));

/* api/agenda-reminders.ts imports src/data/agenda.ts and
   src/lib/calendar-links.ts, and its emitted specifiers resolve to
   node_modules/.tmp/src/... — so it is compiled in its own temp project
   where `@/` maps to src/ like it does in the frontend (same trick as
   scripts/send-newsletter.mjs). Run last: it writes into .tmp/api, which
   the api compile above wipes. */
function compileAgendaReminders() {
  const proj = path.join(tmp, 'agenda-reminders');
  fs.rmSync(proj, { recursive: true, force: true });
  for (const f of ['api/agenda-reminders.ts', 'src/data/agenda.ts', 'src/i18n/lang.ts', 'src/lib/calendar-links.ts']) {
    const dest = path.join(proj, f);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(path.join(root, f), dest);
  }
  fs.writeFileSync(
    path.join(proj, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        target: 'es2022',
        module: 'esnext',
        moduleResolution: 'bundler',
        strict: true,
        skipLibCheck: true,
        types: ['node'],
        outDir: 'out',
        rootDir: '.',
        baseUrl: '.',
        paths: { '@/*': ['src/*'] },
      },
      include: ['api/**/*', 'src/**/*'],
    }),
  );
  console.log('[test] compiling api/agenda-reminders.ts with its data');
  execFileSync(process.execPath, [tsc, '-p', path.join(proj, 'tsconfig.json')], { cwd: root, stdio: 'inherit' });
  const out = path.join(proj, 'out');
  for (const rel of ['api/agenda-reminders.js', 'src/data/agenda.js', 'src/lib/calendar-links.js']) {
    const dest = path.join(tmp, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(path.join(out, rel), dest);
  }
  for (const dir of [path.join(tmp, 'api'), path.join(tmp, 'src', 'data'), path.join(tmp, 'src', 'lib')]) {
    fs.writeFileSync(path.join(dir, 'package.json'), '{"type":"module"}\n');
  }
}
compileAgendaReminders();

/* pass the files explicitly: directory arguments behave inconsistently across
   node versions, and no shell is involved here to expand a glob */
const suites = fs
  .readdirSync(path.join(root, 'tests'))
  .filter((f) => f.endsWith('.test.mjs'))
  .map((f) => path.join('tests', f));

if (suites.length === 0) throw new Error('no test suites found in tests/');

console.log(`[test] running ${suites.length} suites`);
execFileSync(process.execPath, ['--test', ...suites], { cwd: root, stdio: 'inherit' });
