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

const mockUser = {
    id: 'user-1',
    likedAlbums: ['album-1'],
};

describe('likeAlbum', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('показывает ошибку, если пользователь не авторизован', async () => {
        (useUserStore.getState as any).mockReturnValue({ authData: null });

        await likeAlbum('album-1');

        expect(toast.error).toHaveBeenCalledWith('Войдите, чтобы лайкать');
    });

    it('добавляет альбом в избранное, если его нет в списке', async () => {
        (useUserStore.getState as any).mockReturnValue({
            authData: { ...mockUser, likedAlbums: [] },
            toggleLikeAlbum: mockToggleLike,
        });

        (apiJson.patch as any).mockResolvedValue({});

        await likeAlbum('album-2');

        expect(apiJson.patch).toHaveBeenCalledWith('/users/user-1', {
            likedAlbums: ['album-2'],
        });
        expect(mockToggleLike).toHaveBeenCalledWith('album-2');
        expect(toast.success).toHaveBeenCalledWith('❤️ Добавлено в избранное');
    });

    it('удаляет альбом из избранного, если он уже лайкнут', async () => {
        (useUserStore.getState as any).mockReturnValue({
            authData: { ...mockUser },
            toggleLikeAlbum: mockToggleLike,
        });

        (apiJson.patch as any).mockResolvedValue({});

        await likeAlbum('album-1');

        expect(apiJson.patch).toHaveBeenCalledWith('/users/user-1', {
            likedAlbums: [],
        });
        expect(mockToggleLike).toHaveBeenCalledWith('album-1');
        expect(toast.success).toHaveBeenCalledWith('💔 Убрано из избранного');
    });

    it('показывает ошибку при падении запроса', async () => {
        (useUserStore.getState as any).mockReturnValue({
            authData: { ...mockUser },
            toggleLikeAlbum: mockToggleLike,
        });

        (apiJson.patch as any).mockRejectedValue(new Error('Ошибка'));

        await likeAlbum('album-1');

        expect(toast.error).toHaveBeenCalledWith('Не удалось обновить лайк');
    });
});
