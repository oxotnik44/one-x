import type { Track } from 'entities/Track';

// src/entities/Album/model/types.ts
export interface Album {
    id: string;
    name: string;
    groupId: string;
    cover?: string;
    trackIds: Track[];
    createdAt: string;
    updatedAt?: string;
}
