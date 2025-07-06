import { memo } from 'react';
import clsx from 'clsx';
import { useThemeStore } from 'shared/config/theme/themeStore';

export type TextSize = 'small' | 'medium' | 'large' | 'default';

interface TextProps {
    title?: string;
    text?: string;
    className?: string;
    size?: TextSize;
    isLink?: boolean;
}

export const Text = memo(
    ({ title, text, className, size = 'default', isLink = false }: TextProps) => {
        const theme = useThemeStore((state) => state.theme);

        const sizeClassMap: Record<TextSize, string> = {
            small: 'text-sm',
            medium: 'text-base',
            large: 'text-xl',
            default: 'text-lg',
        };

        // Цвет для текста
        const baseColor = theme['--text-color'];

        const finalColor = isLink ? '#ff9a75' : baseColor;

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
                    <p className={titleClass} style={{ color: baseColor }}>
                        {title}
                    </p>
                )}
                {text && (
                    <p className={textClass} style={{ color: finalColor }}>
                        {text}
                    </p>
                )}
            </div>
        );
    },
);
