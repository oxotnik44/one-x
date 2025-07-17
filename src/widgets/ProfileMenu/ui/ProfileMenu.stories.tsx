// src/widgets/ProfileMenu/ui/ProfileMenu.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProfileMenu } from './ProfileMenu';
import { MemoryRouter } from 'react-router-dom';

const meta: Meta<typeof ProfileMenu> = {
    title: 'widgets/ProfileMenu',
    component: ProfileMenu,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (Story) => (
            <MemoryRouter>
                <Story />
            </MemoryRouter>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof ProfileMenu>;

export const Default: Story = {
    render: () => <ProfileMenu />,
};
