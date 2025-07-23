import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import toast from 'react-hot-toast';
import { deleteAlbum } from './deleteAlbum';
import { apiBase, apiJson } from 'shared/api';
import { useAlbumStore } from '../../slice/useAlbumStore';
import { useTrackStore } from 'entities/Track';
import { useGroupStore } from 'entities/Group';

vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

vi.mock('shared/api', () => ({
    apiBase: { delete: vi.fn() },
    apiJson: { delete: vi.fn() },
}));

vi.mock('../../slice/useAlbumStore', () => ({
    useAlbumStore: { getState: vi.fn() },
}));

vi.mock('entities/Track', () => ({
    useTrackStore: { getState: vi.fn() },
}));

vi.mock('entities/Group', () => ({
    useGroupStore: { getState: vi.fn() },
}));

describe('deleteAlbum', () => {
    const fakeAlbum = {
        id: 'a1',
        description: 'Hello',
        name: 'A',
        cover: '',
        createdAt: '',
        updatedAt: '',
        groupId: 'g1',
        trackIds: [],
    };
    const fakeOtherAlbum = { id: 'a2', name: 'Other' };
    const fakeTrack1 = { id: 't1', albumId: 'a1' };
    const fakeTrack2 = { id: 't2', albumId: 'a2' };

    let setAlbumsMock: ReturnType<typeof vi.fn>;
    let setTracksMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.clearAllMocks();

        setAlbumsMock = vi.fn();
        setTracksMock = vi.fn();

        (useAlbumStore.getState as Mock).mockReturnValue({
            albums: [fakeAlbum, fakeOtherAlbum],
            setAlbums: setAlbumsMock,
        });
        (useTrackStore.getState as Mock).mockReturnValue({
            tracks: [fakeTrack1, fakeTrack2],
            setTracks: setTracksMock,
        });
        (useGroupStore.getState as Mock).mockReturnValue({
            currentGroup: { name: 'GroupName' },
        });

        (apiJson.delete as Mock).mockResolvedValue(undefined);
        (apiBase.delete as Mock).mockResolvedValue(undefined);
    });

    it('успешно удаляет альбом и треки, обновляет сторы и показывает тост успеха', async () => {
        await deleteAlbum(fakeAlbum);

        // Проверяем вызовы API
        expect(apiJson.delete).toHaveBeenCalledWith('/albums/a1');
        expect(apiBase.delete).toHaveBeenCalledWith(
            `/deleteAlbum/${encodeURIComponent('GroupName')}/${encodeURIComponent('A')}`,
        );

        // Проверяем обновление Zustand: альбомов и треков
        expect(setAlbumsMock).toHaveBeenCalledWith([fakeOtherAlbum]);
        expect(setTracksMock).toHaveBeenCalledWith([fakeTrack2]);

        // Тост успеха
        expect(toast.success).toHaveBeenCalledWith('Альбом и все его треки успешно удалены');
    });

    it('если нет текущей группы — показывает тост ошибки и не вызывает API', async () => {
        (useGroupStore.getState as Mock).mockReturnValue({ currentGroup: null });

        await deleteAlbum(fakeAlbum);

        expect(apiJson.delete).not.toHaveBeenCalled();
        expect(apiBase.delete).not.toHaveBeenCalled();
        expect(setAlbumsMock).not.toHaveBeenCalled();
        expect(setTracksMock).not.toHaveBeenCalled();

        // Исправлено сообщение ошибки, чтобы совпадало с кодом
        expect(toast.error).toHaveBeenCalledWith('Ошибка: группа не найдена');
    });

    it('при ошибке API показывает тост с сообщением ошибки', async () => {
        const error = new Error('network error');
        (apiJson.delete as Mock).mockRejectedValue(error);

        await deleteAlbum(fakeAlbum);

        expect(toast.error).toHaveBeenCalledWith(error.message);
    });
});
