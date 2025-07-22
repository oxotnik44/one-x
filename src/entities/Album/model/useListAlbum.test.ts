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
    const fakeAlbums = [{ id: 'a1' }, { id: 'a2' }];

    beforeEach(() => {
        vi.clearAllMocks();
        (useNavigate as Mock).mockReturnValue(navigateMock);
        // по умолчанию в сторе группа
        (GroupStore.useGroupStore as unknown as Mock).mockImplementation((sel) =>
            sel({ currentGroup: fakeGroup }),
        );
        // и в альбомном сторе пустой массив
        (AlbumStore.useAlbumStore as unknown as Mock).mockImplementation((sel) =>
            sel({ albums: [], setCurrentAlbum: vi.fn() }),
        );
        // и пользователь
        (UserStore.useUserStore as unknown as Mock).mockImplementation((sel) =>
            sel({ authData: null }),
        );
    });

    it('при монтировании при пустом albums вызывает fetchAlbums и управляет loading', async () => {
        const fetchMock = (API.fetchAlbums as Mock).mockResolvedValue(fakeAlbums);
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
            sel({ albums: fakeAlbums, setCurrentAlbum: vi.fn() }),
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
            sel({ albums: fakeAlbums, setCurrentAlbum }),
        );
        const { result } = renderHook(() => useListAlbum());
        act(() => {
            result.current.onAlbumClick('a2');
        });
        expect(setCurrentAlbum).toHaveBeenCalledWith({ id: 'a2' });
        expect(navigateMock).toHaveBeenCalledWith('/my_group/album/a2');
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
