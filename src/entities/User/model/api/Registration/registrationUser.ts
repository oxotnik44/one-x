import type { User } from 'entities/User';
import { useUserStore } from 'entities/User/model/slice/useUserStore';
import toast from 'react-hot-toast';
import { api } from 'shared/api/api';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

interface RegistrationProps {
    email: string;
    password: string;
}

export const registrationUser = async (authData: RegistrationProps): Promise<User | null> => {
    return toast
        .promise(
            (async () => {
                // Проверяем, что email ещё не зарегистрирован
                const existingUsersResponse = await api.get<User[]>('/users', {
                    params: { email: authData.email },
                });

                if (existingUsersResponse.data.length > 0) {
                    throw new Error('Пользователь с таким email уже существует');
                }

                // Хэшируем пароль перед отправкой
                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = bcrypt.hashSync(authData.password, salt);

                // Генерируем UUID для нового пользователя
                const newUserId = uuidv4();

                const response = await api.post<User>('/users', {
                    id: newUserId,
                    email: authData.email,
                    password: hashedPassword,
                });

                if (!response.data) {
                    throw new Error('Empty response');
                }

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
