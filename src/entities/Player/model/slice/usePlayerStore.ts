import { create } from 'zustand';
import type { Track } from 'entities/Track/model/types/track';

export interface PlayerState {
    currentTrack: Track | null;
    progress: number;
    isPlaying: boolean;
    duration: number;
    volume: number;
    isMuted: boolean;
    audio: HTMLAudioElement | null;

    setCurrentTrack: (track: Track) => void;
    setProgress: (progress: number) => void;
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
    isPlaying: false,
    duration: 0,
    volume: 1,
    isMuted: false,
    audio: null,

    setCurrentTrack: (track) => {
        const { audio, volume, isMuted, currentTrack: prevTrack } = get();

        if (audio) {
            audio.pause();
            audio.src = '';
        }

        const newAudio = new Audio(track.audioUrl);
        newAudio.volume = isMuted ? 0 : volume;

        newAudio.addEventListener('loadedmetadata', () => {
            set({ duration: newAudio.duration });
        });

        newAudio.addEventListener('timeupdate', () => {
            set({ progress: (newAudio.currentTime / newAudio.duration) * 100 });
        });

        newAudio.play().catch(() => {
            // Можно обработать ошибку play (например, автозапуск запрещён)
        });

        // Объединяем предыдущее состояние трека и новый трек, чтобы не потерять поля
        const mergedTrack = {
            ...prevTrack,
            ...track,
        };

        set({
            currentTrack: mergedTrack,
            progress: 0,
            isPlaying: true,
            duration: newAudio.duration,
            audio: newAudio,
        });
    },

    setProgress: (progress) => {
        const audio = get().audio;
        if (audio) {
            audio.currentTime = (progress / 100) * audio.duration;
        }
        set({ progress });
    },

    setIsPlaying: (isPlaying) => {
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
        if (audio) {
            audio.volume = volume;
        }
        set({ volume });
    },

    setIsMuted: (isMuted) => {
        const audio = get().audio;
        if (audio) {
            audio.volume = isMuted ? 0 : get().volume;
        }
        set({ isMuted });
    },

    togglePlay: () => {
        const { isPlaying, setIsPlaying } = get();
        setIsPlaying(!isPlaying);
    },

    resetPlayer: () => {
        const audio = get().audio;
        if (audio) {
            audio.pause();
        }
        set({
            currentTrack: null,
            progress: 0,
            isPlaying: false,
            duration: 0,
            audio: null,
        });
    },
}));
