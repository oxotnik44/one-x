import type { FC } from 'react';
import { sidebarItems } from '../model/items';
import { classNames } from 'shared/lib/classNames/classNames';
import { useThemeStore } from 'shared/config/theme/themeStore';
import { useSidebarStore } from '../model/sidebarStore';
import Logo from 'shared/assets/Logo.png';
import Avatar from 'shared/assets/default-avatar.png';
import { Text } from 'shared/ui/Text/Text';

export const Sidebar: FC = () => {
    const theme = useThemeStore((state) => state.theme);
    const { isCollapsed, toggleCollapsed } = useSidebarStore();

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
                        src={Logo}
                        alt="Логотип"
                        className={classNames(
                            'rounded-3xl object-contain transition-all duration-300',
                            isCollapsed ? 'w-10 h-10' : 'w-full max-w-xs h-auto',
                        )}
                    />
                </div>

                {/* Навигация */}
                <nav className="flex flex-col gap-3">
                    {sidebarItems.map((item) => (
                        <div
                            key={item.label}
                            className={classNames(
                                'flex items-center cursor-pointer px-2 py-1 rounded hover:text-white transition',
                                item.label === 'Главная' ? 'text-white font-bold' : 'text-gray-400',
                                isCollapsed ? 'justify-center' : 'gap-3',
                            )}
                        >
                            {item.icon}
                            {!isCollapsed && (
                                <Text
                                    text={item.label}
                                    size="default"
                                    className="select-none"
                                    isLink={false}
                                />
                            )}
                        </div>
                    ))}
                </nav>
            </div>

            <div className="flex items-center justify-between gap-3 mt-8">
                <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-600 bg-white">
                        <img
                            src={Avatar}
                            alt="Аватар пользователя"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {!isCollapsed && (
                        <Text
                            text="Артём Н."
                            size="small"
                            className="font-semibold"
                            isLink={false}
                        />
                    )}
                </div>
                <div className="group relative">
                    <div
                        onClick={toggleCollapsed}
                        className="cursor-pointer p-1 rounded hover:bg-gray-600 transition"
                        aria-label={isCollapsed ? 'Развернуть' : 'Свернуть'}
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
};
