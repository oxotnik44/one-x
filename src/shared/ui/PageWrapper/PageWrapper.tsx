import React, { type ReactNode, memo } from 'react';
import { sidebarSize, playerSize } from 'shared/config/theme/global/variables';
import { useThemeStore } from 'shared/config/theme/themeStore';
import { useSidebarStore } from 'widgets/Sidebar/model/sidebarStore';

interface PageWrapperProps {
    children: ReactNode;
}

export const PageWrapper: React.FC<PageWrapperProps> = memo(({ children }) => {
    const theme = useThemeStore((state) => state.theme);
    const isCollapsed = useSidebarStore((state) => state.isCollapsed);

    return (
        <div
            className="
                rounded-3xl
                transition-all duration-300 ease-in-out
                p-5
                flex items-center justify-center
            "
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
