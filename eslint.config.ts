// .eslintrc.ts
import storybook from 'eslint-plugin-storybook';
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import react from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: ['dist', 'build', 'node_modules', '*.config.js', 'vitest.config.ts', 'scripts/'],
    },
    {
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            ...tseslint.configs.recommendedTypeChecked,
        ],
        files: ['**/*.{ts,tsx,js,jsx}'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2022,
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
                // Если у тебя несколько tsconfig, укажи массив:
                project: [
                    './tsconfig.app.json',
                    './tsconfig.node.json',
                    './tsconfig.eslint.json',
                    // если создал для ESLint (рекомендуется)
                ],
            },
        },
        plugins: {
            react,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            // TypeScript правила
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-non-null-assertion': 'warn',
            '@typescript-eslint/no-empty-function': 'warn',

            // React правила
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
            '@typescript-eslint/unbound-method': 'off',
            'react-hooks/exhaustive-deps': 'off',

            // Общие правила
            'no-console': 'warn',
            'no-debugger': 'error',
            'no-unused-vars': 'off', // Отключаем базовое правило в пользу TS версии
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
            'react-refresh/only-export-components': 'off',
            'no-multiple-empty-lines': ['error', { max: 1 }],
            'eol-last': 'error',
            'no-trailing-spaces': 'error',
            '@typescript-eslint/no-floating-promises': 'off',

            // Безопасность
            'no-eval': 'error',
            'no-implied-eval': 'error',
            'no-new-func': 'error',
            'no-script-url': 'error',
        },
    },
    // Специальные правила для файлов конфигурации
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
    // Правила для тестовых файлов
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
    storybook.configs['flat/recommended'],
);
