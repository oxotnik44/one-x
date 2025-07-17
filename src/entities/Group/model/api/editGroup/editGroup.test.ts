// src/entities/Group/model/api/editGroup.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiJson, apiBase } from 'shared/api/api';
import { useGroupStore } from '../../slice/useGroupStore';
import { editGroup, type EditGroupData } from './editGroup';

vi.mock('shared/api/api', () => ({
    apiJson: { patch: vi.fn() },
    apiBase: { post: vi.fn() },
}));

vi.mock('entities/Group/model/slice/useGroupStore');

describe('editGroup', () => {
    const groupId = 'group-123';
    const oldCover = '/covers/old.png';
    const newCoverUrl = '/covers/new.png';

    beforeEach(() => {
        vi.clearAllMocks();
        // mock store
        (useGroupStore.getState as any).mockReturnValue({
            setCurrentGroup: vi.fn(),
        });
    });

    it('успешно обновляет без нового файла', async () => {
        const data: EditGroupData = {
            name: 'Name',
            description: 'desc',
            genre: 'Рок',
            cover: oldCover,
        };
        const updated = { ...data, id: groupId, updatedAt: '2025-07-13T00:00:00.000Z' };

        // мок patch
        (apiJson.patch as any).mockResolvedValue({ data: updated });

        const res = await editGroup(groupId, data);

        expect(apiBase.post).not.toHaveBeenCalled();
        expect(apiJson.patch).toHaveBeenCalledWith(
            `/groups/${groupId}`,
            expect.objectContaining({ cover: oldCover }),
        );
        expect(res).toEqual(updated);
        expect(useGroupStore.getState().setCurrentGroup).toHaveBeenCalledWith(updated);
    });

    it('успешно обновляет с загрузкой нового файла', async () => {
        const file = new File([''], 'icon.png', { type: 'image/png' });
        const files = { 0: file, length: 1, item: (i: number) => (i === 0 ? file : null) } as any;
        const data: EditGroupData = {
            name: 'Name',
            description: 'desc',
            genre: 'Поп',
            cover: oldCover,
            newIconFile: files,
        };
        const updated = {
            id: groupId,
            ...data,
            cover: newCoverUrl,
            updatedAt: '2025-07-13T00:00:00.000Z',
        };

        (apiBase.post as any).mockResolvedValue({ data: { url: newCoverUrl } });
        (apiJson.patch as any).mockResolvedValue({ data: updated });

        const res = await editGroup(groupId, data);

        expect(apiBase.post).toHaveBeenCalledWith(
            '/uploadGroupCover',
            expect.any(FormData),
            expect.objectContaining({ headers: { 'Content-Type': 'multipart/form-data' } }),
        );
        expect(apiJson.patch).toHaveBeenCalledWith(
            `/groups/${groupId}`,
            expect.objectContaining({ cover: newCoverUrl }),
        );
        expect(res).toEqual(updated);
        expect(useGroupStore.getState().setCurrentGroup).toHaveBeenCalledWith(updated);
    });

    it('кидает ошибку при пустом groupId', async () => {
        await expect(editGroup('', {} as EditGroupData)).rejects.toThrow('ID группы не указан');
    });

    it('кидает ошибку при отсутствии data в patch', async () => {
        const data: EditGroupData = { name: 'Name', genre: 'Рок', cover: oldCover };
        (apiJson.patch as any).mockResolvedValue({ data: null });
        await expect(editGroup(groupId, data)).rejects.toThrow('Ошибка при обновлении группы');
    });
});
