// src/widgets/Sidebar/ui/ButtonNavigation.tsx
import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { RxArrowLeft, RxGear } from 'react-icons/rx';
import { Button } from 'shared/ui/Button/Button';
import { sidebarSize } from 'shared/config/theme/global/variables';
import { useSidebarStore } from 'widgets/Sidebar/model/sidebarStore';

interface ButtonNavigationProps {
    back?: boolean;
    settings?: boolean;
    title?: string;
}

export const ButtonNavigation = memo(({ back, settings, title }: ButtonNavigationProps) => {
    const navigate = useNavigate();
    const isCollapsed = useSidebarStore((s) => s.isCollapsed);

    const handleClick = useCallback(() => {
        if (settings) {
            navigate('settings', { relative: 'path' });
        } else {
            window.history.back(); // альтернативный способ
        }
    }, [navigate, settings]);

    const left = `calc(${isCollapsed ? sidebarSize['--sidebar-width-collapsed'] : sidebarSize['--sidebar-width']} + 3rem)`;

    return (
        <div
            className="absolute top-14 z-50 transition-[left] duration-300 ease-in-out"
            style={{ left }}
        >
            <Button onClick={handleClick} square title={title}>
                {back ? <RxArrowLeft size={20} /> : <RxGear size={20} />}
            </Button>
        </div>
    );
});
ButtonNavigation.displayName = 'ButtonNavigation';
