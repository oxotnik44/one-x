import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from './Sidebar';
import { ThemeProviders } from 'app/providers/ThemeProviders/ThemeProviders';

const meta: Meta<typeof Sidebar> = {
    title: 'widgets/Sidebar',
    component: Sidebar,
    decorators: [
        (Story) => (
            <ThemeProviders>
                <div style={{ height: '100vh', backgroundColor: '#141414' }}>
                    <Story />
                </div>
            </ThemeProviders>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {};
