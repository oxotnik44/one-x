// src/entities/Album/model/types.ts
export interface Album {
    id: string;
    name: string;
    groupId: string;
    description: string | null;
    cover?: string;
    trackIds: string[];
    createdAt: string;
    updatedAt?: string;
}
