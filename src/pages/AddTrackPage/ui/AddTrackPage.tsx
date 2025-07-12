import { AddTrackForm } from 'features/AddTrackForm/ui/AddTrackForm';
import { type FC } from 'react';
import { RxArrowLeft } from 'react-icons/rx';
import { playerSize, sidebarSize } from 'shared/config/theme/global/variables';
import { useThemeStore } from 'shared/config/theme/themeStore';
import { Button, ButtonTheme } from 'shared/ui/Button/Button';
import { useSidebarStore } from 'widgets/Sidebar/model/sidebarStore';
import { useNavigate } from 'react-router-dom';
export const AddTrackPage: FC = () => {
    const theme = useThemeStore((state) => state.theme);
    const isCollapsed = useSidebarStore((state) => state.isCollapsed);
    const navigate = useNavigate();
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
                    ? 'calc(var(--sidebar-width-collapsed) - 4.4rem )'
                    : 'calc(var(--sidebar-width) - 4.4rem)',
                height: 'calc(100vh - var(--player-height) - 4rem)',
                right: '1.5rem',
            }}
        >
            <Button
                theme={ButtonTheme.BACK}
                onClick={() => {
                    navigate(-1);
                }}
                square
                title="Назад"
            >
                <RxArrowLeft size={20} />
            </Button>

            <AddTrackForm />
        </div>
    );
};
