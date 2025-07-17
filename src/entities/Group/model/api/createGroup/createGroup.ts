import { useUserStore } from 'entities/User';
import { v4 as uuidv4 } from 'uuid';
import type { Group, Group as StoreGroup } from 'entities/Group/model/types/group';
import toast from 'react-hot-toast';
import { apiBase, apiJson } from 'shared/api';
import { useGroupStore } from '../../slice/useGroupStore';
import type { CreateGroupFormData } from 'features/CreateGroupForm';

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
            if (!groupData.icon?.[0]) {
                throw new Error('Иконка обязательна');
            }

            // 1. Проверка существования группы
            const { data: existingGroups } = await apiJson.get<Group[]>('/groups', {
                params: { name: groupData.name },
            });

            if (existingGroups.length > 0) {
                throw new Error('Группа с таким названием уже существует');
            }

            // 2. Загрузка иконки
            const formData = new FormData();
            formData.append('groupName', groupData.name);
            formData.append('icon', groupData.icon[0]);

            const uploadRes = await apiBase.post<UploadResponse>('/uploadGroupCover', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const iconUrl = uploadRes.data.url;

            // 3. Создание группы
            const id = uuidv4();
            const createdAt = new Date().toISOString();

            const payload: Group = {
                id,
                name: groupData.name,
                description: groupData.description ?? '',
                userId: user.id,
                genre: groupData.genre ?? 'Рок',
                cover: iconUrl,
                createdAt,
                updatedAt: '',
            };

            const { data: apiGroup } = await apiJson.post<Group>('/groups', payload);
            if (!apiGroup) throw new Error('Ошибка при создании группы');

            // 4. Обновление пользователя
            await apiJson.patch(`/users/${user.id}`, { id });

            // 5. Обновление состояния
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
