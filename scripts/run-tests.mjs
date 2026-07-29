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

compile('api/', ['api/contact.ts', 'api/verify-phone.ts'], 'api', path.join(tmp, 'api'));
compile('src/i18n/routing.ts', ['src/i18n/routing.ts'], 'src/i18n', path.join(tmp, 'i18n'));

/* pass the files explicitly: directory arguments behave inconsistently across
   node versions, and no shell is involved here to expand a glob */
const suites = fs
  .readdirSync(path.join(root, 'tests'))
  .filter((f) => f.endsWith('.test.mjs'))
  .map((f) => path.join('tests', f));

if (suites.length === 0) throw new Error('no test suites found in tests/');

console.log(`[test] running ${suites.length} suites`);
execFileSync(process.execPath, ['--test', ...suites], { cwd: root, stdio: 'inherit' });
