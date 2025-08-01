// src/features/recommendations/getRecommendedGenre.ts

import { useUserStore } from 'entities/User';
import { useGroupStore } from 'entities/Group';
import { genresList, type Genre } from 'entities/Group/model/types/group';
import type { GenreRecommendation, User } from 'entities/User/model/types/user';

/** Равномерный возврат целого числа в диапазоне [min, max] */
const getRandomInt = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min;

/** Построение рекомендаций по‑умолчанию */
const buildDefaultRecommendations = (): GenreRecommendation[] => {
    const pct = Math.floor(100 / genresList.length);
    return genresList.map((genre) => ({ genre, percent: pct }));
};

/** Нормализация процентов, чтобы в сумме было 100 */
const normalizeRecommendations = (recs: GenreRecommendation[]): GenreRecommendation[] => {
    const total = recs.reduce((sum, { percent }) => sum + percent, 0) || 1;
    return recs.map(({ genre, percent }) => ({
        genre,
        percent: (percent / total) * 100,
    }));
};

/** Случайный выбор жанра по весам */
const pickGenreByPercent = (recs: GenreRecommendation[]): Genre | undefined => {
    const total = recs.reduce((sum, { percent }) => sum + percent, 0);
    const rnd = getRandomInt(1, Math.floor(total));
    let acc = 0;
    for (const { genre, percent } of recs) {
        acc += percent;
        if (rnd <= acc) return genre as Genre;
    }
};

/** Основная функция выдачи рекомендованного жанра */
export const getRecommendedGenre = (): Genre => {
    const user = useUserStore.getState().authData as User | null;
    if (!user) throw new Error('Пользователь не авторизован');

    const available = new Set(useGroupStore.getState().groups.map((g) => g.genre as Genre));

    // Стартовый список — пользовательский или дефолтный
    let recs = user.recommendation?.length ? user.recommendation : buildDefaultRecommendations();

    // Нормализация и фильтрация по доступным жанрам
    recs = normalizeRecommendations(recs).filter((r) => available.has(r.genre as Genre));

    // Если ничего не осталось — берём дефолт и фильтруем
    if (!recs.length) {
        recs = normalizeRecommendations(buildDefaultRecommendations()).filter((r) =>
            available.has(r.genre as Genre),
        );
    }

    // Выбираем жанр, повторяя попытку, если undefined
    let genre: Genre | undefined;
    do {
        genre = pickGenreByPercent(recs);
    } while (!genre);

    return genre;
};
