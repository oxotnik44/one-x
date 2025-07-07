import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useUserStore } from 'entities/User/model/slice/userStore';
import AppRouter from './AppRouter';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Импортируем весь модуль routeConfig для мокирования
import * as routeModule from 'shared/config/routeConfig/routeConfig';

vi.mock('entities/User/model/slice/userStore');
const mockedUseUserStore = vi.mocked(useUserStore);

describe('AppRouter', () => {
    beforeEach(() => {
        // Мокаем routeConfig, чтобы для ABOUT был реальный элемент
        vi.spyOn(routeModule, 'routeConfig', 'get').mockReturnValue({
            ...routeModule.routeConfig,
            [routeModule.AppRoutes.ABOUT]: {
                path: routeModule.RoutePath.about,
                element: <div>About page content</div>, // добавляем реальный элемент для теста
                authOnly: true,
            },
        });
    });

    it('редиректит неавторизованного пользователя с authOnly маршрута', () => {
        mockedUseUserStore.mockReturnValue(false); // неавторизован

        render(
            <MemoryRouter initialEntries={['/about']}>
                <AppRouter />
            </MemoryRouter>,
        );

        // Проверяем, что контент защищённого роута не рендерится
        expect(screen.queryByText('About page content')).toBeNull(); // <- исправлено

        // Можно также проверить, что редирект на главную
        expect(window.location.pathname).toBe('/');
    });

    it('показывает маршруты для авторизованного пользователя', () => {
        mockedUseUserStore.mockReturnValue(true); // авторизован

        render(
            <MemoryRouter initialEntries={['/about']}>
                <AppRouter />
            </MemoryRouter>,
        );

        // Проверяем, что защищённый маршрут отображается
        expect(screen.queryByText('About page content')).not.toBeNull();
    });
});
