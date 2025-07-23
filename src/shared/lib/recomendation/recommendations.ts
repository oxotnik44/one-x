// src/features/recommendations/getRecommendedGenre.ts

import { useUserStore } from 'entities/User';
import { useGroupStore } from 'entities/Group';
import { genresList, type Genre } from 'entities/Group/model/types/group';
import type { GenreRecommendation, User } from 'entities/User/model/types/user';

/** Равномерный возврат целого числа в диапазоне [min, max] */
export function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Построение рекомендаций по‑умолчанию при отсутствии у пользователя своих */
export function buildDefaultRecommendations(): GenreRecommendation[] {
    const percent = Math.floor(100 / genresList.length);
    return genresList.map((genre) => ({ genre, percent }));
}

/** Нормализация процентов, чтобы их сумма была ровно 100 */
export function normalizeRecommendations(recs: GenreRecommendation[]): GenreRecommendation[] {
    const total = recs.reduce((sum, r) => sum + r.percent, 0) || 1;
    return recs.map((r) => ({
        genre: r.genre,
        percent: (r.percent / total) * 100,
    }));
}

/** Выбор жанра с учётом нормализованных процентов */
export function pickGenreByPercent(recs: GenreRecommendation[]): Genre | undefined {
    const total = recs.reduce((sum, r) => sum + r.percent, 0);
    const rand = getRandomInt(1, Math.floor(total));
    let cumulative = 0;
    for (const { genre, percent } of recs) {
        cumulative += percent;
        if (rand <= cumulative) {
            return genre as Genre;
        }
    }

    return undefined;
}

export function getRecommendedGenre(): Genre {
    const user = useUserStore.getState().authData as User | null;
    if (!user) throw new Error('Пользователь не авторизован');

    // Доступные жанры из групп
    const groups = useGroupStore.getState().groups ?? [];
    const available = new Set<Genre>(groups.map((g) => g.genre as Genre));
    let recs: GenreRecommendation[] =
        user.recommendation && user.recommendation.length
            ? user.recommendation
            : buildDefaultRecommendations();
    recs = normalizeRecommendations(recs).filter((r) => available.has(r.genre as Genre));

    if (!recs.length) {
        recs = buildDefaultRecommendations().filter((r) => available.has(r.genre as Genre));
    }

    let genre: Genre | undefined;
    while (!(genre = pickGenreByPercent(recs))) {
        // повторяем
    }
    return genre;
}
