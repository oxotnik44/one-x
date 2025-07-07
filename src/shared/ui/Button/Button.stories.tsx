import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, ButtonSize, ButtonTheme } from './Button';

const meta: Meta<typeof Button> = {
    title: 'shared/Button',
    component: Button,
    tags: ['autodocs'],

    args: {
        children: 'Button',
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Outline: Story = {
    args: {
        theme: ButtonTheme.OUTLINE,
    },
};

export const Clear: Story = {
    args: {
        theme: ButtonTheme.CLEAR,
    },
};

export const SquareM: Story = {
    args: {
        size: ButtonSize.M,
        children: 'Text',
    },
};

export const SquareL: Story = {
    args: {
        size: ButtonSize.L,
        children: 'Text',
    },
};

export const SquareXL: Story = {
    args: {
        size: ButtonSize.XL,
        children: 'Text',
    },
};

export const Square: Story = {
    args: {
        square: true,
        children: '>',
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
    },
};
export const SquareDisabled: Story = {
    args: {
        square: true,
        disabled: true,
        children: 'Text',
    },
};
