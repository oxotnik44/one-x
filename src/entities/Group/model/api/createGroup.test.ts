import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { createGroup } from './createGroup';
import { useUserStore } from 'entities/User/model/slice/useUserStore';
import { useGroupStore } from 'entities/Group/model/slice/useGroupStore';
import { api } from 'shared/api/api';
import type { CreateGroupFormData } from 'features/CreateGroup/model/types/types';
import type { Group } from '../types/group';

vi.mock('shared/api/api', () => ({
    api: {
        get: vi.fn(),
        post: vi.fn(),
        patch: vi.fn(),
    },
}));

vi.mock('entities/User/model/slice/useUserStore', () => ({
    useUserStore: {
        getState: vi.fn(),
    },
}));

vi.mock('entities/Group/model/slice/useGroupStore', () => ({
    useGroupStore: {
        getState: vi.fn(),
    },
}));

vi.mock('react-hot-toast', () => ({
    default: {
        promise: (_p: Promise<any>, _msgs: any) => _p,
        error: vi.fn(),
    },
}));
const patchMock = vi.mocked(api.patch);
describe('createGroup', () => {
    const fakeUser = { id: 'user123' };
    const fakeGroup: Group = {
        id: 'group123',
        name: 'Test Group',
        description: 'desc',
        userId: fakeUser.id,
        genre: 'Рок',
        cover: 'url',
        createdAt: new Date().toISOString(),
    };
    const fakeStoreGroup = {
        id: 'group123',
        name: fakeGroup.name,
        description: fakeGroup.description,
        cover: fakeGroup.cover,
        userId: fakeGroup.userId,
        genre: fakeGroup.genre,
        createdAt: fakeGroup.createdAt,
        updatedAt: '',
    };

    beforeEach(() => {
        vi.clearAllMocks();

        (useUserStore.getState as Mock).mockReturnValue({ authData: fakeUser });
        (useGroupStore.getState as Mock).mockReturnValue({ setCurrentGroup: vi.fn() });
    });

    it('успешно создает группу', async () => {
        (api.get as Mock).mockResolvedValue({ data: [] });

        (global.fetch as unknown) = vi.fn().mockResolvedValue({
            ok: true,
            json: () => ({ url: 'icon-url' }),
        } as unknown as Response);

        (api.post as Mock).mockResolvedValue({ data: fakeGroup });
        (api.patch as Mock).mockResolvedValue({});

        const file = new File([''], 'icon.png');
        const fileList = {
            0: file,
            length: 1,
            item: (index: number) => (index === 0 ? file : null),
        } as unknown as FileList;

        const groupData: CreateGroupFormData = {
            name: 'Test Group',
            description: 'desc',
            icon: fileList,
            genre: 'Рок',
        };

        const result = await createGroup(groupData);

        expect(api.get).toHaveBeenCalledWith('/groups', { params: { name: groupData.name } });
        expect(global.fetch).toHaveBeenCalled();
        expect(api.post).toHaveBeenCalled();
        expect(patchMock).toHaveBeenCalledWith(
            `/users/${fakeUser.id}`,
            expect.objectContaining({
                id: expect.any(String) as string,
            }),
        );

        expect(useGroupStore.getState().setCurrentGroup).toHaveBeenCalledWith(
            expect.objectContaining({
                name: groupData.name,
            }),
        );

        expect(result).not.toBeNull();
        if (result) {
            expect(result.id).toEqual(expect.any(String));
            expect(result.name).toBe(fakeStoreGroup.name);
            expect(result.description).toBe(fakeStoreGroup.description);
            expect(result.cover).toBe(fakeStoreGroup.cover);
            expect(result.userId).toBe(fakeStoreGroup.userId);
            expect(result.genre).toBe(fakeStoreGroup.genre);
            expect(result.createdAt).toBe(fakeStoreGroup.createdAt);
            expect(result.updatedAt).toBe(fakeStoreGroup.updatedAt);
        }
    });

    it('возвращает null при отсутствии иконки', async () => {
        (api.get as Mock).mockResolvedValue({ data: [] });
        const groupData = {
            name: 'New Group',
            description: '',
            icon: null,
        };

        await expect(createGroup(groupData)).rejects.toThrowError(new Error('Иконка обязательна'));
    });

    it('обрабатывает ошибку если группа с именем уже существует', async () => {
        (api.get as Mock).mockResolvedValue({ data: [{ id: 'exist' }] });
        const file = new File([''], 'icon.png');
        const fileList = {
            0: file,
            length: 1,
            item: (index: number) => (index === 0 ? file : null),
        } as unknown as FileList;

        const groupData: CreateGroupFormData = {
            name: 'Exist',
            description: '',
            icon: fileList,
        };

        await expect(createGroup(groupData)).rejects.toThrowError(
            new Error('Группа с таким названием уже существует'),
        );
    });

    it('обрабатывает ошибку при отсутствии иконки', async () => {
        (api.get as Mock).mockResolvedValue({ data: [] });
        const groupData = {
            name: 'New Group',
            description: '',
            icon: null,
        };

        await expect(createGroup(groupData)).rejects.toThrowError(new Error('Иконка обязательна'));
    });
});
