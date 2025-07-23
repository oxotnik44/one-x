// src/entities/User/model/slice/useUserStore.test.ts
import { act, renderHook } from '@testing-library/react';
import { useUserStore } from './useUserStore'; // поправь путь при необходимости
import toast from 'react-hot-toast';
import { describe, expect, it, vi, beforeEach, type Mock } from 'vitest';
import type { User } from '../types/user';
import { useTrackStore } from 'entities/Track';

vi.mock('react-hot-toast');
vi.mock('entities/Track', () => ({
    useTrackStore: {
        getState: vi.fn(),
    },
}));

describe('useUserStore', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Мокаем useTrackStore с треками и жанрами для тестов toggleLikeTrack
        (useTrackStore.getState as Mock).mockReturnValue({
            tracks: [
                { id: 'track1', genre: 'rock' },
                { id: 'track2', genre: 'pop' },
            ],
        });

        // Сбрасываем стор перед каждым тестом:
        const { result } = renderHook(() => useUserStore());
        act(() => {
            result.current.logout();
        });
    });

    it('изначально authData === null', () => {
        const { result } = renderHook(() => useUserStore());
        expect(result.current.authData).toBeNull();
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

        expect(result.current.authData).toBeNull();
        expect(toast).toHaveBeenCalledWith('Вы вышли из системы', { icon: '👋' });
    });

    it('toggleLikeTrack добавляет новый трек к likedTracks', () => {
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

        // добавляем новую "track2"
        act(() => {
            result.current.toggleLikeTrack('track2');
        });

        expect(result.current.authData?.likedTracks).toEqual(['track1', 'track2']);
    });

    it('toggleLikeTrack убирает трек из likedTracks, если он уже там был', () => {
        const { result } = renderHook(() => useUserStore());
        const fakeUser: User = {
            id: '1qwe',
            username: 'user123',
            password: 'hashed-password',
            avatar: 'https://example.com/avatar.png',
            createdAt: new Date().toISOString(),
            likedTracks: ['track1', 'track2'],
        };

        act(() => {
            result.current.setAuthData(fakeUser);
        });

        // удаляем "track1"
        act(() => {
            result.current.toggleLikeTrack('track1');
        });

        expect(result.current.authData?.likedTracks).toEqual(['track2']);
    });

    it('toggleLikeTrack ничего не делает, если authData === null', () => {
        const { result } = renderHook(() => useUserStore());

        act(() => {
            result.current.toggleLikeTrack('track1');
        });

        // authData изначально null и не меняется
        expect(result.current.authData).toBeNull();
    });
});
