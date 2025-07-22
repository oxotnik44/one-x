import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGroupStore } from 'entities/Group';
import { fetchTrack } from '../model/api/fetchTrack/fetchTrack';
import { useTrackStore } from '../model/slice/useTrackStore';
import { Button, ButtonSize, ButtonTheme, Skeleton } from 'shared/ui';
import { TrackItem } from './TrackItem';

interface ListTrackProps {
    albumId: string;
    albumName: string;
}

export const ListTrack: React.FC<ListTrackProps> = ({ albumId, albumName }) => {
    const { t } = useTranslation('listTrack');
    const currentGroup = useGroupStore((state) => state.currentGroup);
    const tracks = useTrackStore((state) => state.tracks);
    const loading = useTrackStore((state) => state.loading);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentGroup) return;
        useTrackStore.getState().setTracks([]);
        useTrackStore.getState().setLoading(true);
        fetchTrack(currentGroup.id, currentGroup.name, albumId, albumName).finally(() =>
            useTrackStore.getState().setLoading(false),
        );
    }, [currentGroup, albumId, albumName]);

    if (!currentGroup) {
        return <div>{t('noGroup')}</div>;
    }

    const onAddTrackClick = () => {
        navigate('/my_group/add_track');
    };

    return (
        // Корневой flex-контейнер: flex-grow + min-h-0
        <div className="flex flex-col flex-grow h-full min-h-0">
            {/* Секция со скроллом */}
            <div className="overflow-y-auto overscroll-contain flex-grow pr-2 space-y-4 min-h-0">
                {loading ? (
                    Array.from({ length: 3 }).map((_, idx) => (
                        <div key={idx} className="flex items-center space-x-4">
                            <Skeleton className="w-20 h-20 rounded-lg" />
                            <div className="flex-grow space-y-2">
                                <Skeleton className="h-4 w-1/2 rounded" />
                                <Skeleton className="h-4 w-1/3 rounded" />
                            </div>
                        </div>
                    ))
                ) : tracks.length > 0 ? (
                    tracks.map((track) => (
                        <TrackItem key={track.id} track={track} groupName={currentGroup.name} />
                    ))
                ) : (
                    <div>{t('noTracks')}</div>
                )}
            </div>

            {!albumId && (
                <Button
                    theme={ButtonTheme.OUTLINE}
                    size={ButtonSize.L}
                    className="self-center mt-4"
                    onClick={onAddTrackClick}
                >
                    {t('addTrack')}
                </Button>
            )}
        </div>
    );
};
