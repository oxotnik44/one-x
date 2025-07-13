import type { Meta, StoryObj } from '@storybook/react-vite';
import { Player } from './Player';

const meta: Meta<typeof Player> = {
    title: 'Features/Player',
    component: Player,
    decorators: [
        (Story) => (
            <div style={{ position: 'relative', minHeight: 300 }}>
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof Player>;

export const Default: Story = {};
