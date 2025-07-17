import type { Meta, StoryObj } from '@storybook/react-vite';
import { TrackItem } from './TrackItem';
import { MemoryRouter } from 'react-router-dom';
import type { Track } from 'entities/Track';
import Logo from '/assets/Logo.webp';
import React, { useEffect } from 'react';
import { useUserStore } from 'entities/User';

// Мок трека
const mockTrack: Track = {
    id: 'track-1',
    title: 'Тестовый трек',
    groupName: 'TestGroup',
    cover: Logo,
    duration: 145,
    groupId: 'group-1',
    audioUrl: '/audio/test.mp3',
    createdAt: new Date().toISOString(),
};

// 👇 Мок Zustand стора для useUserStore
const UserStoreDecorator = (Story: React.FC) => {
    useEffect(() => {
        useUserStore.setState({
            authData: {
                id: 'user-1',
                username: 'tester',
                email: 'tester@example.com',
                password: 'mock-password',
                avatar: '/assets/avatar.png',
                createdAt: new Date().toISOString(),
                likedTracks: ['track-1'],
            },
        });
    }, []);

    return <Story />;
};

const meta: Meta<typeof TrackItem> = {
    title: 'entities/TrackItem',
    component: TrackItem,
    decorators: [
        (Story) => (
            <MemoryRouter>
                <div className="p-6 max-w-md mx-auto">
                    <Story />
                </div>
            </MemoryRouter>
        ),
        UserStoreDecorator, // ✅ Добавляем декоратор
    ],
};

export default meta;
type Story = StoryObj<typeof TrackItem>;

export const Default: Story = {
    args: {
        track: mockTrack,
        groupName: 'TestGroup',
    },
};
