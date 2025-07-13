import type { Meta, StoryObj } from '@storybook/react-vite';
import { EditGroupForm } from './EditGroupForm';
import { MemoryRouter } from 'react-router-dom';

const meta: Meta<typeof EditGroupForm> = {
    title: 'Features/EditGroupForm',
    component: EditGroupForm,
    decorators: [
        (Story) => (
            <MemoryRouter>
                <Story />
            </MemoryRouter>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof EditGroupForm>;

export const Default: Story = {
    render: () => <EditGroupForm />,
};
