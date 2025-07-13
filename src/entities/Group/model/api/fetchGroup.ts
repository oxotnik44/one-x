import { api } from 'shared/api/api';
import type { Group } from '../types/group';
import toast from 'react-hot-toast';
import { SERVER_BASE_URL } from 'shared/const/localstorage';

export async function fetchGroup(userId: string): Promise<Group | null> {
    try {
        const { data: groups } = await api.get<Group[]>('/groups', { params: { userId } });
        if (groups.length === 0) return null;

        const group = groups[0];

        try {
            const coverResp = await fetch(
                `${SERVER_BASE_URL}/groupCover/${encodeURIComponent(group.name)}`,
            );
            if (coverResp.ok) {
                group.cover = `${SERVER_BASE_URL}/groupCover/${encodeURIComponent(group.name)}`;
            }
        } catch {
            toast.error('Не удалось получить иконку группы');
        }
        return group;
    } catch (error) {
        toast.error('Ошибка при загрузке группы пользователя');
        console.log(error);
        return null;
    }
}
