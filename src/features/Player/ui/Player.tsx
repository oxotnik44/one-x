import React, { useCallback, type FC } from 'react';
import { useThemeStore } from 'shared/config/theme/themeStore';
import { usePlayer } from '../model/usePlayer';
import { VolumeControl } from './VolumeControl';
import { likeTrack, useUserStore } from 'entities/User';
import { useTranslation } from 'react-i18next';
import { usePlayerStore } from 'entities/Player/model';
import { useSidebarStore } from 'widgets/Sidebar';
import { playerSize, sidebarSize } from 'shared/config/theme/global/variables';
import { ButtonTheme, Like, PlayButton, TrackControlButton, Text } from 'shared/ui';

export const Player: FC = React.memo(() => {
    const { t } = useTranslation('player');

    const theme = useThemeStore((state) => state.theme);
    const isCollapsed = useSidebarStore((state) => state.isCollapsed);
    const currentTrack = usePlayerStore((state) => state.currentTrack);
    const authData = useUserStore((state) => state.authData);

    const { progress, onSeek, onPrev, onNext, formattedCurrentTime, formattedDuration } =
        usePlayer();

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
                className="w-full h-1 rounded-t-3xl appearance-none bg-gray-700 range-hover-thumb"
                style={{
                    backgroundColor: '#4b5563',
                    backgroundImage: `linear-gradient(
      to right,
      ${buttonColor},
      ${buttonColor}
    )`,
                    backgroundSize: `${Math.max(progress)}% 100%`,
                    backgroundRepeat: 'no-repeat',
                    accentColor: buttonColor,
                }}
                aria-label={t('seek')}
            />

            <div className="flex items-center flex-1 mt-2 relative">
                {/* Обложка + информация */}
                <div className="flex items-center space-x-4 w-[192px] flex-shrink-0">
                    {currentTrack && (
                        <>
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                    src={currentTrack.cover || '/assets/default-cover.png'}
                                    alt={currentTrack.title || t('coverAlt')}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex flex-col justify-center overflow-hidden min-w-0">
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
                    <PlayButton theme={ButtonTheme.OUTLINE} trackForPlay={currentTrack} />

                    <TrackControlButton direction="next" onClick={onNext} ariaLabel={t('next')} />
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
