import type { Track } from 'entities/Track/model/types/track';
import axios from 'axios';
import { api } from 'shared/api/api';
import { useTrackStore } from '../slice/useTrackStore';

export const fetchTracksByGroupName = async (
    groupName: string,
    groupId: string,
): Promise<Track[]> => {
    try {
        // Получаем оба массива параллельно
        const [mainResp, mediaResp] = await Promise.all([
            api.get<Track[]>('/tracks', { params: { groupId } }),
            axios.get<{ trackName: string; coverUrl: string | null; audioUrl: string | null }[]>(
                `http://localhost:4001/tracks/${encodeURIComponent(groupName)}`,
            ),
        ]);

        const main = mainResp.data;
        const media = mediaResp.data;

        if (!Array.isArray(main)) return [];

        // Мёржим и сразу пушим в стор
        const merged = main.map((t) => {
            const m = media.find((m) => m.trackName === t.id || m.trackName === t.title);
            return {
                ...t,
                cover: m?.coverUrl ?? '',
                audioUrl: m?.audioUrl ?? '',
                groupName,
            };
        });

        useTrackStore.getState().setTracks(merged);
        return merged;
    } catch (e) {
        console.error('Ошибка при загрузке треков с медиа', e);
        return [];
    }
};
