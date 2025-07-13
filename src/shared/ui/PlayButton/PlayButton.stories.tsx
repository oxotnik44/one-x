import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useState } from 'react';
import { PlayButton } from './PlayButton';
import { ButtonTheme } from 'shared/ui/Button/Button';

const meta: Meta<typeof PlayButton> = {
    title: 'shared/PlayButton',
    component: PlayButton,
    tags: ['autodocs'],
    args: {
        theme: ButtonTheme.OUTLINE,
        isCurrent: true,
    },
};

export default meta;
type Story = StoryObj<typeof PlayButton>;

const PlayButtonWrapper: React.FC<{ initialPlaying?: boolean }> = ({ initialPlaying = false }) => {
    const [isPlaying, setIsPlaying] = useState(initialPlaying);
    const toggle = () => setIsPlaying((prev) => !prev);

    return (
        <PlayButton
            isPlaying={isPlaying}
            isCurrent={true}
            onClick={toggle}
            theme={ButtonTheme.OUTLINE}
        />
    );
};

export const Playing: Story = {
    render: () => <PlayButtonWrapper initialPlaying={true} />,
};

export const Paused: Story = {
    render: () => <PlayButtonWrapper initialPlaying={false} />,
};
