import { apiBase, apiJson } from 'shared/api/api';
import type { Track } from '../../types/track';
import { useTrackStore } from '../../slice/useTrackStore';

interface MediaTrack {
    trackName: string;
    coverUrl: string | null;
    audioUrl: string | null;
}

interface AlbumTracksResponse {
    albumName: string;
    coverUrl: string | null;
    tracks: {
        trackName: string;
        audioUrl: string;
    }[];
}

export async function fetchTrack(
    groupId: string,
    groupName: string,
    albumId?: string,
    albumName?: string,
): Promise<Track[]> {
    try {
        const [mainResp, mediaResp] = await Promise.all([
            apiJson.get<Track[]>('/tracks', {
                params: { groupId, albumId: albumId && albumName ? albumId : undefined },
            }),
            albumId && albumName
                ? apiBase.get<AlbumTracksResponse>(
                      `/album-tracks/${encodeURIComponent(groupName)}/${encodeURIComponent(albumName)}`,
                  )
                : apiBase.get<MediaTrack[]>(`/tracks/${encodeURIComponent(groupName)}`),
        ]);

        const main = mainResp.data;
        if (!Array.isArray(main)) {
            useTrackStore.getState().setTracks([]);
            return [];
        }

        let media: MediaTrack[] = [];

        if (albumId && albumName) {
            const albumData = mediaResp.data as AlbumTracksResponse;
            const coverUrl = albumData.coverUrl ?? '';
            media = albumData.tracks.map((t) => ({
                trackName: t.trackName,
                audioUrl: t.audioUrl,
                coverUrl,
            }));
        } else {
            media = mediaResp.data as MediaTrack[];
        }

        const merged: Track[] = main
            .map((t) => {
                const m = media.find((m) => m.trackName === t.id || m.trackName === t.title);
                return {
                    ...t,
                    cover: m?.coverUrl ?? '',
                    audioUrl: m?.audioUrl ?? '',
                    groupName,
                };
            })
            .filter((t) =>
                albumId && albumName ? t.albumId === albumId : !t.albumId || t.albumId === '',
            );

        useTrackStore.getState().setTracks(merged);
        return merged;
    } catch (error: unknown) {
        console.error('Ошибка при загрузке треков с медиа', error);
        useTrackStore.getState().setTracks([]);
        return [];
    }
}
