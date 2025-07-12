import type { Meta, StoryObj } from '@storybook/react-vite';
import { AddTrackForm } from './AddTrackForm';

const meta: Meta<typeof AddTrackForm> = {
    title: 'Features/AddTrackForm',
    component: AddTrackForm,
    decorators: [
        (Story) => {
            return (
                <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
                    <Story />
                </div>
            );
        },
    ],
};

export default meta;

type Story = StoryObj<typeof AddTrackForm>;

export const Default: Story = {
    args: {},
};
