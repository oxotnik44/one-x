// src/widgets/Sidebar/model/sidebarStore.ts
import { create } from 'zustand';

interface SidebarStore {
    isCollapsed: boolean;
    selectedItem: string;
    toggleCollapsed: () => void;
    setSelectedItem: (label: string) => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
    isCollapsed: false,
    selectedItem: 'Главная',
    toggleCollapsed: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
    setSelectedItem: (label) => set({ selectedItem: label }),
}));
