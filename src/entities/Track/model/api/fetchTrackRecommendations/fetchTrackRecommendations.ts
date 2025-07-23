import { apiBase, apiJson } from 'shared/api/api';
import type { Group } from 'entities/Group/model/types/group';
import type { Track } from 'entities/Track/model/types/track';
import { getRandomInt, getRecommendedGenre } from 'shared/lib/recomendation/recommendations';
import { useTrackStore } from 'entities/Track';
import { usePlayerStore } from 'entities/Player/model';

export async function fetchTrackRecommendations(): Promise<void> {
    const genre = getRecommendedGenre();
    if (!genre) return;

    try {
        const { data: groups } = await apiJson.get<Group[]>('/groups', {
            params: { genre },
        });
        if (!groups.length) return;

        const allTracks: Track[] = [];
        for (const group of groups) {
            const { data: tracks } = await apiJson.get<Track[]>('/tracks', {
                params: { groupId: group.id },
            });
            if (Array.isArray(tracks) && tracks.length > 0) {
                allTracks.push(
                    ...tracks.map((t) => ({
                        ...t,
                        groupName: group.name,
                        groupId: group.id,
                    })),
                );
            }
        }

        if (!allTracks.length) return;

        const randomIndex = getRandomInt(0, allTracks.length - 1);
        const track = allTracks[randomIndex];

        let albumName: string | undefined;

        if (track.albumId && track.groupId) {
            const { data: albums } = await apiJson.get<{ id: string; name: string }[]>('/albums', {
                params: { groupId: track.groupId },
            });

            const foundAlbum = albums.find((a) => a.id === track.albumId);
            if (foundAlbum) {
                albumName = foundAlbum.name;
            }
        }

        const queryParams = albumName ? `?albumName=${encodeURIComponent(albumName)}` : '';

        const { data: info } = await apiBase.get<{
            coverUrl: string | null;
            audioUrl: string | null;
        }>(
            `/trackInfo/${encodeURIComponent(track.groupName!)}/${encodeURIComponent(track.title)}${queryParams}`,
        );

        if (!info.audioUrl || !info.coverUrl) return;

        const fullTrack: Track = {
            ...track,
            cover: info.coverUrl,
            audioUrl: info.audioUrl,
        };
        console.log(
            `[Рекомендации] Загружаем трек: "${track.title}" — ${track.groupName}${albumName ? ` (альбом: ${albumName})` : ''}`,
        );

        usePlayerStore.getState().setCurrentTrack(fullTrack);

        const existing = useTrackStore.getState().tracks;
        const alreadyExists = existing?.some((t) => t.id === fullTrack.id);
        if (!alreadyExists) {
            useTrackStore.getState().setTracks([...existing, fullTrack]);
        }
    } catch (err) {
        console.error('Ошибка при загрузке рекомендаций:', err);
    }
}
