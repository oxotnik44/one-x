import { Album as AlbumComponent } from './Album';
import { PageWrapper } from 'shared/ui';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { useAlbumStore } from 'entities/Album';
import { useTrackStore, type Track } from 'entities/Track';
import { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import i18n from 'shared/config/i18n/i18n';

import Logo from '/assets/Logo.webp';

// Тип альбома с треками
export interface Album {
    id: string;
    name: string;
    cover: string;
    createdAt: string;
    updatedAt: string;
    groupId: string;
    trackIds: Track[];
}

// Моки треков
const mockTracks: Track[] = [
    {
        id: 'track-1',
        title: 'Track One',
        duration: 185,
        albumId: '1',
        audioUrl: 'https://example.com/audio1.mp3',
        cover: Logo,
        createdAt: '123',
        groupId: '123',
        groupName: 'Group',
        updatedAt: '123',
    },
    {
        id: 'track-1',
        title: 'Track One',
        duration: 185,
        albumId: '1',
        audioUrl: 'https://example.com/audio1.mp3',
        cover: Logo,
        createdAt: '123',
        groupId: '123',
        groupName: 'Group',
        updatedAt: '123',
    },
];

// Мок объекта альбома
const mockAlbum: Album = {
    id: '1',
    name: 'Mock Album',
    cover: Logo,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    groupId: 'mock-group-id',
    trackIds: mockTracks,
};

const meta: Meta<typeof AlbumComponent> = {
    title: 'widgets/Album',
    component: AlbumComponent,
    decorators: [
        (Story) => {
            useEffect(() => {
                useAlbumStore.setState({ currentAlbum: mockAlbum });
                useTrackStore.setState({ tracks: mockTracks });
            }, []);

            return (
                <MemoryRouter>
                    <I18nextProvider i18n={i18n}>
                        <PageWrapper notCenter>
                            <Story />
                        </PageWrapper>
                    </I18nextProvider>
                </MemoryRouter>
            );
        },
    ],
};

export default meta;
type Story = StoryObj<typeof AlbumComponent>;

export const Default: Story = {};
