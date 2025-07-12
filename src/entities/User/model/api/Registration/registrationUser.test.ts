// src/entities/User/model/api/Registration/registrationUser.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';

const setAuthDataMock = vi.fn();

vi.mock('entities/User/model/slice/useUserStore', () => ({
    useUserStore: {
        getState: vi.fn(() => ({
            setAuthData: setAuthDataMock,
        })),
    },
}));

type ToastMessages = {
    loading?: string;
    success?: string | ((result: unknown) => string);
    error?: string | ((err: unknown) => string);
};

let toastPromiseMessages: ToastMessages = {};

vi.mock('react-hot-toast', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-hot-toast')>();
    return {
        default: {
            ...actual.default,
            promise: vi.fn(<T>(p: Promise<T>, msgs: ToastMessages) => {
                toastPromiseMessages = msgs;
                return p;
            }),
            error: vi.fn(),
        },
    };
});

vi.mock('shared/api/api', () => ({
    api: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

import { registrationUser } from './registrationUser';
import toast from 'react-hot-toast';
import { api } from 'shared/api/api';

describe('registrationUser', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        toastPromiseMessages = {};
    });

    it('показывает правильное сообщение загрузки', async () => {
        (api.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: [] });
        (api.post as ReturnType<typeof vi.fn>).mockResolvedValue({
            data: { id: 'uuid', email: 'test@example.com', password: 'hash' },
        });

        await registrationUser({ email: 'test@example.com', password: '123456' });

        expect(toast.promise).toHaveBeenCalled();
        expect(toastPromiseMessages.loading).toBe('Регистрация...');
    });

    it('показывает правильное сообщение успешной регистрации', async () => {
        (api.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: [] });
        (api.post as ReturnType<typeof vi.fn>).mockResolvedValue({
            data: { id: 'uuid', email: 'test@example.com', password: 'hash' },
        });

        const result = await registrationUser({ email: 'test@example.com', password: '123456' });

        const successMessage = toastPromiseMessages.success;
        if (typeof successMessage === 'string') {
            expect(successMessage).toBe('Вы успешно зарегистрировались');
        } else if (typeof successMessage === 'function') {
            expect(successMessage(result)).toBe('Вы успешно зарегистрировались');
        } else {
            throw new Error('Unexpected success message type');
        }
    });
    it('выбрасывает ошибку если email уже существует', async () => {
        (api.get as ReturnType<typeof vi.fn>).mockResolvedValue({
            data: [{ id: '1', email: 'exist@example.com', password: 'hash' }],
        });

        // Запускаем регистрацию с уже существующим email
        const result = await registrationUser({ email: 'exist@example.com', password: '123456' });

        // registrationUser ловит ошибку и возвращает null
        expect(result).toBeNull();

        // Проверяем, что toast.promise вызван с ошибкой, содержащей правильное сообщение
        const errorMessage = toastPromiseMessages.error;

        // error может быть функцией или строкой — проверим оба варианта
        if (typeof errorMessage === 'function') {
            expect(errorMessage(new Error('Пользователь с таким email уже существует'))).toBe(
                'Пользователь с таким email уже существует',
            );
        } else if (typeof errorMessage === 'string') {
            expect(errorMessage).toBe('Пользователь с таким email уже существует');
        } else {
            throw new Error('Unexpected error message type');
        }
    });
    it('показывает правильное сообщение об ошибке', async () => {
        (api.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: [] });
        (api.post as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Failed to register'));

        await registrationUser({ email: 'fail@example.com', password: '123456' });

        const errorMessage = toastPromiseMessages.error;
        if (typeof errorMessage === 'string') {
            expect(errorMessage).toBe('Ошибка при регистрации');
        } else if (typeof errorMessage === 'function') {
            expect(errorMessage(new Error('Failed to register'))).toBe('Failed to register');
            expect(errorMessage('unknown error')).toBe('Ошибка при регистрации');
        } else {
            throw new Error('Unexpected error message type');
        }
    });
});
