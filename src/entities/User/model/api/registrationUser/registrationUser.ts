import type { User } from 'entities/User';
import { useUserStore } from 'entities/User/model/slice/useUserStore';
import toast from 'react-hot-toast';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { apiJson } from 'shared/api';

interface RegistrationProps {
    email: string;
    password: string;
}

export const registrationUser = async (authData: RegistrationProps): Promise<User | null> => {
    return toast
        .promise(
            (async () => {
                // Проверяем, что email ещё не зарегистрирован
                const existingUsersResponse = await apiJson.get<User[]>('/users', {
                    params: { email: authData.email },
                });

                if (existingUsersResponse.data.length > 0) {
                    throw new Error('Пользователь с таким email уже существует');
                }

                // Хэшируем пароль перед отправкой
                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = bcrypt.hashSync(authData.password, salt);
                const newUser: User = {
                    id: uuidv4(),
                    email: authData.email,
                    password: hashedPassword,
                    avatar: '',
                    username: '',
                    createdAt: new Date().toISOString(),
                };
                const response = await apiJson.post<User>('/users', newUser);

                if (!response.data) {
                    throw new Error('Empty response');
                }
                // Сохраняем куку с id и email (без пароля!)
                const cookieValue = encodeURIComponent(
                    JSON.stringify({
                        id: newUser.id,
                        email: authData.email,
                        password: authData.password,
                    }),
                );

                // Устанавливаем куку на 7 дней
                document.cookie = `user=${cookieValue}; path=/; max-age=${7 * 24 * 60 * 60}`;
                const setAuthData = useUserStore.getState().setAuthData;
                setAuthData(response.data);

                return response.data;
            })(),
            {
                loading: 'Регистрация...',
                success: 'Вы успешно зарегистрировались',
                error: (err: unknown) => {
                    if (err instanceof Error) {
                        return err.message;
                    }
                    return 'Ошибка при регистрации';
                },
            },
        )
        .catch(() => null);
};
