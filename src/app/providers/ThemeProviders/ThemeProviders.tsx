import { type ReactNode, useEffect } from 'react';
import { useThemeStore } from 'shared/config/theme/themeStore';
import { normalTheme } from 'shared/config/theme/themes/normal';
import type { ThemeVars } from 'shared/config/theme/types'; // импортируй тип

interface ThemeProvidersProps {
    children: ReactNode;
}

export const ThemeProviders = ({ children }: ThemeProvidersProps) => {
    const { theme, setTheme } = useThemeStore();

    useEffect(() => {
        const storedTheme = localStorage.getItem('app-theme');
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
        localStorage.setItem('app-theme', JSON.stringify(theme));
    }, [theme]);

    return <>{children}</>;
};
