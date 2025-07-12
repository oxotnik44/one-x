import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRouter from './AppRouter';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import * as userStoreModule from 'entities/User/model/slice/useUserStore';

vi.mock('entities/User/model/slice/useUserStore');

describe('AppRouter', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('разрешает доступ к /my_group авторизованному пользователю', () => {
        const mockUser = {
            userId: '1',
            username: 'TestUser',
            password: 'hashed-password',
            avatar: 'avatar.png',
        };

        vi.spyOn(userStoreModule, 'useUserStore').mockImplementation((selector) =>
            selector({
                authData: mockUser,
                setAuthData: vi.fn(),
                logout: vi.fn(),
            }),
        );

        render(
            <MemoryRouter initialEntries={['/my_group']}>
                <AppRouter />
            </MemoryRouter>,
        );

        // Вместо toBeInTheDocument просто проверяем, что элемент найден
        expect(screen.queryByTestId('MyGroupPage')).not.toBeNull();
    });
});
