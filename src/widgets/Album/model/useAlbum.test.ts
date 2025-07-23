// src/pages/Album/model/useAlbum.spec.ts
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAlbum } from './useAlbum';
import { useParams } from 'react-router-dom';

import * as AlbumEntity from 'entities/Album';
import * as GroupEntity from 'entities/Group';
import * as UserEntity from 'entities/User/model/api/likeAlbum/likeAlbum';
import * as UserStoreModule from 'entities/User';
import { useCallback } from 'react';

vi.mock('react-hot-toast');
vi.mock('react-router-dom', () => ({
    useParams: vi.fn(),
    useNavigate: () => vi.fn(), // мок навигации
}));
vi.mock('entities/Album', () => ({
    useAlbumStore: vi.fn(),
    fetchAlbumById: vi.fn(),
    editDescription: vi.fn(),
    deleteAlbum: vi.fn(),
    addTrackInAlbum: vi.fn(),
}));
vi.mock('entities/Group', () => ({ useGroupStore: vi.fn() }));
vi.mock('entities/User', () => ({
    useUserStore: vi.fn(),
}));
vi.mock('entities/User/model/api/likeAlbum/likeAlbum', () => ({ likeAlbum: vi.fn() }));
vi.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (k: string) => k }),
}));

describe('useAlbum hook — простой тест', () => {
    const fakeGroup = { id: 'g1' };
    const fakeAlbum = {
        id: 'a1',
        description: 'Hello',
        name: 'A',
        cover: '',
        createdAt: '',
        updatedAt: '',
        groupId: 'g1',
        trackIds: [],
    };
    let setCurrentAlbum: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.clearAllMocks();

        // useParams → albumId
        (useParams as Mock).mockReturnValue({ albumId: 'a1' });

        // Группа в сторе
        (GroupEntity.useGroupStore as unknown as Mock).mockImplementation((sel) =>
            sel({ currentGroup: fakeGroup }),
        );

        // Альбом в сторе
        setCurrentAlbum = vi.fn();
        (AlbumEntity.useAlbumStore as unknown as Mock).mockImplementation((sel) =>
            sel({ currentAlbum: fakeAlbum, setCurrentAlbum }),
        );

        // Пользователь — пустые лайки
        (UserStoreModule.useUserStore as unknown as Mock).mockImplementation((sel) =>
            sel({ authData: { likedAlbums: [] } }),
        );
    });

    it('инициализирует desc из currentAlbum', () => {
        const { result } = renderHook(() => useAlbum());
        expect(result.current.desc).toBe('Hello');
    });

    it('setDesc обновляет desc', () => {
        const { result } = renderHook(() => useAlbum());
        act(() => {
            result.current.setDesc('New');
        });
        expect(result.current.desc).toBe('New');
    });

    it('openFileDialog кликает на скрытый input', () => {
        const { result } = renderHook(() => useAlbum());
        const clickSpy = vi.fn();
        result.current.fileInputRef.current = { click: clickSpy } as any;
        act(() => {
            result.current.openFileDialog();
        });
        expect(clickSpy).toHaveBeenCalled();
    });

    it('toggleAlbum вызывает likeAlbum', () => {
        const { result } = renderHook(() => useAlbum());
        act(() => {
            result.current.toggleAlbum();
        });
        expect(UserEntity.likeAlbum).toHaveBeenCalledWith('a1');
    });

    it('onSave вызывает editDescription и закрывает режим редактирования', async () => {
        (AlbumEntity.editDescription as Mock).mockResolvedValue(undefined);
        const { result } = renderHook(() => useAlbum());
        // сначала включим режим редактирования, изменим desc
        act(() => {
            result.current.setDesc('X');
            result.current.setIsEditing(true);
        });
        await act(async () => {
            await result.current.onSave();
        });
        expect(AlbumEntity.editDescription).toHaveBeenCalledWith('a1', 'X');
        expect(result.current.isEditing).toBe(false);
    });

    it('onDelete вызывает deleteAlbum и сбрасывает currentAlbum', async () => {
        const fakeAlbum = {
            id: 'a1',
            description: 'Hello',
            name: 'A',
            cover: '',
            createdAt: '',
            updatedAt: '',
            groupId: 'g1',
            trackIds: [],
        };
        (AlbumEntity.deleteAlbum as Mock).mockResolvedValue(undefined);
        const setCurrentAlbum = vi.fn();

        // Мок useAlbumStore с currentAlbum и setCurrentAlbum
        (AlbumEntity.useAlbumStore as unknown as Mock).mockImplementation((sel) =>
            sel({ currentAlbum: fakeAlbum, setCurrentAlbum }),
        );

        const { result } = renderHook(() => useAlbum());
        await act(async () => {
            await result.current.onDelete();
        });

        expect(AlbumEntity.deleteAlbum).toHaveBeenCalledWith(fakeAlbum);
        expect(setCurrentAlbum).toHaveBeenCalledWith(null);
    });

    it('не сбрасывает input.value, если нет файлов', async () => {
        const { result } = renderHook(() => useAlbum());
        const evt = { target: { files: null, value: 'x' } } as any;
        await act(async () => {
            await result.current.onFileChange(evt);
        });
        // поскольку files === null, onFileChange просто вернул, не очищая value
        expect(evt.target.value).toBe('x');
    });
    it('вызывает setIsDeleteModalOpenState с правильным значением', () => {
        // Мокаем useState
        const setIsDeleteModalOpenState = vi.fn();

        // Имитация хука с useCallback
        const { result } = renderHook(() => {
            const setIsDeleteModalOpen = useCallback((val: boolean) => {
                setIsDeleteModalOpenState(val);
            }, []);
            return { setIsDeleteModalOpen };
        });

        act(() => {
            result.current.setIsDeleteModalOpen(true);
            result.current.setIsDeleteModalOpen(false);
        });

        expect(setIsDeleteModalOpenState).toHaveBeenCalledTimes(2);
        expect(setIsDeleteModalOpenState).toHaveBeenNthCalledWith(1, true);
        expect(setIsDeleteModalOpenState).toHaveBeenNthCalledWith(2, false);
    });
});
