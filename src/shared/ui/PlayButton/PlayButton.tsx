import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonSize, ButtonTheme } from 'shared/ui/Button/Button';
import { FaPlay, FaPause } from 'react-icons/fa';
import { useTrackStore, type Track } from 'entities/Track';
import { usePlayerStore } from 'entities/Player/model';
import { useAlbumStore, type Album } from 'entities/Album';
import { useGroupStore } from 'entities/Group';
import toast from 'react-hot-toast';
import { fetchTrack } from 'entities/Track/model/api/fetchTrack/fetchTrack';

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
        recommendation,
    } = props;
    const { t } = useTranslation('playButton');

    const tracks = useTrackStore((s) => s.tracks);

    const togglePlay = usePlayerStore((s) => s.togglePlay);
    const setCurrentTrack = usePlayerStore((s) => s.setCurrentTrack);
    const currentTrack = usePlayerStore((s) => s.currentTrack);
    const isPlaying = usePlayerStore((s) => s.isPlaying);
    const currentAlbum = useAlbumStore((a) => a.currentAlbum);
    const isCurrentAlbum = currentAlbum?.id === albumForPlay?.id;
    const isCurrentTrack = currentTrack?.id === trackForPlay?.id;
    const currentGroup = useGroupStore((g) => g.currentGroup);
    const setCurrentAlbum = useAlbumStore((a) => a.setCurrentAlbum);

    const playTrack = async () => {
        if (recommendation) {
        }
        if (albumForPlay) {
            // Приоритет: альбом
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
                        togglePlay();
                    } catch (err) {
                        toast.error(
                            err instanceof Error ? err.message : 'Ошибка при загрузке альбома',
                        );
                        return;
                    }
                }
                togglePlay();
                return;
            }
            // Если тот же альбом
            const hasCurrent = albumForPlay.trackIds.includes(currentTrack?.id ?? '');
            if (!hasCurrent) {
                const first = tracks?.[0];
                if (first) {
                    setCurrentTrack(first);
                    togglePlay();
                }
            }
            togglePlay();
        }

        // Отдельная дорожка
        if (trackForPlay) {
            if (!isCurrentTrack) {
                setCurrentTrack(trackForPlay);
                togglePlay();
            }
            // если трек уже текущий — переключаем воспроизведение
            togglePlay();
        }
    };

    // Проверяем, играет ли сейчас трек из этого альбома
    const hasCurrentInAlbum = albumForPlay
        ? albumForPlay.trackIds.includes(currentTrack?.id ?? '')
        : false;

    // Выбираем иконку:
    // — для альбома: pause, только если isPlaying и трек действительно внутри него
    // — для трека: pause, если это тот же трек и он играет
    const Icon = albumForPlay
        ? isPlaying && hasCurrentInAlbum
            ? FaPause
            : FaPlay
        : isPlaying && isCurrentTrack
          ? FaPause
          : FaPlay;

    const ariaLabel =
        isPlaying && (albumForPlay ? hasCurrentInAlbum : isCurrentTrack) ? t('pause') : t('play');
    return (
        <Button
            size={ButtonSize.L}
            square
            onClick={playTrack}
            theme={theme}
            className={`${showOnHover ? 'opacity-0 hover:opacity-100' : 'opacity-100'} transition-opacity ${className}`}
            aria-label={ariaLabel}
        >
            <Icon className="h-6 w-6 text-white" />
        </Button>
    );
});

PlayButton.displayName = 'PlayButton';
