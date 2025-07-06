// src/shared/ui/Dropdown/Dropdown.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from './Dropdown';

const meta: Meta<typeof Dropdown> = {
    title: 'shared/Dropdown',
    component: Dropdown,
    tags: ['autodocs'],
    args: {
        isOpen: true,
        children: (
            <ul className="space-y-1">
                <li className="cursor-pointer hover:bg-gray-200 px-2 py-1 rounded">Пункт 1</li>
                <li className="cursor-pointer hover:bg-gray-200 px-2 py-1 rounded">Пункт 2</li>
                <li className="cursor-pointer hover:bg-gray-200 px-2 py-1 rounded">Пункт 3</li>
            </ul>
        ),
    },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {};
