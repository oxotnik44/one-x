import { act, renderHook } from '@testing-library/react';
import { useUserStore } from './useUserStore'; // путь поправь под свой
import toast from 'react-hot-toast';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { User } from '../types/user';

vi.mock('react-hot-toast');

describe('useUserStore', () => {
    beforeEach(() => {
        // Сбрасываем состояние стора перед каждым тестом
        const { result } = renderHook(() => useUserStore());
        act(() => {
            result.current.logout();
        });
        vi.clearAllMocks();
    });

    it('изначально authData undefined', () => {
        const { result } = renderHook(() => useUserStore());
        expect(result.current.authData).toBeUndefined();
    });

    it('setAuthData устанавливает пользователя', () => {
        const { result } = renderHook(() => useUserStore());
        const fakeUser: User = {
            id: '1qwe',
            username: 'user123',
            password: 'hashed-password',
            avatar: 'https://example.com/avatar.png',
        };

        act(() => {
            result.current.setAuthData(fakeUser);
        });

        expect(result.current.authData).toEqual(fakeUser);
    });

    it('logout очищает authData и вызывает toast', () => {
        const { result } = renderHook(() => useUserStore());
        const fakeUser: User = {
            id: '1qwe',
            username: 'user123',
            password: 'hashed-password',
            avatar: 'https://example.com/avatar.png',
        };

        act(() => {
            result.current.setAuthData(fakeUser);
        });

        act(() => {
            result.current.logout();
        });

        expect(result.current.authData).toBeUndefined();
        expect(toast).toHaveBeenCalledWith('Вы вышли из системы', { icon: '👋' });
    });
});
