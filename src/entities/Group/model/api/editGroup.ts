import { api } from 'shared/api/api';
import toast from 'react-hot-toast';
import { useGroupStore } from 'entities/Group/model/slice/useGroupStore';
import type { Group, Genre } from 'entities/Group/model/types/group';
import { SERVER_BASE_URL } from 'shared/const/localstorage';
import axios from 'axios';

interface UploadResponse {
    url: string;
}

export interface EditGroupData {
    name: string;
    description?: string | null;
    genre: Genre;
    cover: string;
    newIconFile?: FileList;
}

export const editGroup = async (
    groupId: string,
    groupData: EditGroupData,
): Promise<Group | null> => {
    if (!groupId) throw new Error('ID группы не указан');

    return toast.promise(
        (async () => {
            let coverUrl = groupData.cover;
            if (groupData.newIconFile?.[0]) {
                const formData = new FormData();
                formData.append('groupName', groupData.name);
                formData.append('icon', groupData.newIconFile[0]);

                const { data } = await axios.post<UploadResponse>(
                    `${SERVER_BASE_URL}/uploadGroupCover`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    },
                );

                coverUrl = data.url;
            }

            const payload: Partial<Group> = {
                name: groupData.name,
                description: groupData.description ?? null,
                genre: groupData.genre,
                cover: `${SERVER_BASE_URL}${coverUrl}`,
                updatedAt: new Date().toISOString(),
            };

            const { data: updatedGroup } = await api.patch<Group>(`/groups/${groupId}`, payload);

            if (!updatedGroup) throw new Error('Ошибка при обновлении группы');

            useGroupStore.getState().setCurrentGroup(updatedGroup);

            return updatedGroup;
        })(),
        {
            loading: 'Сохраняем изменения...',
            success: 'Группа успешно обновлена',
            error: (err: unknown) =>
                err instanceof Error ? err.message : 'Ошибка при обновлении группы',
        },
    );
};
