import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loginUser } from './loginUser';
import bcrypt from 'bcryptjs';
import { useUserStore } from 'entities/User/model/slice/useUserStore';
import { apiJson } from 'shared/api';
vi.mock('shared/api/api', async () => {
    const actual = await vi.importActual<typeof import('shared/api/api')>('shared/api/api');
    return {
        ...actual,
        apiJson: {
            get: vi.fn(),
        },
    };
});

vi.mock('entities/User/model/slice/useUserStore', async () => {
    const actual = await vi.importActual<typeof import('entities/User/model/slice/useUserStore')>(
        'entities/User/model/slice/useUserStore',
    );
    return {
        ...actual,
        useUserStore: {
            getState: vi.fn(),
        },
    };
});
describe('loginUser (без моков)', () => {
    beforeEach(() => {
        // сброс стейта, если нужно
    });

    it('успешно логинит пользователя с валидными данными', async () => {
        const email = 's@gmail.com';
        const password = '123123';
        const hashedPassword = bcrypt.hashSync(password, 10);

        const mockedUser = {
            userId: 'uuid-123',
            email,
            username: 'test_user',
            password: hashedPassword,
            avatar: 'https://example.com/avatar.png',
        };

        // Мокаем API
        (apiJson.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: [mockedUser] });

        // Мокаем setAuthData
        const setAuthDataMock = vi.fn();
        (useUserStore.getState as ReturnType<typeof vi.fn>).mockReturnValue({
            setAuthData: setAuthDataMock,
        });

        const result = await loginUser({ email, password });

        expect(apiJson.get).toHaveBeenCalledWith('/users', { params: { email } });
        expect(setAuthDataMock).toHaveBeenCalledWith(mockedUser);

        expect(result).toEqual(mockedUser);
    });

    it('возвращает null, если пользователь не найден', async () => {
        const user = await loginUser({ email: 'not_exists@example.com', password: '123' });
        expect(user).toBeNull();
    });

    it('возвращает null при неверном пароле', async () => {
        const email = 'existing_user@example.com';
        const wrongPassword = 'wrong_password';

        const user = await loginUser({ email, password: wrongPassword });
        expect(user).toBeNull();
    });
});
