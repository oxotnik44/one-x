// src/widgets/Sidebar/ui/Sidebar.tsx
import { memo, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { sidebarItems } from '../model/items';
import { useThemeStore } from 'shared/config/theme/themeStore';
import { useSidebarStore } from '../model/sidebarStore';
import { classNames } from 'shared/lib';
import { Text } from 'shared/ui';
import { NavLink } from 'react-router-dom';
import { ProfileMenu } from 'widgets/ProfileMenu';

export const Sidebar = memo(() => {
    const { t } = useTranslation('sidebar');
    const theme = useThemeStore((s) => s.theme);
    const { isCollapsed, toggleCollapsed, setSelectedItem } = useSidebarStore();

    const iconColor = (active: boolean) =>
        active ? theme['--primary-color'] : theme['--second-color'];

    return (
        <aside
            className={classNames(
                'fixed left-2 top-2 h-[calc(100vh-1rem)] flex flex-col p-2 rounded-3xl shadow-xl transition-all duration-300',
                isCollapsed ? 'w-20' : 'w-64',
            )}
            style={{ backgroundColor: theme['--bg-container'] }}
        >
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
            <nav className="flex flex-col gap-5 mt-10 flex-grow">
                {sidebarItems.map(({ icon: Icon, label, href }) => (
                    <NavLink
                        key={label}
                        to={href}
                        className={() =>
                            classNames(
                                'flex items-center px-2 py-1 rounded gap-3 cursor-pointer transition',
                                isCollapsed && 'justify-center',
                            )
                        }
                        onClick={() => setSelectedItem(label)}
                    >
                        {({ isActive }) => {
                            const color = iconColor(isActive);
                            return (
                                <>
                                    <Icon size={isCollapsed ? 20 : 24} style={{ color }} />
                                    {!isCollapsed && <Text text={t(label)} size="default" />}
                                </>
                            );
                        }}
                    </NavLink>
                ))}
            </nav>

            {/* Аватар и кнопка сворачивания */}
            <div className="flex items-center justify-between gap-3 mt-8">
                <Suspense
                    fallback={<div className="w-8 h-8 bg-gray-500 rounded-full animate-pulse" />}
                >
                    <ProfileMenu />
                </Suspense>
                <div
                    onClick={toggleCollapsed}
                    className="group relative cursor-pointer p-1 rounded hover:bg-gray-600 transition"
                    aria-label={t(isCollapsed ? 'expand' : 'collapse')}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={classNames(
                            'w-6 h-6 transition-opacity duration-300',
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
        </aside>
    );
});

Sidebar.displayName = 'Sidebar';
