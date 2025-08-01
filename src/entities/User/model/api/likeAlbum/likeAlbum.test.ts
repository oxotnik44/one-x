// src/entities/User/model/api/likeAlbum/likeAlbum.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { likeAlbum } from './likeAlbum';
import { apiJson } from 'shared/api';
import { useUserStore } from 'entities/User/model/slice/useUserStore';
import toast from 'react-hot-toast';

vi.mock('shared/api', () => ({
    apiJson: {
        patch: vi.fn(),
    },
}));

vi.mock('react-hot-toast', () => ({
    default: {
        error: vi.fn(),
        success: vi.fn(),
    },
    error: vi.fn(),
    success: vi.fn(),
}));

vi.mock('entities/User/model/slice/useUserStore', () => ({
    useUserStore: {
        getState: vi.fn(),
    },
}));

const mockToggleLike = vi.fn();
const userId = 'user-1';

beforeEach(() => {
    vi.clearAllMocks();
});

describe('likeAlbum', () => {
    it('показывает ошибку, если пользователь не авторизован', async () => {
        (useUserStore.getState as any).mockReturnValue({ authData: null });

        await likeAlbum('album-1');

        expect(toast.error).toHaveBeenCalledWith('Войдите, чтобы лайкать');
        expect(apiJson.patch).not.toHaveBeenCalled();
    });

    it('добавляет альбом в избранное, если его нет в списке', async () => {
        // До toggle: пустой список
        (useUserStore.getState as any)
            .mockReturnValueOnce({
                authData: { id: userId, likedAlbums: [] },
                toggleLikeAlbum: mockToggleLike,
            })
            // После toggle: ['album-2']
            .mockReturnValueOnce({
                authData: { id: userId, likedAlbums: ['album-2'] },
                toggleLikeAlbum: mockToggleLike,
            });

        (apiJson.patch as any).mockResolvedValue({});

        await likeAlbum('album-2');

        expect(apiJson.patch).toHaveBeenCalledWith(`/users/${userId}`, {
            likedAlbums: ['album-2'],
        });
        expect(mockToggleLike).toHaveBeenCalledWith('album-2');
        expect(toast.success).toHaveBeenCalledWith('❤️ Добавлено в избранное');
    });

    it('удаляет альбом из избранного, если он уже лайкнут', async () => {
        // До toggle: ['album-1']
        (useUserStore.getState as any)
            .mockReturnValueOnce({
                authData: { id: userId, likedAlbums: ['album-1'] },
                toggleLikeAlbum: mockToggleLike,
            })
            // После toggle: []
            .mockReturnValueOnce({
                authData: { id: userId, likedAlbums: [] },
                toggleLikeAlbum: mockToggleLike,
            });

        (apiJson.patch as any).mockResolvedValue({});

        await likeAlbum('album-1');

        expect(apiJson.patch).toHaveBeenCalledWith(`/users/${userId}`, { likedAlbums: [] });
        expect(mockToggleLike).toHaveBeenCalledWith('album-1');
        expect(toast.success).toHaveBeenCalledWith('💔 Убрано из избранного');
    });

    it('показывает ошибку при падении запроса', async () => {
        // До toggle: ['album-1']
        (useUserStore.getState as any)
            .mockReturnValueOnce({
                authData: { id: userId, likedAlbums: ['album-1'] },
                toggleLikeAlbum: mockToggleLike,
            })
            // После toggle: []
            .mockReturnValueOnce({
                authData: { id: userId, likedAlbums: [] },
                toggleLikeAlbum: mockToggleLike,
            });

        (apiJson.patch as any).mockRejectedValue(new Error('Ошибка'));

        await likeAlbum('album-1');

        // toggleLikeAlbum всё же вызывается до запроса
        expect(mockToggleLike).toHaveBeenCalledWith('album-1');
        // и на ошибке должен показать корректное сообщение
        expect(toast.error).toHaveBeenCalledWith('Не удалось обновить лайк');
    });
});
