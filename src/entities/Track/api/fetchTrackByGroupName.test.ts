// src/entities/Track/model/slice/trackService.test.ts
import { describe, it, expect, vi, beforeEach, type Mock, afterEach } from 'vitest';
import { api } from 'shared/api/api';
import axios from 'axios';
import { useTrackStore, type TrackState } from '../slice/useTrackStore';
import { fetchTracksByGroupName } from './fetchTrackByGroupName';

// мокаем оба клиента
vi.mock('shared/api/api');
vi.mock('axios');
vi.mock('../slice/useTrackStore');
vi.mock('shared/api/api', () => {
    return {
        api: {
            get: vi.fn(),
            interceptors: {
                request: {
                    use: vi.fn(),
                    eject: vi.fn(),
                },
                response: {
                    use: vi.fn(),
                    eject: vi.fn(),
                },
            },
        },
    };
});
const mockedApi = vi.mocked(api, true);
const mockedAxios = vi.mocked(axios, true);

describe('fetchTracksByGroupName', () => {
    let mockTrackState: TrackState;

    beforeEach(() => {
        vi.clearAllMocks();
        // Мокаем console.error, чтобы не засорять вывод
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
    it('успешно объединяет данные и вызывает setTracks', async () => {
        const mainTracks = [
            {
                id: '1',
                title: 'Track 1',
                groupId: 'group1',
                duration: 120,
                cover: '',
                audioUrl: '',
                createdAt: '',
            },
        ];
        const mediaTracks = [{ trackName: '1', coverUrl: '/cover1.png', audioUrl: '/audio1.mp3' }];

        mockedApi.get.mockResolvedValue({ data: mainTracks });
        mockedAxios.get.mockResolvedValue({ data: mediaTracks });

        const result = await fetchTracksByGroupName('group1', 'group1');

        expect(mockedApi.get).toHaveBeenCalledWith('/tracks', { params: { groupId: 'group1' } });
        expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:4001/tracks/group1');
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

    it('возвращает пустой массив если main API вернул не массив', async () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        errorSpy.mockRestore();
        mockedApi.get.mockResolvedValue({ data: null });
        // чтобы второй запрос не падал
        mockedAxios.get.mockResolvedValue({ data: [] });

        const result = await fetchTracksByGroupName('group1', 'group1');

        expect(mockTrackState.setTracks).not.toHaveBeenCalled();
        expect(result).toEqual([]);
    });

    it('возвращает пустой массив и не дергает setTracks при ошибке любого запроса', async () => {
        // ошибка на основном API
        mockedApi.get.mockRejectedValue(new Error('fail'));
        // ошибка на локальном API
        mockedAxios.get.mockRejectedValue(new Error('fail'));

        const result1 = await fetchTracksByGroupName('group1', 'group1');
        expect(result1).toEqual([]);
        expect(mockTrackState.setTracks).not.toHaveBeenCalled();

        // теперь основной успешен, локальный падает
        mockedApi.get.mockResolvedValue({ data: [] });
        mockedAxios.get.mockRejectedValue(new Error('fail'));

        const result2 = await fetchTracksByGroupName('group1', 'group1');
        expect(result2).toEqual([]);
        expect(mockTrackState.setTracks).not.toHaveBeenCalled();
    });
});
