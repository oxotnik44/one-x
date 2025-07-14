// src/widgets/UserMenu/model/useProfileMenu.ts
import { create } from 'zustand';

interface ProfileMenuState {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
}

export const useProfileMenu = create<ProfileMenuState>((set, get) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
    toggle: () => set({ isOpen: !get().isOpen }),
}));
