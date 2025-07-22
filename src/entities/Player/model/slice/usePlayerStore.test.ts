// src/entities/Player/model/usePlayerStore.test.ts

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePlayerStore, type PlayerState } from './usePlayerStore';

describe('usePlayerStore', () => {
    beforeEach(() => {
        // Сброс состояния стора
        usePlayerStore.setState({
            currentTrack: null,
            progress: 0,
            isPlaying: false,
            duration: 0,
            volume: 1,
            isMuted: false,
            audio: null,
        } as unknown as PlayerState);
    });
    it('setProgress: обновляет progress и currentTime аудио', () => {
        const audioMock = {
            currentTime: 0,
            duration: 200,
            play: vi.fn(),
            pause: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            volume: 1,
        } as unknown as HTMLAudioElement;

        usePlayerStore.setState({ audio: audioMock });

        const setProgress = usePlayerStore.getState().setProgress;

        setProgress(50);

        expect(usePlayerStore.getState().progress).toBe(50);
        expect(audioMock.currentTime).toBe(100); // 50% от 200 = 100
    });
    it('setVolume: изменяет громкость аудио и состояние', () => {
        const audioMock = {
            volume: 1,
            play: vi.fn(),
            pause: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        } as unknown as HTMLAudioElement;

        usePlayerStore.setState({ audio: audioMock });

        const setVolume = usePlayerStore.getState().setVolume;

        setVolume(0.3);

        expect(audioMock.volume).toBe(0.3);
        expect(usePlayerStore.getState().volume).toBe(0.3);
    });
    it('togglePlay вызывает setIsPlaying с противоположным значением isPlaying', () => {
        const setIsPlayingMock = vi.fn();
        usePlayerStore.setState({
            isPlaying: false,
            setIsPlaying: setIsPlayingMock,
        } as unknown as PlayerState);

        const togglePlay = usePlayerStore.getState().togglePlay;
        togglePlay();

        expect(setIsPlayingMock).toHaveBeenCalledWith(true);

        // Меняем isPlaying на true и вызываем togglePlay снова
        usePlayerStore.setState({
            isPlaying: true,
            setIsPlaying: setIsPlayingMock,
        } as unknown as PlayerState);

        togglePlay();

        expect(setIsPlayingMock).toHaveBeenCalledWith(false);
    });

    it('setIsMuted: устанавливает volume = 0 при true и восстанавливает volume при false', () => {
        const audioMock = {
            volume: 1,
            pause: vi.fn(),
            play: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        } as unknown as HTMLAudioElement;

        usePlayerStore.setState({
            audio: audioMock,
            volume: 0.75,
            isMuted: false,
        });

        const setIsMuted = usePlayerStore.getState().setIsMuted;

        // Заглушение
        setIsMuted(true);
        expect(audioMock.volume).toBe(0);
        expect(usePlayerStore.getState().isMuted).toBe(true);

        // Восстановление громкости
        setIsMuted(false);
        expect(audioMock.volume).toBe(0.75);
        expect(usePlayerStore.getState().isMuted).toBe(false);
    });
    it('setIsPlaying: ничего не делает если audio === null', () => {
        usePlayerStore.setState({ audio: null });

        const setIsPlaying = usePlayerStore.getState().setIsPlaying;

        expect(() => setIsPlaying(true)).not.toThrow();
        expect(usePlayerStore.getState().isPlaying).toBe(false);
    });
    it('setDuration: обновляет duration в сторе', () => {
        const newDuration = 123;

        // Устанавливаем начальное значение, чтобы проверить изменение
        usePlayerStore.setState({ duration: 0 });

        const setDuration = usePlayerStore.getState().setDuration;

        setDuration(newDuration);

        expect(usePlayerStore.getState().duration).toBe(newDuration);
    });
});
