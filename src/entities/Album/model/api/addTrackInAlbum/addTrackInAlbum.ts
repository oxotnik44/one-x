import type { Group } from 'entities/Group';
import { useTrackStore, type Track } from 'entities/Track';
import { apiBase, apiJson } from 'shared/api';
import type { Album } from '../../types/types';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { getAudioDuration } from 'shared/lib';

interface AddTrackResponse {
    message: string;
    trackUrl: string;
}

export async function addTrackInAlbum(
    currentGroup: Group,
    currentAlbum: Album,
    file: File,
): Promise<AddTrackResponse> {
    try {
        const formData = new FormData();
        formData.append('track', file);

        const uploadRes = await apiBase.post<AddTrackResponse>(
            `/addTrack/${encodeURIComponent(currentGroup.name)}/${encodeURIComponent(currentAlbum.name)}`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } },
        );

        const duration = await getAudioDuration(file);

        const track: Track = {
            id: uuidv4(),
            title: file.name.replace(/\.[^/.]+$/, ''),
            duration,
            cover: currentAlbum.cover ?? '',
            groupName: currentGroup.name,
            albumId: currentAlbum.id,
            groupId: currentGroup.id,
            audioUrl: uploadRes.data.trackUrl,
            createdAt: new Date().toISOString(),
        };

        await Promise.all([
            apiJson.post('/tracks', track),
            apiJson.patch(`/albums/${currentAlbum.id}`, {
                trackIds: [...(currentAlbum.trackIds ?? []), track.id],
            }),
        ]);

        useTrackStore.getState().addTrack(track);
        toast.success('Трек успешно добавлен');
        return uploadRes.data;
    } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Ошибка при добавлении трека');
        throw err;
    }
}
