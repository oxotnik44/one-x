import { act, renderHook } from '@testing-library/react';
import { useProfileMenu } from './useProfileMenu'; // поправь путь под свой
import { describe, it, expect } from 'vitest';

describe('useProfileMenu store', () => {
    it('по умолчанию isOpen false', () => {
        const { result } = renderHook(() => useProfileMenu());
        expect(result.current.isOpen).toBe(false);
    });

    it('open устанавливает isOpen в true', () => {
        const { result } = renderHook(() => useProfileMenu());

        act(() => {
            result.current.open();
        });

        expect(result.current.isOpen).toBe(true);
    });

    it('close устанавливает isOpen в false', () => {
        const { result } = renderHook(() => useProfileMenu());

        act(() => {
            result.current.open();
        });
        expect(result.current.isOpen).toBe(true);

        act(() => {
            result.current.close();
        });
        expect(result.current.isOpen).toBe(false);
    });
});
