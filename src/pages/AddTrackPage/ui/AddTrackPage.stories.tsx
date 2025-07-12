import type { Meta, StoryObj } from '@storybook/react-vite';
import { AddTrackPage } from './AddTrackPage';
import { MemoryRouter } from 'react-router-dom';

const meta: Meta<typeof AddTrackPage> = {
    title: 'Pages/AddTrackPage',
    component: AddTrackPage,
    decorators: [
        (Story) => (
            <MemoryRouter>
                <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
                    <Story />
                </div>
            </MemoryRouter>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof AddTrackPage>;

export const Default: Story = {
    args: {},
};
