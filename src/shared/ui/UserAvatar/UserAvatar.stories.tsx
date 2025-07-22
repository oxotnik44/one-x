import type { Meta, StoryObj } from '@storybook/react-vite';
import { UserAvatar } from './UserAvatar';
import Logo from '/assets/Logo.webp';
const meta: Meta<typeof UserAvatar> = {
    title: 'shared/UserAvatar',
    component: UserAvatar,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof UserAvatar>;

export const Default: Story = {
    args: {
        src: Logo,
        alt: 'Default User Avatar',
        size: 40,
    },
};

export const CustomSrc: Story = {
    args: {
        src: Logo,
        alt: 'Custom Avatar',
        size: 50,
    },
};

export const SmallSize: Story = {
    args: {
        src: Logo,
        alt: 'Small Avatar',
        size: 24,
    },
};
