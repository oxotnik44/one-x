import React from 'react';
import { Navigate } from 'react-router-dom';
import type { RouteProps } from 'react-router-dom';

const AddTrackPage = React.lazy(() => import('pages/AddTrackPage'));
const MainPage = React.lazy(() => import('pages/MainPage'));
const MyGroupPage = React.lazy(() => import('pages/MyGroupPage'));
const GroupSettingsPage = React.lazy(() => import('pages/GroupSettingsPage'));
const NotFoundPage = React.lazy(() => import('pages/NotFoundPage'));
const SettingsUserPage = React.lazy(() => import('pages/SettingsUserPage'));

export type AppRoutesProps = RouteProps & {
    authOnly?: boolean;
};

export enum AppRoutes {
    ROOT = 'root',
    MAIN = 'main',
    MY_GROUP = 'my_group',
    ADD_TRACK = 'add_track',
    GROUP_SETTINGS = 'group_settings',
    SETTINGS = 'settings',
    NOT_FOUND = 'not_found',
}

export const RoutePath: Record<AppRoutes, string> = {
    [AppRoutes.ROOT]: '/',
    [AppRoutes.MAIN]: '/main',
    [AppRoutes.MY_GROUP]: '/my_group',
    [AppRoutes.ADD_TRACK]: '/my_group/add_track',
    [AppRoutes.GROUP_SETTINGS]: '/my_group/settings',
    [AppRoutes.SETTINGS]: '/settings',
    [AppRoutes.NOT_FOUND]: '*',
};

export const routeConfig: Record<AppRoutes, AppRoutesProps> = {
    [AppRoutes.ROOT]: {
        path: RoutePath[AppRoutes.ROOT],
        element: <Navigate to={RoutePath[AppRoutes.MAIN]} replace />,
    },
    [AppRoutes.MAIN]: {
        path: RoutePath[AppRoutes.MAIN],
        element: (
            <React.Suspense fallback={<div>Загрузка...</div>}>
                <MainPage />
            </React.Suspense>
        ),
    },
    [AppRoutes.MY_GROUP]: {
        path: RoutePath[AppRoutes.MY_GROUP],
        element: (
            <React.Suspense fallback={<div>Загрузка...</div>}>
                <MyGroupPage />
            </React.Suspense>
        ),
        authOnly: true,
    },
    [AppRoutes.ADD_TRACK]: {
        path: RoutePath[AppRoutes.ADD_TRACK],
        element: (
            <React.Suspense fallback={<div>Загрузка...</div>}>
                <AddTrackPage />
            </React.Suspense>
        ),
        authOnly: true,
    },
    [AppRoutes.GROUP_SETTINGS]: {
        path: RoutePath[AppRoutes.GROUP_SETTINGS],
        element: (
            <React.Suspense fallback={<div>Загрузка...</div>}>
                <GroupSettingsPage />
            </React.Suspense>
        ),
        authOnly: true,
    },
    [AppRoutes.SETTINGS]: {
        path: RoutePath[AppRoutes.SETTINGS],
        element: (
            <React.Suspense fallback={<div>Загрузка...</div>}>
                <SettingsUserPage />
            </React.Suspense>
        ),
        authOnly: true,
    },
    [AppRoutes.NOT_FOUND]: {
        path: RoutePath[AppRoutes.NOT_FOUND],
        element: (
            <React.Suspense fallback={<div>Загрузка...</div>}>
                <NotFoundPage />
            </React.Suspense>
        ),
    },
};
