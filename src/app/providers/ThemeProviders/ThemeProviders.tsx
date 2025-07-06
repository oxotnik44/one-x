// src/app/providers/ThemeProviders.tsx
import { type ReactNode, useEffect } from 'react';
import { useThemeStore } from 'shared/config/theme/themeStore';
import { normalTheme } from 'shared/config/theme/themes/normal';

interface ThemeProvidersProps {
    children: ReactNode;
}

export const ThemeProviders = ({ children }: ThemeProvidersProps) => {
    const { theme, setTheme } = useThemeStore();

    useEffect(() => {
        // Пытаемся загрузить тему из localStorage
        const storedTheme = localStorage.getItem('app-theme');
        if (storedTheme) {
            try {
                const parsed = JSON.parse(storedTheme);
                setTheme(parsed);
            } catch {
                setTheme(normalTheme);
            }
        } else {
            setTheme(normalTheme);
        }
    }, [setTheme]);

    useEffect(() => {
        // Сохраняем изменения темы в localStorage
        localStorage.setItem('app-theme', JSON.stringify(theme));
    }, [theme]);

    return <>{children}</>;
};
