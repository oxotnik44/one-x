import type { Meta, StoryObj } from '@storybook/react-vite';
import { LoginForm } from './LoginForm';

const meta: Meta<typeof LoginForm> = {
    title: 'features/Login/LoginForm',
    component: LoginForm,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof LoginForm>;

// Заглушка функции onSuccess для сторис
const onSuccessMock = () => {
    // eslint-disable-next-line no-console
    console.log('Успешный логин');
};

export const Default: Story = {
    args: {
        onSuccess: onSuccessMock,
    },
};
