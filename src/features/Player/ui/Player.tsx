import React, { useCallback, type FC } from 'react';
import { sidebarSize, playerSize } from 'shared/config/theme/global/variables';
import { useThemeStore } from 'shared/config/theme/themeStore';
import { useSidebarStore } from 'widgets/Sidebar/model/sidebarStore';
import { ButtonTheme } from 'shared/ui/Button/Button';
import { usePlayer } from '../model/usePlayer';
import { Text } from 'shared/ui/Text/Text';
import { usePlayerStore } from 'entities/Player/model';
import { Like } from 'shared/ui/Like/Like';
import { PlayButton } from 'shared/ui/PlayButton/PlayButton';
import { TrackControlButton } from 'shared/ui/TrackControlButton/TrackControlButton';
import { VolumeControl } from './VolumeControl';
import { useUserStore } from 'entities/User/model/slice/useUserStore';
import { likeTrack } from 'entities/User';
import { useTranslation } from 'react-i18next';

export const Player: FC = React.memo(() => {
    const { t } = useTranslation('player');

    const theme = useThemeStore((state) => state.theme);
    const isCollapsed = useSidebarStore((state) => state.isCollapsed);
    const currentTrack = usePlayerStore((state) => state.currentTrack);
    const authData = useUserStore((state) => state.authData);

    const {
        progress,
        isPlaying,
        togglePlay,
        onSeek,
        onPrev,
        formattedCurrentTime,
        formattedDuration,
    } = usePlayer({});

    const buttonColor = theme['--button-color'] || '#ec4899';
    const sidebarLeft = isCollapsed
        ? 'calc(var(--sidebar-width-collapsed) + 1.5rem)'
        : 'calc(var(--sidebar-width) + 1.5rem)';

    const liked = currentTrack ? Boolean(authData?.likedTracks?.includes(currentTrack.id)) : false;

    const toggleLike = useCallback(() => {
        if (!currentTrack) return;
        likeTrack(currentTrack.id);
    }, [currentTrack]);

    return (
        <div
            className="fixed z-40 flex flex-col rounded-3xl transition-all duration-300 ease-in-out px-6"
            style={{
                ...sidebarSize,
                ...playerSize,
                backgroundColor: theme['--bg-container'],
                height: 'var(--player-height)',
                left: sidebarLeft,
                right: '1.5rem',
                bottom: '1.5rem',
            }}
        >
            {/* Полоса прогресса */}
            <input
                type="range"
                min={0}
                max={100}
                value={Number.isFinite(progress) ? progress : 0}
                onChange={onSeek}
                className="w-full h-1 rounded-t-3xl appearance-none cursor-pointer bg-gray-700"
                style={{
                    background: `linear-gradient(
                        to right,
                        ${buttonColor} 0%,
                        ${buttonColor} ${Math.min(progress, 100)}%,
                        #4b5563 ${Math.min(progress, 100)}%,
                        #4b5563 100%
                    )`,
                    accentColor: buttonColor,
                }}
                aria-label={t('seek')}
            />

            <div className="flex items-center flex-1 mt-2 relative">
                {/* Обложка + информация */}
                <div className="w-[192px] flex-shrink-0 flex items-center">
                    {currentTrack && (
                        <>
                            <div className="w-12 h-12 rounded-lg overflow-hidden mr-4">
                                <img
                                    src={currentTrack.cover || '/assets/default-cover.png'}
                                    alt={currentTrack.title || t('coverAlt')}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex flex-col justify-center">
                                <Text className="text-sm font-semibold truncate">
                                    {currentTrack.title}
                                </Text>
                                <Text className="text-xs text-gray-400 truncate">
                                    {currentTrack.groupName ?? t('noAuthor')}
                                </Text>
                            </div>
                        </>
                    )}
                </div>

                {/* Управление треком */}
                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
                    {currentTrack && <Like liked={liked} onToggle={toggleLike} />}
                    <TrackControlButton direction="prev" onClick={onPrev} ariaLabel={t('prev')} />
                    <PlayButton
                        isPlaying={isPlaying}
                        isCurrent
                        onClick={togglePlay}
                        theme={ButtonTheme.OUTLINE}
                    />
                    <TrackControlButton direction="next" ariaLabel={t('next')} />
                </div>

                {/* Громкость и время */}
                <div className="flex items-center ml-auto space-x-2">
                    <VolumeControl />
                    <Text
                        text={`${formattedCurrentTime} / ${formattedDuration}`}
                        size="small"
                        className="text-white"
                    />
                </div>
            </div>
        </div>
    );
});

Player.displayName = 'Player';
