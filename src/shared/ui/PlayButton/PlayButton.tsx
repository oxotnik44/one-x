import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonSize, ButtonTheme } from 'shared/ui/Button/Button';
import { FaPlay, FaPause } from 'react-icons/fa';
import { fetchTrack, fetchTrackRecommendations } from 'entities/Track';
import { useTrackStore, type Track } from 'entities/Track';
import { usePlayerStore } from 'entities/Player/model';
import { useAlbumStore, type Album } from 'entities/Album';
import { useGroupStore, type Group } from 'entities/Group';
import toast from 'react-hot-toast';
import { apiJson } from 'shared/api';

interface PlayButtonProps {
    albumForPlay?: Album;
    className?: string;
    theme: ButtonTheme;
    showOnHover?: boolean;
    trackForPlay?: Track | null;
    recommendation?: boolean;
}

export const PlayButton = React.memo((props: PlayButtonProps) => {
    const {
        albumForPlay,
        className = '',
        theme,
        showOnHover = false,
        trackForPlay,
        recommendation = false,
    } = props;
    const { t } = useTranslation('playButton');

    const tracks = useTrackStore((s) => s.tracks);

    const togglePlay = usePlayerStore((s) => s.togglePlay);
    const setCurrentTrack = usePlayerStore((s) => s.setCurrentTrack);
    const currentTrack = usePlayerStore((s) => s.currentTrack);
    const isPlaying = usePlayerStore((s) => s.isPlaying);
    const isRecommendation = usePlayerStore((s) => s.isRecommendation);
    const setIsRecommendation = usePlayerStore((s) => s.setIsRecommendation);

    const currentAlbum = useAlbumStore((a) => a.currentAlbum);
    const currentGroup = useGroupStore((g) => g.currentGroup);
    const setCurrentAlbum = useAlbumStore((a) => a.setCurrentAlbum);
    const setGroups = useGroupStore((s) => s.setGroups);

    const isCurrentAlbum = albumForPlay?.id === currentAlbum?.id;
    const isCurrentTrack = trackForPlay?.id === currentTrack?.id;
    const hasCurrentInAlbum = albumForPlay
        ? albumForPlay.trackIds.includes(currentTrack?.id ?? '')
        : false;

    const playTrack = async () => {
        // 1. Рекомендации
        if (recommendation) {
            if (isRecommendation) {
                togglePlay();
            } else {
                setIsRecommendation(true);
                try {
                    const { data: groups } = await apiJson.get<Group[]>('/groups');
                    setGroups(groups);
                    await fetchTrackRecommendations();
                } catch (err) {
                    console.error(err);
                    toast.error('Не удалось загрузить рекомендации');
                }
            }
            return;
        }

        // 3. Логика для альбома
        if (albumForPlay) {
            if (isRecommendation) {
                const first = tracks[0];
                if (first) {
                    setCurrentTrack(first);
                } else {
                    if (currentGroup) {
                        try {
                            await fetchTrack(
                                currentGroup.id,
                                currentGroup.name,
                                albumForPlay.id,
                                albumForPlay.name,
                            );
                            const first = useTrackStore.getState().tracks?.[0];
                            if (first) setCurrentTrack(first);
                        } catch (err) {
                            toast.error(
                                err instanceof Error ? err.message : 'Ошибка при загрузке альбома',
                            );
                            return;
                        }
                    }
                }
                setIsRecommendation(false);
                return;
            }

            if (!isCurrentAlbum) {
                setCurrentAlbum(albumForPlay);
                if (currentGroup) {
                    try {
                        await fetchTrack(
                            currentGroup.id,
                            currentGroup.name,
                            albumForPlay.id,
                            albumForPlay.name,
                        );
                        const first = useTrackStore.getState().tracks?.[0];
                        if (first) setCurrentTrack(first);
                    } catch (err) {
                        toast.error(
                            err instanceof Error ? err.message : 'Ошибка при загрузке альбома',
                        );
                        return;
                    }
                }
            } else if (!hasCurrentInAlbum) {
                // остаёмся в том же альбоме, но текущий трек не в нём
                const first = tracks[0];
                if (first) setCurrentTrack(first);
            } else {
                togglePlay();
            }
            return;
        }

        // 4. Логика для отдельного трека
        if (trackForPlay) {
            if (!isCurrentTrack) {
                setCurrentTrack(trackForPlay);
            }
            togglePlay();
        }
    };

    // Иконка
    let Icon: React.ComponentType<{ className?: string }>;
    if (recommendation) {
        Icon = isRecommendation && isPlaying ? FaPause : FaPlay;
    } else if (albumForPlay) {
        if (isRecommendation) {
            Icon = FaPlay;
        } else {
            Icon = isPlaying && hasCurrentInAlbum ? FaPause : FaPlay;
        }
    } else {
        Icon = isPlaying && isCurrentTrack ? FaPause : FaPlay;
    }

    // aria-label
    const isActive = recommendation
        ? isRecommendation && isPlaying
        : albumForPlay
          ? !isRecommendation && isPlaying && hasCurrentInAlbum
          : isPlaying && isCurrentTrack;
    const ariaLabel = isActive ? t('pause') : t('play');

    return (
        <Button
            size={ButtonSize.L}
            square
            onClick={playTrack}
            theme={theme}
            className={`transition-opacity ${
                showOnHover ? 'opacity-0 hover:opacity-100' : 'opacity-100'
            } ${className}`}
            aria-label={ariaLabel}
        >
            <Icon className="h-6 w-6 text-white" />
        </Button>
    );
});

PlayButton.displayName = 'PlayButton';
