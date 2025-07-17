import React, { Suspense } from 'react';
import { LoginForm } from '../LoginForm/LoginForm';
import { Loader, Modal } from 'shared/ui';

interface LoginModalProps {
    className?: string;
    isOpen: boolean;
    onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => (
    <Modal isOpen={isOpen} onClose={onClose} lazy>
        <Suspense fallback={<Loader />}>
            <LoginForm onSuccess={onClose} />
        </Suspense>
    </Modal>
);
