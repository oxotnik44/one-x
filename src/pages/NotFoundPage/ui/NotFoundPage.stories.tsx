import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { NotFoundPage } from './NotFoundPage';
import { ThemeProviders } from 'app/providers/ThemeProviders/ThemeProviders';

const meta: Meta<typeof NotFoundPage> = {
    title: 'pages/NotFoundPage',
    component: NotFoundPage,
    decorators: [
        (Story) => (
            <MemoryRouter initialEntries={['/not-found']}>
                <ThemeProviders>
                    <div style={{ height: '100vh', width: '100vw' }}>
                        <Story />
                    </div>
                </ThemeProviders>
            </MemoryRouter>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof NotFoundPage>;

export const Default: Story = {};
