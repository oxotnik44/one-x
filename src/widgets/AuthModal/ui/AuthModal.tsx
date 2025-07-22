import { LoginForm } from 'features/Login';
import { RegistrationForm } from 'features/Registration';
import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonTheme, Loader, Modal, Text } from 'shared/ui';

interface AuthModalProps {
    className?: string;
    isOpen: boolean;
    onClose: () => void;
    isLogin: boolean;
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, isLogin, setIsLogin }) => {
    const { t } = useTranslation('authModal'); // namespace authModal

    return (
        <Modal isOpen={isOpen} onClose={onClose} lazy>
            <Suspense fallback={<Loader />}>
                {isLogin ? (
                    <LoginForm onSuccess={onClose} />
                ) : (
                    <RegistrationForm onSuccess={onClose} />
                )}
                <Button
                    theme={ButtonTheme.CLEAR}
                    onClick={() => {
                        setIsLogin(!isLogin);
                    }}
                    className="w-full"
                >
                    <Text
                        text={isLogin ? t('toRegister') : t('toLogin')}
                        className="text-center"
                        isLink={true}
                    />
                </Button>
            </Suspense>
        </Modal>
    );
};
