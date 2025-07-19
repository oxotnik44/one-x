// src/entities/Track/model/useTrackItemLogic.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import * as UserEntity from 'entities/User';
import * as PlayerEntity from 'entities/Player/model';
import * as GroupEntity from 'entities/Group';
import * as AlbumEntity from 'entities/Album';
import * as ThemeEntity from 'shared/config/theme/themeStore';
import * as DeleteTrackModule from './api/deleteTrack/deleteTrack';
import * as DeleteTrackFromAlbumModule from 'entities/Album/model/api/deleteTrackFromAlbum/deleteTrackFromAlbum';
import { useTrackItemLogic } from './useTrackActions';

vi.mock('entities/User', () => ({
    useUserStore: vi.fn(),
    likeTrack: vi.fn(),
}));

vi.mock('entities/Player/model', () => ({
    usePlayerStore: vi.fn(),
}));

vi.mock('entities/Group', () => ({
    useGroupStore: vi.fn(),
}));

vi.mock('entities/Album', () => ({
    useAlbumStore: vi.fn(),
}));

vi.mock('shared/config/theme/themeStore', () => ({
    useThemeStore: vi.fn(),
}));

describe('useTrackItemLogic', () => {
    const track = {
        id: 't1',
        title: 'Track 1',
        albumId: 'a1',
        duration: 180,
        cover: 'cover.jpg',
        groupId: 'g1',
        audioUrl: 'http://audio.url/track1.mp3',
        createdAt: new Date().toISOString(),
    };

    const groupName = 'group1';
    const currentGroup = { id: 'g1' };
    const currentAlbum = { id: 'a1' };

    let likeTrackMock: ReturnType<typeof vi.fn>;
    let useUserStoreMock: ReturnType<typeof vi.fn>;
    let usePlayerStoreMock: ReturnType<typeof vi.fn>;
    let useGroupStoreMock: ReturnType<typeof vi.fn>;
    let useAlbumStoreMock: ReturnType<typeof vi.fn>;
    let useThemeStoreMock: ReturnType<typeof vi.fn>;

    let togglePlayMock: ReturnType<typeof vi.fn>;
    let setCurrentTrackMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.clearAllMocks();

        likeTrackMock = vi.fn();
        (UserEntity.likeTrack as any) = likeTrackMock;

        // Здесь useUserStore должен принимать селектор и возвращать из состояния значение селектора
        useUserStoreMock = vi.fn((selector) =>
            selector({
                authData: {
                    likedTracks: ['t1'],
                },
            }),
        );
        (UserEntity.useUserStore as any) = useUserStoreMock;

        togglePlayMock = vi.fn();
        setCurrentTrackMock = vi.fn();

        usePlayerStoreMock = vi.fn((selector) =>
            selector({
                currentTrack: { id: 't1' },
                isPlaying: true,
                togglePlay: togglePlayMock,
                setCurrentTrack: setCurrentTrackMock,
            }),
        );
        (PlayerEntity.usePlayerStore as any) = usePlayerStoreMock;

        useGroupStoreMock = vi.fn(() => currentGroup);
        (GroupEntity.useGroupStore as any) = useGroupStoreMock;

        useAlbumStoreMock = vi.fn(() => currentAlbum);
        (AlbumEntity.useAlbumStore as any) = useAlbumStoreMock;

        useThemeStoreMock = vi.fn(() => 'light');
        (ThemeEntity.useThemeStore as any) = useThemeStoreMock;

        vi.spyOn(DeleteTrackModule, 'deleteTrack').mockResolvedValue(undefined);
        vi.spyOn(DeleteTrackFromAlbumModule, 'deleteTrackFromAlbum').mockResolvedValue(undefined);
    });

    it('корректно инициализируется и лайкает трек', () => {
        const { result } = renderHook(() => useTrackItemLogic({ track, groupName }));

        expect(result.current.liked).toBe(true);

        act(() => {
            result.current.toggleLike();
        });

        expect(likeTrackMock).toHaveBeenCalledWith('t1');
    });

    it('клик play переключает трек, если текущий другой', () => {
        const otherTrack = { ...track, id: 't2' };
        const { result } = renderHook(() => useTrackItemLogic({ track: otherTrack, groupName }));

        act(() => {
            result.current.onPlayClick();
        });

        expect(setCurrentTrackMock).toHaveBeenCalledWith(otherTrack);
    });

    it('onDeleteClick открывает подтверждение удаления', async () => {
        const { result } = renderHook(() => useTrackItemLogic({ track, groupName }));

        await act(async () => {
            result.current.onDeleteClick();
            await new Promise((resolve) => setTimeout(resolve, 0));
        });

        expect(result.current.isConfirmOpen).toBe(true);
        expect(result.current.isDropdownOpen).toBe(false);
    });

    it('onConfirmDeleteClick вызывает deleteTrackFromAlbum если есть albumId', async () => {
        const onConfirmDelete = vi.fn();
        const { result } = renderHook(() =>
            useTrackItemLogic({ track, groupName, onConfirmDelete }),
        );

        await act(async () => {
            await result.current.onConfirmDeleteClick();
        });

        expect(DeleteTrackFromAlbumModule.deleteTrackFromAlbum).toHaveBeenCalledWith(
            track.id,
            track.title,
            currentGroup,
            currentAlbum,
        );
        expect(onConfirmDelete).toHaveBeenCalledWith(track);
    });

    it('onConfirmDeleteClick вызывает deleteTrack если нет albumId', async () => {
        const noAlbumTrack = { ...track, albumId: undefined };
        const onConfirmDelete = vi.fn();

        const { result } = renderHook(() =>
            useTrackItemLogic({ track: noAlbumTrack, groupName, onConfirmDelete }),
        );

        await act(async () => {
            await result.current.onConfirmDeleteClick();
        });

        expect(DeleteTrackModule.deleteTrack).toHaveBeenCalledWith(
            groupName,
            noAlbumTrack.title,
            noAlbumTrack.id,
        );
        expect(onConfirmDelete).toHaveBeenCalledWith(noAlbumTrack);
    });
});
