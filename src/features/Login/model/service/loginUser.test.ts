import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUserStore } from 'entities/User/model/slice/userStore';
import { loginUser } from './loginUser';
import { api } from 'shared/api/api';
import type { Mock } from 'vitest';
// Мокаем api
vi.mock('shared/api/api', () => ({
    api: {
        get: vi.fn(),
    },
}));

// Мокаем bcryptjs с default экспортом
vi.mock('bcryptjs', async (importOriginal) => {
    const actual = await importOriginal<typeof import('bcryptjs')>();
    return {
        default: {
            ...actual.default,
            compareSync: vi.fn(),
        },
    };
});

// Мокаем react-hot-toast с default экспортом
vi.mock('react-hot-toast', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-hot-toast')>();
    return {
        default: {
            ...actual.default,
            promise: (_p: Promise<any>, _msgs: any) => _p,
        },
    };
});

const mockSetAuth = vi.fn();
vi.spyOn(useUserStore, 'getState').mockReturnValue({
    setAuthData: mockSetAuth,
    logout: vi.fn(),
    authData: undefined,
});

describe('loginUser', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('успешно логинит пользователя', async () => {
        const fakeUser = { id: 1, email: 'a@b.com', password: 'hash' };
        vi.mocked(api.get).mockResolvedValue({ data: [fakeUser] });
        const bcryptModule = (await import('bcryptjs')).default;
        const compareSyncMock = bcryptModule.compareSync as unknown as ReturnType<typeof vi.fn>;
        compareSyncMock.mockReturnValue(true);

        const result = await loginUser({ email: 'a@b.com', password: 'pwd' });
        expect(result).toEqual(fakeUser);
        expect(mockSetAuth).toHaveBeenCalledWith(fakeUser);
    });

    it('возвращает null, если пользователь не найден', async () => {
        vi.mocked(api.get).mockResolvedValue({ data: [] });

        const result = await loginUser({ email: 'x@y.com', password: 'pwd' });
        expect(result).toBeNull();
        expect(mockSetAuth).not.toHaveBeenCalled();
    });

    it('возвращает null при неверном пароле', async () => {
        const fakeUser = { id: 2, email: 'c@d.com', password: 'hash2' };
        vi.mocked(api.get).mockResolvedValue({ data: [fakeUser] });

        const bcryptModule = (await import('bcryptjs')).default;
        const compareSyncMock = bcryptModule.compareSync as unknown as Mock;
        compareSyncMock.mockReturnValue(false);

        const result = await loginUser({ email: 'c@d.com', password: 'wrong' });
        expect(result).toBeNull();
        expect(mockSetAuth).not.toHaveBeenCalled();
    });

    it('возвращает null и не падает при ошибке API', async () => {
        vi.mocked(api.get).mockRejectedValue(new Error('Network error'));

        const result = await loginUser({ email: 'err@e.com', password: 'pwd' });
        expect(result).toBeNull();
        expect(mockSetAuth).not.toHaveBeenCalled();
    });
});
