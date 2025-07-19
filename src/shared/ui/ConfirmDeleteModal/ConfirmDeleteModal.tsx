import React from 'react';
import { Modal } from 'shared/ui/Modal/Modal';
import { Button, Text } from 'shared/ui';
import { useTranslation } from 'react-i18next';

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
}) => {
    const { t } = useTranslation('confirmDeleteModal');

    return (
        <Modal isOpen={isOpen} onClose={onClose} closable>
            <div className="flex flex-col gap-4 min-w-[300px]">
                <Text className="text-lg font-semibold text-white">{t('confirmDelete')}</Text>

                <div className="flex justify-center gap-10">
                    <Button onClick={onClose}>{t('cancel')}</Button>
                    <Button onClick={onConfirm}>{t('delete')}</Button>
                </div>
            </div>
        </Modal>
    );
};
