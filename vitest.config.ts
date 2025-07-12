// vitest.config.ts
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import path from 'path';

export default defineConfig({
    plugins: [tsconfigPaths(), storybookTest({ configDir: './.storybook' })],
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
        globals: true,
        setupFiles: ['.storybook/vitest.setup.ts'],

        browser: {
            enabled: true,
            provider: 'playwright',
            headless: true,
            instances: [{ browser: 'chromium' }],
        },

        // Запускаем **только** .test.tsx и .spec.tsx
        include: ['src/**/*.{test,spec}.tsx'],
        // Полностью исключаем все .ts (и декларации)
        exclude: ['**/*.ts', '**/*.d.ts', '.storybook/**', '**/*.index.ts'],

        coverage: {
            // Считаем покрытие только по JSX‑файлам
            include: ['src/**/*.tsx'],
            exclude: [
                'node_modules',
                'src/app',
                'dist',
                '.storybook/**',
                '**/*.stories.tsx',
                '**/*.index.ts',
                '**/*.d.ts',
                '**/*.config.ts',
            ],
            reporter: ['text', 'html'],
            reportsDirectory: 'coverageStories',
        },
    },
    optimizeDeps: {
        exclude: [
            'vitest',
            'vitest/dist/chunks/globals',
            'vitest/dist/chunks/date',
            'vitest/dist/chunks/vi',
        ],
    },
    ssr: {
        noExternal: [
            'vitest',
            'vitest/dist/chunks/globals',
            'vitest/dist/chunks/date',
            'vitest/dist/chunks/vi',
        ],
    },
});
