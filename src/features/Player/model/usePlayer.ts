// src/entities/Player/model/usePlayer.ts
import { usePlayerStore } from 'entities/Player/model';
import { useCallback, useMemo } from 'react';

export interface UsePlayerProps {
    onPrevTrack?: () => void;
    onNextTrack?: () => void;
}

export const usePlayer = ({ onPrevTrack, onNextTrack }: UsePlayerProps = {}) => {
    // Селектим только то, что нужно
    const progress = usePlayerStore((state) => state.progress);
    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const duration = usePlayerStore((state) => state.duration);
    const volume = usePlayerStore((state) => state.volume);
    const isMuted = usePlayerStore((state) => state.isMuted);
    const audio = usePlayerStore((state) => state.audio);

    const setProgress = usePlayerStore((state) => state.setProgress);
    const setVolume = usePlayerStore((state) => state.setVolume);
    const setIsMuted = usePlayerStore((state) => state.setIsMuted);
    const togglePlay = usePlayerStore((state) => state.togglePlay);

    const onSeek = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!audio) return;
            const newProgress = Number(e.target.value);
            setProgress(newProgress);
            audio.currentTime = (newProgress / 100) * duration;
        },
        [audio, duration, setProgress],
    );

    const onVolumeChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const v = Number(e.target.value);
            setVolume(v);
            setIsMuted(v === 0);
            if (audio) audio.volume = v;
        },
        [audio, setVolume, setIsMuted],
    );

    const toggleMute = useCallback(() => {
        const next = !isMuted;
        setIsMuted(next);
        if (audio) audio.volume = next ? 0 : volume;
    }, [audio, isMuted, volume, setIsMuted]);

    const onPrev = useCallback(() => {
        if (!audio) return;
        if (audio.currentTime > 5) {
            audio.currentTime = 0;
            setProgress(0);
        } else {
            onPrevTrack?.();
        }
    }, [audio, onPrevTrack, setProgress]);

    const onNext = useCallback(() => {
        onNextTrack?.();
    }, [onNextTrack]);

    // Мемо для объекта
    return useMemo(
        () => ({
            progress,
            isPlaying,
            duration,
            volume,
            isMuted,
            togglePlay,
            onSeek,
            onVolumeChange,
            toggleMute,
            onPrev,
            onNext,
        }),
        [
            progress,
            isPlaying,
            duration,
            volume,
            isMuted,
            togglePlay,
            onSeek,
            onVolumeChange,
            toggleMute,
            onPrev,
            onNext,
        ],
    );
};
