// src/features/GroupContentSwitcher/model/useGroupContentSwitcherStore.test.ts
import { describe, it, expect } from 'vitest';
import { useGroupContentSwitcherStore } from './useGroup';

describe('useGroupContentSwitcherStore', () => {
    it('should have default selected value "singles"', () => {
        const selected = useGroupContentSwitcherStore.getState().selected;
        expect(selected).toBe('singles');
    });

    it('should update selected value when setSelected is called', () => {
        const newValue = 'albums';
        useGroupContentSwitcherStore.getState().setSelected(newValue);

        const selected = useGroupContentSwitcherStore.getState().selected;
        expect(selected).toBe(newValue);
    });
});
