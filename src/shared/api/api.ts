// src/shared/api/api.ts
import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';
import { USER_LOCALSTORAGE_KEY } from 'shared/const/localstorage';

interface StoredUser {
    token?: string;
}

// Функция для настройки интерсептора авторизации
function setupAuthInterceptor(instance: ReturnType<typeof axios.create>) {
    instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        const raw = localStorage.getItem(USER_LOCALSTORAGE_KEY);
        let token = '';

        try {
            const user = JSON.parse(raw || '{}') as StoredUser;
            token = user.token ?? '';
        } catch (err) {
            console.warn('Ошибка парсинга токена', err as Error);
        }

        if (token) {
            if (!config.headers || !(config.headers instanceof AxiosHeaders)) {
                config.headers = new AxiosHeaders(config.headers);
            }

            config.headers.set('Authorization', `Bearer ${token}`);
        }

        return config;
    });
}

// Создаем инстансы с разными базовыми URL
export const apiJson = axios.create({
    baseURL: 'http://localhost:4000',
});

export const apiBase = axios.create({
    baseURL: 'http://localhost:4001',
});

// Применяем интерсепторы
setupAuthInterceptor(apiJson);
setupAuthInterceptor(apiBase);
