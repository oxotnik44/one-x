import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { GroupCover } from './GroupCover';
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
const meta: Meta<typeof GroupCover> = {
    title: 'shared/GroupCover',
    component: GroupCover,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof GroupCover>;

export const Default: Story = {
    args: {
        edit: false,
        preview: null,
        onIconChange: undefined,
    },
};

export const WithPreview: Story = {
    args: {
        edit: false,
        preview: 'https://via.placeholder.com/256x256.png?text=Preview+Image',
    },
};

export const Editable: Story = {
    render: () => {
        const [preview, setPreview] = useState<string | null>(Logo);
        useGroupStore.setState({ currentGroup: mockGroup });

        const handleIconChange = (files: FileList | null) => {
            if (files && files[0]) {
                const url = URL.createObjectURL(files[0]);
                setPreview(url);
            }
        };

        return <GroupCover edit preview={preview} onIconChange={handleIconChange} />;
    },
};
