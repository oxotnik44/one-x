// src/widgets/AddAlbumForm/model/useAddAlbumForm.ts
import { useEffect, useMemo, useState } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import { useGroupStore } from 'entities/Group/model/slice/useGroupStore';
import { getAudioDuration } from 'shared/lib/getAudioDuration/getAudioDuration';
import { extractTitleFromFile } from 'shared/lib/extractTitleFromFile/extractTitleFromFile';
import { addAlbum } from 'entities/Album';
import { useNavigate } from 'react-router-dom';

export interface FolderFields extends FieldValues {
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
    const folderName = useMemo(() => {
        const file = folder?.[0] as File & { webkitRelativePath?: string };
        return file?.webkitRelativePath?.split('/')[0] ?? '';
    }, [folder]);
    const navigate = useNavigate();

    useEffect(() => {
        register('folder', { required: 'folderRequired' });
        register('title');
        register('description'); // регистрируем description
    }, [register]);

    const onFolderChange = (files: FileList | null) => {
        if (!files?.length) return;

        clearErrors(['folder', 'title']);
        setValue('folder', files, { shouldValidate: true });

        const arr = Array.from(files);

        // Выбираем обложку
        const cover =
            arr.find((f) => /cover\.(jpe?g|png|gif|webp)$/i.test(f.name)) ??
            arr.find((f) => /\.(jpe?g|png|gif|webp)$/i.test(f.name)) ??
            null;

        setCoverFile(cover);
        setCoverPreview(cover ? URL.createObjectURL(cover) : null);

        // Аудиофайлы
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
