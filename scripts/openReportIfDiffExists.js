import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Аналог __dirname в ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const diffDir = path.resolve(__dirname, '../.screenshots/diff');

function isDiffEmpty() {
    if (!fs.existsSync(diffDir)) return true;
    const files = fs.readdirSync(diffDir);
    return files.length === 0;
}

if (isDiffEmpty()) {
    console.log('[screen:open] Diff is empty. Running git add . && cz...');
    try {
        execSync('git add .', { stdio: 'inherit' });
        execSync('cz', { stdio: 'inherit' });
    } catch (error) {
        console.error('[screen:open] Ошибка при выполнении git add или cz:', error);
        process.exit(1);
    }
} else {
    console.log('[screen:open] Diff found. Opening report...');
    execSync('npx open-cli .screenshots/report.html', { stdio: 'inherit' });
}
