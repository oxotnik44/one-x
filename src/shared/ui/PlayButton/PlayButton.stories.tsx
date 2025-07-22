// src/shared/ui/PlayButton/PlayButton.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { PlayButton } from './PlayButton';
import { ButtonTheme } from 'shared/ui/Button/Button';
import type { Album as AlbumType } from 'entities/Album';
import type { Track } from 'entities/Track';
import { useTrackStore } from 'entities/Track';
import { useAlbumStore } from 'entities/Album';
import { useGroupStore } from 'entities/Group';
import Logo from '/assets/Logo.webp';
import { usePlayerStore } from 'entities/Player/model';

const meta: Meta<typeof PlayButton> = {
    title: 'shared/PlayButton',
    component: PlayButton,
    tags: ['autodocs'],
    args: {
        theme: ButtonTheme.OUTLINE,
    },
};

export default meta;
type Story = StoryObj<typeof PlayButton>;

// Моки треков
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

// Мок альбома
const mockAlbum: AlbumType = {
    id: 'album-123',
    name: 'Mock Album',
    description: 'Описание альбома',
    cover: Logo,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    groupId: 'group-1',
    trackIds: ['track-1', 'track-2'],
};

// Обёртка с установкой моков в Zustand
const PlayButtonWrapper: React.FC<{
    isPlaying?: boolean;
}> = ({ isPlaying = false }) => {
    useTrackStore.setState({
        tracks: mockTracks,
    });

    useAlbumStore.setState({ currentAlbum: mockAlbum });

    useGroupStore.setState({
        currentGroup: {
            id: 'group-1',
            name: 'User',
            userId: 'user-1',
            genre: 'Рок',
            cover: Logo,
            createdAt: new Date().toISOString(),
        },
    });

    usePlayerStore.setState({
        isPlaying,
        currentTrack: mockTracks[0],
    });

    return (
        <PlayButton
            albumForPlay={mockAlbum}
            trackForPlay={mockTracks[0]}
            theme={ButtonTheme.OUTLINE}
        />
    );
};

export const Playing: Story = {
    render: () => <PlayButtonWrapper isPlaying={true} />,
};

export const Paused: Story = {
    render: () => <PlayButtonWrapper isPlaying={false} />,
};
