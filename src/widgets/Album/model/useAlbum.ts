import { useState, useEffect, useRef, useCallback, useMemo, type ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import {
    useAlbumStore,
    fetchAlbumById,
    editDescription,
    deleteAlbum,
    addTrackInAlbum,
} from 'entities/Album';
import { useGroupStore } from 'entities/Group';

export function useAlbum() {
    const { t } = useTranslation('album');
    const { albumId } = useParams<{ albumId: string }>();
    const currentGroup = useGroupStore((g) => g.currentGroup);
    const currentAlbum = useAlbumStore((s) => s.currentAlbum);
    const setCurrentAlbum = useAlbumStore((s) => s.setCurrentAlbum);

    const [desc, setDescState] = useState(currentAlbum?.description ?? '');
    const [saving, setSaving] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpenState] = useState(false);
    const [isEditing, setIsEditingState] = useState(false);
    const [loadingTrack, setLoadingTrack] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (!currentAlbum && albumId && currentGroup) {
            fetchAlbumById(currentGroup.id, albumId).catch(() => toast.error(t('loadAlbumError')));
        }
    }, [albumId, currentAlbum, currentGroup, t]);

    useEffect(() => {
        setDescState(currentAlbum?.description ?? '');
    }, [currentAlbum]);

    // мемоизированный сеттер для desc
    const setDesc = useCallback((value: string) => {
        setDescState(value);
    }, []);

    const onSave = useCallback(async () => {
        if (saving) return;
        if (!currentAlbum) {
            toast.error(t('albumNotSelected'));
            return;
        }
        setSaving(true);
        try {
            await editDescription(currentAlbum.id, desc);
            setIsEditingState(false);
        } catch {
            toast.error(t('saveError'));
        } finally {
            setSaving(false);
        }
    }, [saving, currentAlbum, desc, t]);

    const onDelete = useCallback(async () => {
        if (!currentAlbum) {
            toast.error(t('albumNotSelected'));
            return;
        }
        try {
            await deleteAlbum(currentAlbum.id);
            setCurrentAlbum(null);
            toast.success(t('albumDeleted'));
        } catch {
            toast.error(t('deleteError'));
        } finally {
            setIsDeleteModalOpenState(false);
        }
    }, [currentAlbum, setCurrentAlbum, t]);

    const openFileDialog = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const onFileChange = useCallback(
        async (e: ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (files && files.length > 0) {
                const file = files[0];

                if (!currentGroup || !currentAlbum) {
                    toast.error(t('albumOrGroupNotSelected'));
                    e.target.value = '';
                    return;
                }

                setLoadingTrack(true);

                try {
                    await addTrackInAlbum(currentGroup, currentAlbum, file);
                } catch (error) {
                    toast.error(t('uploadTrackError'));
                    console.error(error);
                } finally {
                    setLoadingTrack(false);
                    e.target.value = '';
                }
            }
        },
        [currentGroup, currentAlbum, t],
    );

    const setIsDeleteModalOpen = useCallback((value: boolean) => {
        setIsDeleteModalOpenState(value);
    }, []);

    const setIsEditing = useCallback((value: boolean) => {
        setIsEditingState(value);
    }, []);

    return useMemo(
        () => ({
            currentAlbum,
            desc,
            setDesc,
            saving,
            isDeleteModalOpen,
            setIsDeleteModalOpen,
            isEditing,
            setIsEditing,
            onSave,
            onDelete,
            fileInputRef,
            openFileDialog,
            onFileChange,
            loadingTrack,
        }),
        [
            currentAlbum,
            desc,
            setDesc,
            saving,
            isDeleteModalOpen,
            setIsDeleteModalOpen,
            isEditing,
            setIsEditing,
            onSave,
            onDelete,
            openFileDialog,
            onFileChange,
            loadingTrack,
        ],
    );
}
