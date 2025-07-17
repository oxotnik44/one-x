import React, { useRef, useState, memo, useCallback } from 'react';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { useThemeStore } from 'shared/config/theme/themeStore';
import { useTranslation } from 'react-i18next';
import { usePlayerStore } from 'entities/Player/model';
import { Button, ButtonSize } from 'shared/ui';

export const VolumeControl = memo(() => {
    const { t } = useTranslation('volumeControl');

    const volume = usePlayerStore((s) => s.volume);
    const isMuted = usePlayerStore((s) => s.isMuted);
    const audio = usePlayerStore((s) => s.audio);
    const setVolume = usePlayerStore((s) => s.setVolume);
    const setIsMuted = usePlayerStore((s) => s.setIsMuted);

    const theme = useThemeStore((s) => s.theme);

    const [showSlider, setShowSlider] = useState(false);
    const hideTimeout = useRef<NodeJS.Timeout | null>(null);

    const toggleMute = useCallback(() => {
        const nextMuted = !isMuted;
        setIsMuted(nextMuted);
        if (audio) {
            audio.volume = nextMuted ? 0 : volume;
        }
    }, [isMuted, setIsMuted, audio, volume]);

    const onVolumeChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newVolume = Number(e.target.value);
            setVolume(newVolume);
            setIsMuted(newVolume === 0);
            if (audio) {
                audio.volume = newVolume;
            }
        },
        [setVolume, setIsMuted, audio],
    );

    const handleMouseEnter = useCallback(() => {
        if (hideTimeout.current) clearTimeout(hideTimeout.current);
        setShowSlider(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        hideTimeout.current = setTimeout(() => setShowSlider(false), 500);
    }, []);

    return (
        <div
            className="flex-none ml-auto relative flex items-center space-x-2"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Button
                size={ButtonSize.M}
                square
                onClick={toggleMute}
                aria-label={isMuted ? t('unmute') : t('mute')}
            >
                {isMuted || volume === 0 ? (
                    <FaVolumeMute className="h-5 w-5" />
                ) : (
                    <FaVolumeUp className="h-5 w-5" />
                )}
            </Button>
            <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={onVolumeChange}
                className={`absolute -top-16 left-4 -translate-x-1/2 w-24 h-6
                    rotate-[-90deg] origin-center cursor-pointer rounded
                    transition-opacity duration-300
                    ${showSlider ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                `}
                style={{
                    accentColor: theme['--button-color'],
                    border: `1px solid ${theme['--bg-container']}`,
                }}
                aria-label={t('volumeControl')}
            />
        </div>
    );
});

VolumeControl.displayName = 'VolumeControl';
