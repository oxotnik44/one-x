// src/entities/Track/model/trackStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Track } from '../model/types/track';
import { TRACK_LOCALSTORAGE_KEY } from 'shared/const/localstorage';
import { fetchTrackById } from 'entities/Track/api/fetchTrack';

export interface TrackState {
    /** Текущая выбранная песня */
    currentTrack: Track | null;
    /** Установить текущую песню вручную */
    setTrack: (track: Track) => void;
    /** Загрузить трек по ID и установить как текущий */
    loadTrack: (idTrack: string) => Promise<void>;
}

export const useTrackStore = create<TrackState>()(
    persist(
        (set) => ({
            currentTrack: null,

            setTrack: (track) => {
                set({ currentTrack: track });
            },

            loadTrack: async () => {
                try {
                    const track = await fetchTrackById();
                    set({ currentTrack: track });
                } catch (error) {
                    console.error('Ошибка загрузки трека по ID', error);
                }
            },
        }),
        {
            name: TRACK_LOCALSTORAGE_KEY,
            partialize: (state) => ({ currentTrack: state.currentTrack }),
        },
    ),
);
