// src/entities/Group/model/api/createGroup.test.ts
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { createGroup } from './createGroup';
import type { Group } from '../../types/group';
import type { CreateGroupFormData } from 'features/CreateGroupForm';
import { apiJson, apiBase } from 'shared/api/api';
import { useUserStore } from 'entities/User/model/slice/useUserStore';
import { useGroupStore } from '../../slice/useGroupStore';

// Мокаем сразу оба инстанса
vi.mock('shared/api/api', () => ({
    apiJson: {
        get: vi.fn(),
        post: vi.fn(),
        patch: vi.fn(),
    },
    apiBase: {
        post: vi.fn(),
    },
}));

// Мокаем сторы
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

// Мокаем toast.promise/error
vi.mock('react-hot-toast', () => ({
    default: {
        promise: (_p: Promise<any>, _msgs: any) => _p,
        error: vi.fn(),
    },
}));

const mockedApiJson = vi.mocked(apiJson, true);
const mockedApiBase = vi.mocked(apiBase, true);

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

    beforeEach(() => {
        vi.clearAllMocks();
        // authData
        (useUserStore.getState as Mock).mockReturnValue({ authData: fakeUser });
        // setCurrentGroup
        (useGroupStore.getState as Mock).mockReturnValue({ setCurrentGroup: vi.fn() });
    });

    it('успешно создает группу', async () => {
        // 1) Нет группы с таким именем
        (mockedApiJson.get as Mock).mockResolvedValue({ data: [] });
        // 2) Загрузка иконки через apiBase.post
        const uploadedUrl = 'http://cdn.test/icon.png';
        (mockedApiBase.post as Mock).mockResolvedValue({ data: { url: uploadedUrl } });
        // 3) Создание группы через apiJson.post
        (mockedApiJson.post as Mock).mockResolvedValue({ data: fakeGroup });
        // 4) Добавление в профиль пользователя через apiJson.patch
        (mockedApiJson.patch as Mock).mockResolvedValue({});

        const file = new File([''], 'icon.png', { type: 'image/png' });
        const files = { 0: file, length: 1, item: (i: number) => (i === 0 ? file : null) } as any;

        const groupData: CreateGroupFormData = {
            name: fakeGroup.name,
            description: fakeGroup.description ?? '',
            icon: files,
            genre: fakeGroup.genre,
        };

        const result = await createGroup(groupData);

        // 1) Проверяем get
        expect(mockedApiJson.get).toHaveBeenCalledWith('/groups', {
            params: { name: groupData.name },
        });
        // 2) Проверяем upload
        expect(mockedApiBase.post).toHaveBeenCalledWith(
            '/uploadGroupCover',
            expect.any(FormData),
            expect.objectContaining({ headers: { 'Content-Type': 'multipart/form-data' } }),
        );
        // 3) Проверяем создание
        expect(mockedApiJson.post).toHaveBeenCalledWith(
            '/groups',
            expect.objectContaining({
                // id генерится внутри — просто проверяем, что это строка
                id: expect.any(String),
                name: groupData.name,
                description: groupData.description ?? '',
                userId: fakeUser.id,
                genre: groupData.genre ?? 'Рок',
                cover: uploadedUrl,
                createdAt: expect.any(String),
                // updatedAt устанавливается в ''
                updatedAt: '',
            }),
        );

        // 4) Проверяем обновление пользователя
        expect(mockedApiJson.patch).toHaveBeenCalledWith(
            `/users/${fakeUser.id}`,
            expect.objectContaining({ id: expect.any(String) }),
        );

        // 5) Проверяем стор
        expect(useGroupStore.getState().setCurrentGroup).toHaveBeenCalledWith(
            expect.objectContaining({
                id: expect.any(String),
                name: fakeGroup.name,
                description: fakeGroup.description,
                genre: fakeGroup.genre,
                userId: fakeGroup.userId,
                cover: fakeGroup.cover,
                createdAt: expect.any(String),
                updatedAt: '',
            }),
        );

        // и для возвращаемого результата
        expect(result).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                name: fakeGroup.name,
                description: fakeGroup.description,
                genre: fakeGroup.genre,
                userId: fakeGroup.userId,
                cover: fakeGroup.cover,
                createdAt: expect.any(String),
                updatedAt: '',
            }),
        );
    });

    it('выбрасывает ошибку при отсутствии иконки', async () => {
        (mockedApiJson.get as Mock).mockResolvedValue({ data: [] });
        const groupData = { name: 'New Group', description: '', icon: null } as any;
        await expect(createGroup(groupData)).rejects.toThrowError(new Error('Иконка обязательна'));
    });

    it('обрабатывает ситуацию, когда группа уже существует', async () => {
        (mockedApiJson.get as Mock).mockResolvedValue({ data: [{ id: 'exist' }] });
        const file = new File([''], 'icon.png', { type: 'image/png' });
        const files = { 0: file, length: 1, item: (i: number) => (i === 0 ? file : null) } as any;

        const groupData: CreateGroupFormData = {
            name: 'Exist',
            description: '',
            icon: files,
            genre: 'Рок',
        };

        await expect(createGroup(groupData)).rejects.toThrowError(
            new Error('Группа с таким названием уже существует'),
        );
    });
});
