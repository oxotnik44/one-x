import React, { useCallback } from 'react';
import type { FC } from 'react';
import { sidebarItems } from '../model/items';
import { useThemeStore } from 'shared/config/theme/themeStore';
import { useSidebarStore } from '../model/sidebarStore';
import { Text } from 'shared/ui';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { classNames } from 'shared/lib';
import { ProfileMenu } from 'widgets/ProfileMenu';

export const Sidebar: FC = React.memo(() => {
    const { t } = useTranslation('sidebar'); // namespace sidebar
    const theme = useThemeStore((state) => state.theme);
    const { isCollapsed, toggleCollapsed, setSelectedItem } = useSidebarStore();
    const location = useLocation();
    const navigate = useNavigate();

    const pathname = location.pathname.replace(/^\/+/, '');

    const onNavItemClick = useCallback(
        (label: string, href: string) => {
            setSelectedItem(label);
            navigate(href);
        },
        [setSelectedItem, navigate],
    );

    const onToggleCollapsed = useCallback(() => {
        toggleCollapsed();
    }, [toggleCollapsed]);

    return (
        <aside
            className={classNames(
                'fixed left-2 top-2 h-[calc(100vh-1rem)] text-white flex flex-col p-2 rounded-3xl shadow-xl transition-all duration-300',
                isCollapsed ? 'w-20' : 'w-64',
            )}
            style={{
                backgroundColor: theme['--bg-container'],
            }}
        >
            <div className="flex flex-col flex-grow">
                {/* Логотип */}
                <div className="flex justify-center mb-2">
                    <img
                        src="/assets/Logo.webp"
                        alt={t('logoAlt')}
                        className={classNames(
                            'object-contain transition-all duration-300 rounded-xl',
                            isCollapsed ? 'w-15 h-15' : 'w-40 h-40',
                        )}
                    />
                </div>

                {/* Навигация */}
                <nav className="flex flex-col gap-5 mt-10">
                    {sidebarItems.map(({ icon: Icon, label, href }) => {
                        const isActive = pathname.startsWith(href);
                        const iconColor = isActive
                            ? theme['--primary-color']
                            : theme['--second-color'];

                        return (
                            <div
                                key={label}
                                onClick={() => onNavItemClick(label, href)}
                                className={classNames(
                                    'flex items-center cursor-pointer px-2 py-1 rounded hover:text-white transition gap-3',
                                    isCollapsed && 'justify-center',
                                )}
                                style={{ color: iconColor }}
                            >
                                <Icon size={isCollapsed ? 20 : 24} />
                                {!isCollapsed && (
                                    <Text
                                        text={t(label)}
                                        size="default"
                                        isActive={isActive}
                                        isLink={false}
                                    />
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>

            {/* Аватар и кнопка сворачивания */}
            <div className="flex items-center justify-between gap-3 mt-8">
                <ProfileMenu />
                <div className="group relative">
                    <div
                        onClick={onToggleCollapsed}
                        className="cursor-pointer p-1 rounded hover:bg-gray-600 transition"
                        aria-label={isCollapsed ? t('expand') : t('collapse')}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={classNames(
                                'h-6 w-6 transition-opacity duration-300',
                                isCollapsed ? 'opacity-0 group-hover:opacity-100' : 'opacity-100',
                            )}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d={isCollapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'}
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </aside>
    );
});

Sidebar.displayName = 'Sidebar';
