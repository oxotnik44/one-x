import toast from 'react-hot-toast';
import { apiBase, apiJson } from 'shared/api';
import { useTrackStore } from '../../slice/useTrackStore';

export const deleteTrack = async (
    groupName: string,
    trackName: string,
    trackId: string,
): Promise<void> => {
    try {
        await Promise.all([
            apiBase.delete(
                `/deleteTrack/${encodeURIComponent(groupName)}/${encodeURIComponent(trackName)}`,
            ),
            apiJson.delete(`/tracks/${trackId}`),
        ]);
        useTrackStore.getState().removeTrack(trackId);
        toast.success(`Трек "${trackName}" успешно удалён!`);
    } catch (e) {
        console.error(e);
        toast.error(e instanceof Error ? e.message : 'Ошибка при удалении трека');
    }
};
