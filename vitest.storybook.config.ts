import { defineConfig } from 'vitest/config';
import path from 'path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

export default defineConfig({
    plugins: [storybookTest({ configDir: './.storybook' })],
    resolve: {
        alias: {
            app: path.resolve(__dirname, 'src/app'),
            pages: path.resolve(__dirname, 'src/pages'),
            widgets: path.resolve(__dirname, 'src/widgets'),
            features: path.resolve(__dirname, 'src/features'),
            entities: path.resolve(__dirname, 'src/entities'),
            shared: path.resolve(__dirname, 'src/shared'),
        },
    },
    test: {
        environment: 'jsdom',
        setupFiles: ['.storybook/vitest.setup.ts'],
        browser: {
            enabled: true,
            provider: 'playwright', // ✅ Указываем движок
            headless: true,
            instances: [
                {
                    browser: 'chromium', // можно заменить на 'firefox' или 'webkit'
                },
            ],
        },
    },
});
