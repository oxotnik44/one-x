import React, { useState } from 'react';
import { useGroupStore } from 'entities/Group/model/slice/useGroupStore';
import type { Track } from 'entities/Track';
import { Button, ButtonSize, ButtonTheme } from 'shared/ui/Button/Button';
import { useNavigate } from 'react-router-dom';

export const ListTrack: React.FC = () => {
    const currentGroup = useGroupStore((state) => state.currentGroup);
    const navigate = useNavigate();

    // Заглушка данных (пример)
    const [tracks] = useState<Track[]>([
        {
            idTrack: '1',
            title: 'Трек 1',
            duration: 180,
            cover: '',
            albumId: 'album1',
            artistId: 'artist1',
            audioUrl: '',
        },
        {
            idTrack: '2',
            title: 'Трек 2',
            duration: 215,
            cover: '',
            albumId: 'album1',
            artistId: 'artist1',
            audioUrl: '',
        },
    ]);

    if (!currentGroup) {
        return <div>Группа не выбрана</div>;
    }

    if (tracks.length === 0) {
        return <div>Синглы отсутствуют</div>;
    }

    const LikeButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
        <button
            onClick={onClick}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
            aria-label="Лайк"
            type="button"
        >
            ❤️
        </button>
    );

    const formatDuration = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const onAddTrackClick = () => {
        navigate('/my_group/add_track');
    };

    return (
        <div className="flex flex-col gap-4">
            {tracks.map((track) => (
                <div
                    key={track.idTrack}
                    className="flex items-center gap-4 p-2 border rounded"
                    style={{ backgroundColor: 'var(--bg-container)' }}
                >
                    <img
                        src={track.cover || 'https://via.placeholder.com/64?text=Cover'}
                        alt={track.title || 'Обложка трека'}
                        className="w-16 h-16 object-cover rounded"
                    />

                    <div className="flex flex-col flex-grow">
                        <h3 className="font-semibold">{track.title || 'Название трека'}</h3>
                        <p className="text-sm text-gray-500">{formatDuration(track.duration)}</p>
                    </div>

                    <LikeButton onClick={() => alert(`Поставлен лайк для "${track.title}"`)} />
                </div>
            ))}

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
