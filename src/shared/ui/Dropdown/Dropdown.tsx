import { memo, type FC, type ReactNode, type CSSProperties } from 'react';
import clsx from 'clsx';
import { useThemeStore } from 'shared/config/theme/themeStore';

export interface DropdownProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    style?: CSSProperties;
}

const DropdownComponent: FC<DropdownProps> = ({ isOpen, children, style }) => {
    const theme = useThemeStore((state) => state.theme);

    if (!isOpen) return null;

    return (
        <div
            className={clsx(
                'absolute z-50 shadow-lg rounded p-2',
                'right-0 mt-2 transition-colors duration-200',
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

// ✅ мемоизация по props (без учета сторов)
export const Dropdown = memo(DropdownComponent);
