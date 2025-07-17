import { create } from 'zustand';
import type { Track } from '../types/track';

export interface TrackState {
    tracks: Track[];

    setTracks: (tracks: Track[]) => void;
    addTrack: (track: Track) => void;
    updateTrack: (track: Track) => void;
    removeTrack: (id: string) => void;
}

export const useTrackStore = create<TrackState>((set) => ({
    currentTrack: null,
    tracks: [],

    setTracks: (tracks) => set({ tracks }),
    addTrack: (track) => set((state) => ({ tracks: [...state.tracks, track] })),
    updateTrack: (updatedTrack) =>
        set((state) => ({
            tracks: state.tracks.map((t) => (t.id === updatedTrack.id ? updatedTrack : t)),
        })),
    removeTrack: (id) =>
        set((state) => ({
            tracks: state.tracks.filter((t) => t.id !== id),
        })),
}));
