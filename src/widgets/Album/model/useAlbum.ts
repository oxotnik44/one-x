// src/pages/Album/model/useAlbum.ts
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
import { likeAlbum } from 'entities/User/model/api/likeAlbum/likeAlbum';
import { useUserStore } from 'entities/User';

export function useAlbum() {
    const { t } = useTranslation('album');
    const { albumId } = useParams<{ albumId: string }>();
    const likedAlbums = useUserStore((state) => state.authData?.likedAlbums ?? []);
    const currentGroup = useGroupStore((g) => g.currentGroup);
    const currentAlbum = useAlbumStore((s) => s.currentAlbum);
    const setCurrentAlbum = useAlbumStore((s) => s.setCurrentAlbum);

    const [desc, setDescState] = useState(currentAlbum?.description ?? '');
    const [saving, setSaving] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpenState] = useState(false);
    const [isEditing, setIsEditingState] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (!currentAlbum && albumId && currentGroup) {
            fetchAlbumById(currentGroup.id, albumId).catch(() => toast.error(t('loadAlbumError')));
        }
    }, [albumId, currentAlbum, currentGroup]);

    useEffect(() => {
        setDescState(currentAlbum?.description ?? '');
    }, [currentAlbum]);

    const setDesc = useCallback((value: string) => {
        setDescState(value);
    }, []);

    const toggleAlbum = useCallback(() => {
        if (!currentAlbum?.id) {
            toast.error(t('albumNotSelected'));
            return;
        }
        likeAlbum(currentAlbum.id);
    }, [currentAlbum?.id, t]);

    const onSave = useCallback(async () => {
        if (saving || !currentAlbum) return;
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
            if (!files?.length) return;

            if (!currentGroup || !currentAlbum) {
                toast.error(t('albumOrGroupNotSelected'));
                e.target.value = '';
                return;
            }

            try {
                await addTrackInAlbum(currentGroup, currentAlbum, files[0]);
            } catch (error) {
                toast.error(t('uploadTrackError'));
                console.error(error);
            } finally {
                e.target.value = '';
            }
        },
        [currentGroup, currentAlbum, t],
    );

    const setIsDeleteModalOpen = useCallback((val: boolean) => {
        setIsDeleteModalOpenState(val);
    }, []);

    const setIsEditing = useCallback((val: boolean) => {
        setIsEditingState(val);
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
            toggleAlbum,
            openFileDialog,
            onFileChange,
            likedAlbums, // ← теперь включено
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
            likedAlbums, // ← добавь сюда
        ],
    );
}
