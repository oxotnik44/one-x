import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Аналог __dirname в ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const referenceDir = path.resolve(__dirname, '../.screenshots/reference');
const currentDir = path.resolve(__dirname, '../.screenshots/current');
const diffDir = path.resolve(__dirname, '../.screenshots/diff');

function isDiffEmpty() {
    if (!fs.existsSync(diffDir)) return true;
    const files = fs.readdirSync(diffDir);
    return files.length === 0;
}

function replaceReferenceWithCurrent() {
    if (fs.existsSync(referenceDir)) {
        fs.rmSync(referenceDir, { recursive: true, force: true });
    }
    fs.mkdirSync(referenceDir, { recursive: true });

    const files = fs.readdirSync(currentDir);
    for (const file of files) {
        const srcPath = path.join(currentDir, file);
        const destPath = path.join(referenceDir, file);
        fs.copyFileSync(srcPath, destPath);
    }
}

if (isDiffEmpty()) {
    console.log('[screen:ok] No diff found. Replacing reference with current screenshots...');
    try {
        replaceReferenceWithCurrent();
        run('pnpm screen:ok');

        console.log('[screen:ok] Reference screenshots updated and changes committed.');
    } catch (error) {
        console.error('[screen:ok] Error during commit:', error);
        process.exit(1);
    }
} else {
    console.log('[screen:open] Diff found. Opening report...');
    try {
        execSync('npx open-cli .screenshots/report.html', { stdio: 'inherit' });
    } catch {
        console.log(
            'Failed to open report automatically, please open .screenshots/report.html manually.',
        );
    }
    process.exit(1); // Можно не делать exit(1), если хочешь просто уведомлять
}
