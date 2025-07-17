// src/entities/Player/model/slice/usePlayerStore.ts
import type { Track } from 'entities/Track';
import { create } from 'zustand';

export interface PlayerState {
    currentTrack: Track | null;
    progress: number; // [%]
    currentTime: number; // в секундах
    isPlaying: boolean;
    duration: number; // в секундах
    volume: number;
    isMuted: boolean;
    audio: HTMLAudioElement | null;

    setCurrentTrack: (track: Track) => void;
    setProgress: (progress: number) => void;
    setCurrentTime: (time: number) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    setDuration: (duration: number) => void;
    setVolume: (volume: number) => void;
    setIsMuted: (isMuted: boolean) => void;
    togglePlay: () => void;
    resetPlayer: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
    currentTrack: null,
    progress: 0,
    currentTime: 0,
    isPlaying: false,
    duration: 0,
    volume: 1,
    isMuted: false,
    audio: null,

    setCurrentTrack: (track) => {
        const prev = get();
        if (prev.audio) {
            prev.audio.pause();
            prev.audio.src = '';
        }

        const audio = new Audio(track.audioUrl);
        audio.volume = prev.isMuted ? 0 : prev.volume;

        audio.addEventListener('loadedmetadata', () => {
            set({ duration: audio.duration });
        });

        audio.addEventListener('timeupdate', () => {
            set({
                progress: (audio.currentTime / audio.duration) * 100,
                currentTime: audio.currentTime,
            });
        });

        audio.play().catch(() => {
            console.warn('Автовоспроизведение запрещено браузером');
        });

        set({
            currentTrack: track,
            progress: 0,
            currentTime: 0,
            isPlaying: true,
            duration: 0, // будет обновлено в loadedmetadata
            audio,
        });
    },

    setProgress: (progress) => {
        const audio = get().audio;
        if (audio) {
            audio.currentTime = (progress / 100) * audio.duration;
        }
        set({ progress });
    },

    setCurrentTime: (time) => set({ currentTime: time }),

    setIsPlaying: (isPlaying: boolean) => {
        const audio = get().audio;
        if (!audio) return;

        if (isPlaying) {
            audio.play().catch((e) => {
                console.warn('Ошибка воспроизведения аудио:', e);
            });
        } else {
            audio.pause();
        }
        set({ isPlaying });
    },

    setDuration: (duration) => set({ duration }),

    setVolume: (volume) => {
        const audio = get().audio;
        if (audio) audio.volume = volume;
        set({ volume });
    },

    setIsMuted: (isMuted) => {
        const audio = get().audio;
        if (audio) audio.volume = isMuted ? 0 : get().volume;
        set({ isMuted });
    },

    togglePlay: () => {
        const { isPlaying, setIsPlaying } = get();
        setIsPlaying(!isPlaying);
    },

    resetPlayer: () => {
        const audio = get().audio;
        if (audio) audio.pause();
        set({
            currentTrack: null,
            progress: 0,
            currentTime: 0,
            isPlaying: false,
            duration: 0,
            audio: null,
        });
    },
}));
