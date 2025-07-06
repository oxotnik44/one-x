// src/shared/ui/Input/Input.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
    title: 'shared/Input',
    component: Input,
    tags: ['autodocs'],
    args: {
        value: '',
        placeholder: 'Введите текст...',
    },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
    args: {
        value: 'Hello World',
    },
};

export const Placeholder: Story = {
    args: {
        placeholder: 'Email',
    },
};

export const Autofocus: Story = {
    args: {
        autofocus: true,
    },
};

export const Readonly: Story = {
    args: {
        readonly: true,
        value: 'Только для чтения',
    },
};

export const PasswordType: Story = {
    args: {
        type: 'password',
        placeholder: 'Введите пароль',
        value: 'supersecret',
    },
};
