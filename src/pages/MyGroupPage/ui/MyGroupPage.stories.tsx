import type { Meta, StoryObj } from '@storybook/react-vite';
import { MyGroupPage } from './MyGroupPage';

const meta: Meta<typeof MyGroupPage> = {
    title: 'Pages/MyGroupPage',
    component: MyGroupPage,
    decorators: [
        (Story) => (
            <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof MyGroupPage>;

export const Default: Story = {
    args: {},
};
