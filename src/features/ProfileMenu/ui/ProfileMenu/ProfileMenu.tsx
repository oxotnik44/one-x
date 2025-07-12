import { useRef, useEffect, type FC } from 'react';
import { useProfileMenu } from '../../model/useProfileMenu';
import { Dropdown } from 'shared/ui/Dropdown/Dropdown';
import { useUserStore } from 'entities/User/model/slice/useUserStore';

export const ProfileMenu: FC = () => {
    const { isOpen, close } = useProfileMenu();
    const menuRef = useRef<HTMLDivElement>(null);
    const logout = useUserStore((state) => state.logout);

    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                close();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, close]);

    return (
        <div ref={menuRef}>
            <Dropdown isOpen={isOpen} onClose={close}>
                <ul className="flex flex-col min-w-[160px]">
                    <li>
                        <button
                            onClick={() => {
                                // Настройки
                                close();
                            }}
                            className="w-full text-left px-4 py-2 rounded hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            Настройки
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => {
                                logout();
                                close();
                            }}
                            className="w-full text-left px-4 py-2 rounded hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                        >
                            Выйти
                        </button>
                    </li>
                </ul>
            </Dropdown>
        </div>
    );
};
