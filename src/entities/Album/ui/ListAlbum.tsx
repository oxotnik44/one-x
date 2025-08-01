// src/entities/Album/ui/ListAlbum.tsx
import React from 'react';
import { Button, ButtonSize, ButtonTheme, Text, Skeleton, Like, PlayButton } from 'shared/ui';
import { useListAlbum } from '../model/useListAlbum';
import { likeAlbum } from 'entities/User';

export const ListAlbum: React.FC = () => {
    const { t, currentGroup, albums, authData, loading, onAddAlbumClick, onAlbumClick } =
        useListAlbum();

    if (!currentGroup) {
        return <div className="text-center text-gray-500">{t('noGroup')}</div>;
    }

    return (
        <div className="flex flex-col">
            {loading ? (
                <div className="grid grid-cols-2 gap-6">
                    {Array.from({ length: 2 }).map((_, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                            <Skeleton className="w-32 h-32 rounded-xl" />
                            <Skeleton className="h-4 w-24 mt-2 rounded" />
                        </div>
                    ))}
                </div>
            ) : albums.length === 0 ? (
                <div className="text-center text-gray-500">{t('noAlbums')}</div>
            ) : (
                <div className="grid grid-cols-2 gap-6 overflow-y-auto max-h-[318px] pr-2">
                    {albums.map((album) => {
                        const isLiked = authData?.likedAlbums?.includes(album.id) ?? false;
                        return (
                            <div
                                key={album.id}
                                onClick={() => onAlbumClick(album.id)}
                                className="group relative flex flex-col items-center focus:outline-none cursor-pointer"
                            >
                                <div className="relative w-32 h-32 rounded-xl shadow-md overflow-hidden">
                                    <img
                                        src={album.cover || '/assets/default-cover.png'}
                                        alt={album.name}
                                        className="w-full h-full object-cover rounded-xl transition-opacity duration-200 ease-in-out"
                                    />
                                    {/* Затемнение поверх картинки */}
                                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 rounded-xl transition-opacity" />
                                </div>

                                <Text
                                    text={album.name}
                                    size="small"
                                    className="mt-2 text-center break-words max-w-full"
                                />

                                <div
                                    className="absolute mt-21 mr-18 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    <PlayButton
                                        theme={ButtonTheme.OUTLINE}
                                        albumForPlay={album}
                                        trackForPlay={null}
                                    />
                                </div>

                                <div
                                    className="absolute mt-23 ml-20 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    <Like liked={isLiked} onToggle={() => likeAlbum(album.id)} />
                                </div>
                            </div>
                        );
                    })}
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
