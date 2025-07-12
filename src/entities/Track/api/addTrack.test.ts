// src/entities/Track/api/addTrack.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import toast from 'react-hot-toast';
import { addTrack } from './addTrack';

vi.mock('axios');
vi.mock('react-hot-toast');

describe('addTrack', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('вызывает ошибку, если не передан groupName', async () => {
        const data = {
            title: 'Test Track',
            cover: new File([], 'cover.png'),
            audio: new File([], 'audio.mp3'),
            groupName: undefined,
        };

        await expect(addTrack(data)).rejects.toThrow('groupName is required');
        expect(toast.error).toHaveBeenCalledWith('Группа не выбрана');
    });

    it('успешно отправляет форму и показывает успех', async () => {
        const data = {
            title: 'Test Track',
            cover: new File([], 'cover.png'),
            audio: new File([], 'audio.mp3'),
            groupName: 'Test Group',
        };

        (axios.post as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
            status: 201,
            statusText: 'Created',
        });

        await addTrack(data);

        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(toast.success).toHaveBeenCalledWith('Трек успешно добавлен');
    });

    it('показывает ошибку при статусе не 200 и не 201', async () => {
        const data = {
            title: 'Test Track',
            cover: new File([], 'cover.png'),
            audio: new File([], 'audio.mp3'),
            groupName: 'Test Group',
        };

        (axios.post as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
            status: 400,
            statusText: 'Bad Request',
        });

        await expect(addTrack(data)).rejects.toThrow('Ошибка при добавлении трека: Bad Request');
    });

    it('показывает общий toast error при неизвестной ошибке', async () => {
        const data = {
            title: 'Test Track',
            cover: new File([], 'cover.png'),
            audio: new File([], 'audio.mp3'),
            groupName: 'Test Group',
        };

        const error = new Error('Unknown error');

        (axios.post as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(error);

        await expect(addTrack(data)).rejects.toEqual(error);
        expect(toast.error).toHaveBeenCalledWith('Ошибка при добавлении трека');
    });
});
