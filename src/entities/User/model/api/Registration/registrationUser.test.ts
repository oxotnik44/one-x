// src/entities/User/model/api/Registration/registrationUser.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
const setAuthDataMock = vi.fn();
// Моки должны идти ПЕРВЫМИ
vi.mock('entities/User/model/slice/useUserStore', () => ({
    useUserStore: {
        getState: vi.fn(() => ({
            setAuthData: setAuthDataMock,
        })),
    },
}));

vi.mock('react-hot-toast', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-hot-toast')>();
    return {
        default: {
            ...actual.default,
            promise: vi.fn((p: Promise<any>, _msgs: any) => p),
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
import { useUserStore } from 'entities/User/model/slice/useUserStore';
import toast from 'react-hot-toast';
import { api } from 'shared/api/api';

describe('registrationUser', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('возвращает null если email уже существует', async () => {
        (api.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
            data: [{ id: '1', email: 'test@example.com', password: 'hash' }],
        });

        const result = await registrationUser({ email: 'test@example.com', password: '123456' });

        expect(result).toBeNull();
        expect(toast.promise).toHaveBeenCalled();
    });

    it('успешно регистрирует нового пользователя', async () => {
        (api.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ data: [] });

        const newUser = { id: 'uuid', email: 'new@example.com', password: 'hash' };
        (api.post as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ data: newUser });

        // Получаем мок функции setAuthData из getState
        const setAuthDataMock = useUserStore.getState().setAuthData as ReturnType<typeof vi.fn>;

        const result = await registrationUser({ email: 'new@example.com', password: '123456' });

        expect(api.get).toHaveBeenCalledWith('/users', { params: { email: 'new@example.com' } });
        expect(api.post).toHaveBeenCalled();
        expect(setAuthDataMock).toHaveBeenCalledWith(newUser);
        expect(result).toEqual(newUser);
    });

    it('возвращает null при ошибке регистрации', async () => {
        (api.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ data: [] });
        (api.post as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Failed'));

        const result = await registrationUser({ email: 'fail@example.com', password: '123456' });

        expect(result).toBeNull();
        expect(toast.promise).toHaveBeenCalled();
    });
});
