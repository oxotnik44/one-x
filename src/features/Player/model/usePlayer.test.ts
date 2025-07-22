// src/entities/Player/model/usePlayer.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { usePlayer } from './usePlayer';
import { usePlayerStore } from 'entities/Player/model';
import { useTrackStore } from 'entities/Track';

// моки zustand‑сторов
vi.mock('entities/Player/model', () => ({
    usePlayerStore: vi.fn(),
}));
vi.mock('entities/Track', () => ({
    useTrackStore: vi.fn(),
}));
vi.mock('react-hot-toast');

describe('usePlayer hook', () => {
    const fakeAudio = {
        play: vi.fn().mockResolvedValue(undefined),
        pause: vi.fn(),
        currentTime: 0,
        duration: 120,
        volume: 1,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
    };

    // базовый store
    const baseStore = {
        progress: 0,
        currentTime: 0,
        duration: 120,
        volume: 1,
        isMuted: false,
        audio: fakeAudio,
        currentTrack: { id: 't1' },
        setProgress: vi.fn(),
        setVolume: vi.fn(),
        setIsMuted: vi.fn(),
        setCurrentTrack: vi.fn(),

        // добавим заглушку для setIsPlaying
        isPlaying: false,
        setIsPlaying: vi.fn(),
        set: vi.fn(),
        get: () => baseStore,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (useTrackStore as unknown as Mock).mockReturnValue([]);
        (usePlayerStore as unknown as Mock).mockImplementation((sel) => sel(baseStore));
    });

    it('инициализируется с корректными начальными значениями', () => {
        const { result } = renderHook(() => usePlayer());

        expect(result.current.progress).toBe(0);
        expect(result.current.currentTime).toBe(0);
        expect(result.current.duration).toBe(120);
        expect(result.current.formattedCurrentTime).toMatch(/\d{1,2}:\d{2}/);
        expect(result.current.formattedDuration).toMatch(/\d{1,2}:\d{2}/);
        expect(result.current.volume).toBe(1);
        expect(result.current.isMuted).toBe(false);
    });

    it('onSeek обновляет прогресс и текущее время аудио', () => {
        const { result } = renderHook(() => usePlayer());

        const event = { target: { value: '50' } } as React.ChangeEvent<HTMLInputElement>;
        act(() => {
            result.current.onSeek(event);
        });

        // прогресс устанавливается в сторе
        expect(baseStore.setProgress).toHaveBeenCalledWith(50);
        // аудио.currentTime = 50% от duration
        expect(fakeAudio.currentTime).toBeCloseTo((50 / 100) * baseStore.duration);
    });

    it('onVolumeChange устанавливает громкость и мьют', () => {
        const { result } = renderHook(() => usePlayer());

        act(() => {
            result.current.onVolumeChange({ target: { value: '0.3' } } as any);
        });
        expect(baseStore.setVolume).toHaveBeenCalledWith(0.3);
        expect(baseStore.setIsMuted).toHaveBeenCalledWith(false);

        act(() => {
            result.current.onVolumeChange({ target: { value: '0' } } as any);
        });
        expect(baseStore.setVolume).toHaveBeenCalledWith(0);
        expect(baseStore.setIsMuted).toHaveBeenCalledWith(true);
    });

    it('toggleMute переключает состояние isMuted', () => {
        // сначала isMuted=false
        const { result } = renderHook(() => usePlayer());
        act(() => {
            result.current.toggleMute();
        });
        expect(baseStore.setIsMuted).toHaveBeenCalledWith(true);
    });

    it('onPrev сбрасывает прогресс, если currentTime > 5', () => {
        baseStore.audio.currentTime = 10;
        const { result } = renderHook(() => usePlayer());

        act(() => {
            result.current.onPrev();
        });
        expect(baseStore.setProgress).toHaveBeenCalledWith(0);
        expect(baseStore.audio.currentTime).toBe(0);
    });

    it('onPrev переключает трек, если currentTime ≤ 5 и есть предыдущий', () => {
        // готовим пару треков
        const tracks = [{ id: 't0' }, { id: 't1' }, { id: 't2' }];
        (useTrackStore as unknown as Mock).mockReturnValue(tracks);
        baseStore.currentTrack = { id: 't1' };
        baseStore.audio.currentTime = 2;

        const { result } = renderHook(() => usePlayer());
        act(() => {
            result.current.onPrev();
        });
        expect(baseStore.setCurrentTrack).toHaveBeenCalledWith(tracks[0]);
    });

    it('onNext переключает на следующий трек, если он есть', () => {
        const tracks = [{ id: 't0' }, { id: 't1' }, { id: 't2' }];
        (useTrackStore as unknown as Mock).mockReturnValue(tracks);
        baseStore.currentTrack = { id: 't1' };

        const { result } = renderHook(() => usePlayer());
        act(() => {
            result.current.onNext();
        });
        expect(baseStore.setCurrentTrack).toHaveBeenCalledWith(tracks[2]);
    });
});
