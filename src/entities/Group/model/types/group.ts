// src/entities/Group/model/types/group.ts

export interface Group {
    groupId: string; // уникальный идентификатор группы
    userId: string; // ID пользователя — владельца группы
    name: string;
    description?: string | null;
    cover: string; // URL или base64 иконки группы
    genre: string;
    createdAt: string; // дата создания, ISO строка
    updatedAt?: string; // дата обновления, ISO строка (опционально)
}

export interface GroupSchema {
    currentGroup?: Group | null;
}
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
