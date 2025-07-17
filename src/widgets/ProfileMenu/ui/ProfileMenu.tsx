import { useRef, useEffect, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiSettings, FiLogOut } from 'react-icons/fi';
import { useUserStore } from 'entities/User';
import { useGroupStore } from 'entities/Group';
import { useSidebarStore } from 'widgets/Sidebar';
import { Button, ButtonSize, Dropdown, UserAvatar, Text } from 'shared/ui';
import { useProfileMenu } from 'widgets/ProfileMenu';
import avatar from 'shared/assets/default-avatar.webp';
export const ProfileMenu: FC = () => {
    const { t } = useTranslation('profileMenu');
    const navigate = useNavigate();
    const { isOpen, close, toggle } = useProfileMenu();
    const logout = useUserStore((state) => state.logout);
    const { isCollapsed } = useSidebarStore();
    const currentGroup = useGroupStore((state) => state.currentGroup);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                close();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, close]);

    const onSettingsClick = () => {
        navigate('/settings');
        close();
    };

    const onLogoutClick = () => {
        logout(); // очищает authData и показывает toast
        close();
    };
    return (
        <div ref={menuRef} className="relative inline-block">
            <div onClick={toggle} className="flex items-center cursor-pointer gap-3">
                <UserAvatar src={currentGroup?.cover ?? avatar} />
                {!isCollapsed && (
                    <Text
                        text={currentGroup?.name || t('user')}
                        size="small"
                        className="font-semibold"
                        isLink={false}
                    />
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
                    <div className="flex flex-col gap-y-2 ">
                        <Button
                            onClick={onSettingsClick}
                            size={ButtonSize.L}
                            square
                            aria-label="Settings"
                        >
                            <FiSettings className="w-5 h-5" />
                        </Button>
                        <Button
                            onClick={onLogoutClick}
                            size={ButtonSize.L}
                            square
                            aria-label="Logout"
                        >
                            <FiLogOut />
                        </Button>
                    </div>
                ) : (
                    <ul className="flex flex-col min-w-[160px] gap-y-2">
                        <li>
                            <Button
                                onClick={onSettingsClick}
                                className="w-full text-left px-4 py-2 rounded hover:bg-gray-100 transition-colors"
                            >
                                {t('settings')}
                            </Button>
                        </li>
                        <li>
                            <Button
                                onClick={onLogoutClick}
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
