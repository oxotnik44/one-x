import React from 'react';
import { Navigate } from 'react-router-dom';
import type { RouteProps } from 'react-router-dom';

import AddAlbumPage from 'pages/AddAlbumPage';
import PageLoader from 'shared/ui/PageLoader/PageLoader'; // импорт компонента лоадера

const AddTrackPage = React.lazy(() => import('pages/AddTrackPage'));
const MainPage = React.lazy(() => import('pages/MainPage'));
const MyGroupPage = React.lazy(() => import('pages/MyGroupPage'));
const GroupSettingsPage = React.lazy(() => import('pages/GroupSettingsPage'));
const NotFoundPage = React.lazy(() => import('pages/NotFoundPage'));
const SettingsUserPage = React.lazy(() => import('pages/SettingsUserPage'));
const AlbumPage = React.lazy(() => import('pages/AlbumPage'));

export type AppRoutesProps = RouteProps & {
    authOnly?: boolean;
};

export enum AppRoutes {
    ROOT = 'root',
    MAIN = 'main',
    MY_GROUP = 'my_group',
    ADD_TRACK = 'add_track',
    ADD_ALBUM = 'add_album',
    GROUP_SETTINGS = 'group_settings',
    SETTINGS = 'settings',
    ALBUM_PAGE = 'album_page',
    NOT_FOUND = 'not_found',
}

export const RoutePath: Record<AppRoutes, string> = {
    [AppRoutes.ROOT]: '/',
    [AppRoutes.MAIN]: '/main',
    [AppRoutes.MY_GROUP]: '/my_group',
    [AppRoutes.ADD_TRACK]: '/my_group/add_track',
    [AppRoutes.GROUP_SETTINGS]: '/my_group/settings',
    [AppRoutes.SETTINGS]: '/settings',
    [AppRoutes.ADD_ALBUM]: '/my_group/add_album',
    [AppRoutes.ALBUM_PAGE]: '/my_group/album/:albumId',
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
            <React.Suspense fallback={<PageLoader />}>
                <MainPage />
            </React.Suspense>
        ),
        authOnly: true,
    },
    [AppRoutes.MY_GROUP]: {
        path: RoutePath[AppRoutes.MY_GROUP],
        element: (
            <React.Suspense fallback={<PageLoader />}>
                <MyGroupPage />
            </React.Suspense>
        ),
        authOnly: true,
    },
    [AppRoutes.ADD_TRACK]: {
        path: RoutePath[AppRoutes.ADD_TRACK],
        element: (
            <React.Suspense fallback={<PageLoader />}>
                <AddTrackPage />
            </React.Suspense>
        ),
        authOnly: true,
    },
    [AppRoutes.GROUP_SETTINGS]: {
        path: RoutePath[AppRoutes.GROUP_SETTINGS],
        element: (
            <React.Suspense fallback={<PageLoader />}>
                <GroupSettingsPage />
            </React.Suspense>
        ),
        authOnly: true,
    },
    [AppRoutes.ADD_ALBUM]: {
        path: RoutePath[AppRoutes.ADD_ALBUM],
        element: (
            <React.Suspense fallback={<PageLoader />}>
                <AddAlbumPage />
            </React.Suspense>
        ),
        authOnly: true,
    },
    [AppRoutes.SETTINGS]: {
        path: RoutePath[AppRoutes.SETTINGS],
        element: (
            <React.Suspense fallback={<PageLoader />}>
                <SettingsUserPage />
            </React.Suspense>
        ),
        authOnly: true,
    },
    [AppRoutes.ALBUM_PAGE]: {
        path: RoutePath[AppRoutes.ALBUM_PAGE],
        element: (
            <React.Suspense fallback={<PageLoader />}>
                <AlbumPage />
            </React.Suspense>
        ),
        authOnly: true,
    },
    [AppRoutes.NOT_FOUND]: {
        path: RoutePath[AppRoutes.NOT_FOUND],
        element: (
            <React.Suspense fallback={<PageLoader />}>
                <NotFoundPage />
            </React.Suspense>
        ),
    },
};
