import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTrackStore, type TrackState } from '../slice/useTrackStore';
import { api } from 'shared/api/api';
import { fetchTrackById } from './fetchTrack';

vi.mock('shared/api/api');
vi.mock('../slice/useTrackStore');

const mockedApi = vi.mocked(api, true);

describe('fetchTrackById', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('должен успешно получить первый трек и обновить стор', async () => {
        const mockTrack = { id: '1', title: 'Track 1' } as const;

        mockedApi.get.mockResolvedValue({ data: [mockTrack] });

        const mockTrackState: TrackState = {
            currentTrack: null,
            setTrack: vi.fn(),
            loadTrack: vi.fn(),
            // добавь остальные свойства, если они есть в TrackState
        };

        useTrackStore.getState = vi.fn(() => mockTrackState);

        const result = await fetchTrackById();

        expect(mockedApi.get).toHaveBeenCalledWith('/tracks');
        expect(mockTrackState.setTrack).toHaveBeenCalledWith(mockTrack);
        expect(result).toEqual(mockTrack);
    });

    it('должен вернуть null если треков нет', async () => {
        mockedApi.get.mockResolvedValue({ data: [] });

        const mockTrackState: TrackState = {
            currentTrack: null,
            setTrack: vi.fn(),
            loadTrack: vi.fn(),
        };

        useTrackStore.getState = vi.fn(() => mockTrackState);

        const result = await fetchTrackById();

        expect(result).toBeNull();
    });

    it('должен вернуть null при ошибке запроса', async () => {
        mockedApi.get.mockRejectedValue(new Error('Ошибка запроса'));

        const mockTrackState: TrackState = {
            currentTrack: null,
            setTrack: vi.fn(),
            loadTrack: vi.fn(),
        };

        useTrackStore.getState = vi.fn(() => mockTrackState);

        const result = await fetchTrackById();

        expect(result).toBeNull();
    });
});
