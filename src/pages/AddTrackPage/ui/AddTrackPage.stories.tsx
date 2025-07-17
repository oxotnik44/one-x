import type { Meta, StoryObj } from '@storybook/react-vite';
import { AddTrackPage } from './AddTrackPage';
import { MemoryRouter } from 'react-router-dom';

const meta: Meta<typeof AddTrackPage> = {
    title: 'Pages/AddTrackPage',
    component: AddTrackPage,
    decorators: [
        (Story) => (
            <MemoryRouter>
                <div style={{ minHeight: '100vh', padding: '2rem', backgroundColor: '#f0f0f0' }}>
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
