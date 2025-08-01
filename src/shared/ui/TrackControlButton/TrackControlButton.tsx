import { memo } from 'react';
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

export const TrackControlButton = memo(
    ({
        direction,
        onClick,
        theme = ButtonTheme.OUTLINE,
        className,
        ariaLabel,
    }: TrackControlButtonProps) => (
        <Button
            size={ButtonSize.M}
            square
            theme={theme}
            onClick={onClick}
            className={className}
            aria-label={ariaLabel}
        >
            {direction === 'prev' ? (
                <FaStepBackward className="h-5 w-5" />
            ) : (
                <FaStepForward className="h-5 w-5" />
            )}
        </Button>
    ),
);

TrackControlButton.displayName = 'TrackControlButton';
