import { useAlbumStore } from 'entities/Album';
import { ListTrack } from 'entities/Track';
import { Button, Text } from 'shared/ui';
import { useTranslation } from 'react-i18next';

const formatDate = (isoDateString: string): string => {
    const date = new Date(isoDateString);
    return new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date);
};

export const Album = () => {
    const { t } = useTranslation('album'); // пространство имён 'album'
    const currentAlbum = useAlbumStore((state) => state.currentAlbum);

    if (!currentAlbum) {
        return <div className="p-4 text-center text-gray-500">{t('notSelected')}</div>;
    }

    const createdAt = currentAlbum.createdAt ? formatDate(currentAlbum.createdAt) : null;
    const updatedAt = currentAlbum.updatedAt ? formatDate(currentAlbum.updatedAt) : null;

    return (
        <div className="flex flex-col gap-1 py-6 px-20 text-white min-h-[400px]">
            {/* Верхняя часть с горизонтальными отступами */}
            <div className="flex justify-between items-start gap-6 px-4 py-3 h-64">
                {/* Левая часть: обложка + описание рядом */}
                <div className="flex items-start gap-4 flex-shrink-0 max-w-xl">
                    <img
                        src={currentAlbum.cover}
                        alt={currentAlbum.name}
                        className="w-64 h-64 object-cover rounded-md shadow-lg flex-shrink-0"
                    />
                    <div className="flex flex-col justify-center mt-15">
                        <Text className="text-4xl font-bold">{currentAlbum.name}</Text>
                        {createdAt && (
                            <Text className="mt-4 text-gray-400 text-sm">
                                {t('created', { date: createdAt })}
                            </Text>
                        )}
                        {updatedAt && (
                            <Text className="text-gray-400 text-sm">
                                {t('updated', { date: updatedAt })}
                            </Text>
                        )}
                    </div>
                </div>

                {/* Правая часть: кнопка прижата к низу */}
                <div className="flex flex-col justify-end h-60">
                    <Button type="button">{t('uploadTrack')}</Button>
                </div>
            </div>

            {/* Нижняя часть: ListTrack по центру */}
            <div className="flex justify-center overflow-auto flex-grow mt-10 h-full">
                <ListTrack albumId={currentAlbum.id} albumName={currentAlbum.name} />
            </div>
        </div>
    );
};
