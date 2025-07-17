import { create } from 'zustand';
import type { Album } from '../types/types';
import type { Track } from 'entities/Track';

interface AlbumState {
    albums: Album[];
    currentAlbum: Album | null;
    setAlbums: (albums: Album[]) => void;
    addAlbum: (album: Album) => void;
    updateAlbum: (id: string, updated: Partial<Album>) => void;
    removeAlbum: (id: string) => void;
    appendTrackToAlbum: (albumId: string, track: Track) => void;

    setCurrentAlbum: (album: Album | null) => void;
    clearCurrentAlbum: () => void;
}

export const useAlbumStore = create<AlbumState>((set) => ({
    albums: [],
    currentAlbum: null,

    setAlbums: (albums) => set({ albums }),
    addAlbum: (album) =>
        set((state) => ({
            albums: [...state.albums, album],
        })),
    updateAlbum: (id, updated) =>
        set((state) => ({
            albums: state.albums.map((album) =>
                album.id === id ? { ...album, ...updated } : album,
            ),
        })),
    removeAlbum: (id) =>
        set((state) => ({
            albums: state.albums.filter((album) => album.id !== id),
        })),
    appendTrackToAlbum: (albumId, track) =>
        set((state) => ({
            albums: state.albums.map((album) =>
                album.id === albumId ? { ...album, trackIds: [...album.trackIds, track] } : album,
            ),
        })),

    setCurrentAlbum: (album) => set({ currentAlbum: album }),
    clearCurrentAlbum: () => set({ currentAlbum: null }),
}));
