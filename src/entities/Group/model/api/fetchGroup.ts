import { api } from 'shared/api/api';
import type { Group } from '../types/group';
import toast from 'react-hot-toast';

export async function fetchGroup(userId: string): Promise<Group | null> {
    try {
        const { data: groups } = await api.get<Group[]>('/groups', { params: { userId } });
        if (groups.length === 0) return null;

        const group = groups[0];
        try {
            const coverResp = await fetch(
                `http://localhost:4001/groupCover/${encodeURIComponent(group.name)}`,
            );
            if (coverResp.ok) {
                const blob = await coverResp.blob();
                group.cover = URL.createObjectURL(blob);
            }
        } catch {
            toast.error('Не удалось получить иконку группы');
        }

        return group;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        toast.error('Ошибка при загрузке группы пользователя');
        return null;
    }
}
