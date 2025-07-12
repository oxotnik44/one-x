import axios from 'axios';
import toast from 'react-hot-toast';
import type { Track } from '../model/types/track';
import { v4 as uuidv4 } from 'uuid';

interface AddTrackData {
    title: string;
    cover: File;
    audio: File;
    groupName?: string;
}

export async function addTrack(data: AddTrackData): Promise<void> {
    if (!data.groupName) {
        toast.error('Группа не выбрана');
        throw new Error('groupName is required');
    }

    try {
        // 1. Загружаем файлы на сервер
        const formData = new FormData();
        formData.append('groupName', data.groupName);
        formData.append('trackName', data.title);
        formData.append('cover', data.cover);
        formData.append('audio', data.audio);

        const uploadResponse = await axios.post('http://localhost:4001/uploadTrack', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (uploadResponse.status !== 200 && uploadResponse.status !== 201) {
            throw new Error(`Ошибка при добавлении трека: ${uploadResponse.statusText}`);
        }

        // 2. Получаем группу по имени
        const groupsResponse = await axios.get<{ id: string; name: string }[]>(
            'http://localhost:4000/groups',
            {
                params: { name: data.groupName },
            },
        );

        if (groupsResponse.data.length === 0) {
            throw new Error(`Группа с именем "${data.groupName}" не найдена`);
        }

        const group = groupsResponse.data[0];

        // 3. Формируем трек с данными из uploadResponse
        // Ожидается, что uploadResponse.data содержит { coverUrl, audioUrl, duration }
        const { coverUrl, audioUrl, duration } = uploadResponse.data as {
            coverUrl: string;
            audioUrl: string;
            duration: number;
        };

        const newTrack: Track = {
            id: uuidv4(),
            title: data.title,
            duration: duration ?? 0,
            cover: coverUrl,
            groupId: group.id,
            audioUrl,
            createdAt: new Date().toISOString(),
        };

        // 4. Добавляем трек в json-server
        const addTrackResponse = await axios.post('http://localhost:4000/tracks', newTrack);

        if (addTrackResponse.status !== 200 && addTrackResponse.status !== 201) {
            throw new Error(`Ошибка при добавлении трека в базу: ${addTrackResponse.statusText}`);
        }

        toast.success('Трек успешно добавлен');
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const serverError = error.response?.data as { error?: unknown };
            if (typeof serverError?.error === 'string') {
                toast.error(`Ошибка: ${serverError.error}`);
            } else {
                toast.error('Ошибка при добавлении трека');
            }
        } else {
            toast.error('Ошибка при добавлении трека');
        }
        throw error;
    }
}
