import { api } from 'shared/api/api';
import toast from 'react-hot-toast';
import { useUserStore } from 'entities/User/model/slice/useUserStore';
import type { User } from 'entities/User/model/types/user';

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
        const { data } = await api.patch<Partial<User>>(`/users/${authData.id}`, {
            likedTracks: updatedLikedTracks,
        });
        toggleLikeTrack(data.likedTracks ?? updatedLikedTracks);
        toast.success(
            likedTracks.includes(trackId) ? '💔 Убрано из избранного' : '❤️ Добавлено в избранное',
        );
    } catch {
        toast.error('Не удалось обновить лайк');
    }
};
