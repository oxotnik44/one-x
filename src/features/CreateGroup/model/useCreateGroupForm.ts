import { useForm } from 'react-hook-form';
import { useState, useEffect, useCallback } from 'react';
import { createGroup } from 'entities/Group/model/api/createGroup';
import type { CreateGroupFormData } from './types/types';
import type { Genre } from 'entities/Group/model/types/group';

export function useCreateGroupForm() {
    const [preview, setPreview] = useState<string | null>(null);
    const [isHorizontal, setIsHorizontal] = useState(false);
    const [createdGenres, setCreatedGenres] = useState<Genre[]>([]);

    const {
        control,
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<CreateGroupFormData>({
        defaultValues: { name: '', description: '', icon: null, genre: undefined },
    });

    const iconFiles = watch('icon');

    const checkLayout = useCallback(() => setIsHorizontal(window.innerHeight < 600), []);

    useEffect(() => {
        checkLayout();
        window.addEventListener('resize', checkLayout);
        return () => window.removeEventListener('resize', checkLayout);
    }, [checkLayout]);

    useEffect(() => {
        if (iconFiles?.length) {
            const url = URL.createObjectURL(iconFiles[0]);
            setPreview(url);
            return () => URL.revokeObjectURL(url);
        }
        setPreview(null);
    }, [iconFiles]);

    const onSubmit = async (data: CreateGroupFormData) => {
        const createdGroup = await createGroup(data);
        if (createdGroup) {
            reset();
            setPreview(null);
            if (data.genre !== undefined) {
                setCreatedGenres((prev) => [...prev, data.genre as Genre]);
            }
        }
    };

    const handleIconClick = () => document.getElementById('icon-upload')?.click();

    return {
        control,
        register,
        handleSubmit,
        watch,
        reset,
        errors,
        isSubmitting,
        preview,
        setValue,
        isHorizontal,
        createdGenres,
        handleIconClick,
        handleSubmitForm: () => void handleSubmit(onSubmit)(),
    };
}
