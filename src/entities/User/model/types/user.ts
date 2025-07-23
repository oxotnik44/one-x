// src/entities/User/model/types/user.ts

export interface GenreRecommendation {
    genre: string;
    percent: number;
}

export interface User {
    id: string;
    email?: string;
    username: string;
    password: string;
    avatar: string;
    createdAt: string;
    updatedAt?: string;
    likedTracks?: string[];
    likedGroups?: string[];
    likedAlbums?: string[];
    recommendation?: GenreRecommendation[];
}

export interface UserSchema {
    authData?: User | null;
}
