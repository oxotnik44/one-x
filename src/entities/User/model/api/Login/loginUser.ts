import type { User } from 'entities/User';
import { useUserStore } from 'entities/User/model/slice/useUserStore';
import { api } from 'shared/api/api';
import bcrypt from 'bcryptjs';

interface LoginProps {
    email: string;
    password: string;
}

export const loginUser = async (authData: LoginProps): Promise<User | null> => {
    try {
        const response = await api.get<User[]>('/users', {
            params: { email: authData.email },
        });

        if (!response.data || response.data.length === 0) {
            return null;
        }

        const user = response.data[0];

        const isPasswordValid = bcrypt.compareSync(authData.password, user.password);
        if (!isPasswordValid) {
            return null;
        }

        const setAuthData = useUserStore.getState().setAuthData;
        setAuthData(user);

        return user;
    } catch {
        return null;
    }
};
