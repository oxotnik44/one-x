import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrackItem } from './TrackItem';
import { useTranslation } from 'react-i18next';
import { useGroupStore } from 'entities/Group';
import { fetchTrack } from '../model/api/fetchTrack/fetchTrack';
import { useTrackStore } from '../model/slice/useTrackStore';
import { Button, ButtonSize, ButtonTheme } from 'shared/ui';

interface ListTrackProps {
    albumId?: string; // Опциональный id альбома
    albumName?: string;
}

export const ListTrack: React.FC<ListTrackProps> = ({ albumId, albumName }) => {
    const { t } = useTranslation('listTrack');
    const currentGroup = useGroupStore((state) => state.currentGroup);
    const tracks = useTrackStore((state) => state.tracks);
    const navigate = useNavigate();
    useEffect(() => {
        if (!currentGroup) return;

        useTrackStore.getState().setTracks([]);

        fetchTrack(currentGroup.id, currentGroup.name, albumId, albumName);
    }, [currentGroup, albumId, albumName]);

    if (!currentGroup) {
        return <div>{t('noGroup')}</div>;
    }

    const onAddTrackClick = () => {
        navigate('/my_group/add_track');
    };

    return (
        <div className="flex flex-col flex-grow h-full min-h-0">
            <div className="overflow-y-auto flex-grow pr-2 space-y-4 min-h-0">
                {tracks.length > 0 ? (
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
