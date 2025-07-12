import React from 'react';
import { useForm } from 'react-hook-form';
import { Text } from 'shared/ui/Text/Text';
import { Button } from 'shared/ui/Button/Button';
import { Input } from 'shared/ui/Input/Input';
import type { RegistrationSchema } from '../../../../entities/User/model/types/registrationSchema';
import { registrationUser } from 'entities/User/model/api/Registration/registrationUser';

interface RegistrationFormProps {
    onSuccess: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isSubmitted },
        trigger,
        watch,
    } = useForm<RegistrationSchema>({
        mode: 'onSubmit',
    });

    const passwordValue = watch('password', '');

    const onSubmit = async ({ email, password }: RegistrationSchema) => {
        const user = await registrationUser({ email, password });
        if (user) {
            onSuccess();
        }
    };

    // обёртка, чтобы onSubmit не возвращал Promise напрямую
    const onFormSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        void handleSubmit(onSubmit)(e);
    };

    return (
        <form onSubmit={onFormSubmit} className="" autoComplete="off" noValidate>
            <Text title="Регистрация" />

            {/* Email */}
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
                    disabled={isSubmitting}
                    placeholder="you@example.com"
                    className={errors.email ? 'border-red-500' : 'border-gray-300'}
                    onChange={() => {
                        if (isSubmitted) {
                            void trigger('email');
                        }
                    }}
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
            </div>

            {/* Пароль */}
            <div className="mb-6">
                <Text className="block mb-2 font-semibold text-black text-lg" text="Пароль" />
                <Input
                    id="password"
                    type="password"
                    {...register('password', {
                        required: 'Введите пароль',
                        minLength: { value: 6, message: 'Минимум 6 символов' },
                    })}
                    disabled={isSubmitting}
                    placeholder="••••••"
                    className={errors.password ? 'border-red-500' : 'border-gray-300'}
                    onChange={() => {
                        if (isSubmitted) {
                            void trigger('password');
                            void trigger('confirmPassword');
                        }
                    }}
                />
                {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
            </div>

            {/* Подтверждение пароля */}
            <div className="mb-8">
                <Text
                    className="block mb-2 font-semibold text-black text-lg"
                    text="Повторите пароль"
                />
                <Input
                    id="confirmPassword"
                    type="password"
                    {...register('confirmPassword', {
                        required: 'Подтвердите пароль',
                        validate: (value) => value === passwordValue || 'Пароли не совпадают',
                    })}
                    disabled={isSubmitting}
                    placeholder="••••••"
                    className={errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}
                    onChange={() => {
                        if (isSubmitted) {
                            void trigger('confirmPassword');
                        }
                    }}
                />
                {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                )}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
                Зарегистрироваться
            </Button>
        </form>
    );
};
