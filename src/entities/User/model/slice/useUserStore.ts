import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';
import type { User, UserSchema } from '../types/user';
import { USER_LOCALSTORAGE_KEY } from 'shared/const/localstorage';

interface UserStore extends UserSchema {
    authData?: User;
    setAuthData: (user: User) => void;
    logout: () => void;
    toggleLikeTrack: (likedTracks: string[]) => void;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set, get) => ({
            authData: undefined,

            setAuthData: (user: User) => set({ authData: user }),

            logout: () => {
                set({ authData: undefined });
                toast('Вы вышли из системы', { icon: '👋' });
            },

            toggleLikeTrack: (likedTracks: string[]) => {
                const user = get().authData;
                if (!user) return;

                set({
                    authData: {
                        ...user,
                        likedTracks,
                    },
                });
            },
        }),
        {
            name: USER_LOCALSTORAGE_KEY,
            partialize: (state) => ({ authData: state.authData }),
        },
    ),
);
