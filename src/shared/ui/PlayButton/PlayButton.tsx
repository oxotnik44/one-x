import React from 'react';
import { Button, ButtonSize, ButtonTheme } from 'shared/ui/Button/Button';
import { FaPlay, FaPause } from 'react-icons/fa';

interface PlayButtonProps {
    isPlaying: boolean;
    isCurrent: boolean;
    onClick: () => void;
    className?: string;
    theme: ButtonTheme;
    showOnHover?: boolean;
}

export const PlayButton = React.memo(
    ({
        isPlaying,
        isCurrent,
        onClick,
        className = '',
        theme,
        showOnHover = false,
    }: PlayButtonProps) => {
        return (
            <Button
                size={ButtonSize.L}
                square
                onClick={onClick}
                theme={theme}
                className={`
                ${showOnHover ? 'opacity-0 hover:opacity-100' : 'opacity-100'}
                transition-opacity ${className}
            `}
                aria-label={isCurrent && isPlaying ? 'Пауза' : 'Воспроизвести'}
            >
                {isCurrent && isPlaying ? (
                    <FaPause className="h-6 w-6 text-white" />
                ) : (
                    <FaPlay className="h-6 w-6 text-white" />
                )}
            </Button>
        );
    },
);
PlayButton.displayName = 'PlayButton';
