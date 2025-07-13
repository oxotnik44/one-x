import React, { useEffect } from 'react';
import { useGroupStore } from 'entities/Group/model/slice/useGroupStore';
import { Button, ButtonSize, ButtonTheme } from 'shared/ui/Button/Button';
import { useNavigate } from 'react-router-dom';
import { useTrackStore } from 'entities/Track/slice/useTrackStore';
import { fetchTracksByGroupName } from 'entities/Track/api/fetchTrackByGroupName';
import { TrackItem } from './TrackItem';

export const ListTrack: React.FC = () => {
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
        return <div>Группа не выбрана</div>;
    }

    if (tracks.length === 0) {
        return <div>Синглы отсутствуют</div>;
    }

    const onAddTrackClick = () => {
        navigate('/my_group/add_track');
    };

    return (
        <div className="flex flex-col max-h-[318px]">
            {/* Контейнер с вертикальными отступами и прокруткой */}
            <div className="overflow-y-auto flex-grow pr-2 space-y-4">
                {tracks.map((track) => (
                    <TrackItem key={track.id} track={track} groupName={currentGroup.name} />
                ))}
            </div>

            <Button
                theme={ButtonTheme.OUTLINE}
                size={ButtonSize.L}
                className="self-center mt-4"
                onClick={onAddTrackClick}
            >
                Добавить трек
            </Button>
        </div>
    );
};
