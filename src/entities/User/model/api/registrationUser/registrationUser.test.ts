// src/entities/User/api/registrationUser.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registrationUser } from './registrationUser';
import { useUserStore } from 'entities/User/model/slice/useUserStore';
import { apiJson } from 'shared/api';
import bcrypt from 'bcryptjs';

vi.mock('react-hot-toast', () => ({
    default: {
        promise: (promise: Promise<any>, _messages: any) => promise,
        error: vi.fn(),
    },
}));

vi.mock('entities/User/model/slice/useUserStore', () => ({
    useUserStore: {
        getState: vi.fn(() => ({
            setAuthData: vi.fn(),
        })),
    },
}));

vi.mock('shared/api', () => ({
    apiJson: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

vi.mock('bcryptjs', () => ({
    __esModule: true,
    default: {
        genSaltSync: vi.fn(() => 'salt'),
        hashSync: vi.fn(() => 'hashedPassword'),
    },
}));
describe('registrationUser', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('успешная регистрация', async () => {
        (apiJson.get as any).mockResolvedValueOnce({ data: [] }); // Нет существующих пользователей
        (apiJson.post as any).mockResolvedValueOnce({
            data: {
                id: '123',
                email: 'test@example.com',
                password: 'hashedPassword',
                avatar: '',
                username: '',
                createdAt: '2025-01-01T00:00:00.000Z',
            },
        });

        const setAuthData = vi.fn();
        (useUserStore.getState as any).mockReturnValue({ setAuthData });

        const user = await registrationUser({
            email: 'test@example.com',
            password: 'password123',
        });

        expect(apiJson.get).toHaveBeenCalledWith('/users', {
            params: { email: 'test@example.com' },
        });
        expect(bcrypt.genSaltSync).toHaveBeenCalledWith(10);
        expect(bcrypt.hashSync).toHaveBeenCalledWith('password123', 'salt');
        expect(apiJson.post).toHaveBeenCalled();

        expect(setAuthData).toHaveBeenCalledWith({
            id: '123',
            email: 'test@example.com',
            password: 'hashedPassword',
            avatar: '',
            username: '',
            createdAt: '2025-01-01T00:00:00.000Z',
        });

        expect(user).toEqual({
            id: '123',
            email: 'test@example.com',
            password: 'hashedPassword',
            avatar: '',
            username: '',
            createdAt: '2025-01-01T00:00:00.000Z',
        });
    });

    it('возвращает null если email уже существует', async () => {
        (apiJson.get as any).mockResolvedValueOnce({ data: [{ id: 'existed' }] });

        const user = await registrationUser({
            email: 'test@example.com',
            password: 'password123',
        });

        expect(user).toBeNull();
    });

    it('возвращает null при ошибке apiJson.post', async () => {
        (apiJson.get as any).mockResolvedValueOnce({ data: [] });
        (apiJson.post as any).mockResolvedValueOnce({ data: null });

        const user = await registrationUser({
            email: 'test@example.com',
            password: 'password123',
        });

        expect(user).toBeNull();
    });
});
