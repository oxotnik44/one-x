import { ListAlbum } from './ListAlbum';
import { MemoryRouter } from 'react-router-dom';
import { useAlbumStore } from '../model/slice/useAlbumStore';
import { useGroupStore, type Group } from 'entities/Group';
import { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Album } from '../model/types/types';

export default {
    title: 'entities/ListAlbum',
    component: ListAlbum,
    decorators: [
        (Story) => (
            <MemoryRouter>
                <MockStoreDecorator />
                <Story />
            </MemoryRouter>
        ),
    ],
} satisfies Meta<typeof ListAlbum>;

type Story = StoryObj<typeof ListAlbum>;

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

const mockGroup: Group = {
    id: 'group-1',
    userId: 'user-1',
    name: 'Test Group',
    cover: '',
    genre: 'Рок', // должен быть из genresList
    createdAt: new Date().toISOString(),
};

const MockStoreDecorator = () => {
    const setAlbums = useAlbumStore((state) => state.setAlbums);
    const setGroup = useGroupStore((state) => state.setCurrentGroup);

    useEffect(() => {
        setAlbums(mockAlbums);
        setGroup(mockGroup);
    }, []);

    return null;
};

export const Default: Story = {};
