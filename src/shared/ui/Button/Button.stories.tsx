import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, ButtonSize, ButtonTheme } from './Button';

const meta: Meta<typeof Button> = {
    title: 'shared/Button',
    component: Button,
    tags: ['autodocs'],
    args: {
        children: 'Button',
        theme: ButtonTheme.OUTLINE,
        size: ButtonSize.L,
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

export const Back: Story = {
    args: {
        theme: ButtonTheme.BACK,
        children: '<',
    },
};

export const SizeM: Story = {
    args: {
        size: ButtonSize.M,
    },
};

export const SizeL: Story = {
    args: {
        size: ButtonSize.L,
    },
};

export const SizeXL: Story = {
    args: {
        size: ButtonSize.XL,
    },
};

export const SquareM: Story = {
    args: {
        square: true,
        size: ButtonSize.M,
        children: '>',
    },
};

export const SquareL: Story = {
    args: {
        square: true,
        size: ButtonSize.L,
        children: '>',
    },
};

export const SquareXL: Story = {
    args: {
        square: true,
        size: ButtonSize.XL,
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
        children: '>',
    },
};
