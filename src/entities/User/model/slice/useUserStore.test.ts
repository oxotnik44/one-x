import { act, renderHook } from '@testing-library/react';
import { useUserStore } from './useUserStore'; // поправь путь при необходимости
import toast from 'react-hot-toast';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { User } from '../types/user';

vi.mock('react-hot-toast');

describe('useUserStore', () => {
    beforeEach(() => {
        // Сброс стора перед каждым тестом
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
            createdAt: new Date().toISOString(),
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
            createdAt: new Date().toISOString(),
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

    it('toggleLikeTrack обновляет likedTracks пользователя', () => {
        const { result } = renderHook(() => useUserStore());
        const fakeUser: User = {
            id: '1qwe',
            username: 'user123',
            password: 'hashed-password',
            avatar: 'https://example.com/avatar.png',
            createdAt: new Date().toISOString(),
            likedTracks: ['track1'],
        };

        act(() => {
            result.current.setAuthData(fakeUser);
        });

        const newLikedTracks = ['track1', 'track2'];

        act(() => {
            result.current.toggleLikeTrack(newLikedTracks);
        });

        expect(result.current.authData?.likedTracks).toEqual(newLikedTracks);
    });

    it('toggleLikeTrack ничего не делает, если authData нет', () => {
        const { result } = renderHook(() => useUserStore());

        act(() => {
            result.current.toggleLikeTrack(['track1']);
        });

        expect(result.current.authData).toBeUndefined();
    });
});
