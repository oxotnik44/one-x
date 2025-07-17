// src/entities/Album/api/fetchAlbums.test.ts
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import toast from 'react-hot-toast';
import { fetchAlbums } from './fetchAlbums';
import { useAlbumStore } from '../../slice/useAlbumStore';
import { apiJson, apiBase } from 'shared/api';

vi.mock('react-hot-toast', () => ({
    default: {
        error: vi.fn(),
    },
}));

// Мокаем Zustand store
vi.mock('../../slice/useAlbumStore', () => ({
    useAlbumStore: {
        getState: vi.fn(),
    },
}));

vi.mock('shared/api', () => ({
    apiJson: {
        get: vi.fn(),
    },
    apiBase: {
        get: vi.fn(),
    },
}));

describe('fetchAlbums', () => {
    const mockSetAlbums = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useAlbumStore.getState as Mock).mockReturnValue({
            setAlbums: mockSetAlbums,
        });
    });

    it('успешно загружает альбомы с обложками и вызывает setAlbums', async () => {
        const groupId = 'group-1';
        const groupName = 'TestGroup';

        (apiJson.get as Mock).mockResolvedValue({
            data: [
                { id: 'album1', name: 'Album 1', cover: '', groupId },
                { id: 'album2', name: 'Album 2', cover: '', groupId },
            ],
        });

        (apiBase.get as Mock).mockResolvedValue({
            data: [
                { albumTitle: 'Album 1', coverUrl: 'http://example.com/cover1.png' },
                { albumTitle: 'Album 2', coverUrl: 'http://example.com/cover2.png' },
            ],
        });

        await fetchAlbums(groupId, groupName);

        expect(apiJson.get).toHaveBeenCalledWith('/albums', { params: { groupId } });
        expect(apiBase.get).toHaveBeenCalledWith(`/albumCovers/${encodeURIComponent(groupName)}`);

        expect(mockSetAlbums).toHaveBeenCalledWith([
            { id: 'album1', name: 'Album 1', cover: 'http://example.com/cover1.png', groupId },
            { id: 'album2', name: 'Album 2', cover: 'http://example.com/cover2.png', groupId },
        ]);
    });

    it('вызывает toast.error при ошибке', async () => {
        const error = new Error('Network error');
        (apiJson.get as Mock).mockRejectedValue(error);
        (useAlbumStore.getState as Mock).mockReturnValue({
            setAlbums: mockSetAlbums,
        });

        await fetchAlbums('groupId', 'groupName');

        expect(toast.error).toHaveBeenCalledWith('Network error', {});
    });
});
