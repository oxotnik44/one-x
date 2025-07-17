// src/widgets/AddAlbumForm/ui/AddAlbumForm.tsx
import React from 'react';
import { IoFolderOpen } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { useAddAlbumForm } from '../model/useAddAlbumForm';
import { Button, ButtonSize, ButtonTheme, FilePicker, Input } from 'shared/ui';

export const AddAlbumForm: React.FC = () => {
    const {
        onFolderChange,
        watch,
        errors,
        folderSelected,
        folderName,
        coverPreview,
        trackCount,
        submitHandler,
    } = useAddAlbumForm();

    const { t } = useTranslation('addAlbumForm');
    const albumTitle = watch('title');

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                submitHandler()();
            }}
            className="flex flex-col gap-6 w-full max-w-md mx-auto"
        >
            {/* FilePicker или превью обложки */}
            {coverPreview ? (
                <img
                    src={coverPreview}
                    alt={t('coverPreviewAlt')}
                    className="w-32 h-32 object-cover rounded-md shadow-md mx-auto cursor-pointer"
                    title={t('selectFolder')}
                    onClick={() => {
                        const input = document.querySelector('input[type=file]');
                        if (input && 'click' in input && typeof input.click === 'function') {
                            (input as HTMLInputElement).click();
                        }
                    }}
                />
            ) : (
                <FilePicker
                    directory
                    onChange={onFolderChange}
                    placeholder={<IoFolderOpen size={48} />}
                    title={t('selectFolder')}
                    active={folderSelected}
                />
            )}
            {errors.folder && <p className="text-red-600 text-sm mt-1">{t('folderRequired')}</p>}
            {/* Предупреждение, если cover не найден */}
            {folderSelected && trackCount > 0 && !coverPreview && (
                <p className="text-red-600 text-sm mt-1">{t('noCoverFound')}</p>
            )}
            {folderSelected && trackCount === 0 && (
                <p className="text-red-600 text-sm mt-1">{t('noTracksFound')}</p>
            )}

            <Input placeholder={t('albumTitle')} className={errors.title ? 'border-red-600' : ''} />

            {!albumTitle && folderSelected && (
                <p className="text-yellow-600 text-sm mt-1">
                    {t('titleFromFolder')} <b>{folderName}</b>
                </p>
            )}

            <Button
                type="submit"
                theme={ButtonTheme.OUTLINE}
                size={ButtonSize.L}
                className="self-center mt-2"
            >
                {t('addAlbum')}
            </Button>
        </form>
    );
};
