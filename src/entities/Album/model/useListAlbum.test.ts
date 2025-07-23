// src/pages/ListAlbum/model/useListAlbum.spec.ts
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useListAlbum } from './useListAlbum';
import { useNavigate } from 'react-router-dom';

import * as GroupStore from 'entities/Group';
import * as AlbumStore from 'entities/Album';
import * as UserStore from 'entities/User';
import * as API from 'entities/Album/model/api/fetchAlbums/fetchAlbums';

vi.mock('react-router-dom', () => ({ useNavigate: vi.fn() }));
vi.mock('react-hot-toast');
vi.mock('entities/Group', () => ({ useGroupStore: vi.fn() }));
vi.mock('entities/Album', () => ({ useAlbumStore: vi.fn() }));
vi.mock('entities/User', () => ({ useUserStore: vi.fn() }));
vi.mock('entities/Album/model/api/fetchAlbums/fetchAlbums', () => ({
    fetchAlbums: vi.fn(),
}));
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }));

describe('useListAlbum', () => {
    const navigateMock = vi.fn();
    const fakeGroup = { id: 'g1', name: 'Group1' };
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
    beforeEach(() => {
        vi.clearAllMocks();
        (useNavigate as Mock).mockReturnValue(navigateMock);

        (GroupStore.useGroupStore as unknown as Mock).mockImplementation((sel) =>
            sel({ currentGroup: fakeGroup }),
        );

        // albums — массив, а не объект
        (AlbumStore.useAlbumStore as unknown as Mock).mockImplementation((sel) =>
            sel({ albums: [], setCurrentAlbum: vi.fn() }),
        );

        (UserStore.useUserStore as unknown as Mock).mockImplementation((sel) =>
            sel({ authData: null }),
        );
    });

    it('при монтировании при пустом albums вызывает fetchAlbums и управляет loading', async () => {
        const fetchMock = (API.fetchAlbums as Mock).mockResolvedValue(fakeAlbum);
        const { result } = renderHook(() => useListAlbum());

        // сразу после mount loading=true
        expect(result.current.loading).toBe(true);
        expect(fetchMock).toHaveBeenCalledWith('g1', 'Group1');

        // ждём завершения эффекта
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
    });

    it('onAddAlbumClick ведёт на /my_group/add_album', () => {
        (AlbumStore.useAlbumStore as unknown as Mock).mockImplementation((sel) =>
            sel({ albums: fakeAlbum, setCurrentAlbum: vi.fn() }),
        );
        const { result } = renderHook(() => useListAlbum());
        act(() => {
            result.current.onAddAlbumClick();
        });
        expect(navigateMock).toHaveBeenCalledWith('/my_group/add_album');
    });

    it('onAlbumClick устанавливает текущий альбом и ведёт на страницу альбома', () => {
        const setCurrentAlbum = vi.fn();

        (AlbumStore.useAlbumStore as unknown as Mock).mockImplementation((sel) =>
            sel({ albums: [fakeAlbum], setCurrentAlbum }),
        );

        const { result } = renderHook(() => useListAlbum());

        act(() => {
            result.current.onAlbumClick('a1');
        });

        expect(setCurrentAlbum).toHaveBeenCalledWith(fakeAlbum);
        expect(navigateMock).toHaveBeenCalledWith('/my_group/album/a1');
    });

    it('не вызывает fetchAlbums если currentGroup отсутствует', () => {
        (GroupStore.useGroupStore as unknown as Mock).mockImplementation((sel) =>
            sel({ currentGroup: null }),
        );
        const fetchMock = API.fetchAlbums as Mock;
        renderHook(() => useListAlbum());
        expect(fetchMock).not.toHaveBeenCalled();
    });
});
