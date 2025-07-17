import { useGroupStore } from 'entities/Group';
import { useTranslation } from 'react-i18next';
import { useAlbumStore } from '../model/slice/useAlbumStore';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchAlbums } from '../model/api/fetchAlbums/fetchAlbums';
import { Button, ButtonSize, ButtonTheme, Text } from 'shared/ui';

export const ListAlbum: React.FC = () => {
    const { t } = useTranslation('listAlbum');
    const currentGroup = useGroupStore((state) => state.currentGroup);
    const albums = useAlbumStore((state) => state.albums);
    const setCurrentAlbum = useAlbumStore((state) => state.setCurrentAlbum);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentGroup && albums.length === 0) {
            fetchAlbums(currentGroup.id, currentGroup.name).catch(console.error);
        }
    }, [currentGroup, albums.length]);

    const onAddAlbumClick = () => {
        navigate('/my_group/add_album');
    };

    const onAlbumClick = (albumName: string) => {
        // Находим альбом по имени
        const album = albums.find((a) => a.name === albumName);
        if (album) {
            setCurrentAlbum(album);
        }
        // Кодируем название для URL
        const encodedName = encodeURIComponent(albumName);
        navigate(`/my_group/album/${encodedName}`);
    };

    if (!currentGroup) {
        return <div>{t('noGroup')}</div>;
    }

    return (
        <div className="flex flex-col">
            {albums.length === 0 ? (
                <div className="text-center text-gray-500">{t('noAlbums')}</div>
            ) : (
                <div className="grid grid-cols-2 gap-6 overflow-y-auto max-h-[318px] pr-2">
                    {albums.map((album) => (
                        <button
                            key={album.id}
                            type="button"
                            onClick={() => onAlbumClick(album.name)}
                            className="flex flex-col items-center focus:outline-none transition-opacity duration-200 hover:opacity-70 cursor-pointer"
                        >
                            <img
                                src={album.cover || '/assets/default-cover.png'}
                                alt={album.name}
                                className="w-32 h-32 object-cover rounded-xl shadow-md"
                            />
                            <Text
                                text={album.name}
                                size="small"
                                className="mt-2 text-center break-words max-w-full"
                            />
                        </button>
                    ))}
                </div>
            )}
            <Button
                theme={ButtonTheme.OUTLINE}
                size={ButtonSize.L}
                className="self-center mt-4"
                onClick={onAddAlbumClick}
            >
                {t('addAlbum')}
            </Button>
        </div>
    );
};
