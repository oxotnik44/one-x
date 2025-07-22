// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'app/styles/tailwind.css';
import App from './app/App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProviders } from 'app/providers/ThemeProviders/ThemeProviders.tsx';
import { I18nProvider } from 'app/providers/LanguageProviders/I18nProvider.tsx';
import { ErrorBoundary } from 'app/providers/ErrorBoundary/index.ts';

const container = document.getElementById('root');

if (!container) {
    throw new Error('Контейнер #root не найден в DOM');
}

createRoot(container).render(
    <StrictMode>
        <BrowserRouter>
            <ErrorBoundary>
                <ThemeProviders>
                    <I18nProvider>
                        <Toaster />
                        <App />
                    </I18nProvider>
                </ThemeProviders>
            </ErrorBoundary>
        </BrowserRouter>
    </StrictMode>,
);
