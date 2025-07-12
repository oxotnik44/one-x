// src/shared/api/api.ts
import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';
import { USER_LOCALSTORAGE_KEY } from 'shared/const/localstorage';

interface StoredUser {
    token?: string;
}

export const api = axios.create({
    baseURL: 'http://localhost:4000',
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const raw = localStorage.getItem(USER_LOCALSTORAGE_KEY);
    let token = '';

    try {
        const user = JSON.parse(raw || '{}') as StoredUser; // ✅ типизировали
        token = user.token ?? '';
    } catch (err) {
        console.warn('Ошибка парсинга токена', err as Error);
    }

    if (token) {
        if (!config.headers || !(config.headers instanceof AxiosHeaders)) {
            config.headers = new AxiosHeaders(config.headers); // ✅ безопасное преобразование
        }

        config.headers.set('Authorization', `Bearer ${token}`); // ✅ типизированный метод
    }

    return config;
});
