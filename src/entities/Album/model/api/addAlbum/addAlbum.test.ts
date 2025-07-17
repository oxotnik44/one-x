// src/entities/Album/api/addAlbum.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import toast from 'react-hot-toast';
import { addAlbum, type AddAlbumData } from './addAlbum';
import { apiBase, apiJson } from 'shared/api';
import { v4 as uuidv4 } from 'uuid';

vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
        promise: vi.fn((promise) => promise),
    },
}));

vi.mock('uuid', () => ({
    v4: vi.fn(),
}));

vi.mock('shared/api', () => ({
    apiBase: {
        post: vi.fn(),
    },
    apiJson: {
        get: vi.fn(),
        post: vi.fn(),
        patch: vi.fn(),
    },
}));

describe('addAlbum', () => {
    const mockAlbumId = 'album-uuid-1234';
    const mockTrackId = 'track-uuid-5678';

    beforeEach(() => {
        vi.clearAllMocks();
        (uuidv4 as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => mockAlbumId);
    });

    const mockData: AddAlbumData = {
        title: 'Test Album',
        groupName: 'Test Group',
        cover: new File(['cover'], 'cover.png', { type: 'image/png' }),
        tracks: [
            {
                file: new File(['audio'], 'track1.mp3', { type: 'audio/mpeg' }),
                title: 'Track 1',
                duration: 120,
            },
        ],
    };

    it('успешно создает альбом и треки', async () => {
        // Мокаем загрузку альбома с URL
        (apiBase.post as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
            data: {
                coverUrl: 'http://example.com/cover.png',
                tracksUrls: ['http://example.com/track1.mp3'],
            },
        });

        // Мокаем получение группы
        (apiJson.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
            data: [{ id: 'group-id-1' }],
        });

        // Мокаем создание альбома
        (apiJson.post as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({});

        // Для генерации разных id трека
        let callCount = 0;
        (uuidv4 as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => {
            callCount++;
            return callCount === 1 ? mockAlbumId : mockTrackId;
        });

        // Мокаем создание трека
        (apiJson.post as unknown as ReturnType<typeof vi.fn>)
            .mockResolvedValueOnce({})
            .mockResolvedValueOnce({
                data: { id: mockTrackId },
            });

        // Мокаем обновление альбома
        (apiJson.patch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({});

        const result = await addAlbum(mockData);

        expect(result).toEqual({
            coverUrl: 'http://example.com/cover.png',
            tracksUrls: ['http://example.com/track1.mp3'],
        });

        // Проверяем вызовы API
        expect(apiBase.post).toHaveBeenCalledWith(
            '/uploadAlbum',
            expect.any(FormData),
            expect.objectContaining({ headers: { 'Content-Type': 'multipart/form-data' } }),
        );

        expect(apiJson.get).toHaveBeenCalledWith('/groups?name=Test%20Group');

        expect(apiJson.post).toHaveBeenCalledWith(
            '/albums',
            expect.objectContaining({
                id: mockAlbumId,
                name: mockData.title,
                groupId: 'group-id-1',
                cover: 'http://example.com/cover.png',
                trackIds: [],
            }),
        );

        expect(apiJson.post).toHaveBeenCalledWith(
            '/tracks',
            expect.objectContaining({
                id: mockTrackId,
                title: 'Track 1',
                duration: 120,
                cover: 'http://example.com/cover.png',
                groupName: 'Test Group',
                albumId: mockAlbumId,
                groupId: 'group-id-1',
                audioUrl: 'http://example.com/track1.mp3',
                createdAt: expect.any(String),
            }),
        );

        expect(apiJson.patch).toHaveBeenCalledWith(`/albums/${mockAlbumId}`, {
            trackIds: [mockTrackId],
        });
    });

    it('выбрасывает ошибку, если groupName не указан', async () => {
        const badData = { ...mockData, groupName: '' };
        await expect(addAlbum(badData)).rejects.toThrow('groupName is required');
        expect(toast.error).toHaveBeenCalledWith('Группа не выбрана');
    });

    it('выбрасывает ошибку, если группа не найдена', async () => {
        (apiBase.post as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
            data: {
                coverUrl: 'http://example.com/cover.png',
                tracksUrls: ['http://example.com/track1.mp3'],
            },
        });

        (apiJson.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
            data: [],
        });

        await expect(addAlbum(mockData)).rejects.toThrow('Группа не найдена');
    });
});
