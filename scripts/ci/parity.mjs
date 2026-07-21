import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '../../');

console.log('[parity] Running parity test (Old Pipeline vs New Pipeline) on fixed keyword set...');

const res = spawnSync('pnpm', ['--filter', 'opportunity-engine', 'test', 'src/parity.test.ts'], {
  cwd: rootDir,
  stdio: 'inherit'
});

if (res.status === 0) {
  console.log('[parity] SUCCESS: New workers match old tool perfectly (raw signals + subtotals).');
  process.exit(0);
} else {
  console.error('[parity] FAILED: Material drift detected between old tool and new pipeline.');
  process.exit(1);
}
