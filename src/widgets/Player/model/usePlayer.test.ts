import { act, renderHook } from '@testing-library/react';
import { usePlayer } from 'widgets/Player/model/usePlayer';
import type { ChangeEvent } from 'react';

describe('usePlayer', () => {
    beforeEach(() => {
        // Мокаем HTMLAudioElement, т.к. в jsdom его нет
        global.HTMLAudioElement.prototype.play = vi.fn().mockResolvedValue(undefined);
        global.HTMLAudioElement.prototype.pause = vi.fn();
        Object.defineProperty(global.HTMLAudioElement.prototype, 'duration', {
            configurable: true,
            get: () => 100,
        });
        Object.defineProperty(global.HTMLAudioElement.prototype, 'currentTime', {
            configurable: true,
            get: () => 0,
            set: vi.fn(),
        });
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
        expect(global.HTMLAudioElement.prototype.play).toHaveBeenCalled();
        expect(result.current.isPlaying).toBe(true);

        act(() => {
            result.current.togglePlay();
        });
        expect(global.HTMLAudioElement.prototype.pause).toHaveBeenCalled();
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

        Object.defineProperty(global.HTMLAudioElement.prototype, 'currentTime', {
            configurable: true,
            get: () => 10,
            set: vi.fn(),
        });

        act(() => {
            result.current.onPrev();
        });

        expect(result.current.progress).toBe(0);
    });

    it('onPrev вызывает onPrevTrack если время <= 5', () => {
        const onPrevTrackMock = vi.fn();

        const { result } = renderHook(() => usePlayer({ onPrevTrack: onPrevTrackMock }));

        Object.defineProperty(global.HTMLAudioElement.prototype, 'currentTime', {
            configurable: true,
            get: () => 3,
            set: vi.fn(),
        });

        act(() => {
            result.current.onPrev();
        });

        expect(onPrevTrackMock).toHaveBeenCalled();
    });
});
