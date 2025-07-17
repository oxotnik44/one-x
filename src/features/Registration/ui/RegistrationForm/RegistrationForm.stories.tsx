import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { RegistrationForm } from './RegistrationForm';

const meta: Meta<typeof RegistrationForm> = {
    title: 'Features/Registration/RegistrationForm',
    component: RegistrationForm,
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
type Story = StoryObj<typeof RegistrationForm>;

export const Default: Story = {
    args: {
        onSuccess: () => alert('Регистрация успешна!'),
    },
};
