import React from 'react';
import { useTranslation } from 'react-i18next';
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
        const { t } = useTranslation('playButton'); // namespace player

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
                aria-label={isCurrent && isPlaying ? t('pause') : t('play')}
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
