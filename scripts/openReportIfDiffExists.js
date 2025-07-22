// scripts/screen-ok.js
import { existsSync, readdirSync, rmSync, mkdirSync, cpSync } from 'fs';
import { resolve, dirname } from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const baseDir = resolve(__dirname, '../.screenshots');
const [referenceDir, currentDir, diffDir] = ['reference', 'current', 'diff'].map((sub) =>
    resolve(baseDir, sub),
);

const diffFiles = existsSync(diffDir) ? readdirSync(diffDir) : [];

if (diffFiles.length === 0) {
    console.log('✔ No diffs — updating reference screenshots');
    rmSync(referenceDir, { recursive: true, force: true });
    mkdirSync(referenceDir, { recursive: true });
    readdirSync(currentDir).forEach((file) =>
        cpSync(resolve(currentDir, file), resolve(referenceDir, file)),
    );
    try {
        execSync('pnpm screen:ok', { stdio: 'inherit' });
    } catch {
        // ignore errors in commit step
    }
    console.log('✔ Reference screenshots updated');
} else {
    console.log('✖ Diffs found — opening report');
    try {
        execSync('npx open-cli .screenshots/report.html', { stdio: 'inherit' });
    } catch {
        console.warn('⚠ Could not open report automatically');
    }
    process.exit(1);
}
