import toast from 'react-hot-toast';
import { apiJson } from 'shared/api';
import { useUserStore } from '../../slice/useUserStore';
import type { User } from '../../types/user';

export const likeTrack = async (trackId: string): Promise<void> => {
    const { authData, toggleLikeTrack } = useUserStore.getState();
    if (!authData) {
        toast.error('Войдите, чтобы лайкать');
        return;
    }

    try {
        // 1) Сначала обновляем локальное состояние
        toggleLikeTrack(trackId);

        // Получаем уже обновлённый стейт
        const { authData: updated } = useUserStore.getState();
        if (!updated) {
            toast.error('Ошибка локального обновления');
            return;
        }

        // 2) Формируем payload из обновлённого стейта
        const payload: Partial<User> = {
            likedTracks: updated.likedTracks,
            recommendation: updated.recommendation,
        };

        // 3) Отправляем на сервер
        await apiJson.patch<Partial<User>>(`/users/${updated.id}`, payload);

        // 4) Уведомление
        const justLiked = updated.likedTracks?.includes(trackId);
        toast.success(justLiked ? '❤️ Добавлено в избранное' : '💔 Убрано из избранного');
    } catch (error) {
        toast.error('Не удалось сохранить изменения на сервере');
        console.error(error);
    }
};
