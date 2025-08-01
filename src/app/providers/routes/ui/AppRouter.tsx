// src/providers/routes/AppRouter.tsx
import { memo, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PageLoader from 'shared/ui/PageLoader/PageLoader';
import { routeConfig } from 'shared/config/routeConfig/routeConfig';

const AppRouter = () => {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                {Object.values(routeConfig).map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                ))}
            </Routes>
        </Suspense>
    );
};

export default memo(AppRouter);
