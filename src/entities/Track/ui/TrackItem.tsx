// src/entities/Track/ui/TrackItem.tsx
import React from 'react';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { ButtonTheme, ConfirmDeleteModal, Dropdown, Like, PlayButton, Text } from 'shared/ui';
import { formatTime } from 'shared/lib';
import type { Track } from '../model/types/track';
import { useTrackItemLogic } from '../model/useTrackActions';
import { useTranslation } from 'react-i18next';

interface TrackItemProps {
    track: Track;
    groupName: string;
    onConfirmDelete?: (track: Track) => void;
}

export const TrackItem: React.FC<TrackItemProps> = ({ track, groupName, onConfirmDelete }) => {
    const {
        isDropdownOpen,
        isConfirmOpen,
        modalRef,
        theme,
        liked,
        toggleLike,
        toggleDropdown,
        onDeleteClick,
        setDropdownOpen,
        onConfirmDeleteClick,
        setConfirmOpen,
    } = useTrackItemLogic({ track, groupName, onConfirmDelete });

    const { t } = useTranslation('trackItem');

    return (
        <>
            <div
                className="flex w-full max-w-full items-center border rounded overflow-hidden"
                style={{ backgroundColor: 'var(--bg-container)' }}
            >
                <div className="relative w-20 h-20 flex-shrink-0">
                    <img
                        loading="lazy"
                        width={80}
                        height={80}
                        src={track.cover}
                        alt={track.title}
                        className="object-cover rounded-tr-lg rounded-br-lg"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-colors flex items-center justify-center rounded-tr-lg rounded-br-lg">
                        <PlayButton theme={ButtonTheme.CLEAR} showOnHover trackForPlay={track} />
                    </div>
                </div>

                <div className="flex flex-col justify-center flex-grow px-4 overflow-hidden">
                    <Text size="medium" className="truncate">
                        {groupName}
                    </Text>
                    <Text size="medium" className="truncate font-semibold">
                        {track.title}
                    </Text>
                </div>

                <div className="flex gap-5 items-center px-4 min-w-[60px] relative">
                    <Like liked={liked} onToggle={toggleLike} />
                    <Text size="small">{formatTime(track.duration)}</Text>
                    <button
                        className="p-1 rounded-full border border-white hover:border-gray-300 hover:text-black text-gray-500 transition-colors cursor-pointer"
                        onClick={toggleDropdown}
                    >
                        <HiOutlineDotsVertical size={20} color={theme['--primary-color']} />
                    </button>

                    <Dropdown
                        isOpen={isDropdownOpen}
                        onClose={() => setDropdownOpen(false)}
                        className="ml-30 mb-35 min-w-[120px]"
                        ref={modalRef}
                    >
                        <div
                            className="text-sm cursor-pointer hover:bg-gray-100 rounded p-2"
                            onClick={onDeleteClick}
                        >
                            {t('delete')}
                        </div>
                        <div className="text-sm cursor-pointer hover:bg-gray-100 rounded p-2">
                            {t('option2')}
                        </div>
                    </Dropdown>
                </div>
            </div>

            <ConfirmDeleteModal
                isOpen={isConfirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={onConfirmDeleteClick}
            />
        </>
    );
};

TrackItem.displayName = 'TrackItem';
