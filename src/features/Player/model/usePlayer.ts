// src/entities/Player/model/usePlayer.ts
import { usePlayerStore } from 'entities/Player/model';
import { useTrackStore } from 'entities/Track';
import { useCallback, useMemo } from 'react';
import { formatTime } from 'shared/lib/formatTime/formatTime';

export const usePlayer = () => {
    const progress = usePlayerStore((s) => s.progress);
    const currentTime = usePlayerStore((s) => s.currentTime);
    const duration = usePlayerStore((s) => s.duration);
    const volume = usePlayerStore((s) => s.volume);
    const isMuted = usePlayerStore((s) => s.isMuted);
    const audio = usePlayerStore((s) => s.audio);
    const currentTrack = usePlayerStore((s) => s.currentTrack);

    const setProgress = usePlayerStore((s) => s.setProgress);
    const setVolume = usePlayerStore((s) => s.setVolume);
    const setIsMuted = usePlayerStore((s) => s.setIsMuted);
    const setCurrentTrack = usePlayerStore((s) => s.setCurrentTrack);

    const tracks = useTrackStore((s) => s.tracks) ?? [];

    const onSeek = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!audio) return;
            const prog = Number(e.target.value);
            audio.currentTime = (prog / 100) * duration;
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
        setIsMuted(!isMuted);
    }, [isMuted, setIsMuted]);

    const onPrev = useCallback(() => {
        if (!audio) return;
        const idx = tracks.findIndex((t) => t.id === currentTrack?.id);
        if (audio.currentTime > 5) {
            audio.currentTime = 0;
            setProgress(0);
        } else if (idx > 0) {
            setCurrentTrack(tracks[idx - 1]);
        } else {
            audio.currentTime = 0;
            setProgress(0);
        }
    }, [audio, currentTrack, tracks, setProgress, setCurrentTrack]);

    const onNext = useCallback(() => {
        if (!audio) return;
        const idx = tracks.findIndex((t) => t.id === currentTrack?.id);
        if (idx !== -1 && idx < tracks.length - 1) {
            setCurrentTrack(tracks[idx + 1]);
        }
    }, [audio, currentTrack, tracks, setCurrentTrack]);

    return useMemo(
        () => ({
            progress,
            currentTime,
            duration,
            formattedCurrentTime: formatTime(currentTime),
            formattedDuration: formatTime(duration),
            volume,
            isMuted,
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
            volume,
            isMuted,
            onSeek,
            onVolumeChange,
            toggleMute,
            onPrev,
            onNext,
        ],
    );
};
