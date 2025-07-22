import { routeConfig } from 'shared/config/routeConfig/routeConfig';
import { memo, Suspense, useMemo } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useUserStore } from 'entities/User/model/slice/useUserStore';

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
                    <Route key={path} path={path} element={element} />
                ))}
            </Routes>
        </Suspense>
    );
};

export default memo(AppRouter);
