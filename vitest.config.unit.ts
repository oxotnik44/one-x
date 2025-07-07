import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
        environment: 'jsdom',
        globals: true,
        exclude: ['**/*.stories.*'],
    },
});
