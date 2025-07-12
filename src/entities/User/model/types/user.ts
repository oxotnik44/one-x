export interface User {
    id: string;
    email?: string;
    username: string;
    password: string;
    avatar: string;
    createdAt: string; // дата создания, ISO строка
    updatedAt?: string; // дата обновления, ISO строка (опционально)
}

export interface UserSchema {
    authData?: User | null;
}
