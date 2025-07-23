// src/entities/Group/model/types/group.ts
export const genresList = [
    'Рок',
    'Метал',
    'Поп',
    'Джаз',
    'Классика',
    'Хип-хоп',
    'Электроника',
    'Блюз',
    'Регги',
    'Панк',
] as const;

export type Genre = (typeof genresList)[number];

export interface Group {
    id: string;
    userId: string;
    name: string;
    description?: string | null;
    cover: string;
    genre: Genre;
    createdAt: string;
    updatedAt?: string;
}

export interface GroupSchema {
    groups: Group[];
    currentGroup?: Group | null;
}
