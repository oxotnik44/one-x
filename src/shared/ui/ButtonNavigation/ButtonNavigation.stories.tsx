import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { ButtonNavigation } from './ButtonNavigation';

const meta: Meta<typeof ButtonNavigation> = {
    title: 'shared/ButtonNavigation',
    component: ButtonNavigation,
    tags: ['autodocs'],
    args: {
        back: true,
        settings: false,
        title: 'Назад',
    },
    decorators: [
        (Story) => (
            <MemoryRouter initialEntries={['/']}>
                <Story />
            </MemoryRouter>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof ButtonNavigation>;

export const BackButton: Story = {
    args: {
        back: true,
        settings: false,
        title: 'Назад',
    },
};

export const SettingsButton: Story = {
    args: {
        back: false,
        settings: true,
        title: 'Настройки',
    },
};
