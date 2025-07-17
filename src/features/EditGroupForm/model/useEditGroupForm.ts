import { useForm } from 'react-hook-form';
import { useGroupStore } from 'entities/Group/model/slice/useGroupStore';
import { useState, useEffect } from 'react';
import type { Genre } from 'entities/Group';
import { editGroup } from 'entities/Group/model/api/editGroup/editGroup';

export interface EditGroupFormValues {
    name: string;
    description?: string;
    genre: Genre;
    icon?: FileList | null;
}

export const useEditGroupForm = () => {
    const currentGroup = useGroupStore((s) => s.currentGroup);
    const [preview, setPreview] = useState<string | null>(null);

    const {
        control,
        register,
        setValue,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<EditGroupFormValues>({
        defaultValues: { name: '', description: '', genre: 'Рок', icon: null },
    });

    useEffect(() => {
        if (currentGroup) {
            setValue('name', currentGroup.name);
            setValue('description', currentGroup.description ?? '');
            setValue('genre', currentGroup.genre ?? 'Рок');
            setPreview(currentGroup.cover ?? null);
            setValue('icon', null);
        }
    }, [currentGroup, setValue]);

    const handleIconChange = (files: FileList | null) => {
        if (files?.[0]) {
            setPreview(URL.createObjectURL(files[0]));
            setValue('icon', files); // передаём FileList в поле формы
        } else {
            setPreview(null);
            setValue('icon', null);
        }
    };

    const onSubmit = handleSubmit(async (data) => {
        if (!currentGroup) return false;
        try {
            await editGroup(currentGroup.id, {
                name: data.name,
                description: data.description ?? null,
                genre: data.genre,
                cover: currentGroup.cover,
                newIconFile: data.icon ?? null,
            });
            return true;
        } catch (error) {
            console.error('Ошибка обновления группы', error);
            return false;
        }
    });

    return {
        control,
        register,
        errors,
        isSubmitting,
        preview,
        handleIconChange,
        onSubmit,
        setValue,
        watch,
    };
};
