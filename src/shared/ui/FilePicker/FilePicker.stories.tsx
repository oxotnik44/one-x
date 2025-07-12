import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilePicker } from './FilePicker';
import { RxSpeakerLoud } from 'react-icons/rx';
import { IoMdMusicalNote } from 'react-icons/io';

const meta: Meta<typeof FilePicker> = {
    title: 'Shared/FilePicker/Interactive',
    component: FilePicker,
};
export default meta;

type Story = StoryObj<typeof FilePicker>;

// 🎨 Для изображений
const ImagePicker = () => {
    const [preview, setPreview] = useState<string | null>(null);

    return (
        <FilePicker
            accept="image/*"
            previewUrl={preview}
            placeholder={<span>Upload image</span>}
            onChange={(files) => {
                if (files && files[0]) {
                    const url = URL.createObjectURL(files[0]);
                    setPreview(url);
                }
            }}
        />
    );
};

// 🎵 Для аудио
const AudioPicker = () => {
    const [audioSelected, setAudioSelected] = useState(false);

    return (
        <FilePicker
            key={audioSelected ? 'selected' : 'default'} // 🔁 форсируем пересоздание
            accept="audio/mpeg"
            placeholder={
                audioSelected ? <IoMdMusicalNote size={48} /> : <RxSpeakerLoud size={48} />
            }
            active={audioSelected}
            onChange={(files) => {
                if (files && files.length > 0) {
                    setAudioSelected(true);
                    console.log('Audio selected:', files[0]);
                }
            }}
        />
    );
};

export const ImageUpload: Story = {
    name: '🖼️ Upload Image with Preview',
    render: () => <ImagePicker />,
};

export const AudioUpload: Story = {
    name: '🎵 Upload Audio with Icon Switch',
    render: () => <AudioPicker />,
};
