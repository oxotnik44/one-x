import type { Genre } from 'entities/Group';

export interface Track {
    id: string;
    title: string;
    duration: number;
    cover: string;
    groupName?: string;
    albumId?: string;
    groupId: string;
    genre: Genre;
    audioUrl: string;
    createdAt: string;
    updatedAt?: string;
}
