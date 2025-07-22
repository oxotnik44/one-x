// src/pages/Album/ui/Album.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useAlbumStore, type Album as AlbumType } from 'entities/Album'; // тип с тем же именем

import { PageWrapper } from 'shared/ui';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from 'shared/config/i18n/i18n';

import { useEffect } from 'react';
import { useGroupStore, type Group } from 'entities/Group';
import { useUserStore, type User } from 'entities/User';
import { AlbumPage } from './AlbumPage';
import type { Album } from 'widgets/Album';
import Logo from '/assets/Logo.webp';

const meta: Meta<typeof Album> = {
    title: 'pages/AlbumPage',
    component: AlbumPage,
    decorators: [
        (Story) => (
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
        ),
    ],
};

export default meta;

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

const WithData = () => {
    const setAlbum = useAlbumStore((s) => s.setCurrentAlbum);
    const setGroup = useGroupStore((s) => s.setCurrentGroup);
    const setUser = useUserStore((s) => s.setAuthData);

    useEffect(() => {
        setAlbum(mockAlbum);
        setGroup(mockGroup);
        setUser(mockUser);
    }, [setAlbum, setGroup, setUser]);

    return <AlbumPage />;
};

export const Default: StoryObj<typeof Album> = {
    render: () => <WithData />,
};
