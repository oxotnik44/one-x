import type { Meta, StoryObj } from '@storybook/react-vite';
import { AddAlbumForm } from './AddAlbumForm';
import { MemoryRouter } from 'react-router-dom';

const mockHook = () => ({
    watch: () => '',
    errors: {
        folder: false,
        title: false,
    },
    folderSelected: true,
    folderName: 'Mock Album',
    coverPreview: 'https://via.placeholder.com/150',
    trackCount: 5,
    submitHandler: () => () => alert('✅ Альбом добавлен'),
});

const meta: Meta<typeof AddAlbumForm> = {
    title: 'Features/AddAlbumForm',
    component: AddAlbumForm,
    decorators: [
        (Story) => (
            <MemoryRouter>
                <div className="p-6 max-w-md mx-auto">
                    <Story />
                </div>
            </MemoryRouter>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof AddAlbumForm>;

export const Default: Story = {
    args: {
        hook: mockHook,
    },
};
