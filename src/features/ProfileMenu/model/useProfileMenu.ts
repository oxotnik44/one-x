import { create } from 'zustand';

interface ProfileMenuState {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

export const useProfileMenu = create<ProfileMenuState>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
}));
