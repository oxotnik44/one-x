import React, { useEffect } from 'react';
import { useGroupStore } from 'entities/Group/model/slice/useGroupStore';
import { Button, ButtonSize, ButtonTheme } from 'shared/ui/Button/Button';
import { useNavigate } from 'react-router-dom';
import { useTrackStore } from 'entities/Track/slice/useTrackStore';
import { fetchTracksByGroupName } from 'entities/Track/api/fetchTrackByGroupName';
import { TrackItem } from './TrackItem';
import { useTranslation } from 'react-i18next';

export const ListTrack: React.FC = () => {
    const { t } = useTranslation('listTrack');
    const currentGroup = useGroupStore((state) => state.currentGroup);
    const tracks = useTrackStore((state) => state.tracks);
    const setTracks = useTrackStore((state) => state.setTracks);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentGroup?.id) {
            fetchTracksByGroupName(currentGroup.name, currentGroup.id).then(setTracks);
        }
    }, [currentGroup?.id, setTracks, currentGroup?.name]);

    if (!currentGroup) {
        return <div>{t('noGroup')}</div>;
    }

    const onAddTrackClick = () => {
        navigate('/my_group/add_track');
    };

    return (
        <div className="flex flex-col max-h-[318px]">
            <div className="overflow-y-auto flex-grow pr-2 space-y-4">
                {tracks.map((track) => (
                    <TrackItem key={track.id} track={track} groupName={currentGroup.name} />
                ))}
            </div>
            {tracks.length === 0 && <div>{t('noTracks')}</div>}
            <Button
                theme={ButtonTheme.OUTLINE}
                size={ButtonSize.L}
                className="self-center mt-4"
                onClick={onAddTrackClick}
            >
                {t('addTrack')}
            </Button>
        </div>
    );
};
