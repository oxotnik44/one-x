// src/widgets/Sidebar/model/sidebarStore.test.ts
import { describe, it, expect } from 'vitest';
import { useSidebarStore } from './sidebarStore';

describe('useSidebarStore', () => {
    it('should have default isCollapsed = false and selectedItem = "Главная"', () => {
        const state = useSidebarStore.getState();
        expect(state.isCollapsed).toBe(false);
        expect(state.selectedItem).toBe('Главная');
    });

    it('toggleCollapsed should invert isCollapsed state', () => {
        const initial = useSidebarStore.getState().isCollapsed;

        useSidebarStore.getState().toggleCollapsed();
        expect(useSidebarStore.getState().isCollapsed).toBe(!initial);

        useSidebarStore.getState().toggleCollapsed();
        expect(useSidebarStore.getState().isCollapsed).toBe(initial);
    });

    it('setSelectedItem should update selectedItem', () => {
        const newItem = 'Настройки';
        useSidebarStore.getState().setSelectedItem(newItem);
        expect(useSidebarStore.getState().selectedItem).toBe(newItem);
    });
});
