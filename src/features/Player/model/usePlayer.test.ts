import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePlayer } from './usePlayer';

// Мокаем useTrackStore
vi.mock('entities/Track/slice/useTrackStore', () => ({
    useTrackStore: vi.fn(),
}));
import { useTrackStore } from 'entities/Track/slice/useTrackStore';

describe('usePlayer', () => {
    let mockAudio: Partial<HTMLAudioElement>;
    const dummyTrack = { id: '1', audioUrl: 'test.mp3' };

    beforeEach(() => {
        mockAudio = {
            play: vi.fn().mockResolvedValue(undefined),
            pause: vi.fn(),
            duration: 100,
            currentTime: 0,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        };

        vi.stubGlobal('Audio', vi.fn(() => mockAudio) as unknown as typeof Audio);

        // Приводим useTrackStore к нужному типу и мокаем возврат
        (useTrackStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(dummyTrack);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('инициализируется с правильными начальными значениями', () => {
        const { result } = renderHook(() => usePlayer());

        expect(result.current.progress).toBe(0);
        expect(result.current.isPlaying).toBe(false);
        expect(result.current.volume).toBe(1);
        expect(result.current.isMuted).toBe(false);
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

        mockAudio.currentTime = 10;

        act(() => {
            result.current.onPrev();
        });

        expect(result.current.progress).toBe(0);
    });

    it('onPrev вызывает onPrevTrack если время <= 5', () => {
        const onPrevTrackMock = vi.fn();

        const { result } = renderHook(() => usePlayer({ onPrevTrack: onPrevTrackMock }));

        mockAudio.currentTime = 3;

        act(() => {
            result.current.onPrev();
        });

        expect(onPrevTrackMock).toHaveBeenCalled();
    });
});
