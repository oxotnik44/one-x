import { useGroupStore } from 'entities/Group/model/slice/useGroupStore';
import { CreateGroupForm } from 'features/CreateGroup';
import { type FC } from 'react';
import { playerSize, sidebarSize } from 'shared/config/theme/global/variables';
import { useThemeStore } from 'shared/config/theme/themeStore';
import { Group } from 'widgets/Group';
import { useSidebarStore } from 'widgets/Sidebar/model/sidebarStore';

export const MyGroupPage: FC = () => {
    const theme = useThemeStore((state) => state.theme);
    const isCollapsed = useSidebarStore((state) => state.isCollapsed);
    const currentGroup = useGroupStore((state) => state.currentGroup);
    return (
        <div data-testid="MyGroupPage">
            {!currentGroup ? (
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
                            ? 'calc(var(--sidebar-width-collapsed) - 4.4rem )'
                            : 'calc(var(--sidebar-width) - 4.4rem)',
                        height: 'calc(100vh - var(--player-height) - 4rem)',
                        right: '1.5rem',
                    }}
                >
                    <CreateGroupForm />{' '}
                </div>
            ) : (
                <div
                    className="
                rounded-3xl
                transition-all duration-300 ease-in-out
                p-5
              "
                    style={{
                        ...sidebarSize,
                        ...playerSize,
                        backgroundColor: theme['--bg-container'],
                        marginLeft: isCollapsed
                            ? 'calc(var(--sidebar-width-collapsed) - 4.4rem )'
                            : 'calc(var(--sidebar-width) - 4.4rem)',
                        height: 'calc(100vh - var(--player-height) - 4rem)',
                        right: '1.5rem',
                    }}
                >
                    <Group />
                </div>
            )}
        </div>
    );
};
