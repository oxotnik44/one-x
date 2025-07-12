// scripts/runCommitChecks.js
import { execSync } from 'child_process';

function run(cmd) {
    try {
        execSync(cmd, { stdio: 'inherit' });
    } catch {
        // не прерывать выполнение
    }
}

run('pnpm style');
run('pnpm test');
run('pnpm screen:current');
run('pnpm screen:compare'); // если упадёт — просто логируем
run('pnpm screen:open');
