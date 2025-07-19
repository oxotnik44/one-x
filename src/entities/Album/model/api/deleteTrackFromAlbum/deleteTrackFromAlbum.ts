import toast from 'react-hot-toast';
import { useTrackStore } from 'entities/Track';
import { useAlbumStore } from '../../slice/useAlbumStore';
import { apiBase, apiJson } from 'shared/api';
import type { Group } from 'entities/Group';
import type { Album } from '../../types/types';

export async function deleteTrackFromAlbum(
    trackId: string,
    trackTitle: string,
    currentGroup: Group,
    currentAlbum: Album,
): Promise<void> {
    if (!currentGroup || !currentAlbum) {
        toast.error('Ошибка: группа или альбом не выбраны');
        return;
    }

    const groupName = currentGroup.name;
    const albumName = currentAlbum.name;
    const updatedTrackIds = currentAlbum.trackIds.filter((id) => id !== trackId);

    try {
        // Параллельно выполняем все необходимые запросы
        await Promise.all([
            apiBase.delete(
                `/deleteTrack/${encodeURIComponent(groupName)}/${encodeURIComponent(albumName)}/${encodeURIComponent(trackTitle)}`,
            ),
            apiJson.delete(`/tracks/${trackId}`),
            apiJson.patch(`/albums/${currentAlbum.id}`, { trackIds: updatedTrackIds }),
        ]);

        // Обновляем Zustand после успешных запросов
        const { tracks, setTracks } = useTrackStore.getState();
        setTracks(tracks.filter((t) => t.id !== trackId));

        const { albums, setAlbums } = useAlbumStore.getState();
        const updatedAlbums = albums.map((a) =>
            a.id === currentAlbum.id ? { ...a, trackIds: updatedTrackIds } : a,
        );
        setAlbums(updatedAlbums);

        toast.success(`Трек "${trackTitle}" успешно удалён из альбома "${albumName}"`);
    } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Ошибка при удалении трека');
    }
}
