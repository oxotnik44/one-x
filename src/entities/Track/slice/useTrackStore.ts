// src/entities/Track/model/trackStore.ts
import { create } from 'zustand';
import type { Track } from '../model/types/track';

export interface TrackState {
    /** Текущая выбранная песня */
    currentTrack: Track | null;
    /** Установить текущую песню вручную */
    setTrack: (track: Track) => void;
}

export const useTrackStore = create<TrackState>()((set) => ({
    currentTrack: null,

    setTrack: (track) => {
        set({ currentTrack: track });
    },
}));
