import { type ReactNode, useEffect } from 'react';
import { useThemeStore } from 'shared/config/theme/themeStore';
import { normalTheme } from 'shared/config/theme/themes/normal';
import type { ThemeVars } from 'shared/config/theme/types'; // импортируй тип
import { THEME_LOCALSTORAGE_KEY } from 'shared/const/localstorage';

interface ThemeProvidersProps {
    children: ReactNode;
}

export const ThemeProviders = ({ children }: ThemeProvidersProps) => {
    const { theme, setTheme } = useThemeStore();

    useEffect(() => {
        const storedTheme = localStorage.getItem(THEME_LOCALSTORAGE_KEY);
        if (storedTheme) {
            try {
                const parsed = JSON.parse(storedTheme) as ThemeVars;
                setTheme(parsed);
            } catch {
                setTheme(normalTheme);
            }
        } else {
            setTheme(normalTheme);
        }
    }, [setTheme]);

    useEffect(() => {
        localStorage.setItem(THEME_LOCALSTORAGE_KEY, JSON.stringify(theme));
    }, [theme]);

    return <>{children}</>;
};
