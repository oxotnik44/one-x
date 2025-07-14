import { type FC, memo, type ImgHTMLAttributes } from 'react';
import defaultAvatar from 'shared/assets/default-avatar.webp';

interface UserAvatarProps
    extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'width' | 'height'> {
    /** Источник изображения */
    src?: string;
    /** Alt текст */
    alt?: string;
    /** Размер в пикселях (ширина и высота) */
    size?: number;
}

const UserAvatarComponent: FC<UserAvatarProps> = ({
    src,
    alt = 'User Avatar',
    size = 40,
    className,
    ...rest
}) => {
    const imageSrc = src ?? defaultAvatar;

    return (
        <div
            style={{ width: size, height: size }}
            className={['rounded-full overflow-hidden border-2 border-pink-600 bg-white', className]
                .filter(Boolean)
                .join(' ')}
        >
            <img
                src={imageSrc}
                alt={alt}
                width={size}
                height={size}
                className="w-full h-full object-cover"
                {...rest}
            />
        </div>
    );
};

export const UserAvatar = memo(UserAvatarComponent);
UserAvatar.displayName = 'UserAvatar';
