// src/widgets/Sidebar/model/items.test.ts
import { describe, it, expect } from 'vitest';
import { sidebarItems } from './items';

describe('sidebarItems', () => {
    it('should be an array of SidebarItem with correct length', () => {
        expect(Array.isArray(sidebarItems)).toBe(true);
        expect(sidebarItems.length).toBe(3);
    });

    it('each item should have icon, label, and href properties', () => {
        sidebarItems.forEach((item) => {
            expect(item).toHaveProperty('icon');
            expect(typeof item.icon).toBe('function'); // IconType is a React component (function)
            expect(typeof item.label).toBe('string');
            expect(typeof item.href).toBe('string');
        });
    });

    it('should contain expected labels and hrefs', () => {
        expect(sidebarItems.map((item) => item.label)).toEqual(['Поиск', 'Главная', 'Моя группа']);
        expect(sidebarItems.map((item) => item.href)).toEqual(['search', 'main', 'my_group']);
    });
});
