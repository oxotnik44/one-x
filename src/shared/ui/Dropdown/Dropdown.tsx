import { memo, forwardRef, type ReactNode, type CSSProperties, type ForwardedRef } from 'react';
import { classNames } from 'shared/lib/classNames/classNames';
import { useThemeStore } from 'shared/config/theme/themeStore';

interface DropdownProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    style?: CSSProperties;
    className?: string;
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
            className={classNames(
                'fixed z-50 shadow-lg rounded p-2 transition-colors duration-200',
                className,
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
