// src/features/Player/model/usePlayer.test.ts
import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { usePlayer } from './usePlayer';
import { create } from 'zustand';

// Мокаем useTrackStore с фиктивным треком
vi.mock('entities/Track/slice/useTrackStore', () => ({
    useTrackStore: () => ({ id: '1', audioUrl: 'test.mp3' }),
}));

// Глобальный мок Audio
const mockAudio = {
    play: vi.fn().mockResolvedValue(undefined),
    pause: vi.fn(),
    duration: 100,
    currentTime: 0,
    volume: 1,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
};

// Типизация состояния PlayerStore для Zustand
interface PlayerState {
    progress: number;
    isPlaying: boolean;
    duration: number;
    volume: number;
    isMuted: boolean;
    audio: typeof mockAudio;
    setProgress: (val: number) => void;
    setVolume: (val: number) => void;
    setIsMuted: (val: boolean) => void;
    togglePlay: () => void;
}

// Создаём реальный Zustand стор для теста
const createTestStore = () =>
    create<PlayerState>((set, get) => ({
        progress: 0,
        isPlaying: false,
        duration: 100,
        volume: 1,
        isMuted: false,
        audio: { ...mockAudio, currentTime: 0, volume: 1 },
        setProgress: (val) => set({ progress: val }),
        setVolume: (val) => set({ volume: val }),
        setIsMuted: (val) => set({ isMuted: val }),
        togglePlay: () => {
            const { isPlaying, audio } = get();
            if (!audio) return;
            if (isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
            set({ isPlaying: !isPlaying });
        },
    }));

let testStore = createTestStore();

vi.mock('entities/Player/model', () => {
    const originalModule = vi.importActual('entities/Player/model') as unknown as {
        usePlayerStore: <T>(selector: (state: PlayerState) => T) => T;
    };

    return {
        ...originalModule,
        usePlayerStore: <T>(selector: (state: PlayerState) => T): T => {
            return testStore(selector);
        },
    };
});

describe('usePlayer', () => {
    beforeEach(() => {
        // Перед каждым тестом пересоздаём стор, чтобы сбросить состояние
        testStore = createTestStore();
        vi.clearAllMocks();
    });

    it('инициализируется с правильными начальными значениями', () => {
        const { result } = renderHook(() => usePlayer());

        expect(result.current.progress).toBe(0);
        expect(result.current.isPlaying).toBe(false);
        expect(result.current.volume).toBe(1);
        expect(result.current.isMuted).toBe(false);
    });
    it('onSeek обновляет прогресс и устанавливает текущее время аудио', () => {
        const { result } = renderHook(() => usePlayer());

        // Создаём мок-событие изменения input[type=range] со значением 50
        const event = {
            target: {
                value: '50',
            },
        } as React.ChangeEvent<HTMLInputElement>;

        act(() => {
            result.current.onSeek(event);
        });

        expect(result.current.progress).toBe(50);
        expect(testStore.getState().audio.currentTime).toBeCloseTo(
            (50 / 100) * testStore.getState().duration,
        );
    });

    it('переключает проигрывание', () => {
        const { result } = renderHook(() => usePlayer());

        act(() => {
            result.current.togglePlay();
        });
        expect(mockAudio.play).toHaveBeenCalled();
        expect(result.current.isPlaying).toBe(true);

        act(() => {
            result.current.togglePlay();
        });
        expect(mockAudio.pause).toHaveBeenCalled();
        expect(result.current.isPlaying).toBe(false);
    });

    it('изменяет громкость и мьют', () => {
        const { result } = renderHook(() => usePlayer());

        const createChangeEvent = (value: string): ChangeEvent<HTMLInputElement> =>
            ({
                target: { value },
            }) as ChangeEvent<HTMLInputElement>;

        act(() => {
            result.current.onVolumeChange(createChangeEvent('0.5'));
        });
        expect(result.current.volume).toBe(0.5);
        expect(result.current.isMuted).toBe(false);

        act(() => {
            result.current.onVolumeChange(createChangeEvent('0'));
        });
        expect(result.current.volume).toBe(0);
        expect(result.current.isMuted).toBe(true);

        act(() => {
            result.current.toggleMute();
        });
        expect(result.current.isMuted).toBe(false);
    });

    it('onPrev сбрасывает прогресс если время > 5', () => {
        const { result } = renderHook(() => usePlayer());

        act(() => {
            testStore.setState({ audio: { ...mockAudio, currentTime: 10 } });
        });

        act(() => {
            result.current.onPrev();
        });

        expect(result.current.progress).toBe(0);
    });

    it('onPrev вызывает onPrevTrack если время <= 5', () => {
        const onPrevTrackMock = vi.fn();

        const { result } = renderHook(() => usePlayer({ onPrevTrack: onPrevTrackMock }));

        act(() => {
            testStore.setState({ audio: { ...mockAudio, currentTime: 3 } });
        });

        act(() => {
            result.current.onPrev();
        });

        expect(onPrevTrackMock).toHaveBeenCalled();
    });
});
