// src/widgets/ProfileMenu/ui/ProfileMenu.tsx

import { useRef, useEffect, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiSettings, FiLogOut } from 'react-icons/fi';

import { useUserStore } from 'entities/User';
import { useGroupStore } from 'entities/Group';
import { useSidebarStore } from 'widgets/Sidebar';
import { useProfileMenu } from 'widgets/ProfileMenu';

import { Button, ButtonSize, Dropdown, UserAvatar, Text } from 'shared/ui';
import avatar from 'shared/assets/default-avatar.webp';

export const ProfileMenu: FC = () => {
    const { t } = useTranslation('profileMenu');
    const { isOpen, toggle, close } = useProfileMenu();
    const { isCollapsed } = useSidebarStore();
    const group = useGroupStore((s) => s.currentGroup);
    const logout = useUserStore((s) => s.logout);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isOpen) return;
        const onClick = (e: MouseEvent) => {
            if (!menuRef.current?.contains(e.target as Node)) close();
        };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, [isOpen, close]);

    const handleClick = (path: string, action?: () => void) => {
        navigate(path);
        action?.();
        close();
    };

    return (
        <div ref={menuRef} className="relative inline-block">
            <div onClick={toggle} className="flex items-center cursor-pointer gap-3">
                <UserAvatar src={group?.cover ?? avatar} />
                {!isCollapsed && (
                    <Text text={group?.name || t('user')} size="small" className="font-semibold" />
                )}
            </div>

            <Dropdown
                isOpen={isOpen}
                onClose={close}
                className={isCollapsed ? 'bottom-15 left-2' : 'bottom-20 left-10'}
                style={
                    isCollapsed ? { backgroundColor: 'transparent', boxShadow: 'none' } : undefined
                }
            >
                {isCollapsed ? (
                    <div className="flex flex-col gap-2">
                        <Button onClick={() => handleClick('/settings')} size={ButtonSize.L} square>
                            <FiSettings className="w-5 h-5" />
                        </Button>
                        <Button onClick={() => handleClick('/', logout)} size={ButtonSize.L} square>
                            <FiLogOut className="w-5 h-5" />
                        </Button>
                    </div>
                ) : (
                    <ul className="flex flex-col min-w-[160px] gap-2">
                        <li>
                            <Button
                                onClick={() => handleClick('/settings')}
                                className="w-full text-left px-4 py-2 rounded hover:bg-gray-100 transition-colors"
                            >
                                {t('settings')}
                            </Button>
                        </li>
                        <li>
                            <Button
                                onClick={() => handleClick('/', logout)}
                                className="w-full text-left px-4 py-2 rounded hover:bg-red-100 text-red-600 transition-colors"
                            >
                                {t('logout')}
                            </Button>
                        </li>
                    </ul>
                )}
            </Dropdown>
        </div>
    );
};
