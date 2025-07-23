import toast from 'react-hot-toast';
import { useUserStore } from 'entities/User/model/slice/useUserStore';
import type { User } from 'entities/User/model/types/user';
import { apiJson } from 'shared/api';

export const likeTrack = async (trackId: string): Promise<void> => {
    const { authData, toggleLikeTrack } = useUserStore.getState();
    if (!authData) {
        toast.error('Войдите, чтобы лайкать');
        return;
    }

    try {
        // Формируем новый массив likedTracks (локальное обновление лучше сделать в toggleLikeTrack)
        const updatedLikedTracks = authData.likedTracks?.includes(trackId)
            ? authData.likedTracks.filter((id) => id !== trackId)
            : [...(authData.likedTracks || []), trackId];

        // Отправляем обновлённые данные на сервер
        await apiJson.patch<Partial<User>>(`/users/${authData.id}`, {
            likedTracks: updatedLikedTracks,
            recommendation: authData.recommendation,
        });

        // Только после успешного запроса обновляем локальный стейт
        toggleLikeTrack(trackId);

        toast.success(
            updatedLikedTracks.includes(trackId)
                ? '❤️ Добавлено в избранное'
                : '💔 Убрано из избранного',
        );
    } catch (error) {
        toast.error('Не удалось обновить лайк');
        console.error(error);
    }
};
