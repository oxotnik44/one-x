// src/entities/User/model/types/user.ts
export interface User {
    id: string;
    email?: string;
    username: string;
    password: string;
    avatar: string;
    createdAt: string;
    updatedAt?: string;
    likedTracks?: string[];
}

export interface UserSchema {
    authData?: User | null;
}
