import React, { type ReactNode, memo } from 'react';
import { sidebarSize, playerSize } from 'shared/config/theme/global/variables';
import { useThemeStore } from 'shared/config/theme/themeStore';
import { useSidebarStore } from 'widgets/Sidebar/model/sidebarStore';
import { classNames } from 'shared/lib/classNames/classNames';

interface PageWrapperProps {
    children: ReactNode;
    notCenter?: boolean;
}

export const PageWrapper: React.FC<PageWrapperProps> = memo(({ children, notCenter }) => {
    const theme = useThemeStore((state) => state.theme);
    const isCollapsed = useSidebarStore((state) => state.isCollapsed);

    const className = classNames(
        'rounded-3xl transition-all duration-300 ease-in-out',
        !notCenter && 'p-5 flex items-center justify-center',
    );

    return (
        <div
            className={className}
            style={{
                ...sidebarSize,
                ...playerSize,
                backgroundColor: theme['--bg-container'],
                marginLeft: isCollapsed
                    ? 'calc(var(--sidebar-width-collapsed) - 4.4rem)'
                    : 'calc(var(--sidebar-width) - 4.4rem)',
                height: 'calc(100vh - var(--player-height) - 4rem)',
                right: '1.5rem',
            }}
        >
            {children}
        </div>
    );
});

PageWrapper.displayName = 'PageWrapper';
