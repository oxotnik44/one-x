import type { Meta, StoryObj } from '@storybook/react-vite';
import { ErrorPage } from './ErrorPage';

const meta: Meta<typeof ErrorPage> = {
    title: 'pages/ErrorPage',
    component: ErrorPage,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ErrorPage>;

export const Default: Story = {};
