import { describe, it, expect, vi, beforeEach, type Mock, afterEach } from 'vitest';
import { useTrackStore, type TrackState } from '../../slice/useTrackStore';
import { fetchTrack } from './fetchTrack';
import { apiJson, apiBase } from 'shared/api/api';

vi.mock('shared/api/api', () => {
    const mockInterceptors = {
        request: { use: vi.fn(), eject: vi.fn() },
        response: { use: vi.fn(), eject: vi.fn() },
    };

    const mockApiJsonInstance = {
        interceptors: mockInterceptors,
        get: vi.fn(),
    };

    const mockApiBaseInstance = {
        interceptors: mockInterceptors,
        get: vi.fn(),
    };

    return {
        apiJson: mockApiJsonInstance,
        apiBase: mockApiBaseInstance,
    };
});

vi.mock('axios');

const mockedApiJson = vi.mocked(apiJson, true);
const mockedApiBase = vi.mocked(apiBase, true);

describe('fetchTrack', () => {
    let mockTrackState: TrackState;

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => {});

        mockTrackState = {
            tracks: [],
            setTracks: vi.fn(),
            addTrack: vi.fn(),
            updateTrack: vi.fn(),
            removeTrack: vi.fn(),
        };
        (useTrackStore.getState as Mock) = vi.fn(() => mockTrackState);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('успешно объединяет данные и вызывает setTracks без album', async () => {
        const mainTracks = [
            {
                id: '1',
                title: 'Track 1',
                groupId: 'group1',
                duration: 120,
                cover: '',
                audioUrl: '',
                createdAt: '',
                albumId: '',
            },
        ];
        const mediaTracks = [
            {
                trackName: '1',
                coverUrl: '/cover1.png',
                audioUrl: '/audio1.mp3',
            },
        ];

        mockedApiJson.get.mockResolvedValue({ data: mainTracks });
        mockedApiBase.get.mockResolvedValue({ data: mediaTracks });

        const result = await fetchTrack('group1', 'group1');

        expect(mockedApiJson.get).toHaveBeenCalledWith('/tracks', {
            params: { groupId: 'group1', albumId: undefined },
        });
        expect(mockedApiBase.get).toHaveBeenCalledWith('/tracks/group1');
        expect(mockTrackState.setTracks).toHaveBeenCalledWith([
            {
                ...mainTracks[0],
                cover: '/cover1.png',
                audioUrl: '/audio1.mp3',
                groupName: 'group1',
            },
        ]);
        expect(result).toEqual([
            {
                ...mainTracks[0],
                cover: '/cover1.png',
                audioUrl: '/audio1.mp3',
                groupName: 'group1',
            },
        ]);
    });

    it('успешно объединяет данные и вызывает setTracks с album', async () => {
        const mainTracks = [
            {
                id: 'track1',
                title: 'Track One',
                groupId: 'group1',
                duration: 100,
                cover: '',
                audioUrl: '',
                createdAt: '',
                albumId: 'album1',
            },
            {
                id: 'track2',
                title: 'Track Two',
                groupId: 'group1',
                duration: 150,
                cover: '',
                audioUrl: '',
                createdAt: '',
                albumId: 'album1',
            },
        ];

        const albumTracksResponse = {
            albumName: 'album1',
            coverUrl: '/album-cover.png',
            tracks: [
                { trackName: 'track1', audioUrl: '/audio1.mp3' },
                { trackName: 'track2', audioUrl: '/audio2.mp3' },
            ],
        };

        mockedApiJson.get.mockResolvedValue({ data: mainTracks });
        mockedApiBase.get.mockResolvedValue({ data: albumTracksResponse });

        const result = await fetchTrack('group1', 'group1', 'album1', 'album1');

        expect(mockedApiJson.get).toHaveBeenCalledWith('/tracks', {
            params: { groupId: 'group1', albumId: 'album1' },
        });
        expect(mockedApiBase.get).toHaveBeenCalledWith('/album-tracks/group1/album1');

        expect(mockTrackState.setTracks).toHaveBeenCalledWith([
            {
                ...mainTracks[0],
                cover: '/album-cover.png',
                audioUrl: '/audio1.mp3',
                groupName: 'group1',
            },
            {
                ...mainTracks[1],
                cover: '/album-cover.png',
                audioUrl: '/audio2.mp3',
                groupName: 'group1',
            },
        ]);
        expect(result).toEqual([
            {
                ...mainTracks[0],
                cover: '/album-cover.png',
                audioUrl: '/audio1.mp3',
                groupName: 'group1',
            },
            {
                ...mainTracks[1],
                cover: '/album-cover.png',
                audioUrl: '/audio2.mp3',
                groupName: 'group1',
            },
        ]);
    });

    it('возвращает пустой массив если main API вернул не массив', async () => {
        mockedApiJson.get.mockResolvedValue({ data: null });
        mockedApiBase.get.mockResolvedValue({ data: [] });

        const result = await fetchTrack('group1', 'group1');

        expect(mockTrackState.setTracks).toHaveBeenCalledWith([]);
        expect(result).toEqual([]);
    });

    it('возвращает пустой массив и вызывает setTracks с пустым массивом при ошибке любого запроса', async () => {
        // Ошибка в основном API
        mockedApiJson.get.mockRejectedValue(new Error('fail'));
        mockedApiBase.get.mockResolvedValue({ data: [] });

        const result1 = await fetchTrack('group1', 'group1');
        expect(result1).toEqual([]);
        expect(mockTrackState.setTracks).toHaveBeenCalledWith([]);

        // Ошибка в apiBase
        mockedApiJson.get.mockResolvedValue({ data: [] });
        mockedApiBase.get.mockRejectedValue(new Error('fail'));

        const result2 = await fetchTrack('group1', 'group1');
        expect(result2).toEqual([]);
        expect(mockTrackState.setTracks).toHaveBeenCalledWith([]);
    });
});
