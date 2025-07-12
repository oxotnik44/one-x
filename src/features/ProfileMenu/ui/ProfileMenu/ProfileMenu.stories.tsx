import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProfileMenu } from './ProfileMenu';

const meta: Meta<typeof ProfileMenu> = {
    title: 'widgets/ProfileMenu',
    component: ProfileMenu,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProfileMenu>;

export const Default: Story = {
    render: () => {
        const [isOpen, setIsOpen] = useState(false);

        // Чтобы пробросить управление состоянием в useProfileMenu,
        // в реальном проекте лучше сделать параметризацию стора.
        // Здесь для простоты обёртка:
        return (
            <div style={{ padding: 20 }}>
                <button
                    onClick={() => setIsOpen((open) => !open)}
                    className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
                >
                    {isOpen ? 'Закрыть меню' : 'Открыть меню'}
                </button>
                {/* Оборачиваем ProfileMenu в провайдер стора или имитируем состояние */}
                <ProfileMenuWrapper isOpen={isOpen} onClose={() => setIsOpen(false)} />
            </div>
        );
    },
};

// Пример обёртки для передачи состояния через пропсы (если изменить useProfileMenu сложно)
import { Dropdown } from 'shared/ui/Dropdown/Dropdown';
import { useUserStore } from 'entities/User/model/slice/useUserStore';

interface ProfileMenuWrapperProps {
    isOpen: boolean;
    onClose: () => void;
}
const ProfileMenuWrapper: React.FC<ProfileMenuWrapperProps> = ({ isOpen, onClose }) => {
    const logout = useUserStore((state) => state.logout);

    return (
        <Dropdown isOpen={isOpen} onClose={onClose}>
            <ul className="flex flex-col min-w-[160px] bg-white border rounded shadow-lg">
                <li>
                    <button
                        onClick={onClose}
                        className="w-full text-left px-4 py-2 rounded hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                        Настройки
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => {
                            logout();
                            onClose();
                        }}
                        className="w-full text-left px-4 py-2 rounded hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                    >
                        Выйти
                    </button>
                </li>
            </ul>
        </Dropdown>
    );
};
