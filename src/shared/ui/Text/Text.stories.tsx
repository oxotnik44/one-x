import type { Meta, StoryObj } from '@storybook/react';
import { Text } from './Text';

const meta: Meta<typeof Text> = {
    title: 'shared/Text',
    component: Text,
    tags: ['autodocs'],
    args: {
        title: 'Заголовок',
        text: 'Это простой текст',
    },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Default: Story = {};

export const OnlyTitle: Story = {
    args: {
        text: undefined,
    },
};

export const OnlyText: Story = {
    args: {
        title: undefined,
    },
};

export const Small: Story = {
    args: {
        size: 'small',
    },
};

export const Medium: Story = {
    args: {
        size: 'medium',
    },
};

export const Large: Story = {
    args: {
        size: 'large',
    },
};

export const LinkText: Story = {
    args: {
        isLink: true,
        text: 'Ссылка на что-то',
        title: undefined,
    },
};
