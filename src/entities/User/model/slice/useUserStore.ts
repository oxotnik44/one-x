// src/entities/User/model/slice/useUserStore.ts
import { create } from 'zustand';
import toast from 'react-hot-toast';
import type { GenreRecommendation, User, UserSchema } from '../types/user';
import { useTrackStore } from 'entities/Track';
const MAX_PERCENT = 80;
export interface UserStore extends UserSchema {
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

        // Удаление куки с разными вариантами path и secure
        const cookieOptions = [
            'user=; max-age=0; path=/',
            'user=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/',
            'user=; max-age=0; path=/; secure',
            'user=; max-age=0',
        ];

        cookieOptions.forEach((cookie) => {
            document.cookie = cookie;
        });

        toast('Вы вышли из системы', { icon: '👋' });
    },
    toggleLikeTrack: (trackId: string) => {
        const user = get().authData;
        if (!user) return;

        const track = useTrackStore.getState().tracks.find((t) => t.id === trackId);
        if (!track?.genre) return;
        const genre = track.genre;

        const likes = new Set(user.likedTracks || []);
        const isLiked = likes.has(trackId);
        isLiked ? likes.delete(trackId) : likes.add(trackId);
        const updatedLikedTracks = Array.from(likes);

        let recs: GenreRecommendation[] = user.recommendation ? [...user.recommendation] : [];

        const currentIdx = recs.findIndex((r) => r.genre === genre);
        const isNewGenre = currentIdx === -1;

        if (isNewGenre && !isLiked) {
            recs.push({ genre, percent: 1 });
            const others = recs.filter((r) => r.genre !== genre);
            const totalOthers = others.reduce((sum, r) => sum + r.percent, 0);

            recs = recs.map((r) => {
                if (r.genre !== genre && totalOthers > 0) {
                    const share = r.percent / totalOthers;
                    return { ...r, percent: Math.max(0, Number((r.percent - share).toFixed(2))) };
                }
                return r;
            });
        }

        if (!isNewGenre) {
            const delta = isLiked ? -1 : +1;
            const target = recs[currentIdx];
            let tentativeNew = target.percent + delta;

            if (tentativeNew > MAX_PERCENT) {
                tentativeNew = MAX_PERCENT;
            }

            if (tentativeNew < 0) {
                tentativeNew = 0;
            }

            const actualDelta = Number((tentativeNew - target.percent).toFixed(2));
            if (actualDelta !== 0) {
                const others = recs.filter((_, i) => i !== currentIdx);
                const totalOthers = others.reduce((sum, r) => sum + r.percent, 0);

                recs = recs.map((r, i) => {
                    if (i === currentIdx) {
                        return { ...r, percent: tentativeNew };
                    }
                    if (totalOthers > 0) {
                        const share = r.percent / totalOthers;
                        const adjusted = r.percent - actualDelta * share;
                        return { ...r, percent: Math.max(0, Number(adjusted.toFixed(2))) };
                    }
                    return r;
                });
            }
        }

        // Нормализация до ровно 100%
        const total = recs.reduce((sum, r) => sum + r.percent, 0);
        if (total !== 100) {
            const correction = Number((100 - total).toFixed(2));
            const adjustIdx = recs.findIndex((r) => r.percent + correction <= MAX_PERCENT);
            if (adjustIdx !== -1) {
                recs[adjustIdx].percent = Number((recs[adjustIdx].percent + correction).toFixed(2));
            }
        }

        set({
            authData: {
                ...user,
                likedTracks: updatedLikedTracks,
                recommendation: recs,
            },
        });
    },

    toggleLikeGroup: (groupId) => {
        const user = get().authData;
        if (!user) return;
        const likes = new Set(user.likedGroups || []);
        likes.has(groupId) ? likes.delete(groupId) : likes.add(groupId);
        set({ authData: { ...user, likedGroups: Array.from(likes) } });
    },

    toggleLikeAlbum: (albumId: string) => {
        const user = get().authData;
        if (!user) return;

        // Получаем жанр альбома через треки
        const trackStore = useTrackStore.getState();
        const albumTrack = trackStore.tracks.find((t) => t.albumId === albumId);
        if (!albumTrack?.genre) return;
        const genre = albumTrack.genre;

        const likes = new Set(user.likedAlbums || []);
        const isLiked = likes.has(albumId);
        if (isLiked) likes.delete(albumId);
        else likes.add(albumId);
        const updatedLikedAlbums = Array.from(likes);

        let recs: GenreRecommendation[] = user.recommendation ? [...user.recommendation] : [];

        const currentIdx = recs.findIndex((r) => r.genre === genre);
        const isNewGenre = currentIdx === -1;

        const STEP = 5;
        const MAX_PERCENT = 80;

        if (isNewGenre && !isLiked) {
            // Добавляем новый жанр с STEP %
            recs.push({ genre, percent: STEP });

            // Уменьшаем остальные пропорционально, чтобы сумма была 100%
            const others = recs.filter((r) => r.genre !== genre);
            const totalOthers = others.reduce((sum, r) => sum + r.percent, 0);

            recs = recs.map((r) => {
                if (r.genre !== genre && totalOthers > 0) {
                    const share = r.percent / totalOthers;
                    return { ...r, percent: r.percent - STEP * share };
                }
                return r;
            });
        } else if (!isNewGenre) {
            const oldPercent = recs[currentIdx].percent;
            // Вычисляем новый процент с учётом max ограничения
            let tentativeNew = isLiked ? oldPercent - STEP : oldPercent + STEP;
            if (tentativeNew > MAX_PERCENT) tentativeNew = MAX_PERCENT;
            if (tentativeNew < 0) tentativeNew = 0;

            const actualDelta = tentativeNew - oldPercent;
            if (actualDelta !== 0) {
                const others = recs.filter((_, i) => i !== currentIdx);
                const totalOthers = others.reduce((sum, r) => sum + r.percent, 0);

                recs = recs.map((r, i) => {
                    if (i === currentIdx) return { ...r, percent: tentativeNew };

                    if (totalOthers > 0) {
                        const share = r.percent / totalOthers;
                        return { ...r, percent: r.percent - actualDelta * share };
                    }
                    return r;
                });
            }
        }

        // Проверяем сумму и корректируем минимально возможным образом, чтобы сумма была ровно 100%
        const total = recs.reduce((sum, r) => sum + r.percent, 0);
        const diff = 100 - total;

        if (Math.abs(diff) > 1e-6) {
            // Добавим или уберём разницу у жанра, который изменили (текущий)
            recs[currentIdx] = {
                ...recs[currentIdx],
                percent: recs[currentIdx].percent + diff,
            };
        }

        set({
            authData: {
                ...user,
                likedAlbums: updatedLikedAlbums,
                recommendation: recs,
            },
        });
    },
}));
