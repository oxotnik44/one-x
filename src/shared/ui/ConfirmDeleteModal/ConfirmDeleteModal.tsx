// src/features/DeleteEntity/ui/ConfirmDeleteModal.tsx
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'shared/ui/Modal/Modal';
import { Button, Text } from 'shared/ui';

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const ConfirmDeleteModal = memo(
    ({ isOpen, onClose, onConfirm }: ConfirmDeleteModalProps) => {
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
    },
);
ConfirmDeleteModal.displayName = 'ConfirmDeleteModal';
