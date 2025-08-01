import { create } from 'zustand';
import type { Track } from 'entities/Track';
import { useTrackStore } from 'entities/Track';

export interface PlayerState {
    currentTrack: Track | null;
    progress: number;
    currentTime: number;
    isPlaying: boolean;
    duration: number;
    volume: number;
    isMuted: boolean;
    audio: HTMLAudioElement | null;
    // Новые поля для рекомендаций
    isRecommendation: boolean;
    setIsRecommendation: (isRecommendation: boolean) => void;

    setCurrentTrack: (track: Track) => void;
    setProgress: (progress: number) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    setDuration: (duration: number) => void;
    setVolume: (volume: number) => void;
    setIsMuted: (isMuted: boolean) => void;
    togglePlay: () => void;
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
    // Инициализация массива рекомендаций
    isRecommendation: false,

    setCurrentTrack: (track) => {
        const prev = get();

        if (prev.audio) {
            prev.audio.pause();
            prev.audio.src = '';
        }

        const audio = new Audio(track.audioUrl);
        audio.volume = prev.isMuted ? 0 : prev.volume;

        audio.addEventListener('ended', () => {
            const state = get();
            const allTracks = useTrackStore.getState().tracks ?? [];
            const idx = allTracks.findIndex((t) => t.id === state.currentTrack?.id);
            if (idx !== -1 && idx < allTracks.length - 1) {
                state.setCurrentTrack(allTracks[idx + 1]);
            } else {
                audio.pause();
                set({ isPlaying: false });
            }
        });

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

        set({ currentTrack: track, audio, isPlaying: true });
    },
    setIsRecommendation: (isRecommendation) => {
        set({ isRecommendation });
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
            audio.play().catch((e) => console.warn('Ошибка воспроизведения аудио:', e));
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
}));
