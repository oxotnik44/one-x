import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AuthModal } from './AuthModal';

const meta: Meta<typeof AuthModal> = {
    title: 'widgets/AuthModal',
    component: AuthModal,
    parameters: {
        layout: 'centered',
    },
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
