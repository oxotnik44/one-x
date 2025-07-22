import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sidebar } from './Sidebar';
import { MemoryRouter } from 'react-router-dom';
import { useGroupStore, type Group } from 'entities/Group';
import Logo from '/assets/Logo.webp';

const mockGroup: Group = {
    id: '1',
    name: 'Mock Group',
    userId: 'user-1',
    genre: 'Рок',
    cover: Logo,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};
const meta: Meta<typeof Sidebar> = {
    title: 'widgets/Sidebar',
    component: Sidebar,
    decorators: [
        (Story) => {
            useGroupStore.setState({ currentGroup: mockGroup });
            return (
                <MemoryRouter initialEntries={['/my_group']}>
                    <div style={{ height: '100vh', backgroundColor: '#141414' }}>
                        <Story />
                    </div>
                </MemoryRouter>
            );
        },
    ],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {};
