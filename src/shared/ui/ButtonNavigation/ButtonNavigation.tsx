import React, { memo, useCallback } from 'react';
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

export const ButtonNavigation: React.FC<ButtonNavigationProps> = memo(
    ({ back, settings, title }) => {
        const navigate = useNavigate();
        const isCollapsed = useSidebarStore((state) => state.isCollapsed);

        const onClick = useCallback(() => {
            if (settings) {
                navigate('settings', { relative: 'path' });
            } else {
                navigate(-1);
            }
        }, [navigate, settings]);

        const icon = back ? <RxArrowLeft size={20} /> : <RxGear size={20} />;

        const sidebarWidth = isCollapsed
            ? sidebarSize['--sidebar-width-collapsed']
            : sidebarSize['--sidebar-width'];

        return (
            <div
                className="absolute top-14 transition-[left] duration-300 ease-in-out z-50"
                style={{
                    left: `calc(${sidebarWidth} + 3rem)`,
                }}
            >
                <Button onClick={onClick} square title={title}>
                    {icon}
                </Button>
            </div>
        );
    },
);

ButtonNavigation.displayName = 'ButtonNavigation';
