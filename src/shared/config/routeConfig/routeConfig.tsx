import { AddTrackPage } from 'pages/AddTrackPage';
import { MainPage } from 'pages/MainPage';
import { MyGroupPage } from 'pages/MyGroupPage';
import React from 'react';
import type { RouteProps } from 'react-router-dom';

const NotFoundPage = React.lazy(() => import('pages/NotFoundPage'));

export type AppRoutesProps = RouteProps & {
    authOnly?: boolean;
};

export enum AppRoutes {
    MAIN = 'main',
    MY_GROUP = 'my_group',
    NOT_FOUND = 'not_found',
    ADD_TRACK = 'add_track',
}

export const RoutePath: Record<AppRoutes, string> = {
    [AppRoutes.MAIN]: '/main',
    [AppRoutes.MY_GROUP]: '/my_group',
    [AppRoutes.ADD_TRACK]: '/my_group/add_track',
    [AppRoutes.NOT_FOUND]: '*',
};

export const routeConfig: Record<AppRoutes, AppRoutesProps> = {
    [AppRoutes.MAIN]: {
        path: RoutePath.main,
        element: <MainPage />,
    },
    [AppRoutes.MY_GROUP]: {
        path: RoutePath.my_group,
        element: <MyGroupPage />,
        authOnly: true,
    },
    [AppRoutes.ADD_TRACK]: {
        path: RoutePath.add_track,
        element: <AddTrackPage />,
        authOnly: true,
    },
    [AppRoutes.NOT_FOUND]: {
        path: RoutePath.not_found,
        element: (
            <React.Suspense fallback={null}>
                <NotFoundPage />
            </React.Suspense>
        ),
    },
};
