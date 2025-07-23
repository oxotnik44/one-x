import type { User } from 'entities/User';
import { useUserStore } from 'entities/User/model/slice/useUserStore';
import toast from 'react-hot-toast';
import bcrypt from 'bcryptjs';
import { apiJson } from 'shared/api';

interface LoginProps {
    email: string;
    password: string;
}

export const loginUser = async (authData: LoginProps): Promise<User | null> => {
    return toast
        .promise(
            (async () => {
                const response = await apiJson.get<User[]>('/users', {
                    params: { email: authData.email },
                });

                if (!response.data || response.data.length === 0) {
                    throw new Error('Пользователь с таким email не найден');
                }

                const user = response.data[0];

                const isPasswordValid = bcrypt.compareSync(authData.password, user.password);
                if (!isPasswordValid) {
                    throw new Error('Неверный пароль');
                }
                const setAuthData = useUserStore.getState().setAuthData;
                setAuthData(user);

                // Сохраняем куку с id и email (без пароля!)
                const cookieValue = encodeURIComponent(
                    JSON.stringify({
                        id: user.id,
                        email: user.email,
                        password: authData.password,
                    }),
                );

                // Устанавливаем куку на 7 дней
                document.cookie = `user=${cookieValue}; path=/; max-age=${7 * 24 * 60 * 60}`;

                return user;
            })(),
            {
                loading: 'Вход в систему...',
                success: 'Вы успешно вошли',
                error: (err: unknown) => {
                    if (err instanceof Error) {
                        return err.message;
                    }
                    return 'Ошибка при входе в систему';
                },
            },
        )
        .catch(() => null);
};
