import { useTrackStore } from 'entities/Track';
import { useGroupStore } from 'entities/Group';

export function getGenreByTrackId(trackId: string): string {
    const track = useTrackStore.getState().tracks.find((t) => t.id === trackId);
    if (!track) return '';
    const group = useGroupStore.getState().groups.find((g) => g.id === track.groupId);
    return group?.genre ?? '';
}
