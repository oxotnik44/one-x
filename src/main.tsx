// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'app/styles/tailwind.css';
import App from './app/App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProviders } from 'app/providers/ThemeProviders/ThemeProviders.tsx';

const container = document.getElementById('root');

if (!container) {
    throw new Error('Контейнер #root не найден в DOM');
}

createRoot(container).render(
    <StrictMode>
        <BrowserRouter>
            <ThemeProviders>
                <Toaster />
                <App />
            </ThemeProviders>
        </BrowserRouter>
    </StrictMode>,
);
