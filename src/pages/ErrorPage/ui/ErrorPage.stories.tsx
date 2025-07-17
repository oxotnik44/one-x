import type { Meta, StoryObj } from '@storybook/react-vite';
import { ErrorPage } from './ErrorPage';

const meta: Meta<typeof ErrorPage> = {
    title: 'pages/ErrorPage',
    component: ErrorPage,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div style={{ height: '100vh', width: '100vw' }}>
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof ErrorPage>;

export const Default: Story = {};
