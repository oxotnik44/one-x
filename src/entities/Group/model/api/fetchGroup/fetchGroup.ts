// src/entities/Group/model/api/fetchGroup.ts
import { apiJson, apiBase } from 'shared/api/api';
import type { Group } from 'entities/Group/model/types/group';
import toast from 'react-hot-toast';

export async function fetchGroup(userId: string): Promise<Group | null> {
    try {
        const { data: groups } = await apiJson.get<Group[]>('/groups', {
            params: { userId },
        });
        if (!Array.isArray(groups) || groups.length === 0) {
            return null;
        }

        const group = { ...groups[0] };

        try {
            // теперь используем apiBase для получения cover
            const { data } = await apiBase.get<{ coverUrl: string }>(
                `/groupCover/${encodeURIComponent(group.name)}`,
            );
            group.cover = data.coverUrl;
        } catch (err) {
            toast.error('Не удалось получить иконку группы');
            console.error('Cover load error:', err);
        }

        return group;
    } catch (err) {
        toast.error('Ошибка при загрузке группы пользователя');
        console.error('Group fetch error:', err);
        return null;
    }
}
