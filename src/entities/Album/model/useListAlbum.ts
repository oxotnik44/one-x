// src/pages/ListAlbum/model/useListAlbum.ts
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { useGroupStore } from 'entities/Group';
import { useAlbumStore } from 'entities/Album';
import { useUserStore } from 'entities/User';
import { fetchAlbums } from 'entities/Album/model/api/fetchAlbums/fetchAlbums';

export function useListAlbum() {
    const { t } = useTranslation('listAlbum');
    const currentGroup = useGroupStore((state) => state.currentGroup);
    const albums = useAlbumStore((state) => state.albums);
    const setCurrentAlbum = useAlbumStore((state) => state.setCurrentAlbum);
    const authData = useUserStore((state) => state.authData);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!currentGroup) return;
        if (albums.length === 0) {
            setLoading(true);
            fetchAlbums(currentGroup.id, currentGroup.name)
                .catch((e) => {
                    console.error(e);
                    toast.error(t('loadError'));
                })
                .finally(() => setLoading(false));
        }
    }, [currentGroup, albums.length, t]);

    const onAddAlbumClick = useCallback(() => {
        navigate('/my_group/add_album');
    }, [navigate]);

    const onAlbumClick = useCallback(
        (id: string) => {
            const album = albums.find((a) => a.id === id);
            if (album) setCurrentAlbum(album);
            navigate(`/my_group/album/${encodeURIComponent(id)}`);
        },
        [albums, navigate, setCurrentAlbum],
    );

    return {
        t,
        currentGroup,
        albums,
        authData,
        loading,
        onAddAlbumClick,
        onAlbumClick,
    };
}
