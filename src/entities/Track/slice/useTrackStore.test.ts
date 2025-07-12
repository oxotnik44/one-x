// src/entities/Track/model/trackStore.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
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
});
