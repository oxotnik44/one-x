// src/widgets/Group/ui/Group.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Group } from './Group';
import { useGroupStore } from 'entities/Group/model/slice/useGroupStore';
import { useGroupContentSwitcherStore } from '../model/useGroup';
import { useEffect } from 'react';
import { MemoryRouter } from 'react-router-dom';

const meta: Meta<typeof Group> = {
    title: 'Widgets/Group',
    component: Group,
    decorators: [
        (Story) => (
            <MemoryRouter>
                <Story />
            </MemoryRouter>
        ),
    ],
};
export default meta;

type Story = StoryObj<typeof Group>;

export const Default: Story = {
    render: () => {
        useEffect(() => {
            useGroupStore.setState({
                currentGroup: {
                    groupId: 'group-1',
                    name: 'User',
                    cover: '',
                    description: 'Лучшая группа всех времён',
                    genre: 'Рок',
                    userId: 'user-1',
                    createdAt: '',
                },
            });

            useGroupContentSwitcherStore.setState({
                selected: 'singles',
            });
        }, []);

        return <Group />;
    },
};
