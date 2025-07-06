import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Text } from 'shared/ui/Text/Text';
import { Button } from 'shared/ui/Button/Button';
import { Input } from 'shared/ui/Input/Input';
import type { LoginSchema } from '../../model/types/loginSchema';
import { loginUser } from 'features/Login/model/service/loginUser';

interface LoginFormProps {
    onSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isSubmitted },
        trigger,
    } = useForm<LoginSchema>({
        mode: 'onSubmit', // валидировать только при отправке
    });

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const onEmailChange = (value: string) => {
        setEmail(value);
        if (isSubmitted) trigger('email'); // после первого сабмита валидируем при вводе
    };

    const onPasswordChange = (value: string) => {
        setPassword(value);
        if (isSubmitted) trigger('password');
    };

    const onSubmit = async () => {
        const user = await loginUser({ email, password });
        if (user) {
            onSuccess();
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="" autoComplete="off" noValidate>
            <Text title="Авторизация" />

            <div className="mb-6">
                <Text className="block mb-2 font-semibold text-black text-lg" text="Email" />
                <Input
                    id="email"
                    type="email"
                    {...register('email', {
                        required: 'Введите email',
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Некорректный email',
                        },
                    })}
                    value={email}
                    onChangeHandler={onEmailChange}
                    disabled={isSubmitting}
                    placeholder="you@example.com"
                    className={`${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    autoComplete="off"
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
            </div>

            <div className="mb-8">
                <Text className="block mb-2 font-semibold text-black text-lg" text="Пароль" />

                <Input
                    id="password"
                    type="password"
                    {...register('password', {
                        required: 'Введите пароль',
                        minLength: { value: 6, message: 'Минимум 6 символов' },
                    })}
                    value={password}
                    onChangeHandler={onPasswordChange}
                    disabled={isSubmitting}
                    placeholder="••••••"
                    className={`${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                    autoComplete="off"
                />
                {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
                <Text text="Войти" />
            </Button>
        </form>
    );
};
