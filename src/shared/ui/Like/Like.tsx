import React from 'react';
import { FaHeart } from 'react-icons/fa';
import { Button, ButtonSize, ButtonTheme } from 'shared/ui/Button/Button';
import { useTranslation } from 'react-i18next';

interface LikeProps {
    liked: boolean;
    onToggle: () => void;
    size?: ButtonSize;
    className?: string;
}

const PRIMARY_COLOR = '#880015';

const LikeComponent: React.FC<LikeProps> = ({
    liked,
    onToggle,
    size = ButtonSize.M,
    className,
}) => {
    const { t } = useTranslation('like'); // namespace like
    const color = liked ? PRIMARY_COLOR : 'white';

    return (
        <Button
            theme={ButtonTheme.CLEAR}
            size={size}
            square
            onClick={onToggle}
            className={className}
            aria-pressed={liked}
            aria-label={liked ? t('removeFromFavorites') : t('addToFavorites')}
        >
            <FaHeart className="h-5 w-5 transition-colors duration-300" style={{ color }} />
        </Button>
    );
};

export const Like = React.memo(LikeComponent);
