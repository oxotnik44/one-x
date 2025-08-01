// src/shared/ui/Loader/Loader.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Loader } from './Loader';

const meta: Meta<typeof Loader> = {
    title: 'shared/Loader',
    component: Loader,
    tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Loader>;

export const Default: Story = {};
