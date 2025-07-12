import { memo, type ReactNode } from 'react';
import clsx from 'clsx';
import { useThemeStore } from 'shared/config/theme/themeStore';

export type TextSize = 'small' | 'medium' | 'large' | 'default';

interface TextProps {
    title?: string;
    text?: string;
    children?: ReactNode; // добавляем
    className?: string;
    size?: TextSize;
    isLink?: boolean;
    isActive?: boolean;
}

export const Text = memo(
    ({
        title,
        text,
        children,
        className,
        size = 'default',
        isLink = false,
        isActive = false,
    }: TextProps) => {
        const theme = useThemeStore((state) => state.theme);

        const sizeClassMap: Record<TextSize, string> = {
            small: 'text-sm',
            medium: 'text-base',
            large: 'text-xl',
            default: 'text-lg',
        };

        const textColor = isActive
            ? theme['--primary-color']
            : isLink
              ? '#ff9a75'
              : theme['--text-color'];
        const textClass = clsx(
            'font-semibold',
            sizeClassMap[size],
            {
                'underline cursor-pointer transition-colors duration-200 ease-in-out': isLink,
            },
            className,
        );

        const titleClass = clsx('text-3xl font-bold mb-8 text-center', className);

        return (
            <div>
                {title && (
                    <p className={titleClass} style={{ color: theme['--text-color'] }}>
                        {title}
                    </p>
                )}
                {text && (
                    <p className={textClass} style={{ color: textColor }}>
                        {text}
                    </p>
                )}
                {children && (
                    <p className={textClass} style={{ color: textColor }}>
                        {children}
                    </p>
                )}
            </div>
        );
    },
);

Text.displayName = 'Text';
