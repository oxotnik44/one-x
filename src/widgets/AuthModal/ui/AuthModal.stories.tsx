// src/widgets/AuthModal/ui/AuthModal.stories.tsx
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AuthModal } from './AuthModal';
import { MemoryRouter } from 'react-router-dom';

const meta: Meta<typeof AuthModal> = {
    title: 'widgets/AuthModal',
    component: AuthModal,
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (Story) => (
            <MemoryRouter>
                <Story />
            </MemoryRouter>
        ),
    ],
};

export default meta;

type Story = StoryObj<typeof AuthModal>;

export const Default: Story = {
    render: () => {
        const [isOpen, setIsOpen] = useState(true);
        const [isLogin, setIsLogin] = useState(true);

        const handleClose = () => setIsOpen(false);

        return (
            <AuthModal
                isOpen={isOpen}
                onClose={handleClose}
                isLogin={isLogin}
                setIsLogin={setIsLogin}
            />
        );
    },
};
