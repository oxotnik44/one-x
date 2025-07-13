import { ButtonSize } from 'shared/ui/Button/Button';
import { Like } from './Like';
import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useState } from 'react';

const meta: Meta<typeof Like> = {
    title: 'shared/Like',
    component: Like,
    args: {
        size: ButtonSize.M,
    },
};

export default meta;
type Story = StoryObj<typeof Like>;

// Компонент-обёртка для управления состоянием лайка в сторис
const LikeWrapper: React.FC<{ initialLiked?: boolean }> = ({ initialLiked = false }) => {
    const [liked, setLiked] = useState(initialLiked);
    const toggle = () => setLiked((prev) => !prev);

    return (
        <div className="p-4 bg-black rounded-md inline-block">
            <Like liked={liked} onToggle={toggle} />
        </div>
    );
};

export const NotLiked: Story = {
    render: () => <LikeWrapper initialLiked={false} />,
};

export const Liked: Story = {
    render: () => <LikeWrapper initialLiked={true} />,
};
