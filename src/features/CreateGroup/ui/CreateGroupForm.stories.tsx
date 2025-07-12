import type { Meta, StoryObj } from '@storybook/react-vite';
import { CreateGroupForm } from './CreateGroupForm';

const meta: Meta<typeof CreateGroupForm> = {
    title: 'Features/CreateGroupForm',
    component: CreateGroupForm,
    decorators: [
        (Story) => (
            <div className="p-6 bg-gray-900 min-h-screen flex items-center justify-center">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof CreateGroupForm>;

export const Default: Story = {
    args: {},
};
