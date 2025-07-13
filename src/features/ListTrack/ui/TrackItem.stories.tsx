import type { Meta, StoryObj } from '@storybook/react-vite';
import { TrackItem } from './TrackItem';
import { MemoryRouter } from 'react-router-dom';
import type { Track } from 'entities/Track';
import Logo from 'shared/assets/Logo.png';

// Простой мок трека
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

const meta: Meta<typeof TrackItem> = {
    title: 'Features/TrackItem',
    component: TrackItem,
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
type Story = StoryObj<typeof TrackItem>;

export const Default: Story = {
    args: {
        track: mockTrack,
        groupName: 'TestGroup',
    },
};
