import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { RegistrationModal } from './RegistrationModal';

const meta: Meta<typeof RegistrationModal> = {
    title: 'Features/Registration/RegistrationModal',
    component: RegistrationModal,
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
type Story = StoryObj<typeof RegistrationModal>;

export const Default: Story = {
    args: {
        isOpen: true,
        onClose: () => alert('Модалка закрыта'),
    },
};
