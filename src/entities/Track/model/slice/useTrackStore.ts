// src/entities/Track/model/slice/useTrackStore.ts
import { create } from 'zustand';
import type { Track } from '../types/track';

export interface TrackState {
    tracks: Track[];
    currentTrack: Track | null;
    isPlaying: boolean;
    loading: boolean;

    setLoading: (loading: boolean) => void;
    setTracks: (tracks: Track[]) => void;
    addTrack: (track: Track) => void;
    updateTrack: (track: Track) => void;
    removeTrack: (id: string) => void;

    setCurrentTrack: (track: Track | null) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    togglePlay: () => void;
}

export const useTrackStore = create<TrackState>((set) => ({
    tracks: [],
    currentTrack: null,
    isPlaying: false,
    loading: false,

    setLoading: (loading) => set({ loading }),
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

    setCurrentTrack: (track) => set({ currentTrack: track }),
    setIsPlaying: (isPlaying) => set({ isPlaying }),
    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
}));
