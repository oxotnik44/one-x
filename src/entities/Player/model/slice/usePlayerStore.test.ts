import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePlayerStore, type PlayerState } from './usePlayerStore';
import type { Track } from 'entities/Track/model/types/track';

describe('usePlayerStore', () => {
    const trackMock: Track = {
        id: 'track-1',
        title: 'Test Track',
        duration: 180,
        cover: '/covers/track-1.png',
        groupId: 'group-1',
        audioUrl: 'http://test/audio.mp3',
        createdAt: '2025-07-13T00:00:00.000Z',
    };

    beforeEach(() => {
        // Сброс стора перед каждым тестом
        usePlayerStore.setState({
            currentTrack: null,
            progress: 0,
            isPlaying: false,
            duration: 0,
            volume: 1,
            isMuted: false,
            audio: null,
        });
    });

    it('setProgress обновляет progress и currentTime аудио', () => {
        const audioMock = {
            currentTime: 0,
            duration: 100,
            play: vi.fn(),
            pause: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            volume: 1,
        };
        usePlayerStore.setState({ audio: audioMock as unknown as HTMLAudioElement });

        const setProgress = usePlayerStore.getState().setProgress;

        setProgress(50);

        expect(usePlayerStore.getState().progress).toBe(50);
        expect(audioMock.currentTime).toBe(50);
    });

    it('setProgress обновляет progress и currentTime аудио', () => {
        const audioMock = {
            currentTime: 0,
            duration: 100,
            play: vi.fn(),
            pause: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            volume: 1,
        };
        usePlayerStore.setState({ audio: audioMock as unknown as HTMLAudioElement });

        const setProgress = usePlayerStore.getState().setProgress;

        setProgress(50);

        expect(usePlayerStore.getState().progress).toBe(50);
        expect(audioMock.currentTime).toBe(50);
    });

    it('setIsPlaying вызывает play или pause аудио', () => {
        const playMock = vi.fn().mockResolvedValue(undefined);
        const pauseMock = vi.fn();
        const audioMock = {
            play: playMock,
            pause: pauseMock,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            volume: 1,
        };
        usePlayerStore.setState({ audio: audioMock as unknown as HTMLAudioElement });

        const setIsPlaying = usePlayerStore.getState().setIsPlaying;

        // Включаем воспроизведение
        setIsPlaying(true);
        expect(playMock).toHaveBeenCalled();

        // Ставим на паузу
        setIsPlaying(false);
        expect(pauseMock).toHaveBeenCalled();
    });

    it('setVolume изменяет громкость аудио и состояние', () => {
        const audioMock = {
            volume: 1,
            play: vi.fn(),
            pause: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        };
        usePlayerStore.setState({ audio: audioMock as unknown as HTMLAudioElement });

        const setVolume = usePlayerStore.getState().setVolume;

        setVolume(0.5);

        expect(audioMock.volume).toBe(0.5);
        expect(usePlayerStore.getState().volume).toBe(0.5);
    });

    it('setIsMuted устанавливает громкость в 0 или восстанавливает', () => {
        const audioMock = {
            volume: 1,
            play: vi.fn(),
            pause: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        };
        usePlayerStore.setState({ audio: audioMock as unknown as HTMLAudioElement, volume: 0.7 });

        const setIsMuted = usePlayerStore.getState().setIsMuted;

        setIsMuted(true);
        expect(audioMock.volume).toBe(0);
        expect(usePlayerStore.getState().isMuted).toBe(true);

        setIsMuted(false);
        expect(audioMock.volume).toBe(0.7);
        expect(usePlayerStore.getState().isMuted).toBe(false);
    });

    it('togglePlay переключает isPlaying и вызывает setIsPlaying', () => {
        const setIsPlayingMock = vi.fn();
        usePlayerStore.setState({
            isPlaying: false,
            setIsPlaying: setIsPlayingMock,
        } as unknown as PlayerState);

        const togglePlay = usePlayerStore.getState().togglePlay;
        togglePlay();

        expect(setIsPlayingMock).toHaveBeenCalledWith(true);

        usePlayerStore.setState({ isPlaying: true, setIsPlaying: setIsPlayingMock });
        togglePlay();

        expect(setIsPlayingMock).toHaveBeenCalledWith(false);
    });

    it('resetPlayer останавливает аудио и сбрасывает состояние', () => {
        const pauseMock = vi.fn();
        const audioMock = {
            pause: pauseMock,
        };
        usePlayerStore.setState({
            audio: audioMock as unknown as HTMLAudioElement,
            currentTrack: trackMock,
            progress: 50,
            isPlaying: true,
            duration: 120,
        });

        const resetPlayer = usePlayerStore.getState().resetPlayer;
        resetPlayer();

        const state = usePlayerStore.getState();

        expect(pauseMock).toHaveBeenCalled();
        expect(state.currentTrack).toBeNull();
        expect(state.progress).toBe(0);
        expect(state.isPlaying).toBe(false);
        expect(state.duration).toBe(0);
        expect(state.audio).toBeNull();
    });
});
