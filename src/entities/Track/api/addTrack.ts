// src/entities/Track/api/addTrack.ts
import axios from 'axios';
import toast from 'react-hot-toast';

export async function addTrack(data: {
    title: string;
    cover: File;
    audio: File;
    groupName?: string;
}): Promise<void> {
    if (!data.groupName) {
        toast.error('Группа не выбрана');
        throw new Error('groupName is required');
    }

    try {
        const formData = new FormData();
        formData.append('groupName', data.groupName);
        formData.append('trackName', data.title);
        formData.append('cover', data.cover);
        formData.append('audio', data.audio);

        const response = await axios.post('http://localhost:4001/uploadTrack', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.status !== 200 && response.status !== 201) {
            throw new Error(`Ошибка при добавлении трека: ${response.statusText}`);
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
