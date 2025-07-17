// .eslintrc.ts
import storybook from 'eslint-plugin-storybook';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import react from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';
import i18next from 'eslint-plugin-i18next';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default tseslint.config(
    // 1) Корневая конфигурация: игнорируем лишние папки
    {
        ignores: ['dist', 'build', 'node_modules', '*.config.js', 'vitest.config.ts', 'scripts/'],
    },

    // 2) Основная конфигурация для всех исходников
    {
        files: ['**/*.{ts,tsx,js,jsx}'],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2022,
            },
            parserOptions: {
                ecmaFeatures: { jsx: true },
                project: ['./tsconfig.app.json', './tsconfig.node.json', './tsconfig.eslint.json'],
            },
        },
        plugins: {
            react,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            i18next,
            '@typescript-eslint': tsPlugin,
        },
        settings: {
            react: { version: 'detect' },
        },
        rules: {
            // TypeScript-проверки
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
            ],
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-non-null-assertion': 'warn',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/unbound-method': 'off',
            '@typescript-eslint/no-floating-promises': 'off',

            // React
            ...react.configs.recommended.rules,
            ...react.configs['jsx-runtime'].rules,
            ...reactHooks.configs.recommended.rules,
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'react/jsx-uses-react': 'off',
            'react/jsx-uses-vars': 'error',
            'react/jsx-key': 'error',
            'react/jsx-no-duplicate-props': 'error',
            'react/jsx-no-undef': 'error',
            'react/no-children-prop': 'error',
            'react/no-unescaped-entities': 'warn',
            'react-hooks/exhaustive-deps': 'off',
            'react-refresh/only-export-components': 'off',

            // Общие правила
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'no-debugger': 'error',
            'no-unused-vars': 'off', // вместо базового — TS-версия
            'prefer-const': 'error',
            'no-var': 'error',
            'object-shorthand': 'error',
            'prefer-arrow-callback': 'error',
            'prefer-template': 'error',
            'template-curly-spacing': 'error',
            'arrow-spacing': 'error',
            'comma-dangle': ['error', 'always-multiline'],
            quotes: ['error', 'single'],
            indent: 'off',
            'no-multiple-empty-lines': ['error', { max: 1 }],
            'eol-last': 'error',
            'no-trailing-spaces': 'error',

            // Безопасность
            'no-eval': 'error',
            'no-implied-eval': 'error',
            'no-new-func': 'error',
            'no-script-url': 'error',

            // i18next: подсвечиваем все литералы строк
            'i18next/no-literal-string': [
                'warn',
                {
                    markupOnly: false,
                    ignoreAttribute: [
                        'to',
                        'href',
                        'target',
                        'rel',
                        'viewBox',
                        'xmlns',
                        'fill',
                        'stroke',
                        'd',
                        'x',
                        'y',
                        'width',
                        'height',
                    ],
                },
            ],

            // Подключаем остальные рекомендованные правила из плагина
            ...i18next.configs.recommended.rules,
        },
    },

    // 3) Конфиги для файлов настроек
    {
        files: ['**/*.config.{js,ts}', '**/vite.config.{js,ts}'],
        languageOptions: {
            globals: globals.node,
        },
        rules: {
            'no-console': 'off',
            '@typescript-eslint/no-require-imports': 'off',
        },
    },

    // 4) Тестовые файлы
    {
        files: ['**/*.test.{js,ts,jsx,tsx}', '**/*.spec.{js,ts,jsx,tsx}'],
        languageOptions: {
            globals: {
                ...globals.jest,
                ...globals.vitest,
            },
        },
        rules: {
            'no-console': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },

    // 5) Отключаем проверку i18next в stories
    {
        files: ['**/*.stories.@(ts|tsx)'],
        rules: {
            'i18next/no-literal-string': 'off',
        },
    },

    // 6) Рекомендации Storybook
    storybook.configs['flat/recommended'],
);
