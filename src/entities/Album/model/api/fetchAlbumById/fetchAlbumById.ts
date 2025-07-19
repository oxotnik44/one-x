import toast from 'react-hot-toast';
import { useAlbumStore } from '../../slice/useAlbumStore';
import { apiJson } from 'shared/api';
import type { Album } from '../../types/types';

export async function fetchAlbumById(groupId: string, albumId: string): Promise<void> {
    try {
        const { setCurrentAlbum } = useAlbumStore.getState();
        const { data } = await apiJson.get<Album[]>('/albums', { params: { groupId, albumId } });
        setCurrentAlbum(Array.isArray(data) ? data[0] : data);
    } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Ошибка при загрузке альбома');
    }
}
