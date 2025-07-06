import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import Song from 'shared/assets/Its All Over.mp3';

interface UsePlayerProps {
    onPrevTrack?: () => void;
}

export const usePlayer = ({ onPrevTrack }: UsePlayerProps = {}) => {
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        audioRef.current = new Audio(Song);
        audioRef.current.volume = volume;

        const audio = audioRef.current;

        const onLoadedMetadata = () => {
            if (audio.duration) setDuration(audio.duration);
        };

        audio.addEventListener('loadedmetadata', onLoadedMetadata);

        return () => {
            audio.pause();
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audioRef.current = null;
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    const updateProgress = () => {
        if (!audioRef.current) return;
        const currentTime = audioRef.current.currentTime;
        const dur = audioRef.current.duration || 1;
        setProgress((currentTime / dur) * 100);
    };

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        } else {
            audioRef.current.play();
            setIsPlaying(true);
            updateProgress();
            intervalRef.current = setInterval(updateProgress, 100);
        }
    };

    const onSeek = (e: ChangeEvent<HTMLInputElement>) => {
        if (!audioRef.current) return;

        const newProgress = Number(e.target.value);
        setProgress(newProgress);

        const newTime = (newProgress / 100) * duration;
        audioRef.current.currentTime = newTime;

        updateProgress();
    };

    const onVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newVolume = Number(e.target.value);
        setVolume(newVolume);
        if (newVolume === 0) {
            setIsMuted(true);
        } else {
            setIsMuted(false);
        }
    };

    const toggleMute = () => {
        setIsMuted((prev) => !prev);
    };

    // Новая функция обработки кнопки "назад"
    const onPrev = () => {
        if (!audioRef.current) return;

        if (audioRef.current.currentTime > 5) {
            audioRef.current.currentTime = 0;
            setProgress(0);
        } else {
            // Если меньше или равно 5 секунд — вызываем переключение на предыдущий трек
            if (onPrevTrack) {
                onPrevTrack();
            }
        }
    };

    return {
        progress,
        isPlaying,
        volume,
        isMuted,
        togglePlay,
        onSeek,
        onVolumeChange,
        toggleMute,
        onPrev,
    };
};
