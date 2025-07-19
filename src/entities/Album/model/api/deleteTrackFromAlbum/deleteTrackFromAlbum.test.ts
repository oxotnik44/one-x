import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import toast from 'react-hot-toast';
import { deleteTrackFromAlbum } from './deleteTrackFromAlbum';
import { apiBase, apiJson } from 'shared/api';
import { useTrackStore } from 'entities/Track';
import { useAlbumStore } from '../../slice/useAlbumStore';
import type { Group } from 'entities/Group';
import type { Album } from '../../types/types';

vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

vi.mock('shared/api', () => ({
    apiBase: { delete: vi.fn() },
    apiJson: { delete: vi.fn(), patch: vi.fn() },
}));
vi.mock('entities/Track', () => ({
    useTrackStore: { getState: vi.fn() },
}));
vi.mock('../../slice/useAlbumStore', () => ({
    useAlbumStore: { getState: vi.fn() },
}));

describe('deleteTrackFromAlbum', () => {
    const trackId = 't1';
    const trackTitle = 'My Track';
    const group: Group = {
        id: 'g1',
        name: 'GroupName',
        userId: '',
        cover: '',
        genre: 'Рок',
        createdAt: '',
    };
    const album: Album = {
        id: 'a1',
        name: 'AlbumName',
        cover: '',
        trackIds: ['t1', 't2'],
        groupId: '',
        description: null,
        createdAt: '',
    };

    let setTracksMock: ReturnType<typeof vi.fn>;
    let setAlbumsMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.clearAllMocks();

        setTracksMock = vi.fn();
        setAlbumsMock = vi.fn();

        (useTrackStore.getState as Mock).mockReturnValue({
            tracks: [
                { id: 't1', title: 'My Track', albumId: 'a1' },
                { id: 't2', title: 'Other', albumId: 'a1' },
            ],
            setTracks: setTracksMock,
        });
        (useAlbumStore.getState as Mock).mockReturnValue({
            albums: [{ id: 'a1', name: 'AlbumName', cover: '', trackIds: ['t1', 't2'] }],
            setAlbums: setAlbumsMock,
        });

        (apiBase.delete as Mock).mockResolvedValue(undefined);
        (apiJson.delete as Mock).mockResolvedValue(undefined);
        (apiJson.patch as Mock).mockResolvedValue(undefined);
    });

    it('ранний выход при отсутствии группы или альбома', async () => {
        await deleteTrackFromAlbum(trackId, trackTitle, null as any, null as any);

        expect(toast.error).toHaveBeenCalledWith('Ошибка: группа или альбом не выбраны');
        expect(apiBase.delete).not.toHaveBeenCalled();
        expect(apiJson.delete).not.toHaveBeenCalled();
        expect(apiJson.patch).not.toHaveBeenCalled();
        expect(setTracksMock).not.toHaveBeenCalled();
        expect(setAlbumsMock).not.toHaveBeenCalled();
    });

    it('успешно удаляет трек и обновляет сторы', async () => {
        await deleteTrackFromAlbum(trackId, trackTitle, group, album);

        // Проверяем API-вызовы
        expect(apiBase.delete).toHaveBeenCalledWith(
            `/deleteTrack/${encodeURIComponent(group.name)}/${encodeURIComponent(album.name)}/${encodeURIComponent(trackTitle)}`,
        );
        expect(apiJson.delete).toHaveBeenCalledWith(`/tracks/${trackId}`);
        expect(apiJson.patch).toHaveBeenCalledWith(`/albums/${album.id}`, {
            trackIds: ['t2'],
        });

        // Проверяем обновление стора треков
        expect(setTracksMock).toHaveBeenCalledWith([{ id: 't2', title: 'Other', albumId: 'a1' }]);

        // Проверяем обновление стора альбомов
        expect(setAlbumsMock).toHaveBeenCalledWith([
            { id: 'a1', name: 'AlbumName', cover: '', trackIds: ['t2'] },
        ]);

        // Тост успеха
        expect(toast.success).toHaveBeenCalledWith(
            'Трек "My Track" успешно удалён из альбома "AlbumName"',
        );
    });

    it('при ошибке API показывает тост с сообщением ошибки', async () => {
        const error = new Error('Network fail');
        (apiBase.delete as Mock).mockRejectedValue(error);

        await deleteTrackFromAlbum(trackId, trackTitle, group, album);

        expect(toast.error).toHaveBeenCalledWith(error.message);
        // После ошибки сторы не меняются
        expect(setTracksMock).not.toHaveBeenCalled();
        expect(setAlbumsMock).not.toHaveBeenCalled();
    });
});
