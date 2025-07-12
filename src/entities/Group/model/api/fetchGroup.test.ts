import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { fetchGroup } from './fetchGroup';
import { api } from 'shared/api/api';
import toast from 'react-hot-toast';

vi.mock('shared/api/api', () => ({
    api: {
        get: vi.fn(),
    },
}));

vi.mock('react-hot-toast', () => ({
    default: {
        error: vi.fn(),
    },
}));

describe('fetchGroup', () => {
    const fakeUserId = 'user123';
    const fakeGroup = {
        id: 'group123',
        name: 'MyGroup',
        description: 'desc',
        userId: fakeUserId,
        genre: 'rock',
        cover: 'initial-cover-url',
        createdAt: new Date().toISOString(),
        updatedAt: '',
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        // Очистка URL.createObjectURL, чтобы избежать утечек памяти
        if (typeof URL.revokeObjectURL === 'function') {
            URL.revokeObjectURL(fakeGroup.cover);
        }
    });

    it('возвращает null если групп нет', async () => {
        (api.get as Mock).mockResolvedValue({ data: [] });

        const result = await fetchGroup(fakeUserId);

        expect(api.get).toHaveBeenCalledWith('/groups', { params: { userId: fakeUserId } });
        expect(result).toBeNull();
    });

    it('возвращает группу с обновлённым cover при успешном запросе cover', async () => {
        // Глубокая копия fakeGroup, чтобы менять cover локально, не мутируя исходный объект
        const groupCopy = { ...fakeGroup };

        (api.get as Mock).mockResolvedValue({ data: [groupCopy] });

        const fakeBlob = new Blob(['test'], { type: 'image/png' });

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            blob: () => Promise.resolve(fakeBlob),
        } as unknown as Response);

        // Мокаем URL.createObjectURL, возвращаем строку с префиксом blob:
        global.URL.createObjectURL = vi.fn(() => 'blob:test-url');

        const result = await fetchGroup(fakeUserId);

        expect(api.get).toHaveBeenCalledWith('/groups', { params: { userId: fakeUserId } });
        expect(global.fetch).toHaveBeenCalledWith(
            `http://localhost:4001/groupCover/${encodeURIComponent(fakeGroup.name)}`,
        );
        expect(global.URL.createObjectURL).toHaveBeenCalledWith(fakeBlob);
        expect(result).not.toBeNull();
        expect(result?.cover).toContain('blob:'); // Теперь проверка пройдет успешно
    });

    it('выводит ошибку если не удалось получить cover, но возвращает группу', async () => {
        (api.get as Mock).mockResolvedValue({ data: [fakeGroup] });

        global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

        const result = await fetchGroup(fakeUserId);

        expect(toast.error).toHaveBeenCalledWith('Не удалось получить иконку группы');
        expect(result).not.toBeNull();
    });

    it('выводит ошибку и возвращает null при ошибке api.get', async () => {
        (api.get as Mock).mockRejectedValue(new Error('API error'));

        const result = await fetchGroup(fakeUserId);

        expect(toast.error).toHaveBeenCalledWith('Ошибка при загрузке группы пользователя');
        expect(result).toBeNull();
    });
});
