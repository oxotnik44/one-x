import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { fetchGroup } from './fetchGroup';
import { api } from 'shared/api/api';
import toast from 'react-hot-toast';
import { SERVER_BASE_URL } from 'shared/const/localstorage';

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

    // Подавляем логи ошибок в тестах
    let consoleLogSpy: ReturnType<typeof vi.spyOn>;
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        vi.clearAllMocks();
        consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });

    it('возвращает null если групп нет', async () => {
        (api.get as Mock).mockResolvedValue({ data: [] });

        const result = await fetchGroup(fakeUserId);

        expect(api.get).toHaveBeenCalledWith('/groups', { params: { userId: fakeUserId } });
        expect(result).toBeNull();
    });

    it('возвращает группу с обновлённым cover при успешном запросе cover', async () => {
        const groupCopy = { ...fakeGroup };

        (api.get as Mock).mockResolvedValue({ data: [groupCopy] });

        const fakeBlob = new Blob(['test'], { type: 'image/png' });

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            blob: () => Promise.resolve(fakeBlob),
        } as unknown as Response);

        // НЕ мокаем URL.createObjectURL, он не вызывается в коде

        const result = await fetchGroup(fakeUserId);

        expect(api.get).toHaveBeenCalledWith('/groups', { params: { userId: fakeUserId } });
        expect(global.fetch).toHaveBeenCalledWith(
            `${SERVER_BASE_URL}/groupCover/${encodeURIComponent(fakeGroup.name)}`,
        );

        // Проверяем, что cover установлен именно в строку URL
        expect(result).not.toBeNull();
        expect(result?.cover).toBe(
            `${SERVER_BASE_URL}/groupCover/${encodeURIComponent(fakeGroup.name)}`,
        );
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
