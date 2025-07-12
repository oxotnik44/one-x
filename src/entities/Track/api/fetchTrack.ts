// src/entities/Track/model/slice/trackService.ts
import type { Track } from 'entities/Track/model/types/track';
import { api } from 'shared/api/api';
import { useTrackStore } from '../slice/useTrackStore';

export const fetchTrackById = async (): Promise<Track | null> => {
    try {
        const response = await api.get<Track[]>('/tracks');
        const tracks = response.data;

        if (!Array.isArray(tracks) || tracks.length === 0) {
            return null;
        }
        const firstTrack = tracks[0];

        useTrackStore.getState().setTrack(firstTrack);

        return firstTrack;
    } catch (error) {
        console.error('Ошибка при загрузке трека', error);
        return null;
    }
};
