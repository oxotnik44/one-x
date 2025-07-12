import { type ButtonHTMLAttributes, memo, type ReactNode } from 'react';
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

const baseStyle =
    'inline-flex items-center justify-center cursor-pointer transition-colors hover:opacity-80 disabled:opacity-50 rounded-md';

const sizeClasses: Record<ButtonSize, string> = {
    [ButtonSize.M]: 'text-sm px-4 py-1.5',
    [ButtonSize.L]: 'text-base px-5 py-2',
    [ButtonSize.XL]: 'text-lg px-6 py-2.5',
};

const squareSizeClasses: Record<ButtonSize, string> = {
    [ButtonSize.M]: 'w-8 h-8 text-sm',
    [ButtonSize.L]: 'w-10 h-10 text-base',
    [ButtonSize.XL]: 'w-12 h-12 text-lg',
};

export const Button = memo((props: ButtonProps) => {
    const {
        theme = ButtonTheme.OUTLINE,
        size = ButtonSize.L,
        square = false,
        className,
        disabled = false,
        children,
        ...otherProps
    } = props;

    const themeVars = useThemeStore((state) => state.theme);

    const inlineStyles =
        theme === ButtonTheme.OUTLINE || theme === ButtonTheme.BACK
            ? {
                  backgroundColor: themeVars['--button-color'],
                  color: '#fff',
              }
            : {
                  backgroundColor: 'transparent',
                  color: themeVars['--text-color'],
              };

    const themeClass = theme === ButtonTheme.BACK ? 'absolute top-20 left-80' : '';

    const sizeClass = square ? squareSizeClasses[size] : sizeClasses[size];
    const shapeClass = square ? 'rounded-full p-0' : '';
    const btnClassName = classNames(baseStyle, sizeClass, shapeClass, themeClass, className);

    return (
        <button className={btnClassName} style={inlineStyles} disabled={disabled} {...otherProps}>
            {children}
        </button>
    );
});
Button.displayName = 'Button';
