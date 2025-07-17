import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import type { Track } from '../../types/track';
import { apiBase, apiJson } from 'shared/api';
import { useTrackStore } from '../../slice/useTrackStore';

export interface AddTrackData {
    title: string;
    cover: File;
    audio: File;
    groupName?: string;
    duration: number;
}

interface UploadTrackResponse {
    coverUrl: string;
    audioUrl: string;
}

interface GroupResponse {
    id: string;
    name: string;
}

export async function addTrack(data: AddTrackData): Promise<void> {
    return await toast.promise(
        (async () => {
            if (!data.groupName) {
                toast.error('Группа не выбрана');
                throw new Error('groupName is required');
            }

            // 1. Получение данных о группе
            const { data: groups } = await apiJson.get<GroupResponse[]>('/groups', {
                params: { name: data.groupName },
            });

            if (!groups.length) {
                throw new Error(`Группа с именем "${data.groupName}" не найдена`);
            }

            const group = groups[0];

            // 2. Загрузка файлов (cover + audio)
            const formData = new FormData();
            formData.append('groupName', data.groupName);
            formData.append('trackName', data.title);
            formData.append('cover', data.cover);
            formData.append('audio', data.audio);

            const uploadRes = await apiBase.post<UploadTrackResponse>('/uploadTrack', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const { coverUrl, audioUrl } = uploadRes.data;

            // 3. Формирование нового трека
            const newTrack: Track = {
                id: uuidv4(),
                title: data.title,
                duration: data.duration,
                cover: coverUrl,
                groupId: group.id,
                audioUrl,
                createdAt: new Date().toISOString(),
            };

            // 4. Отправка трека в JSON Server
            await apiJson.post('/tracks', newTrack);

            // 5. Добавляем трек в Zustand сразу после успешного сохранения
            useTrackStore.getState().addTrack(newTrack);
        })(),
        {
            loading: 'Загрузка трека...',
            success: 'Трек успешно добавлен',
            error: (err: unknown) =>
                err instanceof Error ? err.message : 'Ошибка при добавлении трека',
        },
    );
}
