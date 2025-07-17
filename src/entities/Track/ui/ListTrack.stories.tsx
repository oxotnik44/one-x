import type { Meta, StoryObj } from '@storybook/react-vite';
import { ListTrack } from './ListTrack';
import { MemoryRouter } from 'react-router-dom';
import { useTrackStore, type Track } from 'entities/Track';
import Logo from '/assets/Logo.webp';
import { useGroupStore } from 'entities/Group';

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

// Storybook meta
const meta: Meta<typeof ListTrack> = {
    title: 'entities/ListTrack',
    component: ListTrack,
    decorators: [
        (Story) => {
            // Установка стейта прямо в декораторе
            useGroupStore.setState({
                currentGroup: {
                    id: 'group-1',
                    name: 'User',
                    cover: Logo,
                    description: 'Описание',
                    genre: 'Рок',
                    userId: 'user-1',
                    createdAt: '',
                },
            });

            useTrackStore.setState({
                tracks: mockTracks,
                setTracks: () => {},
            });

            return (
                <MemoryRouter>
                    <Story />
                </MemoryRouter>
            );
        },
    ],
};

export default meta;
type Story = StoryObj<typeof ListTrack>;

export const Default: Story = {
    render: () => <ListTrack />,
};
