import React from 'react';
import { MemoryRouter } from 'react-router-dom'; // легковесный роутер для тестов и сторибука
import type { Meta, StoryObj } from '@storybook/react-vite';
import { GroupSettingsPage } from './GroupSettingsPage';

const meta: Meta<typeof GroupSettingsPage> = {
    title: 'Pages/GroupSettingsPage',
    component: GroupSettingsPage,
    decorators: [
        (Story) => (
            <MemoryRouter>
                <div style={{ padding: 20, minHeight: 400, backgroundColor: '#f0f0f0' }}>
                    <Story />
                </div>
            </MemoryRouter>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof GroupSettingsPage>;

export const Default: Story = {};
