import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Modal } from './Modal';

const meta: Meta<typeof Modal> = {
    title: 'shared/Modal',
    component: Modal,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
    render: () => {
        const [isOpen, setIsOpen] = useState(true);

        return (
            <>
                <button
                    onClick={() => setIsOpen(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Открыть модалку
                </button>
                <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                    <div className="text-white">Контент модального окна</div>
                </Modal>
            </>
        );
    },
};
