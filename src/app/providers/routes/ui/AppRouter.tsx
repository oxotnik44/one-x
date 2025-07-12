import { routeConfig } from 'shared/config/routeConfig/routeConfig';
import { memo, Suspense, useMemo, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useUserStore } from 'entities/User/model/slice/useUserStore';

// Ленивая загрузка PageLoader
const PageLoader = lazy(() => import('shared/ui/PageLoader/PageLoader'));

const AppRouter = () => {
    const isAuth = useUserStore((state) => !!state.authData);

    const routes = useMemo(() => {
        return Object.values(routeConfig).map((route) => {
            if (route.authOnly && !isAuth) {
                return {
                    ...route,
                    element: <Navigate to="/" replace />,
                };
            }
            return route;
        });
    }, [isAuth]);

    return (
        <Suspense fallback={null /* можно тут простой спиннер, например */}>
            <Routes>
                {routes.map(({ element, path }) => (
                    <Route
                        key={path}
                        path={path}
                        element={<Suspense fallback={<PageLoader />}>{element}</Suspense>}
                    />
                ))}
            </Routes>
        </Suspense>
    );
};

export default memo(AppRouter);
