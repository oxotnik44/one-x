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

    const likedTracks = authData.likedTracks ?? [];
    const updatedLikedTracks = likedTracks.includes(trackId)
        ? likedTracks.filter((id) => id !== trackId)
        : [...likedTracks, trackId];

    try {
        await apiJson.patch<Partial<User>>(`/users/${authData.id}`, {
            likedTracks: updatedLikedTracks,
        });
        toggleLikeTrack(trackId);
        toast.success(
            likedTracks.includes(trackId) ? '💔 Убрано из избранного' : '❤️ Добавлено в избранное',
        );
    } catch {
        toast.error('Не удалось обновить лайк');
    }
};
