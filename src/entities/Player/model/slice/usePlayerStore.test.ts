// src/entities/Player/model/usePlayerStore.test.ts

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePlayerStore, type PlayerState } from './usePlayerStore';
import type { Track } from 'entities/Track';

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
    it('resetPlayer останавливает аудио и сбрасывает состояние плеера', () => {
        const pauseMock = vi.fn();
        const audioMock = {
            pause: pauseMock,
        } as unknown as HTMLAudioElement;

        usePlayerStore.setState({
            audio: audioMock,
            currentTrack: {
                id: 'track-1',
                title: 'Test Track',
                duration: 180,
                cover: '/covers/track-1.png',
                groupId: 'group-1',
                audioUrl: 'http://test/audio.mp3',
                createdAt: '2025-07-13T00:00:00.000Z',
            },
            progress: 50,
            isPlaying: true,
            duration: 180,
        });

        const resetPlayer = usePlayerStore.getState().resetPlayer;
        resetPlayer();

        expect(pauseMock).toHaveBeenCalled();
        const state = usePlayerStore.getState();
        expect(state.currentTrack).toBeNull();
        expect(state.progress).toBe(0);
        expect(state.isPlaying).toBe(false);
        expect(state.duration).toBe(0);
        expect(state.audio).toBeNull();
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

    it('setCurrentTrack: останавливает старый audio и очищает src, создаёт новый Audio и запускает воспроизведение', () => {
        // Мок старого audio
        const oldAudio = {
            pause: vi.fn(),
            src: 'old-src',
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            play: vi.fn(),
            volume: 1,
            currentTime: 0,
            duration: 0,
        } as unknown as HTMLAudioElement;
        usePlayerStore.setState({ audio: oldAudio } as unknown as PlayerState);

        // Подготовка мок нового Audio
        const listeners: Record<string, () => void> = {};
        const newAudioMock = {
            pause: vi.fn(),
            src: '',
            addEventListener: vi.fn((event: string, cb: EventListener) => {
                listeners[event] = cb as () => void;
            }),
            removeEventListener: vi.fn(),
            play: vi.fn().mockResolvedValue(undefined),
            volume: 0,
            currentTime: 0,
            duration: 42,
        } as unknown as HTMLAudioElement;

        // Мокаем глобальный конструктор Audio
        const AudioSpy = vi.spyOn(global, 'Audio').mockImplementation((src?: string) => {
            expect(src).toBe(trackMock.audioUrl);
            return newAudioMock;
        });

        // Вызываем setCurrentTrack
        usePlayerStore.getState().setCurrentTrack(trackMock);

        // Старый audio должен быть остановлен и очищен
        expect(oldAudio.pause).toHaveBeenCalled();
        expect(oldAudio.src).toBe('');

        // Конструктор Audio получил правильный URL
        expect(AudioSpy).toHaveBeenCalledWith(trackMock.audioUrl);

        // Новый audio получил громкость из стора
        expect(newAudioMock.volume).toBe(usePlayerStore.getState().volume);

        // Навешаны слушатели
        expect(newAudioMock.addEventListener).toHaveBeenCalledWith(
            'loadedmetadata',
            expect.any(Function),
        );
        expect(newAudioMock.addEventListener).toHaveBeenCalledWith(
            'timeupdate',
            expect.any(Function),
        );

        // Запущено воспроизведение
        expect(newAudioMock.play).toHaveBeenCalled();

        AudioSpy.mockRestore();
    });

    it('setCurrentTrack: обновляет duration и progress при событиях loadedmetadata и timeupdate', () => {
        const store = usePlayerStore.getState();

        // Подготовка мок нового Audio
        const listeners: Record<string, EventListener> = {};
        const newAudioMock = {
            pause: vi.fn(),
            src: '',
            addEventListener: vi.fn((event: string, cb: EventListenerOrEventListenerObject) => {
                if (typeof cb === 'function') {
                    listeners[event] = cb;
                }
            }),
            removeEventListener: vi.fn(),
            play: vi.fn().mockResolvedValue(undefined),
            volume: 1,
            currentTime: 21,
            duration: 84,
        } as unknown as HTMLAudioElement;

        vi.spyOn(global, 'Audio').mockImplementation(() => newAudioMock);

        // Запускаем
        store.setCurrentTrack(trackMock);

        // Срабатывает loadedmetadata
        listeners.loadedmetadata(new Event('loadedmetadata'));
        expect(usePlayerStore.getState().duration).toBe(84);

        // Срабатывает timeupdate
        listeners.timeupdate(new Event('timeupdate'));
        expect(usePlayerStore.getState().progress).toBe((21 / 84) * 100);
    });
});
