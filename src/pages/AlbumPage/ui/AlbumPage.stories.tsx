import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlbumPage } from './AlbumPage';
import { PageWrapper } from 'shared/ui';
import { MemoryRouter } from 'react-router-dom';

const meta: Meta<typeof AlbumPage> = {
    title: 'pages/AlbumPage',
    component: AlbumPage,
    decorators: [
        (Story) => (
            <MemoryRouter>
                <PageWrapper notCenter>
                    <Story />
                </PageWrapper>
            </MemoryRouter>
        ),
    ],
};

export default meta;

type Story = StoryObj<typeof AlbumPage>;

export const Default: Story = {};
