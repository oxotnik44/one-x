// src/entities/Album/model/api/fetchAlbumById/fetchAlbumById.test.ts
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

const mockedToast = vi.mocked(toast, true);
const mockedApi = vi.mocked(apiJson, true);
const mockedUseStore = vi.mocked(useAlbumStore, true);

describe('fetchAlbumById', () => {
    const groupId = 'g1';
    const albumId = 'a1';
    let setCurrentAlbumMock: Mock;

    beforeEach(() => {
        vi.clearAllMocks();
        setCurrentAlbumMock = vi.fn();
        mockedUseStore.getState.mockReturnValue({
            setCurrentAlbum: setCurrentAlbumMock,
        } as any);
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
        mockedApi.get.mockResolvedValue({ data: [album] });

        await fetchAlbumById(groupId, albumId);

        expect(mockedApi.get).toHaveBeenCalledWith('/albums', { params: { groupId, albumId } });
        expect(setCurrentAlbumMock).toHaveBeenCalledWith(album);
    });

    it('когда приходит одиночный объект, показывает ошибку и не устанавливает альбом', async () => {
        const album: Album = {
            id: albumId,
            name: 'Album 1',
            trackIds: [],
            description: '',
            groupId: '',
            createdAt: '',
        };
        // возвращаем один объект вместо массива
        mockedApi.get.mockResolvedValue({ data: album } as any);

        await fetchAlbumById(groupId, albumId);

        // убедимся, что toast.error вызван (с любым текстом)
        expect(mockedToast.error).toHaveBeenCalled();
        // и что setCurrentAlbum не сработал
        expect(setCurrentAlbumMock).not.toHaveBeenCalled();
    });

    it('при ошибке запроса вызывает toast.error с сообщением ошибки', async () => {
        const error = new Error('fail load');
        mockedApi.get.mockRejectedValue(error);

        await fetchAlbumById(groupId, albumId);

        expect(mockedToast.error).toHaveBeenCalledWith(error.message);
        expect(setCurrentAlbumMock).not.toHaveBeenCalled();
    });
});
