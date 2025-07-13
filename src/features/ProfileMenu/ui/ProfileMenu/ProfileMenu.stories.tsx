import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProfileMenu } from './ProfileMenu';

const meta: Meta<typeof ProfileMenu> = {
    title: 'widgets/ProfileMenu',
    component: ProfileMenu,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

export default meta;
type Story = StoryObj<typeof ProfileMenu>;

export const Default: Story = {
    render: () => <ProfileMenu />,
};
