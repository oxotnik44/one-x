import React, { Suspense } from 'react';
import { Loader } from 'shared/ui';
import { Modal } from 'shared/ui/Modal/Modal';
import { RegistrationForm } from '../RegistrationForm/RegistrationForm';

interface RegistrationModalProps {
    className?: string;
    isOpen: boolean;
    onClose: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose }) => (
    <Modal isOpen={isOpen} onClose={onClose} lazy>
        <Suspense fallback={<Loader />}>
            <RegistrationForm onSuccess={onClose} />
        </Suspense>
    </Modal>
);
