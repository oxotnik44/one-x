// src/features/Album/services/addTrackInAlbum.spec.ts
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { addTrackInAlbum } from './addTrackInAlbum';
import { apiBase, apiJson } from 'shared/api';
import { getAudioDuration } from 'shared/lib';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { useTrackStore } from 'entities/Track';

interface DummyGroup {
    id: string;
    name: string;
}
interface DummyAlbum {
    id: string;
    name: string;
    cover?: string;
    trackIds?: string[];
}

vi.mock('shared/api', () => ({
    apiBase: { post: vi.fn() },
    apiJson: { post: vi.fn(), patch: vi.fn() },
}));
vi.mock('shared/lib', () => ({ getAudioDuration: vi.fn() }));
vi.mock('uuid', () => ({ v4: vi.fn() }));
vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

vi.mock('entities/Track', () => ({
    useTrackStore: { getState: vi.fn() },
}));

describe('addTrackInAlbum', () => {
    const dummyGroup: DummyGroup = { id: 'g1', name: 'Group One' };
    const dummyAlbum: DummyAlbum = {
        id: 'a1',
        name: 'Album One',
        cover: 'cover.jpg',
        trackIds: ['t0'],
    };
    const dummyFile = new File(['audio'], 'song.mp3', { type: 'audio/mpeg' });

    const dummyResponse = { message: 'ok', trackUrl: 'http://url/to/song.mp3' };

    let addTrackMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.clearAllMocks();

        // apiBase.post возвращает dummyResponse
        (apiBase.post as Mock).mockResolvedValue({ data: dummyResponse });
        // getAudioDuration возвращает 200
        (getAudioDuration as Mock).mockResolvedValue(200);
        // uuidv4 генерит фиксированный id
        (uuidv4 as Mock).mockReturnValue('uuid-123');

        // стор
        addTrackMock = vi.fn();
        (useTrackStore.getState as Mock).mockReturnValue({
            addTrack: addTrackMock,
        });
    });

    it('успешно загружает файл, создаёт запись и возвращает ответ', async () => {
        const result = await addTrackInAlbum(dummyGroup as any, dummyAlbum as any, dummyFile);

        // Проверили вызов загрузки
        expect(apiBase.post).toHaveBeenCalledWith(
            `/addTrack/${encodeURIComponent(dummyGroup.name)}/${encodeURIComponent(dummyAlbum.name)}`,
            expect.any(FormData),
            { headers: { 'Content-Type': 'multipart/form-data' } },
        );

        // Проверили duration
        expect(getAudioDuration).toHaveBeenCalledWith(dummyFile);

        // Проверили создание трека в apiJson
        expect(apiJson.post).toHaveBeenCalledWith('/tracks', {
            id: 'uuid-123',
            title: 'song',
            duration: 200,
            cover: 'cover.jpg',
            groupName: 'Group One',
            albumId: 'a1',
            groupId: 'g1',
            audioUrl: dummyResponse.trackUrl,
            createdAt: expect.any(String),
        });

        // Проверили патч альбома
        expect(apiJson.patch).toHaveBeenCalledWith(`/albums/${dummyAlbum.id}`, {
            trackIds: [...(dummyAlbum.trackIds ?? []), 'uuid-123'],
        });

        // Проверили стор
        expect(addTrackMock).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 'uuid-123',
                title: 'song',
            }),
        );

        // Проверили тост
        expect(toast.success).toHaveBeenCalledWith('Трек успешно добавлен');

        // Проверили возвращаемое значение
        expect(result).toEqual(dummyResponse);
    });

    it('при ошибке выбрасывает исключение и показывает тост ошибки', async () => {
        const error = new Error('fail upload');
        (apiBase.post as Mock).mockRejectedValue(error);

        await expect(
            addTrackInAlbum(dummyGroup as any, dummyAlbum as any, dummyFile),
        ).rejects.toThrow(error);

        expect(toast.error).toHaveBeenCalledWith(error.message);
        expect(addTrackMock).not.toHaveBeenCalled();
    });
});
