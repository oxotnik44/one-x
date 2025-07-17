// src/entities/Group/model/api/fetchGroup/fetchGroup.test.ts
import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import toast from 'react-hot-toast';
import { apiJson, apiBase } from 'shared/api/api';
import { fetchGroup } from './fetchGroup';

vi.mock('shared/api/api', () => ({
    apiJson: { get: vi.fn() },
    apiBase: { get: vi.fn() },
}));

vi.mock('react-hot-toast', () => ({
    default: { error: vi.fn() },
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

    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        vi.clearAllMocks();
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    it('возвращает null если групп нет', async () => {
        (apiJson.get as Mock).mockResolvedValue({ data: [] });

        const result = await fetchGroup(fakeUserId);

        expect(apiJson.get).toHaveBeenCalledWith('/groups', { params: { userId: fakeUserId } });
        expect(result).toBeNull();
    });

    it('возвращает группу с обновлённым cover при успешном запросе cover', async () => {
        const groupCopy = { ...fakeGroup };
        (apiJson.get as Mock).mockResolvedValue({ data: [groupCopy] });

        const newCover = 'https://cdn.example.com/cover.png';
        (apiBase.get as Mock).mockResolvedValue({ data: { coverUrl: newCover } });

        const result = await fetchGroup(fakeUserId);

        expect(apiJson.get).toHaveBeenCalledWith('/groups', { params: { userId: fakeUserId } });
        expect(apiBase.get).toHaveBeenCalledWith(
            `/groupCover/${encodeURIComponent(fakeGroup.name)}`,
        );
        expect(result).not.toBeNull();
        expect(result?.cover).toBe(newCover);
    });

    it('выводит ошибку если не удалось получить cover, но возвращает группу', async () => {
        (apiJson.get as Mock).mockResolvedValue({ data: [fakeGroup] });
        (apiBase.get as Mock).mockRejectedValue(new Error('Network error'));

        const result = await fetchGroup(fakeUserId);

        expect(toast.error).toHaveBeenCalledWith('Не удалось получить иконку группы');
        expect(result).not.toBeNull();
        // cover осталось начальным
        expect(result?.cover).toBe(fakeGroup.cover);
    });

    it('выводит ошибку и возвращает null при ошибке apiJson.get', async () => {
        (apiJson.get as Mock).mockRejectedValue(new Error('API error'));

        const result = await fetchGroup(fakeUserId);

        expect(toast.error).toHaveBeenCalledWith('Ошибка при загрузке группы пользователя');
        expect(result).toBeNull();
    });
});
