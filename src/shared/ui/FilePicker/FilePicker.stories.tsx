// src/shared/ui/FilePicker/FilePicker.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useState } from 'react';
import { FilePicker } from './FilePicker';

const meta: Meta<typeof FilePicker> = {
    title: 'shared/FilePicker',
    component: FilePicker,
    parameters: {
        layout: 'centered',
    },
};

export default meta;
type Story = StoryObj<typeof FilePicker>;

export const Default: Story = {
    render: () => {
        const [preview, setPreview] = useState<string | null>(null);

        const handleChange = (files: FileList | null) => {
            if (!files || files.length === 0) {
                setPreview(null);
                return;
            }

            const file = files[0];
            const url = URL.createObjectURL(file);
            setPreview(url);
        };

        return (
            <FilePicker
                accept="image/*"
                onChange={handleChange}
                placeholder={<div className="text-center text-gray-400">Выберите файл</div>}
                previewUrl={preview}
                title="Выберите изображение"
            />
        );
    },
};
