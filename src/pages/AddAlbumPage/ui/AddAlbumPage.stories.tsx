// src/pages/AddAlbumPage/AddAlbumPage.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';

import { AddAlbumPage } from './AddAlbumPage';

const meta: Meta<typeof AddAlbumPage> = {
    title: 'Pages/AddAlbumPage',
    component: AddAlbumPage,
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
type Story = StoryObj<typeof AddAlbumPage>;

export const Default: Story = {};
