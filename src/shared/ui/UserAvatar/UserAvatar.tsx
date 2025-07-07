import type { FC } from 'react';
import defaultAvatar from 'shared/assets/default-avatar.png';

interface UserAvatarProps {
    src?: string;
    alt?: string;
    size?: number;
}

export const UserAvatar: FC<UserAvatarProps> = ({ src, alt = 'User Avatar', size = 40 }) => {
    const imageSrc = src ?? defaultAvatar;

    return (
        <img
            src={imageSrc}
            alt={alt}
            width={size}
            height={size}
            className="rounded-full object-cover"
        />
    );
};
