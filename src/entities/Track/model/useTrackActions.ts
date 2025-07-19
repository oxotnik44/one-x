// src/entities/Track/model/useTrackItemLogic.ts
import { useState, useCallback, useRef, useEffect } from 'react';
import { likeTrack, useUserStore } from 'entities/User';
import { usePlayerStore } from 'entities/Player/model';
import { useThemeStore } from 'shared/config/theme/themeStore';
import { useGroupStore } from 'entities/Group';
import { useAlbumStore } from 'entities/Album';
import { deleteTrackFromAlbum } from 'entities/Album/model/api/deleteTrackFromAlbum/deleteTrackFromAlbum';
import { deleteTrack } from './api/deleteTrack/deleteTrack';
import type { Track } from '../model/types/track';

interface UseTrackItemLogicProps {
    track: Track;
    groupName: string;
    onConfirmDelete?: (track: Track) => void;
}

export function useTrackItemLogic({ track, groupName, onConfirmDelete }: UseTrackItemLogicProps) {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const currentGroup = useGroupStore((s) => s.currentGroup);
    const currentAlbum = useAlbumStore((s) => s.currentAlbum);

    const currentTrackId = usePlayerStore((s) => s.currentTrack?.id);
    const isPlayingGlobal = usePlayerStore((s) => s.isPlaying);
    const togglePlay = usePlayerStore((s) => s.togglePlay);
    const setCurrentTrack = usePlayerStore((s) => s.setCurrentTrack);

    const authData = useUserStore((s) => s.authData);
    const theme = useThemeStore((s) => s.theme);

    const isCurrent = currentTrackId === track.id;
    const isPlaying = isCurrent && isPlayingGlobal;
    const liked = Boolean(authData?.likedTracks?.includes(track.id));

    // Клик по кнопке Play
    const onPlayClick = useCallback(() => {
        if (!isCurrent) setCurrentTrack(track);
        else togglePlay();
    }, [isCurrent, setCurrentTrack, track, togglePlay]);

    // Лайк/дизлайк трека
    const toggleLike = useCallback(() => likeTrack(track.id), [track.id]);

    // Открытие/закрытие Dropdown
    const toggleDropdown = useCallback(() => setDropdownOpen((v) => !v), []);

    // Закрытие Dropdown по клику вне
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node))
                setDropdownOpen(false);
        };
        if (isDropdownOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen]);

    // Клик "Удалить" — показываем ConfirmDeleteModal
    const onDeleteClick = () => {
        setDropdownOpen(false);
        setConfirmOpen(false); // явно сбрасываем
        setTimeout(() => setConfirmOpen(true), 0); // и потом открываем
    };
    // Подтверждение удаления
    const onConfirmDeleteClick = useCallback(async () => {
        setConfirmOpen(false);
        try {
            if (!track.albumId) {
                await deleteTrack(groupName, track.title, track.id);
            } else {
                if (!currentGroup || !currentAlbum) return;
                await deleteTrackFromAlbum(track.id, track.title, currentGroup, currentAlbum);
            }
            onConfirmDelete?.(track);
        } catch (error) {
            console.error(error);
        }
    }, [track, groupName, currentGroup, currentAlbum, onConfirmDelete]);

    return {
        isDropdownOpen,
        isConfirmOpen,
        modalRef,
        theme,
        liked,
        isPlaying,
        isCurrent,
        onPlayClick,
        toggleLike,
        toggleDropdown,
        onDeleteClick,
        onConfirmDeleteClick,
        setConfirmOpen,
        setDropdownOpen,
    };
}
