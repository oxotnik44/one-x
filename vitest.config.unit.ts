// vitest.config.unit.ts
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
    plugins: [tsconfigPaths()],
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
        include: ['src/**/*.{test,spec}.ts'],
        exclude: [
            '**/ui/**',
            '**/types/**',
            'src/shared/config/test/**',
            'src/shared/config/theme/global/**',
            '**/*.d.ts',
            '**/*.tsx',
            '**/index.ts',
            '**/index.tsx',
            'node_modules',
            'dist',
        ],
        coverage: {
            enabled: true,
            provider: 'istanbul', // или 'v8', по вкусу
            reporter: ['text', 'html'], // форматы отчётов
            reportsDirectory: 'coverageUnit', // <— сюда складываем
            include: ['src/**/*.ts'],
            exclude: [
                '**/ui/**',
                '**/types/**',
                'src/shared/config/test/**',
                'src/shared/config/theme/global/**',
                '**/*.d.ts',
                '**/*.tsx',
                '**/*.test.ts',
                '**/*.spec.ts',
                '**/*.stories.ts',
                '**/index.ts',
                '**/index.tsx',
                'node_modules',
                'dist',
            ],
        },
    },
});
