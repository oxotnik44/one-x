import React, { Suspense } from 'react';
import { Modal } from 'shared/ui/Modal/Modal';
import { Loader } from 'shared/ui/Loader/Loader';
import { LoginForm } from 'features/Login/ui/LoginForm/LoginForm';
import { RegistrationForm } from 'features/Registration/ui/RegistrationForm/RegistrationForm';
import { Button, ButtonTheme } from 'shared/ui/Button/Button';
import { Text } from 'shared/ui/Text/Text';

interface AuthModalProps {
    className?: string;
    isOpen: boolean;
    onClose: () => void;
    isLogin: boolean;
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, isLogin, setIsLogin }) => (
    <Modal isOpen={isOpen} onClose={onClose} lazy>
        <Suspense fallback={<Loader />}>
            {isLogin ? <LoginForm onSuccess={onClose} /> : <RegistrationForm onSuccess={onClose} />}
            <Button
                theme={ButtonTheme.CLEAR}
                onClick={() => {
                    setIsLogin(!isLogin);
                }}
                className="w-full"
            >
                <Text
                    text={isLogin ? 'Регистрация' : 'Авторизация'}
                    className="text-center"
                    isLink={true}
                />
            </Button>
        </Suspense>
    </Modal>
);
