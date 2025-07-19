// src/features/Album/services/editDescription.spec.ts
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import toast from 'react-hot-toast';
import { editDescription } from './editDescription';
import { apiJson } from 'shared/api';
import { useAlbumStore } from '../../slice/useAlbumStore';

vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

vi.mock('shared/api', () => ({
    apiJson: { patch: vi.fn() },
}));
vi.mock('../../slice/useAlbumStore', () => ({
    useAlbumStore: { getState: vi.fn() },
}));

describe('editDescription', () => {
    const albumId = 'a1';
    const newDesc = 'Новое описание';
    const existingAlbums = [
        { id: 'a1', name: 'Album One', description: 'Старое' },
        { id: 'a2', name: 'Album Two', description: 'Другой' },
    ];

    let setAlbumsMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.clearAllMocks();

        setAlbumsMock = vi.fn();
        (useAlbumStore.getState as Mock).mockReturnValue({
            albums: existingAlbums,
            setAlbums: setAlbumsMock,
        });

        (apiJson.patch as Mock).mockResolvedValue(undefined);
    });

    it('успешно патчит описание и обновляет стор', async () => {
        await editDescription(albumId, newDesc);

        expect(apiJson.patch).toHaveBeenCalledWith(`/albums/${albumId}`, { description: newDesc });
        expect(setAlbumsMock).toHaveBeenCalledWith([
            { id: 'a1', name: 'Album One', description: newDesc },
            { id: 'a2', name: 'Album Two', description: 'Другой' },
        ]);
        expect(toast.success).toHaveBeenCalledWith('Описание успешно обновлено');
    });

    it('при ошибке показывает тост с текстом ошибки', async () => {
        const error = new Error('fail update');
        (apiJson.patch as Mock).mockRejectedValue(error);

        await editDescription(albumId, newDesc);

        expect(toast.error).toHaveBeenCalledWith(error.message);
        expect(setAlbumsMock).not.toHaveBeenCalled();
    });
});
