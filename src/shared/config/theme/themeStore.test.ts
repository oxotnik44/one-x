import { describe, it, expect, beforeEach } from 'vitest';
import { useThemeStore } from './themeStore';
import { normalTheme } from './themes/normal';

describe('useThemeStore', () => {
    beforeEach(() => {
        useThemeStore.setState({ theme: normalTheme });
    });

    it('должен иметь дефолтную тему normalTheme', () => {
        expect(useThemeStore.getState().theme).toEqual(normalTheme);
    });

    it('setTheme устанавливает новую тему', () => {
        const newTheme = {
            ...normalTheme,
            '--bg-color': '#000000',
        };
        useThemeStore.getState().setTheme(newTheme);
        expect(useThemeStore.getState().theme['--bg-color']).toBe('#000000');
    });

    it('updateVar обновляет одну CSS-переменную темы', () => {
        useThemeStore.getState().updateVar('--button-color', '#123456');
        expect(useThemeStore.getState().theme['--button-color']).toBe('#123456');
    });
});
