// src/shared/ui/PageLoader/PageLoader.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import PageLoader from './PageLoader';

const meta: Meta<typeof PageLoader> = {
    title: 'Shared/PageLoader',
    component: PageLoader,
    tags: ['autodocs'],
    argTypes: {
        className: { control: 'text' },
    },
};

export default meta;

type Story = StoryObj<typeof PageLoader>;

export const Default: Story = {
    args: {},
};

export const WithCustomClass: Story = {
    args: {
        className: 'bg-gray-100',
    },
};
