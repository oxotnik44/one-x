import type { Meta, StoryObj } from '@storybook/react-vite';
import { MainPage } from './MainPage';
import { useSidebarStore } from 'widgets/Sidebar/model/sidebarStore';

const meta: Meta<typeof MainPage> = {
    title: 'pages/MainPage',
    component: MainPage,
    decorators: [
        (Story) => {
            // Устанавливаем состояние сайдбара (развернутый)
            useSidebarStore.setState({ isCollapsed: false });

            return (
                <div style={{ height: '100vh', backgroundColor: '#141414', padding: '1rem' }}>
                    <Story />
                </div>
            );
        },
    ],
};

export default meta;
type Story = StoryObj<typeof MainPage>;

export const Default: Story = {};

export const SidebarCollapsed: Story = {
    decorators: [
        (Story) => {
            useSidebarStore.setState({ isCollapsed: true });
            return <Story />;
        },
    ],
};
