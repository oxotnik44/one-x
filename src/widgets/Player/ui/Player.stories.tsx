import type { Meta, StoryObj } from '@storybook/react';
import { Player } from './Player';
import { ThemeProviders } from 'app/providers/ThemeProviders/ThemeProviders';

const meta: Meta<typeof Player> = {
    title: 'widgets/Player',
    component: Player,
    decorators: [
        (Story) => (
            <ThemeProviders>
                <div style={{ position: 'relative', minHeight: 300 }}>
                    <Story />
                </div>
            </ThemeProviders>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof Player>;

export const Default: Story = {
    // Чтобы убрать логику из usePlayer,
    // можно замокать его через jest или просто сделать заглушку:
    // Но в этом простом сторибуке мы не прокидываем props,
    // просто покажем компонент (он будет использовать дефолтное состояние usePlayer)
};
