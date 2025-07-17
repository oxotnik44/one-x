import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { registrationUser, type RegistrationSchema } from 'entities/User';
import { Button, Input, Text } from 'shared/ui';
import { useNavigate } from 'react-router-dom';

interface RegistrationFormProps {
    onSuccess: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess }) => {
    const { t } = useTranslation('registration');
    const navigate = useNavigate();
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
            navigate('/main');
        }
    };

    const onFormSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        void handleSubmit(onSubmit)(e);
    };

    return (
        <form onSubmit={onFormSubmit} className="" autoComplete="off" noValidate>
            <Text title={t('title')} />

            {/* Email */}
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

            {/* Password */}
            <div className="mb-6">
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

            {/* Confirm Password */}
            <div className="mb-8">
                <Text
                    className="block mb-2 font-semibold text-black text-lg"
                    text={t('confirmPassword.label')}
                />
                <Input
                    id="confirmPassword"
                    type="password"
                    {...register('confirmPassword', {
                        required: t('confirmPassword.required'),
                        validate: (value) => value === passwordValue || t('confirmPassword.match'),
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
                {t('submit')}
            </Button>
        </form>
    );
};
