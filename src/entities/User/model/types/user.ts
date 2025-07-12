export interface User {
    userId: string;
    email?: string;
    username: string;
    password: string;
    avatar: string;
}

export interface UserSchema {
    authData?: User | null;
}
