import { api } from 'shared/api/api';
import type { Group } from '../types/group';
import toast from 'react-hot-toast';
import { SERVER_BASE_URL } from 'shared/const/localstorage';

export async function fetchGroup(userId: string): Promise<Group | null> {
    try {
        const response = await api.get<Group[]>('/groups', { params: { userId } });
        const groups = response.data;
        if (!groups || groups.length === 0) return null;

        const group = { ...groups[0] }; // копируем, чтобы избежать мутаций оригинала

        try {
            const coverResp = await fetch(
                `${SERVER_BASE_URL}/groupCover/${encodeURIComponent(group.name)}`,
            );

            if (coverResp.ok) {
                group.cover = `${SERVER_BASE_URL}/groupCover/${encodeURIComponent(group.name)}`;
            }
        } catch (fetchError) {
            toast.error('Не удалось получить иконку группы');
            console.error('Ошибка при загрузке cover:', fetchError);
        }

        return group;
    } catch (error) {
        toast.error('Ошибка при загрузке группы пользователя');
        console.error('Ошибка при загрузке группы:', error);
        return null;
    }
}
