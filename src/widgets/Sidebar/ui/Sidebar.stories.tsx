import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sidebar } from './Sidebar';
import { MemoryRouter } from 'react-router-dom';

const meta: Meta<typeof Sidebar> = {
    title: 'widgets/Sidebar',
    component: Sidebar,
    decorators: [
        (Story) => (
            <MemoryRouter initialEntries={['/my_group']}>
                <div style={{ height: '100vh', backgroundColor: '#141414' }}>
                    <Story />
                </div>
            </MemoryRouter>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {};
