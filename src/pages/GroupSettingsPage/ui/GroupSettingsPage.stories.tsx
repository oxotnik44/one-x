import { MemoryRouter } from 'react-router-dom'; // легковесный роутер для тестов и сторибука
import type { Meta, StoryObj } from '@storybook/react-vite';
import { GroupSettingsPage } from './GroupSettingsPage';
import Logo from '/assets/Logo.webp';
import { useGroupStore, type Group } from 'entities/Group';

const mockGroup: Group = {
    id: '1',
    name: 'Mock Group',
    userId: 'user-1',
    genre: 'Рок',
    cover: Logo,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};
const meta: Meta<typeof GroupSettingsPage> = {
    title: 'Pages/GroupSettingsPage',
    component: GroupSettingsPage,
    decorators: [
        (Story) => {
            useGroupStore.setState({ currentGroup: mockGroup });
            return (
                <MemoryRouter>
                    <div style={{ padding: 20, minHeight: 400, backgroundColor: '#f0f0f0' }}>
                        <Story />
                    </div>
                </MemoryRouter>
            );
        },
    ],
};

export default meta;
type Story = StoryObj<typeof GroupSettingsPage>;

export const Default: Story = {};
