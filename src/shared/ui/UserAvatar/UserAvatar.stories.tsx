import type { Meta, StoryObj } from '@storybook/react-vite';
import { UserAvatar } from './UserAvatar';

const meta: Meta<typeof UserAvatar> = {
    title: 'shared/UserAvatar',
    component: UserAvatar,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof UserAvatar>;

export const Default: Story = {
    args: {
        src: undefined,
        alt: 'Default User Avatar',
        size: 40,
    },
};

export const CustomSrc: Story = {
    args: {
        src: 'https://randomuser.me/api/portraits/men/75.jpg',
        alt: 'Custom Avatar',
        size: 50,
    },
};

export const SmallSize: Story = {
    args: {
        src: 'https://randomuser.me/api/portraits/women/65.jpg',
        alt: 'Small Avatar',
        size: 24,
    },
};
