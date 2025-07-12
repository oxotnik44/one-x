import { api } from 'shared/api/api';
import toast from 'react-hot-toast';
import { useUserStore } from 'entities/User/model/slice/useUserStore';
import { useGroupStore } from 'entities/Group/model/slice/useGroupStore';
import type { CreateGroupFormData } from 'features/CreateGroup/model/types/types';
import type { Group as StoreGroup } from 'entities/Group/model/types/group';
import { v4 as uuidv4 } from 'uuid';
import type { Group } from '../types/group';

interface UploadResponse {
    url: string;
}

export const createGroup = async (groupData: CreateGroupFormData): Promise<StoreGroup | null> => {
    const user = useUserStore.getState().authData;
    if (!user) {
        throw new Error('Пользователь не авторизован');
    }

    return await toast.promise(
        (async () => {
            const existing = await api.get<Group[]>('/groups', {
                params: { name: groupData.name },
            });
            if (existing.data.length) throw new Error('Группа с таким названием уже существует');
            if (!groupData.icon?.[0]) throw new Error('Иконка обязательна');

            const formData = new FormData();
            formData.append('groupName', groupData.name);
            formData.append('icon', groupData.icon[0]);

            const uploadResp = await fetch('http://localhost:4001/uploadGroupCover', {
                method: 'POST',
                body: formData,
            });
            if (!uploadResp.ok) throw new Error('Ошибка при загрузке иконки');
            const { url: iconUrl } = (await uploadResp.json()) as UploadResponse;

            const id = uuidv4();
            const createdAt = new Date().toISOString();

            const payload: Group = {
                id,
                description: groupData.description ?? '',
                name: groupData.name,
                userId: user.id,
                genre: groupData.genre ?? 'Рок',
                cover: iconUrl,
                createdAt,
                updatedAt: '',
            };

            const { data: apiGroup } = await api.post<Group>('/groups', payload);
            if (!apiGroup) throw new Error('Ошибка при создании группы');

            await api.patch(`/users/${user.id}`, { id });

            const storeGroup: StoreGroup = {
                id: uuidv4(),
                name: apiGroup.name,
                description: apiGroup.description ?? '',
                cover: apiGroup.cover,
                userId: apiGroup.userId,
                genre: apiGroup.genre,
                createdAt: apiGroup.createdAt,
                updatedAt: '',
            };

            useGroupStore.getState().setCurrentGroup(storeGroup);
            return storeGroup;
        })(),
        {
            loading: 'Создание группы...',
            success: 'Группа успешно создана',
            error: (err: unknown) =>
                err instanceof Error ? err.message : 'Ошибка при создании группы',
        },
    );
};
