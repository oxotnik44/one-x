// src/entities/User/model/slice/useUserStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';
import type { User, UserSchema } from '../types/user';
import { USER_LOCALSTORAGE_KEY } from 'shared/const/localstorage';

export interface UserStore extends UserSchema {
    authData?: User | null;
    setAuthData: (user: User) => void;
    logout: () => void;
    toggleLikeTrack: (trackId: string) => void;
    toggleLikeGroup: (groupId: string) => void;
    toggleLikeAlbum: (albumId: string) => void;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set, get) => ({
            authData: null,

            setAuthData: (user: User) => set({ authData: user }),

            logout: () => {
                set({ authData: null });
                toast('Вы вышли из системы', { icon: '👋' });
            },

            toggleLikeTrack: (trackId: string) => {
                const user = get().authData;
                if (!user) return;
                const likes = new Set(user.likedTracks || []);
                likes.has(trackId) ? likes.delete(trackId) : likes.add(trackId);
                set({ authData: { ...user, likedTracks: Array.from(likes) } });
            },

            toggleLikeGroup: (groupId: string) => {
                const user = get().authData;
                if (!user) return;
                const likes = new Set(user.likedGroups || []);
                likes.has(groupId) ? likes.delete(groupId) : likes.add(groupId);
                set({ authData: { ...user, likedGroups: Array.from(likes) } });
            },

            toggleLikeAlbum: (albumId: string) => {
                const user = get().authData;
                if (!user) return;
                const likes = new Set(user.likedAlbums || []);
                likes.has(albumId) ? likes.delete(albumId) : likes.add(albumId);
                set({ authData: { ...user, likedAlbums: Array.from(likes) } });
            },
        }),
        {
            name: USER_LOCALSTORAGE_KEY,
            partialize: (state) => ({ authData: state.authData }),
        },
    ),
);
