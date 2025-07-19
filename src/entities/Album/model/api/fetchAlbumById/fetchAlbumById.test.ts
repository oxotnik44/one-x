// src/features/Album/services/fetchAlbumById.spec.ts
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import toast from 'react-hot-toast';
import { fetchAlbumById } from './fetchAlbumById';
import { apiJson } from 'shared/api';
import { useAlbumStore } from '../../slice/useAlbumStore';
import type { Album } from '../../types/types';

vi.mock('react-hot-toast', () => ({
    default: {
        error: vi.fn(),
    },
}));
vi.mock('shared/api', () => ({
    apiJson: { get: vi.fn() },
}));
vi.mock('../../slice/useAlbumStore', () => ({
    useAlbumStore: { getState: vi.fn() },
}));

describe('fetchAlbumById', () => {
    const groupId = 'g1';
    const albumId = 'a1';

    const setCurrentAlbumMock = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        (useAlbumStore.getState as Mock).mockReturnValue({
            setCurrentAlbum: setCurrentAlbumMock,
        });
    });

    it('успешно устанавливает текущий альбом, когда приходит массив', async () => {
        const album: Album = {
            id: albumId,
            name: 'Album 1',
            trackIds: [],
            description: '',
            groupId: '',
            createdAt: '',
        };
        (apiJson.get as Mock).mockResolvedValue({ data: [album] });

        await fetchAlbumById(groupId, albumId);

        expect(apiJson.get).toHaveBeenCalledWith('/albums', { params: { groupId, albumId } });
        expect(setCurrentAlbumMock).toHaveBeenCalledWith(album);
    });

    it('успешно устанавливает текущий альбом, когда приходит одиночный объект', async () => {
        const album: Album = {
            id: albumId,
            name: 'Album 1',
            trackIds: [],
            description: '',
            groupId: '',
            createdAt: '',
        };
        (apiJson.get as Mock).mockResolvedValue({ data: album });

        await fetchAlbumById(groupId, albumId);

        expect(setCurrentAlbumMock).toHaveBeenCalledWith(album);
    });

    it('при ошибке вызывает toast.error с сообщением ошибки', async () => {
        const error = new Error('fail load');
        (apiJson.get as Mock).mockRejectedValue(error);

        await fetchAlbumById(groupId, albumId);

        expect(toast.error).toHaveBeenCalledWith(error.message);
        expect(setCurrentAlbumMock).not.toHaveBeenCalled();
    });
});
