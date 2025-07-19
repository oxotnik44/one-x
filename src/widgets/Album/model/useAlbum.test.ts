import React from 'react';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import * as AlbumEntity from 'entities/Album';
import * as GroupEntity from 'entities/Group';
import toast from 'react-hot-toast';
import { useAlbum } from './useAlbum';

// 🔧 Моки зависимостей
vi.mock('entities/Album', () => ({
    fetchAlbumById: vi.fn(),
    editDescription: vi.fn(),
    deleteAlbum: vi.fn(),
    addTrackInAlbum: vi.fn(),
    useAlbumStore: vi.fn(),
}));
vi.mock('entities/Group', () => ({
    useGroupStore: vi.fn(),
}));

vi.mock('react-hot-toast', () => ({
    __esModule: true,
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe('useAlbum hook', () => {
    const fakeGroup = { id: 'group-1', name: 'test-group' };
    const fakeAlbum = {
        id: 'album-1',
        name: 'test-album',
        description: 'Initial desc',
        cover: '',
        trackIds: [],
    };

    beforeEach(() => {
        vi.clearAllMocks();

        (AlbumEntity.fetchAlbumById as Mock).mockResolvedValue(undefined);
        (AlbumEntity.editDescription as Mock).mockResolvedValue(undefined);
        (AlbumEntity.deleteAlbum as Mock).mockResolvedValue(undefined);

        (GroupEntity.useGroupStore as unknown as Mock).mockImplementation(
            (selector: (state: any) => any) => selector({ currentGroup: fakeGroup }),
        );

        (AlbumEntity.useAlbumStore as unknown as Mock).mockImplementation(
            (selector: (state: any) => any) =>
                selector({
                    currentAlbum: fakeAlbum,
                    setCurrentAlbum: vi.fn(),
                }),
        );
    });

    // Обёртка с роутингом
    const wrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(
            MemoryRouter,
            { initialEntries: ['/albums/album-1'] },
            React.createElement(
                Routes,
                null,
                React.createElement(Route, { path: '/albums/:albumId', element: children }),
            ),
        );

    it('должен загружать альбом, если его нет в сторе', () => {
        // Используем пустой currentAlbum в этом конкретном тесте
        (AlbumEntity.useAlbumStore as unknown as Mock).mockImplementation(
            (selector: (state: any) => any) =>
                selector({
                    currentAlbum: undefined,
                    setCurrentAlbum: vi.fn(),
                }),
        );

        renderHook(() => useAlbum(), { wrapper });
        expect(AlbumEntity.fetchAlbumById).toHaveBeenCalledWith('group-1', 'album-1');
    });

    it('инициализирует description из currentAlbum', () => {
        const { result } = renderHook(() => useAlbum(), { wrapper });
        expect(result.current.desc).toBe('Initial desc');
    });

    it('onSave вызывает editDescription и выключает режим редактирования', async () => {
        const { result } = renderHook(() => useAlbum(), { wrapper });
        await act(async () => {
            await result.current.onSave();
        });
        expect(AlbumEntity.editDescription).toHaveBeenCalledWith('album-1', 'Initial desc');
        expect(result.current.isEditing).toBe(false);
    });

    it('onDelete удаляет альбом и сбрасывает currentAlbum', async () => {
        const setCurrentAlbum = vi.fn();

        (AlbumEntity.useAlbumStore as unknown as Mock).mockImplementation(
            (selector: (state: any) => any) =>
                selector({
                    currentAlbum: fakeAlbum,
                    setCurrentAlbum,
                }),
        );

        const { result } = renderHook(() => useAlbum(), { wrapper });
        await act(async () => {
            await result.current.onDelete();
        });

        expect(AlbumEntity.deleteAlbum).toHaveBeenCalledWith('album-1');
        expect(setCurrentAlbum).toHaveBeenCalledWith(null);
        expect(toast.success).toHaveBeenCalled();
    });

    it('openFileDialog кликает на input', () => {
        const { result } = renderHook(() => useAlbum(), { wrapper });
        const clickSpy = vi.fn();
        result.current.fileInputRef.current = { click: clickSpy } as any;

        act(() => {
            result.current.openFileDialog();
        });

        expect(clickSpy).toHaveBeenCalled();
    });
});
