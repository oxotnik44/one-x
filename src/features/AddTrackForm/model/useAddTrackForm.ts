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
            setAudioFileName(files[0].name);
        }
    };

    const submitHandler = (onSuccess?: () => void) =>
        handleSubmit(async ({ cover, audio, title }) => {
            const coverFile = cover[0];
            const audioFile = audio[0];
            if (!coverFile || !audioFile) return alert('Обложка и аудиофайл обязательны');

            const finalTitle = title?.trim() || audioFile.name.replace(/\.[^/.]+$/, '');
            await addTrack({ title: finalTitle, cover: coverFile, audio: audioFile, groupName });
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
