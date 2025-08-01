// src/entities/User/model/api/likeTrack/likeTrack.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { likeTrack } from './likeTrack';
import { apiJson } from 'shared/api';
import { useUserStore } from 'entities/User/model/slice/useUserStore';
import toast from 'react-hot-toast';

vi.mock('shared/api');
vi.mock('entities/User/model/slice/useUserStore');
vi.mock('react-hot-toast');

const mockedApi = vi.mocked(apiJson, true);
const mockedStore = vi.mocked(useUserStore, true);
const mockedToast = vi.mocked(toast, true);

describe('likeTrack', () => {
    const trackId = 'track-1';
    const userId = 'user-1';
    const baseToggle = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('показывает ошибку, если пользователь не авторизован', async () => {
        mockedStore.getState.mockReturnValue({
            authData: undefined,
            toggleLikeTrack: baseToggle,
        } as any);

        await likeTrack(trackId);

        expect(mockedToast.error).toHaveBeenCalledWith('Войдите, чтобы лайкать');
        expect(mockedApi.patch).not.toHaveBeenCalled();
        expect(baseToggle).not.toHaveBeenCalled();
    });

    it('добавляет трек в лайки, если его там не было', async () => {
        // До toggle: пустой likedTracks
        mockedStore.getState
            .mockReturnValueOnce({
                authData: { id: userId, likedTracks: [] },
                toggleLikeTrack: baseToggle,
            } as any)
            // После toggle: [trackId]
            .mockReturnValueOnce({
                authData: { id: userId, likedTracks: [trackId] },
                toggleLikeTrack: baseToggle,
            } as any);

        mockedApi.patch.mockResolvedValue({ data: { likedTracks: [trackId] } });

        await likeTrack(trackId);

        expect(mockedApi.patch).toHaveBeenCalledWith(`/users/${userId}`, {
            likedTracks: [trackId],
        });
        expect(baseToggle).toHaveBeenCalledWith(trackId);
        expect(mockedToast.success).toHaveBeenCalledWith('❤️ Добавлено в избранное');
    });

    it('убирает трек из лайков, если он там был', async () => {
        // До toggle: [trackId]
        mockedStore.getState
            .mockReturnValueOnce({
                authData: { id: userId, likedTracks: [trackId] },
                toggleLikeTrack: baseToggle,
            } as any)
            // После toggle: []
            .mockReturnValueOnce({
                authData: { id: userId, likedTracks: [] },
                toggleLikeTrack: baseToggle,
            } as any);

        mockedApi.patch.mockResolvedValue({ data: { likedTracks: [] } });

        await likeTrack(trackId);

        expect(mockedApi.patch).toHaveBeenCalledWith(`/users/${userId}`, { likedTracks: [] });
        expect(baseToggle).toHaveBeenCalledWith(trackId);
        expect(mockedToast.success).toHaveBeenCalledWith('💔 Убрано из избранного');
    });

    it('показывает ошибку при неудачном обновлении', async () => {
        // До toggle: [trackId] — но патч упадёт, и toggle не должен вызываться
        mockedStore.getState.mockReturnValue({
            authData: { id: userId, likedTracks: [trackId] },
            toggleLikeTrack: baseToggle,
        } as any);
        mockedApi.patch.mockRejectedValue(new Error('fail'));

        await likeTrack(trackId);

        expect(mockedToast.error).toHaveBeenCalledWith('Не удалось сохранить изменения на сервере');
        expect(baseToggle).toHaveBeenCalledWith(trackId);
    });
});
