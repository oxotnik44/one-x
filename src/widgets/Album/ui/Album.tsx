import React from 'react';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { Button, Text, Input, ConfirmDeleteModal } from 'shared/ui';
import { useTranslation } from 'react-i18next';

import { ListTrack } from 'entities/Track';
import { useAlbum } from '../model/useAlbum';
import { formatDate } from 'shared/lib/formatDate/formatDate';

const AlbumComponent = () => {
    const { t } = useTranslation('album');
    const {
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
    } = useAlbum();

    if (!currentAlbum)
        return <div className="p-4 text-center text-gray-500">{t('notSelected')}</div>;

    return (
        <div className="relative flex flex-col gap-1 py-6 px-20 text-white min-h-[400px]">
            <Button
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 transition-colors"
                onClick={() => setIsDeleteModalOpen(true)}
                aria-label={t('deleteAlbum')}
            >
                <FiTrash size={22} style={{ color: 'var(--primary-color)' }} />
            </Button>

            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={onDelete}
            />

            <div className="flex justify-between items-start gap-6 px-4 py-3 h-64">
                <div className="flex items-start gap-4 flex-shrink-0 max-w-xl">
                    <img
                        src={currentAlbum.cover}
                        alt={currentAlbum.name}
                        className="w-64 h-64 object-cover rounded-md shadow-lg"
                    />
                    <div className="flex flex-col justify-center mt-15 max-w-[450px]">
                        <Text className="text-4xl font-bold">{currentAlbum.name}</Text>
                        {currentAlbum.createdAt && (
                            <Text className="mt-4 text-gray-400 text-sm">
                                {t('created', { date: formatDate(currentAlbum.createdAt) })}
                            </Text>
                        )}
                        {currentAlbum.updatedAt && (
                            <Text className="text-gray-400 text-sm">
                                {t('updated', { date: formatDate(currentAlbum.updatedAt) })}
                            </Text>
                        )}

                        <div className="mt-4 flex items-start gap-2">
                            {!isEditing ? (
                                <div className="flex items-center gap-2 flex-1">
                                    <Text className="text-gray-300 whitespace-pre-wrap break-words">
                                        {desc || t('noDescription')}
                                    </Text>
                                    <Button
                                        onClick={() => setIsEditing(true)}
                                        aria-label={t('editDescription')}
                                        className="text-gray-400 hover:text-white p-1 transition-colors"
                                    >
                                        <FiEdit size={20} />
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <Input
                                        className="flex-1 rounded-md p-2 text-black resize-y"
                                        value={desc}
                                        onChange={(e) => setDesc(e.target.value)}
                                        disabled={saving}
                                    />
                                    <Button
                                        onClick={onSave}
                                        className="self-start"
                                        disabled={saving}
                                    >
                                        {saving ? t('saving') : t('save')}
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-end h-60">
                    <Button type="button" onClick={openFileDialog}>
                        {t('uploadTrack')}
                    </Button>

                    <input
                        type="file"
                        accept="audio/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={onFileChange}
                    />
                </div>
            </div>

            <div className="flex justify-center overflow-auto flex-grow mt-10 h-full">
                <ListTrack albumId={currentAlbum.id} albumName={currentAlbum.name} />
            </div>
        </div>
    );
};

export const Album = React.memo(AlbumComponent);
