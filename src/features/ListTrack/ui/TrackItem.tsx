import React, { useCallback } from 'react';
import { Like } from 'shared/ui/Like/Like';
import { Text } from 'shared/ui/Text/Text';
import { ButtonTheme } from 'shared/ui/Button/Button';
import type { Track } from 'entities/Track/model/types/track';
import { PlayButton } from 'shared/ui/PlayButton/PlayButton';
import { usePlayerStore } from 'entities/Player/model/slice/usePlayerStore';
import { useUserStore } from 'entities/User/model/slice/useUserStore';
import { likeTrack } from 'entities/User';

interface TrackItemProps {
    track: Track;
    groupName: string;
}

export const TrackItem: React.FC<TrackItemProps> = React.memo(({ track, groupName }) => {
    const currentTrackId = usePlayerStore((s) => s.currentTrack?.id);
    const isPlayingGlobal = usePlayerStore((s) => s.isPlaying);
    const togglePlay = usePlayerStore((s) => s.togglePlay);
    const setCurrentTrack = usePlayerStore((s) => s.setCurrentTrack);

    const authData = useUserStore((s) => s.authData);

    const isCurrent = currentTrackId === track.id;
    const isPlaying = isCurrent && isPlayingGlobal;

    const onPlayClick = useCallback(() => {
        if (!isCurrent) {
            setCurrentTrack(track);
        } else {
            togglePlay();
        }
    }, [isCurrent, setCurrentTrack, track, togglePlay]);

    const formatDuration = useCallback((sec: number) => {
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60)
            .toString()
            .padStart(2, '0');
        return `${m}:${s}`;
    }, []);

    // Лайкнут ли текущий трек
    const liked = Boolean(authData?.likedTracks?.includes(track.id));

    // Обработчик переключения лайка
    const toggleLike = useCallback(() => {
        likeTrack(track.id);
        // Здесь можно добавить обновление стора или другой эффект
    }, [track.id]);

    return (
        <div
            className="flex w-full items-center border rounded overflow-hidden"
            style={{ backgroundColor: 'var(--bg-container)' }}
        >
            <div className="relative w-20 h-20 flex-shrink-0">
                <img
                    src={track.cover}
                    alt={track.title}
                    className="w-full h-full object-cover rounded-tr-lg rounded-br-lg"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-colors flex items-center justify-center rounded-tr-lg rounded-br-lg">
                    <PlayButton
                        isPlaying={isPlaying}
                        isCurrent={isCurrent}
                        onClick={onPlayClick}
                        theme={ButtonTheme.CLEAR}
                        showOnHover
                    />
                </div>
            </div>

            <div className="flex flex-col justify-center flex-grow px-4 overflow-hidden">
                <Text size="medium" className="truncate">
                    {groupName}
                </Text>
                <Text size="medium" className="truncate font-semibold">
                    {track.title}
                </Text>
            </div>

            <div className="flex flex-col items-center justify-center px-4 space-y-1 min-w-[60px]">
                <Like liked={liked} onToggle={toggleLike} />
                <span className="text-xs text-gray-500 select-none">
                    {formatDuration(track.duration)}
                </span>
            </div>
        </div>
    );
});

TrackItem.displayName = 'TrackItem';
