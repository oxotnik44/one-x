// src/pages/MainPage.tsx
import { useGroupStore, type Group } from 'entities/Group';
import { Button } from 'shared/ui';
import { apiJson } from 'shared/api';
import { fetchTrackRecommendations } from 'entities/Track';

export const Main = () => {
    const setGroups = useGroupStore((state) => state.setGroups);

    const handleClick = async () => {
        try {
            // 1) Загружаем группы
            const { data: groups } = await apiJson.get<Group[]>('/groups');
            setGroups(groups);

            fetchTrackRecommendations();
        } catch (error) {
            console.error('Ошибка при загрузке данных', error);
        }
    };

    return (
        <div className="p-4">
            <Button onClick={handleClick} className="px-6 py-3 rounded-2xl shadow-md">
                Посмотреть рекомендации (консоль)
            </Button>
        </div>
    );
};
