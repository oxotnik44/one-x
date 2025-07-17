import toast from 'react-hot-toast';
import type { Album } from '../../types/types';
import type { Track } from 'entities/Track';
import { v4 as uuidv4 } from 'uuid';
import { apiBase, apiJson } from 'shared/api';

interface UploadAlbumResponse {
    coverUrl: string;
    tracksUrls: string[];
}

export interface AddAlbumData {
    title: string;
    groupName: string;
    cover: File;
    tracks: {
        file: File;
        title: string;
        duration: number;
    }[];
}

interface CreatedTrackResponse {
    id: string;
}

const extractTitle = (url: string): string =>
    decodeURIComponent(url)
        .split('/')
        .pop()
        ?.replace(/\.[^/.]+$/, '') ?? 'Untitled';

export async function addAlbum(data: AddAlbumData): Promise<UploadAlbumResponse> {
    if (!data.groupName) {
        toast.error('Группа не выбрана');
        throw new Error('groupName is required');
    }

    return await toast.promise(
        (async (): Promise<UploadAlbumResponse> => {
            // 1. Загружаем файлы
            const formData = new FormData();
            formData.append('groupName', data.groupName);
            formData.append('title', data.title);
            formData.append('cover', data.cover);
            data.tracks.forEach(({ file }) => {
                formData.append('tracks', file, file.name);
            });

            const uploadPromise = apiBase.post<UploadAlbumResponse>('/uploadAlbum', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const groupPromise = apiJson.get<{ id: string }[]>(
                `/groups?name=${encodeURIComponent(data.groupName)}`,
            );

            const [uploadRes, groupRes] = await Promise.all([uploadPromise, groupPromise]);

            const upload = uploadRes.data;
            const groupId = groupRes.data[0]?.id;
            if (!groupId) throw new Error('Группа не найдена');

            // 2. Создаём альбом
            const albumId = uuidv4();
            const album: Album = {
                id: albumId,
                name: data.title,
                groupId,
                cover: upload.coverUrl,
                createdAt: new Date().toISOString(),
                trackIds: [],
            };

            await apiJson.post<Album>('/albums', album);

            // 3. Параллельное создание треков
            const trackCreatePromises = upload.tracksUrls.map(async (url, i) => {
                const track: Track = {
                    id: uuidv4(),
                    title: data.tracks[i].title || extractTitle(url),
                    duration: data.tracks[i].duration,
                    cover: upload.coverUrl,
                    groupName: data.groupName,
                    albumId,
                    groupId,
                    audioUrl: url,
                    createdAt: new Date().toISOString(),
                };

                const { data: created } = await apiJson.post<CreatedTrackResponse>(
                    '/tracks',
                    track,
                );

                return created.id;
            });

            const trackIds = await Promise.all(trackCreatePromises);

            // 4. Обновляем альбом (trackIds)
            await apiJson.patch(`/albums/${albumId}`, {
                trackIds,
            });

            return upload;
        })(),
        {
            loading: 'Создание альбома...',
            success: 'Альбом и треки успешно загружены',
            error: (err: unknown) =>
                err instanceof Error ? err.message : 'Ошибка при создании альбома',
        },
    );
}
