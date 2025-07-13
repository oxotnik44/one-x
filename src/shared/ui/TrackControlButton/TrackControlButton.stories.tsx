import type { Meta, StoryObj } from '@storybook/react-vite';
import { TrackControlButton, type TrackDirection } from './TrackControlButton';
import { ButtonTheme } from 'shared/ui/Button/Button';

const meta: Meta<typeof TrackControlButton> = {
    title: 'shared/TrackControlButton',
    component: TrackControlButton,
    tags: ['autodocs'],
    args: {
        theme: ButtonTheme.OUTLINE,
    },
};

export default meta;
type Story = StoryObj<typeof TrackControlButton>;

export const Prev: Story = {
    args: {
        direction: 'prev' as TrackDirection,
        ariaLabel: 'Предыдущий трек',
        onClick: () => alert('Prev clicked'),
    },
};

export const Next: Story = {
    args: {
        direction: 'next' as TrackDirection,
        ariaLabel: 'Следующий трек',
        onClick: () => alert('Next clicked'),
    },
};
