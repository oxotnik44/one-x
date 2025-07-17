import type { Preview } from '@storybook/react-vite';
import { I18nextProvider } from 'react-i18next';
import i18n from '../src/shared/config/i18n/i18n';
import '../src/app/styles/tailwind.css';
import { ThemeProviders } from '../src/app/providers/ThemeProviders/ThemeProviders';
import React from 'react';
const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },

        a11y: {
            test: 'todo',
        },
    },

    decorators: [
        (Story) => (
            <I18nextProvider i18n={i18n}>
                <ThemeProviders>
                    <Story />
                </ThemeProviders>
            </I18nextProvider>
        ),
    ],
};

export default preview;
