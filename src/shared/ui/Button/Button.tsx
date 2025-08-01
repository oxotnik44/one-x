// src/shared/ui/Button.tsx
import { memo, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { classNames } from 'shared/lib/classNames/classNames';
import { useThemeStore } from 'shared/config/theme/themeStore';

export enum ButtonTheme {
    OUTLINE = 'outline',
    CLEAR = 'clear',
    BACK = 'back',
}

export enum ButtonSize {
    M = 'm',
    L = 'l',
    XL = 'xl',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    theme?: ButtonTheme;
    size?: ButtonSize;
    square?: boolean;
    className?: string;
    children?: ReactNode;
}

const base =
    'inline-flex items-center justify-center cursor-pointer transition-colors hover:opacity-80 disabled:opacity-50 rounded-md';
const sizeMap: Record<ButtonSize, string> = {
    m: 'text-sm px-4 py-1.5',
    l: 'text-base px-5 py-2',
    xl: 'text-lg px-6 py-2.5',
};
const squareSizeMap: Record<ButtonSize, string> = {
    m: 'w-8 h-8 text-sm',
    l: 'w-10 h-10 text-base',
    xl: 'w-12 h-12 text-lg',
};

export const Button = memo(
    ({
        theme = ButtonTheme.OUTLINE,
        size = ButtonSize.L,
        square = false,
        className,
        disabled,
        children,
        ...otherProps
    }: ButtonProps) => {
        const themeVars = useThemeStore((s) => s.theme);

        const style =
            theme === ButtonTheme.OUTLINE || theme === ButtonTheme.BACK
                ? { backgroundColor: themeVars['--button-color'], color: '#fff' }
                : { backgroundColor: 'transparent', color: themeVars['--text-color'] };

        const sizeClass = square ? squareSizeMap[size] : sizeMap[size];
        const shapeClass = square ? 'rounded-full p-0' : '';
        const positionClass = theme === ButtonTheme.BACK ? 'absolute top-20 left-80' : '';

        return (
            <button
                type="button"
                className={classNames(base, sizeClass, shapeClass, positionClass, className)}
                style={style}
                disabled={disabled}
                {...otherProps}
            >
                {children}
            </button>
        );
    },
);
Button.displayName = 'Button';
