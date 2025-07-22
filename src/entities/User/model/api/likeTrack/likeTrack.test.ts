// src/entities/User/model/api/likeTrack/likeTrack.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiJson } from 'shared/api/api';
import { useUserStore } from 'entities/User/model/slice/useUserStore';
import { likeTrack } from './likeTrack';
import type { User } from 'entities/User/model/types/user';
import toast from 'react-hot-toast';

vi.mock('shared/api/api');
vi.mock('entities/User/model/slice/useUserStore');
vi.mock('react-hot-toast');

const mockedApi = vi.mocked(apiJson, true);
const mockedUserStore = vi.mocked(useUserStore, true);
const mockedToast = vi.mocked(toast, true);

describe('likeTrack', () => {
    const trackId = 'track-1';

    beforeEach(() => {
        vi.clearAllMocks();
        // общий “скелет” UserStore
        const baseStore = {
            authData: undefined,
            toggleLikeTrack: vi.fn(),
            toggleLikeGroup: vi.fn(),
            toggleLikeAlbum: vi.fn(),
            setAuthData: vi.fn(),
            logout: vi.fn(),
        };
        mockedUserStore.getState.mockReturnValue(baseStore as any);
    });

    it('показывает ошибку, если пользователь не авторизован', async () => {
        mockedUserStore.getState.mockReturnValue({
            authData: undefined,
            toggleLikeTrack: vi.fn(),
            toggleLikeGroup: vi.fn(),
            toggleLikeAlbum: vi.fn(),
            setAuthData: vi.fn(),
            logout: vi.fn(),
        } as any);

        await likeTrack(trackId);

        expect(mockedToast.error).toHaveBeenCalledWith('Войдите, чтобы лайкать');
        expect(mockedApi.patch).not.toHaveBeenCalled();
    });

    it('добавляет трек в лайки, если его там не было', async () => {
        const toggleLikeTrack = vi.fn();
        const authData: User = {
            id: 'user-1',
            username: 'testuser',
            password: 'pass',
            avatar: '',
            createdAt: new Date().toISOString(),
            likedTracks: [],
        };

        mockedUserStore.getState.mockReturnValue({
            authData,
            toggleLikeTrack,
            toggleLikeGroup: vi.fn(),
            toggleLikeAlbum: vi.fn(),
            setAuthData: vi.fn(),
            logout: vi.fn(),
        } as any);

        const patchedLikedTracks = [trackId];
        mockedApi.patch.mockResolvedValue({ data: { likedTracks: patchedLikedTracks } });

        await likeTrack(trackId);

        expect(mockedApi.patch).toHaveBeenCalledWith(`/users/${authData.id}`, {
            likedTracks: patchedLikedTracks,
        });
        // теперь ожидаем вызов именно с trackId
        expect(toggleLikeTrack).toHaveBeenCalledWith(trackId);
        expect(mockedToast.success).toHaveBeenCalledWith('❤️ Добавлено в избранное');
    });

    it('убирает трек из лайков, если он там был', async () => {
        const toggleLikeTrack = vi.fn();
        const authData: User = {
            id: 'user-1',
            username: 'testuser',
            password: 'pass',
            avatar: '',
            createdAt: new Date().toISOString(),
            likedTracks: [trackId],
        };

        mockedUserStore.getState.mockReturnValue({
            authData,
            toggleLikeTrack,
            toggleLikeGroup: vi.fn(),
            toggleLikeAlbum: vi.fn(),
            setAuthData: vi.fn(),
            logout: vi.fn(),
        } as any);

        const patchedLikedTracks: string[] = [];
        mockedApi.patch.mockResolvedValue({ data: { likedTracks: patchedLikedTracks } });

        await likeTrack(trackId);

        expect(mockedApi.patch).toHaveBeenCalledWith(`/users/${authData.id}`, {
            likedTracks: patchedLikedTracks,
        });
        // ожидаем trackId, а не массив
        expect(toggleLikeTrack).toHaveBeenCalledWith(trackId);
        expect(mockedToast.success).toHaveBeenCalledWith('💔 Убрано из избранного');
    });

    it('показывает ошибку при неудачном обновлении', async () => {
        const toggleLikeTrack = vi.fn();
        const authData: User = {
            id: 'user-1',
            username: 'testuser',
            password: 'pass',
            avatar: '',
            createdAt: new Date().toISOString(),
            likedTracks: [],
        };

        mockedUserStore.getState.mockReturnValue({
            authData,
            toggleLikeTrack,
            toggleLikeGroup: vi.fn(),
            toggleLikeAlbum: vi.fn(),
            setAuthData: vi.fn(),
            logout: vi.fn(),
        } as any);

        mockedApi.patch.mockRejectedValue(new Error('fail'));

        await likeTrack(trackId);

        expect(mockedToast.error).toHaveBeenCalledWith('Не удалось обновить лайк');
        expect(toggleLikeTrack).not.toHaveBeenCalled();
    });
});
