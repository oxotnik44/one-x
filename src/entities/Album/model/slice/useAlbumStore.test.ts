// src/entities/Album/model/slice/useAlbumStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useAlbumStore } from './useAlbumStore';
import type { Album } from '../types/types';

describe('useAlbumStore', () => {
    beforeEach(() => {
        // Сбрасываем состояние между тестами
        useAlbumStore.setState({ albums: [] });
    });

    const album1: Album = {
        id: '1',
        name: 'Album 1',
        groupId: 'group1',
        cover: 'cover1.png',
        createdAt: new Date().toISOString(),
        trackIds: [],
        description: null,
    };

    const album2: Album = {
        id: '2',
        name: 'Album 2',
        groupId: 'group1',
        cover: 'cover2.png',
        createdAt: new Date().toISOString(),
        trackIds: [],
        description: null,
    };

    it('setAlbums устанавливает список альбомов', () => {
        useAlbumStore.getState().setAlbums([album1, album2]);
        expect(useAlbumStore.getState().albums).toEqual([album1, album2]);
    });

    it('addAlbum добавляет альбом', () => {
        useAlbumStore.getState().setAlbums([album1]);
        useAlbumStore.getState().addAlbum(album2);
        expect(useAlbumStore.getState().albums).toEqual([album1, album2]);
    });

    it('updateAlbum обновляет альбом по id', () => {
        useAlbumStore.getState().setAlbums([album1]);
        useAlbumStore.getState().updateAlbum('1', { name: 'Updated Album 1' });
        expect(useAlbumStore.getState().albums[0].name).toBe('Updated Album 1');
    });

    it('removeAlbum удаляет альбом по id', () => {
        useAlbumStore.getState().setAlbums([album1, album2]);
        useAlbumStore.getState().removeAlbum('1');
        expect(useAlbumStore.getState().albums).toEqual([album2]);
    });
});
