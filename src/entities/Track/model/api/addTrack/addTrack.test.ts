// src/entities/Track/model/api/addTrack/addTrack.test.ts
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import toast from 'react-hot-toast';
import { addTrack, type AddTrackData } from './addTrack';
import { apiJson, apiBase } from 'shared/api';
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
    apiJson: {
        get: vi.fn(),
        post: vi.fn(),
    },
    apiBase: {
        post: vi.fn(),
    },
}));

describe('addTrack', () => {
    const mockUuid = 'test-uuid-1234';

    beforeEach(() => {
        vi.clearAllMocks();
        (uuidv4 as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockUuid);
    });

    const mockData: AddTrackData = {
        title: 'Test Track',
        cover: new File(['cover'], 'cover.png', { type: 'image/png' }),
        audio: new File(['audio'], 'audio.mp3', { type: 'audio/mpeg' }),
        groupName: 'Test Group',
        duration: 180,
    };

    it('успешно добавляет трек', async () => {
        // Мокаем ответ от запроса групп
        (apiJson.get as Mock).mockResolvedValue({
            data: [{ id: 'group-id-1', name: 'Test Group' }],
        });

        // Мокаем загрузку файлов
        (apiBase.post as Mock).mockResolvedValue({
            data: {
                coverUrl: 'http://example.com/cover.png',
                audioUrl: 'http://example.com/audio.mp3',
            },
        });

        // Мокаем добавление трека
        (apiJson.post as Mock).mockResolvedValue({});

        await expect(addTrack(mockData)).resolves.toBeUndefined();

        // Проверяем, что загрузка файлов вызвана с FormData
        expect(apiBase.post).toHaveBeenCalledWith(
            '/uploadTrack',
            expect.any(FormData),
            expect.objectContaining({
                headers: { 'Content-Type': 'multipart/form-data' },
            }),
        );

        // Проверяем, что добавление трека вызвано с нужными данными
        expect(apiJson.post).toHaveBeenCalledWith('/tracks', {
            id: mockUuid,
            title: mockData.title,
            duration: mockData.duration,
            cover: 'http://example.com/cover.png',
            groupId: 'group-id-1',
            audioUrl: 'http://example.com/audio.mp3',
            createdAt: expect.any(String),
        });
    });

    it('выбрасывает ошибку, если groupName не указан', async () => {
        const dataWithoutGroup = { ...mockData, groupName: undefined };

        await expect(addTrack(dataWithoutGroup)).rejects.toThrow('groupName is required');

        expect(toast.error).toHaveBeenCalledWith('Группа не выбрана');
    });

    it('выбрасывает ошибку, если группа не найдена', async () => {
        (apiJson.get as Mock).mockResolvedValue({ data: [] });

        await expect(addTrack(mockData)).rejects.toThrow(
            `Группа с именем "${mockData.groupName}" не найдена`,
        );
    });
});
