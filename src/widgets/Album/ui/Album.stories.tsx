// src/pages/Album/ui/Album.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Album } from './Album';
import { useAlbumStore, type Album as AlbumType } from 'entities/Album';
import { useGroupStore, type Group } from 'entities/Group';
import { useUserStore, type User } from 'entities/User';

import { PageWrapper } from 'shared/ui';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from 'shared/config/i18n/i18n';
import { useTrackStore, type Track } from 'entities/Track';
import Logo from '/assets/Logo.webp';
const mockGroup: Group = {
    id: '1',
    name: 'Mock Group',
    userId: 'user-1',
    genre: 'Рок',
    cover: 'https://via.placeholder.com/150',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

const mockAlbum: AlbumType = {
    id: '123',
    name: 'Mock Album',
    description: 'Описание альбома',
    cover: Logo,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    groupId: '1',
    trackIds: ['track-1', 'track-2'],
};

const mockUser: User = {
    id: 'user-1',
    username: 'test_user',
    likedAlbums: ['123'],
    password: '',
    avatar: '',
    createdAt: '',
};
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
    useAlbumStore.setState({ currentAlbum: mockAlbum });
    useGroupStore.setState({ currentGroup: mockGroup });
    useUserStore.setState({ authData: mockUser }); // Если authData - объект пользователя
    useTrackStore.setState({
        tracks: mockTracks,
        setTracks: () => {},
    });
}

const meta: Meta<typeof Album> = {
    title: 'widgets/Album',
    component: Album,
    decorators: [
        (Story) => {
            setupStores(); // вызов до рендера компонента, чтобы сторы уже имели данные
            return (
                <MemoryRouter initialEntries={['/group/1/album/123']}>
                    <Routes>
                        <Route
                            path="/group/:groupId/album/:albumId"
                            element={
                                <I18nextProvider i18n={i18n}>
                                    <PageWrapper>
                                        <Story />
                                    </PageWrapper>
                                </I18nextProvider>
                            }
                        />
                    </Routes>
                </MemoryRouter>
            );
        },
    ],
};

export default meta;

export const Default: StoryObj<typeof Album> = {
    render: () => <Album />,
};
