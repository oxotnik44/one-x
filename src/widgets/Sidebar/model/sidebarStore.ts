import { create } from 'zustand';

interface SidebarStore {
    isCollapsed: boolean;
    toggleCollapsed: () => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
    isCollapsed: false,
    toggleCollapsed: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
}));
