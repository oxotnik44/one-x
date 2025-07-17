import type { Meta, StoryObj } from '@storybook/react-vite';
import { LoginForm } from './LoginForm';
import { MemoryRouter } from 'react-router-dom';

const meta: Meta<typeof LoginForm> = {
    title: 'features/Login/LoginForm',
    component: LoginForm,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <MemoryRouter>
                <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
                    <Story />
                </div>
            </MemoryRouter>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof LoginForm>;

export const Default: Story = {};
