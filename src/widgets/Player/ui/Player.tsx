// src/widgets/Player/ui/Player.tsx
import { useRef, useState, type FC } from 'react';
import { sidebarSize, playerSize } from 'shared/config/theme/global/variables';
import { useThemeStore } from 'shared/config/theme/themeStore';
import { useSidebarStore } from 'widgets/Sidebar/model/sidebarStore';
import Logo from 'shared/assets/Logo.png';
import { Button, ButtonTheme, ButtonSize } from 'shared/ui/Button/Button';

import {
    FaHeart,
    FaStepBackward,
    FaPlay,
    FaPause,
    FaStepForward,
    FaVolumeUp,
    FaVolumeMute,
} from 'react-icons/fa';

import { usePlayer } from '../model/usePlayer';

export const Player: FC = () => {
    const theme = useThemeStore((state) => state.theme);
    const isCollapsed = useSidebarStore((state) => state.isCollapsed);
    const handlePrevTrack = () => {
        console.log('Переключение на предыдущий трек');
        // Тут должна быть логика переключения трека в плейлисте
    };
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const hideTimeout = useRef<NodeJS.Timeout | null>(null);

    const onVolumeMouseEnter = () => {
        if (hideTimeout.current) {
            clearTimeout(hideTimeout.current);
            hideTimeout.current = null;
        }
        setShowVolumeSlider(true);
    };

    const onVolumeMouseLeave = () => {
        hideTimeout.current = setTimeout(() => {
            setShowVolumeSlider(false);
        }, 500);
    };
    const {
        progress,
        isPlaying,
        volume,
        isMuted,
        togglePlay,
        onSeek,
        onVolumeChange,
        toggleMute,
        onPrev,
    } = usePlayer({ onPrevTrack: handlePrevTrack });

    const buttonColor = theme['--button-color'] || '#ec4899';
    const sidebarLeft = isCollapsed
        ? 'calc(var(--sidebar-width-collapsed) + 1.5rem)'
        : 'calc(var(--sidebar-width) + 1.5rem)';

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
            {/* Полоса перемотки */}
            <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={onSeek}
                className="w-full h-1 rounded-t-3xl appearance-none cursor-pointer bg-gray-700"
                style={{
                    background: `linear-gradient(
            to right,
            ${buttonColor} 0%,
            ${buttonColor} ${progress}%,
            #4b5563 ${progress}%,
            #4b5563 100%
        )`,
                    accentColor: buttonColor,
                }}
            />

            <div className="flex items-center flex-1 mt-2">
                {/* Левый блок: обложка + информация */}
                <div className="flex items-center flex-none">
                    <div className="w-12 h-12 rounded-lg overflow-hidden mr-4">
                        <img
                            src={Logo}
                            alt="Обложка трека"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col justify-center">
                        <span
                            className="text-sm font-semibold"
                            style={{ color: theme['--text-color'] }}
                        >
                            Название группы
                        </span>
                        <span className="text-xs text-gray-400">Название песни</span>
                    </div>
                </div>

                {/* Центральный блок: управление */}
                <div className="flex items-center mx-auto space-x-2">
                    <Button theme={ButtonTheme.CLEAR} size={ButtonSize.M} square>
                        <FaHeart
                            className="h-5 w-5 text-red-500"
                            style={{ color: theme['--inverted-heart-color'] }}
                        />
                    </Button>

                    <Button size={ButtonSize.M} square onClick={onPrev}>
                        <FaStepBackward className="h-5 w-5" />
                    </Button>
                    <Button size={ButtonSize.L} square onClick={togglePlay}>
                        {isPlaying ? (
                            <FaPause className="h-6 w-6" />
                        ) : (
                            <FaPlay className="h-6 w-6" />
                        )}
                    </Button>

                    <Button size={ButtonSize.M} square>
                        <FaStepForward className="h-5 w-5" />
                    </Button>
                </div>

                {/* Регулировка громкости */}
                <div
                    className="flex-none ml-4 relative flex items-center space-x-2"
                    onMouseEnter={onVolumeMouseEnter}
                    onMouseLeave={onVolumeMouseLeave}
                >
                    <Button
                        size={ButtonSize.M}
                        square
                        onClick={toggleMute}
                        aria-label={isMuted ? 'Включить звук' : 'Выключить звук'}
                    >
                        {isMuted || volume === 0 ? (
                            <FaVolumeMute className="h-5 w-5" />
                        ) : (
                            <FaVolumeUp className="h-5 w-5" />
                        )}
                    </Button>

                    {/* Вертикальный слайдер громкости, появляется при showVolumeSlider */}
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={volume}
                        onChange={onVolumeChange}
                        className={`absolute -top-16 left-7 -translate-x-1/2 w-24 h-6
            rotate-[-90deg] origin-center cursor-pointer rounded
            transition-opacity duration-300
            ${
                showVolumeSlider
                    ? 'opacity-100 pointer-events-auto'
                    : 'opacity-0 pointer-events-none'
            }
        `}
                        style={{
                            accentColor: theme['--button-color'] || '#ec4899',
                            border: `1px solid ${theme['--bg-container']}`,
                        }}
                        aria-label="Регулировка громкости"
                    />
                </div>
            </div>
        </div>
    );
};
