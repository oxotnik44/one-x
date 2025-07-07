import type { Meta, StoryObj } from '@storybook/react-vite';
import { MainPage } from './MainPage';
import { useSidebarStore } from 'widgets/Sidebar/model/sidebarStore';
import { ThemeProviders } from 'app/providers/ThemeProviders/ThemeProviders';

const meta: Meta<typeof MainPage> = {
    title: 'pages/MainPage',
    component: MainPage,
    decorators: [
        (Story) => {
            // Устанавливаем состояние сайдбара (развернутый)
            useSidebarStore.setState({ isCollapsed: false });

            return (
                <ThemeProviders>
                    <div style={{ height: '100vh', backgroundColor: '#141414', padding: '1rem' }}>
                        <Story />
                    </div>
                </ThemeProviders>
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
