// src/pages/SettingsUserPage.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SettingsUserPage } from './SettingsUserPage';

const meta: Meta<typeof SettingsUserPage> = {
    title: 'pages/SettingsUserPage',
    component: SettingsUserPage,
    decorators: [
        (Story) => (
            <div style={{ minHeight: '100vh', padding: '2rem', backgroundColor: '#f9fafb' }}>
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof SettingsUserPage>;

export const Default: Story = {};
