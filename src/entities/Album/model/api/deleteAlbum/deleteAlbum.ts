import toast from 'react-hot-toast';
import { useAlbumStore } from '../../slice/useAlbumStore';
import { useTrackStore } from 'entities/Track';
import { apiBase, apiJson } from 'shared/api';
import { useGroupStore } from 'entities/Group';

export async function deleteAlbum(albumId: string): Promise<void> {
    try {
        const { albums, setAlbums } = useAlbumStore.getState();
        const { currentGroup } = useGroupStore.getState();

        const album = albums.find((a) => a.id === albumId);
        if (!album || !currentGroup?.name) {
            toast.error('Ошибка: альбом или группа не найдены');
            return;
        }

        // Удаляем с сервера
        await Promise.all([
            apiJson.delete(`/albums/${albumId}`),
            apiBase.delete(
                `/deleteAlbum/${encodeURIComponent(currentGroup.name)}/${encodeURIComponent(album.name)}`,
            ),
        ]);

        // Обновляем Zustand — удаляем альбом и треки
        setAlbums(albums.filter((a) => a.id !== albumId));

        const { tracks, setTracks } = useTrackStore.getState();
        setTracks(tracks.filter((t) => t.albumId !== albumId));

        toast.success('Альбом и все его треки успешно удалены');
    } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Ошибка при удалении альбома');
    }
}
