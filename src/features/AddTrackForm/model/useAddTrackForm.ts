import { useGroupStore } from 'entities/Group/model/slice/useGroupStore';
import { addTrack } from 'entities/Track/api/addTrack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export interface FormData {
    title: string;
    cover: FileList;
    audio: FileList;
}

export function useAddTrackForm() {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormData>();

    const groupName = useGroupStore((s) => s.currentGroup?.name);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [audioFileName, setAudioFileName] = useState<string | null>(null);
    const [audioDuration, setAudioDuration] = useState<number | null>(null);

    useEffect(() => {
        register('cover', { required: true });
        register('audio', { required: true });
        register('title');
    }, [register]);

    const handleFileChange = (field: 'cover' | 'audio', files: FileList | null) => {
        if (!files || files.length === 0) return;

        setValue(field, files, { shouldValidate: true });

        if (field === 'cover') {
            setCoverPreview(URL.createObjectURL(files[0]));
        } else {
            const file = files[0];
            setAudioFileName(file.name);

            // Получаем длительность аудиофайла
            const audio = document.createElement('audio');
            audio.preload = 'metadata';
            audio.src = URL.createObjectURL(file);
            audio.onloadedmetadata = () => {
                URL.revokeObjectURL(audio.src);
                setAudioDuration(audio.duration); // в секундах (float)
            };
        }
    };

    const submitHandler = (onSuccess?: () => void) =>
        handleSubmit(async ({ cover, audio, title }) => {
            const coverFile = cover[0];
            const audioFile = audio[0];

            const finalTitle = title?.trim() || audioFile.name.replace(/\.[^/.]+$/, '');

            if (audioDuration == null) {
                alert('Не удалось получить длительность аудио. Пожалуйста, подождите.');
                return;
            }

            await addTrack({
                title: finalTitle,
                cover: coverFile,
                audio: audioFile,
                duration: Math.round(audioDuration), // округляем до целых секунд
                groupName,
            });

            onSuccess?.();
        });

    return {
        register,
        watch,
        setValue,
        errors,
        coverPreview,
        audioSelected: !!audioFileName,
        audioFileName,
        onCoverChange: (f: FileList | null) => handleFileChange('cover', f),
        onAudioChange: (f: FileList | null) => handleFileChange('audio', f),
        submitHandler,
    };
}
