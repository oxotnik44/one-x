import { memo, type ReactNode } from 'react';
import { useThemeStore } from 'shared/config/theme/themeStore';
import { classNames } from 'shared/lib';

type TextSize = 'small' | 'medium' | 'large' | 'default';

interface TextProps {
    title?: string;
    text?: string;
    children?: ReactNode;
    className?: string;
    size?: TextSize;
    isLink?: boolean;
    isActive?: boolean;
    error?: boolean;
}

export const Text = memo(
    ({
        title,
        text,
        children,
        className = '',
        size = 'default',
        isLink = false,
        isActive = false,
        error = false,
    }: TextProps) => {
        const theme = useThemeStore((state) => state.theme);

        const sizeClassMap: Record<TextSize, string> = {
            small: 'text-sm',
            medium: 'text-base',
            large: 'text-xl',
            default: 'text-lg',
        };

        const hasText4xl = className.includes('text-4xl');
        const fontSizeClass = hasText4xl ? 'text-4xl' : sizeClassMap[size];

        const textColor = error
            ? theme['--primary-color']
            : isActive
              ? theme['--primary-color']
              : isLink
                ? '#ff9a75'
                : theme['--text-color'];

        const textClass = classNames(
            'font-semibold',
            fontSizeClass,
            isLink && 'underline cursor-pointer transition-colors duration-200 ease-in-out',
            className,
        );

        const titleClass = classNames('text-3xl font-bold mb-8 text-center', className);

        return (
            <div>
                {title && (
                    <p className={titleClass} style={{ color: theme['--text-color'] }}>
                        {title}
                    </p>
                )}
                {(text || children) && (
                    <p className={textClass} style={{ color: textColor }}>
                        {text ?? children}
                    </p>
                )}
            </div>
        );
    },
);

Text.displayName = 'Text';
