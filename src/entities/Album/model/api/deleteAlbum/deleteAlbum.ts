import toast from 'react-hot-toast';
import { useAlbumStore } from '../../slice/useAlbumStore';
import { useTrackStore } from 'entities/Track';
import { apiBase, apiJson } from 'shared/api';
import { useGroupStore } from 'entities/Group';
import type { Album } from '../../types/types';

export async function deleteAlbum(currentAlbum: Album): Promise<void> {
    try {
        const albumId = currentAlbum.id;
        const albumName = currentAlbum.name;

        const albumStore = useAlbumStore.getState();
        const trackStore = useTrackStore.getState();
        const groupStore = useGroupStore.getState();

        if (!groupStore.currentGroup?.name) {
            toast.error('Ошибка: группа не найдена');
            return;
        }

        const { tracks, setTracks } = trackStore;
        const { albums, setAlbums } = albumStore;

        // Фильтруем треки альбома
        const albumTrackIds = tracks
            .filter((track) => track.albumId === albumId)
            .map((track) => track.id);

        // Удаляем треки параллельно, если они есть
        if (albumTrackIds.length > 0) {
            await Promise.all(albumTrackIds.map((trackId) => apiJson.delete(`/tracks/${trackId}`)));
        }

        // Удаляем альбом
        await apiJson.delete(`/albums/${albumId}`);

        // Удаляем папку с сервера
        await apiBase.delete(
            `/deleteAlbum/${encodeURIComponent(groupStore.currentGroup.name)}/${encodeURIComponent(albumName)}`,
        );

        // Обновляем состояние
        setAlbums(albums.filter((a) => a.id !== albumId));
        setTracks(tracks.filter((t) => t.albumId !== albumId));

        // Вызов успеха
        toast.success('Альбом и все его треки успешно удалены');
    } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Ошибка при удалении альбома');
    }
}
