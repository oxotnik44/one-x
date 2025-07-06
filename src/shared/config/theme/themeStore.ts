import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeSchema } from './types';
import { normalTheme } from './themes/normal';

export const useThemeStore = create<ThemeSchema>()(
    persist(
        (set, get) => ({
            theme: normalTheme,
            setTheme: (vars) => {
                set({ theme: vars });
            },
            updateVar: (key, value) => {
                const newTheme = { ...get().theme, [key]: value };
                set({ theme: newTheme });
            },
        }),
        {
            name: 'theme',
        },
    ),
);
