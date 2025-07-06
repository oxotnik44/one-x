import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { USER_LOCALSTORAGE_KEY } from 'shared/const/localstorage';
import type { User, UserSchema } from '../types/user';
import toast from 'react-hot-toast';

interface UserStore extends UserSchema {
    authData?: User;
    setAuthData: (user: any) => void;
    logout: () => void;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            authData: undefined,

            setAuthData: (user) => {
                set({ authData: user });
            },

            logout: () => {
                set({ authData: undefined });
                toast('Вы вышли из системы', { icon: '👋' });
            },
        }),
        {
            name: USER_LOCALSTORAGE_KEY,
            partialize: (state) => ({ authData: state.authData }),
        },
    ),
);
