// src/entities/User/model/slice/useUserStore.ts
import { create } from 'zustand';
import toast from 'react-hot-toast';
import type { GenreRecommendation, User, UserSchema } from '../types/user';
import { useTrackStore } from 'entities/Track';
import { genresList, type Genre } from 'entities/Group/model/types/group';

const STEP_TRACK = 1;
const STEP_ALBUM = 5;
const STEP_GROUP = 10;
const MAX_PERCENT = 80;
const clampPercent = (v: number) => Math.max(0, Math.min(MAX_PERCENT, v));

function buildDefault(): GenreRecommendation[] {
    const p = 100 / genresList.length;
    return genresList.map((genre) => ({ genre, percent: p }));
}

function adjustRecs(
    recs: GenreRecommendation[] = [],
    target: Genre,
    delta: number,
): GenreRecommendation[] {
    const list = recs.length ? [...recs] : buildDefault();
    let idx = list.findIndex((r) => r.genre === target);
    if (idx === -1) {
        list.push({ genre: target, percent: 0 });
        idx = list.length - 1;
    }

    const old = list[idx].percent;
    const neu = clampPercent(old + delta);
    const actual = neu - old;
    list[idx].percent = neu;

    const others = list.filter((_, i) => i !== idx);
    if (others.length > 0 && actual !== 0) {
        const share = actual / others.length;
        for (const r of others) {
            r.percent = clampPercent(r.percent - share);
        }
    }

    return list;
}

function normalizeTo100(recs: GenreRecommendation[], target: Genre): GenreRecommendation[] {
    const sum = recs.reduce((s, r) => s + r.percent, 0);
    const diff = Number((100 - sum).toFixed(2));
    if (Math.abs(diff) < 1e-6) return recs;
    return recs.map((r) =>
        r.genre === target ? { ...r, percent: clampPercent(r.percent + diff) } : r,
    );
}

interface UserStore extends UserSchema {
    authData?: User | null;
    setAuthData: (user: User) => void;
    logout: () => void;
    toggleLikeTrack: (trackId: string) => void;
    toggleLikeGroup: (groupId: string) => void;
    toggleLikeAlbum: (albumId: string) => void;
}

export const useUserStore = create<UserStore>()((set, get) => ({
    authData: null,

    setAuthData: (user) => set({ authData: user }),

    logout: () => {
        set({ authData: null });
        ['user=; max-age=0; path=/', 'user=; max-age=0; path=/; secure'].forEach(
            (c) => (document.cookie = c),
        );
        toast('Вы вышли из системы', { icon: '👋' });
    },

    toggleLikeTrack: (trackId) => {
        const user = get().authData;
        if (!user) return;

        const likes = new Set(user.likedTracks || []);
        const isLiked = likes.has(trackId);
        if (isLiked) likes.delete(trackId);
        else likes.add(trackId);

        const track = useTrackStore.getState().tracks.find((t) => t.id === trackId);
        if (!track?.genre) return;
        const genre = track.genre as Genre;

        let recs = adjustRecs(user.recommendation, genre, isLiked ? -STEP_TRACK : STEP_TRACK);
        recs = normalizeTo100(recs, genre);

        set({
            authData: {
                ...user,
                likedTracks: Array.from(likes),
                recommendation: recs,
            },
        });
    },

    toggleLikeAlbum: (albumId: string) => {
        const user = get().authData;
        if (!user) return;

        const likes = new Set(user.likedAlbums || []);
        const isLiked = likes.has(albumId);
        if (isLiked) likes.delete(albumId);
        else likes.add(albumId);

        const track = useTrackStore.getState().tracks.find((t) => t.albumId === albumId);
        if (!track?.genre) return;
        const genre = track.genre as Genre;

        let recs = adjustRecs(user.recommendation, genre, isLiked ? -STEP_ALBUM : STEP_ALBUM);
        recs = normalizeTo100(recs, genre);

        set({
            authData: {
                ...user,
                likedAlbums: Array.from(likes),
                recommendation: recs,
            },
        });
    },

    toggleLikeGroup: (groupId: string) => {
        const user = get().authData;
        if (!user) return;

        const likes = new Set(user.likedGroups || []);
        const isLiked = likes.has(groupId);
        if (isLiked) likes.delete(groupId);
        else likes.add(groupId);

        const track = useTrackStore.getState().tracks.find((t) => t.groupId === groupId);
        if (!track?.genre) return;
        const genre = track.genre as Genre;

        let recs = adjustRecs(user.recommendation, genre, isLiked ? -STEP_GROUP : STEP_GROUP);
        recs = normalizeTo100(recs, genre);

        set({
            authData: {
                ...user,
                likedGroups: Array.from(likes),
                recommendation: recs,
            },
        });
    },
}));
