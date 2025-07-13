import React from 'react';
import { Button, ButtonSize, ButtonTheme } from 'shared/ui/Button/Button';
import { FaStepBackward, FaStepForward } from 'react-icons/fa';

export type TrackDirection = 'prev' | 'next';

interface TrackControlButtonProps {
    direction: TrackDirection;
    onClick?: () => void;
    theme?: ButtonTheme;
    className?: string;
    ariaLabel?: string;
}

export const TrackControlButton = React.memo(
    ({
        direction,
        onClick,
        theme = ButtonTheme.OUTLINE,
        className = '',
        ariaLabel,
    }: TrackControlButtonProps) => {
        const icon =
            direction === 'prev' ? (
                <FaStepBackward className="h-5 w-5" />
            ) : (
                <FaStepForward className="h-5 w-5" />
            );

        return (
            <Button
                size={ButtonSize.M}
                square
                theme={theme}
                {...(onClick ? { onClick } : {})} // передаем onClick только если он есть
                className={className}
                aria-label={ariaLabel}
            >
                {icon}
            </Button>
        );
    },
);

TrackControlButton.displayName = 'TrackControlButton';
