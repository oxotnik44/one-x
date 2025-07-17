// src/widgets/Group/ui/Group.stories.tsx
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Group } from './Group';
// Импортируем ваш логотип
import Logo from '/assets/Logo.webp';
// Zustand‑стор группы и типы
import { useGroupStore } from 'entities/Group';
import { genresList } from 'entities/Group/model/types/group';

// Замокаем full‑object для currentGroup
useGroupStore.setState({
    currentGroup: {
        id: 'mock‐group-1',
        userId: 'mock-user-1',
        name: 'Storybook Group',
        description: 'Группа для демонстрации в Storybook',
        cover: Logo,
        genre: genresList[0], // например, 'Рок'
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
});

export default {
    title: 'Widgets/Group',
    component: Group,
    decorators: [
        (Story: React.FC) => (
            <MemoryRouter>
                <Story />
            </MemoryRouter>
        ),
    ],
};

export const Default = {
    render: () => <Group />,
};
