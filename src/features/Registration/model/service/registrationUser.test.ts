import { describe, it, expect, beforeEach, vi } from 'vitest';
import { registrationUser } from './registrationUser';
import { useUserStore } from 'entities/User/model/slice/userStore';
import { api } from 'shared/api/api';
import toast from 'react-hot-toast';

// Важно: мок через функцию, чтобы vi был в области видимости
vi.mock('shared/api/api', () => ({
    api: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

vi.mock('entities/User/model/slice/userStore', () => ({
    useUserStore: {
        getState: vi.fn(),
    },
}));

vi.mock('react-hot-toast', () => ({
    default: {
        promise: vi.fn(),
    },
}));

describe('registrationUser', () => {
    const mockSetAuthData = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useUserStore.getState as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            setAuthData: mockSetAuthData,
        });
    });

    it('успешно регистрирует нового пользователя', async () => {
        const fakeUser = { id: '1', email: 'test@example.com', password: 'hashed' };

        // Используем vi.mocked для корректной типизации моков
        vi.mocked(api.get).mockResolvedValueOnce({ data: [] }); // email не занят
        vi.mocked(api.post).mockResolvedValueOnce({ data: fakeUser });

        vi.mocked(toast.promise).mockImplementation(async (promise) => promise);

        const result = await registrationUser({ email: 'test@example.com', password: 'password' });

        expect(api.get).toHaveBeenCalledWith('/users', { params: { email: 'test@example.com' } });
        expect(api.post).toHaveBeenCalled();
        expect(mockSetAuthData).toHaveBeenCalledWith(fakeUser);
        expect(result).toEqual(fakeUser);
    });

    it('возвращает null, если email уже существует', async () => {
        vi.mocked(api.get).mockResolvedValueOnce({
            data: [{ id: '1', email: 'test@example.com', password: 'hashed' }],
        });

        const result = await registrationUser({ email: 'test@example.com', password: 'password' });

        expect(api.get).toHaveBeenCalled();
        expect(api.post).not.toHaveBeenCalled();
        expect(mockSetAuthData).not.toHaveBeenCalled();
        expect(result).toBeNull();
    });

    it('возвращает null при ошибке API', async () => {
        vi.mocked(api.get).mockRejectedValueOnce(new Error('Network error'));

        vi.mocked(toast.promise).mockImplementation(async (promise) => promise);

        const result = await registrationUser({ email: 'test@example.com', password: 'password' });

        expect(result).toBeNull();
    });
});
