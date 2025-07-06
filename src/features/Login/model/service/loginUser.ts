import type { User } from 'entities/User';
import { useUserStore } from 'entities/User/model/slice/userStore';
import toast from 'react-hot-toast';
import { api } from 'shared/api/api';
import bcrypt from 'bcryptjs';

interface LoginProps {
    email: string;
    password: string;
}

export const loginUser = async (authData: LoginProps): Promise<User | null> => {
    return toast
        .promise(
            (async () => {
                // Получаем всех пользователей с таким email
                const response = await api.get<User[]>('/users', {
                    params: { email: authData.email },
                });

                if (!response.data || response.data.length === 0) {
                    throw new Error('Пользователь не найден');
                }

                const user = response.data[0];

                // Проверяем пароль, сравнивая введённый с хэшем из базы
                const isPasswordValid = bcrypt.compareSync(authData.password, user.password);

                if (!isPasswordValid) {
                    throw new Error('Неверный пароль');
                }

                // Авторизация успешна — сохраняем данные в Zustand
                const setAuthData = useUserStore.getState().setAuthData;
                setAuthData(user);

                return user;
            })(),
            {
                loading: 'Авторизация...',
                success: 'Вы успешно вошли в систему',
                error: (err) => err.message || 'Ошибка при авторизации',
            },
        )
        .catch(() => null);
};
