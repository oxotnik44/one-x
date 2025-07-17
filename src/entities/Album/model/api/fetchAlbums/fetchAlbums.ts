import toast from 'react-hot-toast';
import { useAlbumStore } from '../../slice/useAlbumStore';
import { apiBase, apiJson } from 'shared/api';
import type { Album } from '../../types/types';

interface AlbumCover {
    albumTitle: string;
    coverUrl: string;
}

export async function fetchAlbums(groupId: string, groupName: string): Promise<void> {
    try {
        const setAlbums = useAlbumStore.getState().setAlbums;

        const [albumsRes, coversRes] = await Promise.all([
            apiJson.get<Album[]>('/albums', {
                params: { groupId },
            }),
            apiBase.get<AlbumCover[]>(`/albumCovers/${encodeURIComponent(groupName)}`),
        ]);

        const coverMap = new Map<string, string>();
        for (const cover of coversRes.data) {
            coverMap.set(cover.albumTitle, cover.coverUrl);
        }

        const albumsWithCovers = albumsRes.data.map((album) => ({
            ...album,
            cover: coverMap.get(album.name) ?? album.cover ?? '',
        }));

        setAlbums(albumsWithCovers);
    } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Ошибка при загрузке альбомов', {});
    }
}
