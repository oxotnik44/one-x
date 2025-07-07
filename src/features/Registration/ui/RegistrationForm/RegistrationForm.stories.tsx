// src/features/Registration/ui/RegistrationForm.stories.tsx

import type { Meta, StoryObj } from '@storybook/react-vite';
import { RegistrationForm } from './RegistrationForm';

const meta: Meta<typeof RegistrationForm> = {
    title: 'Features/Registration/RegistrationForm',
    component: RegistrationForm,
    parameters: {
        layout: 'centered',
    },
};

export default meta;
type Story = StoryObj<typeof RegistrationForm>;

export const Default: Story = {
    args: {
        onSuccess: () => alert('Регистрация успешна!'),
    },
};
