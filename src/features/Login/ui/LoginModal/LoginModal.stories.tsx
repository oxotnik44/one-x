import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';

import { LoginModal } from './LoginModal';

const meta: Meta<typeof LoginModal> = {
    title: 'features/Login/LoginModal',
    component: LoginModal,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <MemoryRouter>
                <Story />
            </MemoryRouter>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof LoginModal>;

export const Default: Story = {
    render: () => {
        const [isOpen, setIsOpen] = useState(true);

        const handleClose = () => setIsOpen(false);

        return <LoginModal isOpen={isOpen} onClose={handleClose} />;
    },
};
