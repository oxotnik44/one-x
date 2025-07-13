import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Track } from '../model/types/track';
import { useTrackStore } from './useTrackStore';

describe('useTrackStore', () => {
    beforeEach(() => {
        useTrackStore.setState({
            tracks: [],
        });
        vi.clearAllMocks();
    });

    it('должен иметь начальное состояние tracks пустым массивом', () => {
        const tracks = useTrackStore.getState().tracks;
        expect(tracks).toEqual([]);
    });

    it('setTracks корректно устанавливает список треков', () => {
        const tracks: Track[] = [
            {
                id: '1',
                title: 'Track 1',
                duration: 100,
                cover: 'cover1.jpg',
                groupId: 'group1',
                audioUrl: 'audio1.mp3',
                createdAt: new Date().toISOString(),
            },
            {
                id: '2',
                title: 'Track 2',
                duration: 200,
                cover: 'cover2.jpg',
                groupId: 'group1',
                audioUrl: 'audio2.mp3',
                createdAt: new Date().toISOString(),
            },
        ];

        useTrackStore.getState().setTracks(tracks);

        const stateTracks = useTrackStore.getState().tracks;
        expect(stateTracks).toEqual(tracks);
    });

    it('addTrack корректно добавляет новый трек', () => {
        const newTrack: Track = {
            id: '3',
            title: 'New Track',
            duration: 150,
            cover: 'cover3.jpg',
            groupId: 'group2',
            audioUrl: 'audio3.mp3',
            createdAt: new Date().toISOString(),
        };

        useTrackStore.setState({ tracks: [] });

        useTrackStore.getState().addTrack(newTrack);

        const stateTracks = useTrackStore.getState().tracks;
        expect(stateTracks).toContainEqual(newTrack);
        expect(stateTracks.length).toBe(1);
    });

    it('removeTrack удаляет трек по id', () => {
        const track1: Track = {
            id: '1',
            title: 'Track 1',
            duration: 100,
            cover: 'cover1.jpg',
            groupId: 'group1',
            audioUrl: 'audio1.mp3',
            createdAt: new Date().toISOString(),
        };
        const track2: Track = {
            id: '2',
            title: 'Track 2',
            duration: 200,
            cover: 'cover2.jpg',
            groupId: 'group1',
            audioUrl: 'audio2.mp3',
            createdAt: new Date().toISOString(),
        };

        useTrackStore.setState({
            tracks: [track1, track2],
        });

        useTrackStore.getState().removeTrack('1');

        const stateTracks = useTrackStore.getState().tracks;

        expect(stateTracks).toHaveLength(1);
        expect(stateTracks[0]).toEqual(track2);
    });

    it('updateTrack обновляет существующий трек', () => {
        const track: Track = {
            id: '1',
            title: 'Old Title',
            duration: 100,
            cover: 'cover.jpg',
            groupId: 'group1',
            audioUrl: 'audio.mp3',
            createdAt: new Date().toISOString(),
        };

        useTrackStore.setState({ tracks: [track] });

        const updatedTrack = { ...track, title: 'New Title' };

        useTrackStore.getState().updateTrack(updatedTrack);

        const stateTracks = useTrackStore.getState().tracks;

        expect(stateTracks).toHaveLength(1);
        expect(stateTracks[0].title).toBe('New Title');
    });
});
