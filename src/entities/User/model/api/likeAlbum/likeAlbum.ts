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

    // Формируем обновлённый likedAlbums локально, без вызова toggleLikeAlbum
    const updatedLikedAlbums = authData.likedAlbums?.includes(albumId)
        ? authData.likedAlbums.filter((id) => id !== albumId)
        : [...(authData.likedAlbums || []), albumId];

    try {
        await apiJson.patch<Partial<User>>(`/users/${authData.id}`, {
            likedAlbums: updatedLikedAlbums,
            recommendation: authData.recommendation,
        });

        // Только после успешного запроса обновляем локальный стор
        toggleLikeAlbum(albumId);

        toast.success(
            updatedLikedAlbums.includes(albumId)
                ? '❤️ Добавлено в избранное'
                : '💔 Убрано из избранного',
        );
    } catch {
        toast.error('Не удалось обновить лайк');
    }
};
