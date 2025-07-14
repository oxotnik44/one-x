import { memo, forwardRef, type ReactNode, type CSSProperties, type ForwardedRef } from 'react';
import clsx from 'clsx';
import { useThemeStore } from 'shared/config/theme/themeStore';

export interface DropdownProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    style?: CSSProperties;
    className?: string; // добавлен проп
}

const DropdownComponent = (
    { isOpen, children, style, className }: DropdownProps,
    ref: ForwardedRef<HTMLDivElement>,
) => {
    const theme = useThemeStore((state) => state.theme);

    if (!isOpen) return null;

    return (
        <div
            ref={ref}
            className={clsx(
                'fixed z-50 shadow-lg rounded p-2 transition-colors duration-200',
                className, // передаем сюда проп className
            )}
            style={{
                backgroundColor: theme['--bg-container'],
                color: theme['--text-color'],
                ...style,
            }}
        >
            {children}
        </div>
    );
};

export const Dropdown = memo(forwardRef(DropdownComponent));
