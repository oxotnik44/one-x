// src/pages/MainPage.tsx
import type { FC } from 'react';
import { useThemeStore } from 'shared/config/theme/themeStore';
import { useSidebarStore } from 'widgets/Sidebar/model/sidebarStore';
import Logo from 'shared/assets/Logo.png';
import { sidebarSize, playerSize } from 'shared/config/theme/global/variables';

export const MainPage: FC = () => {
    const theme = useThemeStore((state) => state.theme);
    const isCollapsed = useSidebarStore((state) => state.isCollapsed);

    return (
        <div
            className="
        rounded-3xl
        transition-all duration-300 ease-in-out
        bg-[var(--bg-container)]
        p-5
        flex items-center justify-center
      "
            style={{
                ...sidebarSize,
                ...playerSize,
                backgroundColor: theme['--bg-container'],
                marginLeft: isCollapsed
                    ? 'calc(var(--sidebar-width-collapsed) - 4.4rem )'
                    : 'calc(var(--sidebar-width) - 4.4rem)',
                height: 'calc(100vh - var(--player-height) - 5rem)', // высота с учётом плеера + 1rem отступа
                right: '1.5rem',
            }}
        >
            <img src={Logo} alt="Логотип" className="w-full h-full object-contain" />
        </div>
    );
};
