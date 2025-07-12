import { useTrackStore } from 'entities/Track/slice/useTrackStore';
import { useState, useEffect, useRef, useCallback, useMemo, type ChangeEvent } from 'react';

interface UsePlayerProps {
    onPrevTrack?: () => void;
}

export const usePlayer = ({ onPrevTrack }: UsePlayerProps = {}) => {
    const track = useTrackStore((s) => s.currentTrack);
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Обновление аудио при смене трека
    useEffect(() => {
        if (!track) return;

        // Очистка предыдущего
        if (audioRef.current) {
            audioRef.current.pause();
            if (intervalRef.current) clearInterval(intervalRef.current);
        }

        const audio = new Audio(track.audioUrl);
        audio.volume = isMuted ? 0 : volume;
        audioRef.current = audio;

        const onLoadedMetadata = () => {
            setDuration(audio.duration);
        };

        audio.addEventListener('loadedmetadata', onLoadedMetadata);

        return () => {
            audio.pause();
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            if (intervalRef.current) clearInterval(intervalRef.current);
            audioRef.current = null;
        };
    }, [track]);

    // Обновляем громкость при изменении volume или isMuted
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    const updateProgress = useCallback(() => {
        if (!audioRef.current) return;
        const currentTime = audioRef.current.currentTime;
        const dur = audioRef.current.duration || 1;
        setProgress((currentTime / dur) * 100);
    }, []);

    const togglePlay = useCallback(() => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
            updateProgress();
            intervalRef.current = setInterval(updateProgress, 100);
        }
    }, [isPlaying, updateProgress]);

    const onSeek = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            if (!audioRef.current) return;
            const newProgress = Number(e.target.value);
            setProgress(newProgress);
            audioRef.current.currentTime = (newProgress / 100) * duration;
            updateProgress();
        },
        [duration, updateProgress],
    );

    const onVolumeChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const newVolume = Number(e.target.value);
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    }, []);

    const toggleMute = useCallback(() => {
        setIsMuted((prev) => {
            const next = !prev;
            if (audioRef.current) audioRef.current.volume = next ? 0 : volume;
            return next;
        });
    }, [volume]);

    const onPrev = useCallback(() => {
        if (!audioRef.current) return;
        if (audioRef.current.currentTime > 5) {
            audioRef.current.currentTime = 0;
            setProgress(0);
        } else {
            if (onPrevTrack) onPrevTrack();
        }
    }, [onPrevTrack]);

    return useMemo(
        () => ({
            progress,
            isPlaying,
            duration,
            volume,
            isMuted,
            track,
            togglePlay,
            onSeek,
            onVolumeChange,
            toggleMute,
            onPrev,
        }),
        [
            progress,
            isPlaying,
            duration,
            volume,
            isMuted,
            track,
            togglePlay,
            onSeek,
            onVolumeChange,
            toggleMute,
            onPrev,
        ],
    );
};
