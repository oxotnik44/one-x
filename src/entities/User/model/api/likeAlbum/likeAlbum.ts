import toast from 'react-hot-toast';
import { useUserStore } from 'entities/User/model/slice/useUserStore';
import type { User } from 'entities/User/model/types/user';
import { apiJson } from 'shared/api';

export const likeAlbum = async (albumId: string): Promise<void> => {
    const { authData, toggleLikeAlbum } = useUserStore.getState();

    if (!authData) {
        toast.error('Войдите, чтобы лайкать');
        return;
    }

    const likedAlbums = authData.likedAlbums ?? [];
    const updatedLikedAlbums = likedAlbums.includes(albumId)
        ? likedAlbums.filter((id) => id !== albumId)
        : [...likedAlbums, albumId];

    try {
        await apiJson.patch<Partial<User>>(`/users/${authData.id}`, {
            likedAlbums: updatedLikedAlbums,
        });
        toggleLikeAlbum(albumId);
        toast.success(
            likedAlbums.includes(albumId) ? '💔 Убрано из избранного' : '❤️ Добавлено в избранное',
        );
    } catch {
        toast.error('Не удалось обновить лайк');
    }
};
