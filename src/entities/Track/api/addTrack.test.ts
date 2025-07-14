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

    it('показывает общее сообщение, если error.response.data.error не строка', async () => {
        const data = {
            title: 'Test Track',
            cover: new File([], 'cover.png'),
            audio: new File([], 'audio.mp3'),
            groupName: 'Test Group',
        };

        const error = {
            response: {
                data: {
                    error: { code: 123, message: 'Invalid' }, // не строка
                },
            },
        };

        (axios.post as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(error);

        await expect(addTrack(data)).rejects.toEqual(error);
        expect(toast.error).toHaveBeenCalledWith('Ошибка при добавлении трека');
    });
    it('выбрасывает ошибку, если статус второго запроса не 200 или 201', async () => {
        const data = {
            title: 'Test Track',
            cover: new File([], 'cover.png'),
            audio: new File([], 'audio.mp3'),
            groupName: 'Test Group',
        };

        (axios.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
            data: [{ id: 'group-id-123', name: 'Test Group' }],
        });

        // Первый POST (загрузка файлов) — успешный
        (axios.post as unknown as ReturnType<typeof vi.fn>)
            .mockResolvedValueOnce({
                status: 201,
                statusText: 'Created',
                data: {
                    coverUrl: 'some_cover_url',
                    audioUrl: 'some_audio_url',
                    duration: 120,
                },
            })
            // Второй POST (сохранение в БД) — ошибка
            .mockResolvedValueOnce({
                status: 500,
                statusText: 'Internal Server Error',
            });

        await expect(addTrack(data)).rejects.toThrow(
            'Ошибка при добавлении трека в базу: Internal Server Error',
        );
    });
    it('выбрасывает ошибку, если группа не найдена', async () => {
        const data = {
            title: 'Test Track',
            cover: new File([], 'cover.png'),
            audio: new File([], 'audio.mp3'),
            groupName: 'Test Group',
        };

        // Первый post — загрузка файла
        (axios.post as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            status: 201,
            data: {
                coverUrl: 'cover.png',
                audioUrl: 'audio.mp3',
                duration: 180,
            },
        });

        // get вернёт пустой массив — что и нужно по сценарию
        (axios.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
            data: [], // <--- ключевой момент
        });

        await expect(addTrack(data)).rejects.toThrow('Группа с именем "Test Group" не найдена');
    });

    it('успешно отправляет форму и показывает успех', async () => {
        const data = {
            title: 'Test Track',
            cover: new File([], 'cover.png'),
            audio: new File([], 'audio.mp3'),
            groupName: 'Test Group',
        };

        (axios.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
            data: [{ id: 'group-id-123', name: 'Test Group' }],
        });

        (axios.post as unknown as ReturnType<typeof vi.fn>)
            .mockResolvedValueOnce({
                status: 201,
                statusText: 'Created',
                data: {
                    coverUrl: 'some_cover_url',
                    audioUrl: 'some_audio_url',
                    duration: 120,
                },
            })
            .mockResolvedValueOnce({
                status: 201,
                statusText: 'Created',
                data: {},
            });

        await addTrack(data);

        expect(axios.post).toHaveBeenCalledTimes(2);
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
