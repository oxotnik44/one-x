import type { Meta, StoryObj } from '@storybook/react-vite';
import { MyGroupPage } from './MyGroupPage';
import { MemoryRouter } from 'react-router-dom';
import { useAlbumStore, type Album } from 'entities/Album';
import { useGroupStore, type Group } from 'entities/Group';
import { useTrackStore, type Track } from 'entities/Track';
import Logo from '/assets/Logo.webp';

const mockGroup: Group = {
    id: '1',
    name: 'Mock Group',
    userId: 'user-1',
    genre: 'Рок',
    cover: Logo,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

const mockAlbums: Album[] = [
    {
        id: '1',
        name: 'Test Album 1',
        groupId: 'group-1',
        cover: '/assets/Logo.webp',
        trackIds: [],
        createdAt: new Date().toISOString(),
        description: null,
    },
    {
        id: '2',
        name: 'Test Album 2',
        groupId: 'group-1',
        cover: '/assets/Logo.webp',
        trackIds: [],
        createdAt: new Date().toISOString(),
        description: null,
    },
];
const mockTracks: Track[] = [
    {
        id: 'track-1',
        title: 'Первый трек',
        groupName: 'User',
        cover: Logo,
        duration: 180,
        groupId: 'group-1',
        audioUrl: '/audio/track-1.mp3',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'track-2',
        title: 'Второй трек',
        groupName: 'User',
        cover: Logo,
        duration: 210,
        groupId: 'group-1',
        audioUrl: '/audio/track-2.mp3',
        createdAt: new Date().toISOString(),
    },
];

// Предварительно устанавливаем состояние в сторы до рендера компонента
function setupStores() {
    useAlbumStore.setState({ albums: mockAlbums });
    useGroupStore.setState({ currentGroup: mockGroup });
    useTrackStore.setState({
        tracks: mockTracks,
        setTracks: () => {},
    });
}

const meta: Meta<typeof MyGroupPage> = {
    title: 'Pages/MyGroupPage',
    component: MyGroupPage,
    decorators: [
        (Story) => {
            setupStores();
            return (
                <MemoryRouter>
                    <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
                        <Story />
                    </div>
                </MemoryRouter>
            );
        },
    ],
};

export default meta;
type Story = StoryObj<typeof MyGroupPage>;

export const Default: Story = {
    args: {},
};
