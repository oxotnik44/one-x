// src/widgets/AddAlbumForm/model/useAddAlbumForm.ts
import { useEffect, useState } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import { addAlbum } from 'entities/Album';
import { useNavigate } from 'react-router-dom';
import { useGroupStore } from 'entities/Group';
import { extractTitleFromFile, getAudioDuration } from 'shared/lib';

interface FolderFields extends FieldValues {
    title: string;
    folder: FileList;
    description?: string;
}

export function useAddAlbumForm() {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        clearErrors,
        formState: { errors },
    } = useForm<FolderFields>();

    const groupName = useGroupStore((s) => s.currentGroup?.name || '');
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [trackFiles, setTrackFiles] = useState<File[]>([]);

    const folder = watch('folder');
    const folderSelected = Boolean(folder?.length);
    const [folderName, setFolderName] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        register('folder', { required: 'folderRequired' });
        register('title');
        register('description'); // регистрируем description
    }, [register]);

    const onFolderChange = (files: FileList | null, name?: string) => {
        if (!files?.length) return;

        clearErrors(['folder', 'title']);
        setValue('folder', files, { shouldValidate: true });

        setFolderName(name ?? '');

        const arr = Array.from(files);

        // Обложка
        const cover =
            arr.find((f) => /cover\.(jpe?g|png|gif|webp)$/i.test(f.name)) ??
            arr.find((f) => /\.(jpe?g|png|gif|webp)$/i.test(f.name)) ??
            null;

        setCoverFile(cover);
        setCoverPreview(cover ? URL.createObjectURL(cover) : null);

        // Треки
        setTrackFiles(arr.filter((f) => /\.(mp3|wav|flac)$/i.test(f.name)));
    };

    const submitHandler = (onSuccess?: () => void) =>
        handleSubmit(async ({ title, description }) => {
            // добавляем description сюда
            const finalTitle = title?.trim() || folderName;
            if (!finalTitle || !coverFile || trackFiles.length === 0) return;

            const preparedTracks = await Promise.all(
                trackFiles.map(async (file) => ({
                    file,
                    title: extractTitleFromFile(file),
                    duration: await getAudioDuration(file),
                })),
            );

            await addAlbum({
                title: finalTitle,
                groupName,
                description, // передаем description
                cover: coverFile,
                tracks: preparedTracks,
            });

            onSuccess?.();
            navigate(-1);
        });

    return {
        register,
        watch,
        errors,
        onFolderChange,
        folderSelected,
        folderName,
        coverPreview,
        trackCount: trackFiles.length,
        submitHandler,
        setValue,
    };
}
