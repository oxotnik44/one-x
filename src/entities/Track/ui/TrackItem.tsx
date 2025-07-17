import React, { useCallback } from 'react';
import { likeTrack, useUserStore } from 'entities/User';
import type { Track } from '../model/types/track';
import { usePlayerStore } from 'entities/Player/model';
import { ButtonTheme, Like, PlayButton, Text } from 'shared/ui';

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
            className="flex w-full max-w-full items-center border rounded overflow-hidden"
            style={{ backgroundColor: 'var(--bg-container)' }}
        >
            <div className="relative w-20 h-20 flex-shrink-0">
                <img
                    loading="lazy"
                    width={80}
                    height={80}
                    src={track.cover}
                    alt={track.title}
                    className=" object-cover rounded-tr-lg rounded-br-lg"
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
