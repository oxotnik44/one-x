// src/features/Player/ui/Player.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { Player } from './Player';
import { MemoryRouter } from 'react-router-dom';

import { usePlayerStore } from 'entities/Player/model/slice/usePlayerStore';
import { useUserStore } from 'entities/User';

// Мок трека для стора
const mockCurrentTrack = {
    id: 'track-1',
    title: 'Тестовый трек',
    groupName: 'Test Group',
    cover: '/assets/Logo.webp',
    duration: 210,
    groupId: 'group-1',
    audioUrl: '/audio/test.mp3',
    createdAt: new Date().toISOString(),
};

const mockUser = {
    id: 'user-1',
    username: 'TestUser',
    password: 'secret',
    avatar: '/assets/avatar.png',
    createdAt: new Date().toISOString(),
    likedTracks: ['track-1'],
};

const withMockStores = (Story: React.FC) => {
    // Устанавливаем состояние плеера
    usePlayerStore.setState({
        currentTrack: mockCurrentTrack,
        progress: 37,
        currentTime: 77,
        isPlaying: true,
        duration: 210,
        volume: 0.8,
        isMuted: false,
        audio: null,
        setCurrentTrack: () => {},
        setProgress: () => {},
        setIsPlaying: () => {},
        setDuration: () => {},
        setVolume: () => {},
        setIsMuted: () => {},
        togglePlay: () => {},
    });

    // Устанавливаем пользователя
    useUserStore.setState({
        authData: mockUser,
        setAuthData: () => {},
        logout: () => {},
        toggleLikeTrack: () => {},
    });

    return <Story />;
};

const meta: Meta<typeof Player> = {
    title: 'Features/Player',
    component: Player,
    decorators: [
        withMockStores,
        (Story) => (
            <MemoryRouter>
                <div style={{ position: 'relative', minHeight: 300 }}>
                    <Story />
                </div>
            </MemoryRouter>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof Player>;

export const Default: Story = {};
