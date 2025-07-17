// src/entities/Player/model/usePlayer.ts
import { usePlayerStore } from 'entities/Player/model';
import { useCallback, useMemo } from 'react';
import { formatTime } from 'shared/lib/formatTime/formatTime';

export interface UsePlayerProps {
    onPrevTrack?: () => void;
    onNextTrack?: () => void;
}

export const usePlayer = ({ onPrevTrack, onNextTrack }: UsePlayerProps = {}) => {
    const progress = usePlayerStore((s) => s.progress);
    const currentTime = usePlayerStore((s) => s.currentTime);
    const duration = usePlayerStore((s) => s.duration);
    const isPlaying = usePlayerStore((s) => s.isPlaying);
    const volume = usePlayerStore((s) => s.volume);
    const isMuted = usePlayerStore((s) => s.isMuted);
    const audio = usePlayerStore((s) => s.audio);

    const setProgress = usePlayerStore((s) => s.setProgress);
    const setVolume = usePlayerStore((s) => s.setVolume);
    const setIsMuted = usePlayerStore((s) => s.setIsMuted);
    const togglePlay = usePlayerStore((s) => s.togglePlay);

    const onSeek = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!audio) return;
            const prog = Number(e.target.value);
            audio.currentTime = (prog / 100) * duration; // <-- здесь
            setProgress(prog);
        },
        [audio, duration, setProgress],
    );

    const onVolumeChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const v = Number(e.target.value);
            setVolume(v);
            setIsMuted(v === 0);
        },
        [setVolume, setIsMuted],
    );

    const toggleMute = useCallback(() => {
        const next = !isMuted;
        setIsMuted(next);
    }, [isMuted, setIsMuted]);

    const onPrev = useCallback(() => {
        if (audio && audio.currentTime > 5) {
            audio.currentTime = 0;
            setProgress(0);
        } else {
            onPrevTrack?.();
        }
    }, [audio, onPrevTrack, setProgress]);

    const onNext = useCallback(() => {
        onNextTrack?.();
    }, [onNextTrack]);

    return useMemo(
        () => ({
            progress,
            currentTime,
            duration,
            formattedCurrentTime: formatTime(currentTime),
            formattedDuration: formatTime(duration),
            isPlaying,
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
            currentTime,
            duration,
            isPlaying,
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
