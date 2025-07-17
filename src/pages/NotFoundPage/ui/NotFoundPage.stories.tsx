import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { NotFoundPage } from './NotFoundPage';

const meta: Meta<typeof NotFoundPage> = {
    title: 'pages/NotFoundPage',
    component: NotFoundPage,
    decorators: [
        (Story) => (
            <MemoryRouter initialEntries={['/not-found']}>
                <div style={{ height: '100vh', width: '100vw' }}>
                    <Story />
                </div>
            </MemoryRouter>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof NotFoundPage>;

export const Default: Story = {};
