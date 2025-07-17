import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { loginUser, type LoginSchema } from 'entities/User';
import { Button, Input, Text } from 'shared/ui';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
    onSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
    const { t } = useTranslation('loginForm');
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isSubmitted },
        trigger,
    } = useForm<LoginSchema>({
        mode: 'onSubmit',
    });

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const onEmailChange = (value: string) => {
        setEmail(value);
        if (isSubmitted) trigger('email');
    };

    const onPasswordChange = (value: string) => {
        setPassword(value);
        if (isSubmitted) trigger('password');
    };

    const onSubmit = async () => {
        const user = await loginUser({ email, password });
        if (user) {
            onSuccess();
            navigate('/main');
        }
    };

    return (
        <form
            onSubmit={(e) => {
                void handleSubmit(onSubmit)(e);
            }}
            autoComplete="off"
            noValidate
        >
            <Text title={t('title')} />

            <div className="mb-6">
                <Text
                    className="block mb-2 font-semibold text-black text-lg"
                    text={t('email.label')}
                />
                <Input
                    id="email"
                    type="email"
                    {...register('email', {
                        required: t('email.required'),
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: t('email.invalid'),
                        },
                    })}
                    value={email}
                    onChangeHandler={onEmailChange}
                    disabled={isSubmitting}
                    placeholder={t('email.placeholder')}
                    className={errors.email ? 'border-red-500' : 'border-gray-300'}
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
            </div>

            <div className="mb-8">
                <Text
                    className="block mb-2 font-semibold text-black text-lg"
                    text={t('password.label')}
                />
                <Input
                    id="password"
                    type="password"
                    {...register('password', {
                        required: t('password.required'),
                        minLength: { value: 6, message: t('password.minLength') },
                    })}
                    value={password}
                    onChangeHandler={onPasswordChange}
                    disabled={isSubmitting}
                    placeholder={t('password.placeholder')}
                    className={errors.password ? 'border-red-500' : 'border-gray-300'}
                />
                {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
                <Text text={t('submit')} />
            </Button>
        </form>
    );
};
