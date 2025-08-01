// src/features/recommendations/fetchTrackRecommendations.ts

import { apiBase, apiJson } from 'shared/api/api';
import { getRecommendedGenre } from 'shared/lib/recomendation/recommendations';
import { useTrackStore, type Track } from 'entities/Track';
import { usePlayerStore } from 'entities/Player/model';
import { useGroupStore } from 'entities/Group';

const shuffle = <T>(arr: T[]): T[] => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

interface TrackInfo {
    coverUrl: string | null;
    audioUrl: string | null;
}

export async function fetchTrackRecommendations(): Promise<void> {
    const genre = getRecommendedGenre();
    if (!genre) return;

    const groups = useGroupStore.getState().groups?.filter((g) => g.genre === genre) ?? [];
    if (!groups.length) return;

    try {
        // Собираем и перемешиваем все треки из отфильтрованных групп
        const all = (
            await Promise.all(
                groups.map((g) =>
                    apiJson
                        .get<Track[]>('/tracks', { params: { groupId: g.id } })
                        .then((r) => (r.data ?? []).map((t) => ({ ...t, groupName: g.name }))),
                ),
            )
        ).flat();
        if (!all.length) return;

        const recommended = shuffle(all);

        // Кладём весь массив рандомизированных треков в глобальный стор
        const trackStore = useTrackStore.getState();
        trackStore.setTracks(recommended);

        // Берём первый трек и загружаем его в плеер
        const first = recommended[0];
        const player = usePlayerStore.getState();

        // Опционально: получаем имя альбома
        const albums = first.albumId
            ? (
                  await apiJson.get<{ id: string; name: string }[]>('/albums', {
                      params: { groupId: first.groupId },
                  })
              ).data
            : [];
        const albumName = albums.find((a) => a.id === first.albumId)?.name;

        // Запрашиваем media-данные
        const { data: info } = await apiBase.get<TrackInfo>(
            `/trackInfo/${encodeURIComponent(first.groupName)}/${encodeURIComponent(first.title)}`,
            albumName ? { params: { albumName } } : {},
        );
        if (!info.audioUrl || !info.coverUrl) return;

        const fullTrack: Track = {
            ...first,
            audioUrl: info.audioUrl,
            cover: info.coverUrl,
        };
        player.setCurrentTrack(fullTrack);
    } catch (e) {
        console.error('Ошибка при загрузке рекомендаций:', e);
    }
}
