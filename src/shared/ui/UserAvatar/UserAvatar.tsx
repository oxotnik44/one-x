import { type FC, memo, type ImgHTMLAttributes } from 'react';
import defaultAvatar from 'shared/assets/default-avatar.webp';
import { classNames } from 'shared/lib';

interface UserAvatarProps
    extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'width' | 'height'> {
    src?: string;
    alt?: string;
    size?: number;
}

const UserAvatarComponent: FC<UserAvatarProps> = ({
    src,
    alt = 'User Avatar',
    size = 40,
    className,
    ...rest
}) => (
    <div
        style={{ width: size, height: size }}
        className={classNames(
            'rounded-full overflow-hidden border-2 border-pink-600 bg-white',
            className,
        )}
    >
        <img
            src={src ?? defaultAvatar}
            alt={alt}
            width={size}
            height={size}
            className="w-full h-full object-cover"
            {...rest}
        />
    </div>
);

export const UserAvatar = memo(UserAvatarComponent);
UserAvatar.displayName = 'UserAvatar';
