import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { api } from 'shared/api/api';
import { useGroupStore } from 'entities/Group/model/slice/useGroupStore';
import { editGroup, type EditGroupData } from './editGroup';

vi.mock('axios');

vi.mock('shared/api/api', () => {
    return {
        api: {
            get: vi.fn(),
            post: vi.fn(),
            patch: vi.fn(),
            interceptors: {
                request: {
                    use: vi.fn(),
                    eject: vi.fn(),
                },
                response: {
                    use: vi.fn(),
                    eject: vi.fn(),
                },
            },
        },
    };
});

vi.mock('entities/Group/model/slice/useGroupStore');

const mockedAxios = vi.mocked(axios, true);
const mockedApi = vi.mocked(api, true);
const mockedGroupStore = vi.mocked(useGroupStore, true);

describe('editGroup', () => {
    const groupId = 'group-123';
    const baseCover = '/covers/old.png';
    const newCoverUrl = '/covers/new.png';
    const now = '2025-07-13T00:00:00.000Z';

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        vi.setSystemTime(new Date(now));
        mockedGroupStore.getState.mockReturnValue({
            setCurrentGroup: vi.fn(),
            clearCurrentGroup: vi.fn(),
        });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('успешно обновляет группу без загрузки нового файла', async () => {
        const groupData: EditGroupData = {
            name: 'New Name',
            description: 'desc',
            genre: 'Рок',
            cover: baseCover,
        };

        const updatedGroup = {
            id: groupId,
            name: groupData.name,
            description: groupData.description,
            genre: groupData.genre,
            cover: newCoverUrl,
            updatedAt: now,
        };

        mockedApi.patch.mockResolvedValue({ data: updatedGroup });

        const result = await editGroup(groupId, groupData);

        expect(mockedApi.patch).toHaveBeenCalledWith(`/groups/${groupId}`, {
            name: groupData.name,
            description: groupData.description,
            genre: groupData.genre,
            cover: baseCover,
            updatedAt: now,
        });

        expect(result).toEqual(updatedGroup);
        expect(useGroupStore.getState().setCurrentGroup).toHaveBeenCalledWith(updatedGroup);
        expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    it('успешно обновляет группу с загрузкой нового файла', async () => {
        const file = new File(['dummy content'], 'icon.png', { type: 'image/png' });
        const fileList = {
            0: file,
            length: 1,
            item: (index: number) => (index === 0 ? file : null),
        } as unknown as FileList;

        // Эмуляция того, что возвращает сервер:
        const uploadedUrl = 'http://localhost:4001/static/groups/group-123/cover.png';
        mockedAxios.post.mockResolvedValue({ data: { url: uploadedUrl } });

        const groupData: EditGroupData = {
            name: 'New Name',
            description: 'desc',
            genre: 'Поп',
            cover: baseCover,
            newIconFile: fileList,
        };

        const updatedGroup = {
            id: groupId,
            name: groupData.name,
            description: groupData.description,
            genre: groupData.genre,
            cover: uploadedUrl,
            updatedAt: now,
        };
        mockedApi.patch.mockResolvedValue({ data: updatedGroup });

        const result = await editGroup(groupId, groupData);

        // Проверяем, что загрузили файл на правильный эндпоинт:
        expect(mockedAxios.post).toHaveBeenCalledWith(
            expect.stringContaining('/uploadGroupCover'),
            expect.any(FormData),
            expect.objectContaining({
                headers: { 'Content-Type': 'multipart/form-data' },
            }),
        );

        // И что в patch ушёл именно полный URL, как дал сервер:
        expect(mockedApi.patch).toHaveBeenCalledWith(`/groups/${groupId}`, {
            name: groupData.name,
            description: groupData.description,
            genre: groupData.genre,
            cover: uploadedUrl,
            updatedAt: now,
        });

        expect(result).toEqual(updatedGroup);
        expect(useGroupStore.getState().setCurrentGroup).toHaveBeenCalledWith(updatedGroup);
    });

    it('выбрасывает ошибку если groupId пустой', async () => {
        await expect(
            editGroup('', {
                name: 'Name',
                genre: 'Рок',
                cover: '',
            } as EditGroupData),
        ).rejects.toThrow('ID группы не указан');
    });

    it('бросает ошибку при отсутствии updatedGroup в ответе', async () => {
        const groupData: EditGroupData = {
            name: 'Name',
            genre: 'Рок',
            cover: baseCover,
        };

        mockedApi.patch.mockResolvedValue({ data: null });

        await expect(editGroup(groupId, groupData)).rejects.toThrow('Ошибка при обновлении группы');
    });
});
