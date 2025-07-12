// src/entities/Track/model/trackStore.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchTrackById } from 'entities/Track/api/fetchTrack';
import { useTrackStore } from './useTrackStore';
import type { Track } from '../model/types/track';

// Мокаем fetchTrackById
vi.mock('entities/Track/api/fetchTrack', () => ({
    fetchTrackById: vi.fn(),
}));

describe('useTrackStore', () => {
    beforeEach(() => {
        // Сбрасываем состояние стора перед каждым тестом
        useTrackStore.setState({ currentTrack: null });
        vi.clearAllMocks();
    });

    it('должен иметь начальное состояние currentTrack null', () => {
        const currentTrack = useTrackStore.getState().currentTrack;
        expect(currentTrack).toBeNull();
    });

    it('setTrack корректно устанавливает текущий трек', () => {
        const track = { id: '1', title: 'Test Track' };
        useTrackStore.getState().setTrack(track as unknown as Track);

        const currentTrack = useTrackStore.getState().currentTrack;
        expect(currentTrack).toEqual(track);
    });

    it('loadTrack загружает трек и устанавливает currentTrack', async () => {
        const mockTrack = { id: '2', title: 'Loaded Track' };
        (fetchTrackById as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockTrack);

        await useTrackStore.getState().loadTrack('2');

        expect(fetchTrackById).toHaveBeenCalled();
        expect(useTrackStore.getState().currentTrack).toEqual(mockTrack);
    });

    it('loadTrack не меняет currentTrack при ошибке', async () => {
        (fetchTrackById as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
            new Error('fail'),
        );

        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        await useTrackStore.getState().loadTrack('bad-id');

        expect(fetchTrackById).toHaveBeenCalled();
        expect(useTrackStore.getState().currentTrack).toBeNull();
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Ошибка загрузки трека по ID',
            expect.any(Error),
        );

        consoleErrorSpy.mockRestore();
    });
});
