// src/entities/Track/model/useTrackItemLogic.ts
import { useState, useCallback, useRef, useEffect } from 'react';
import { likeTrack, useUserStore } from 'entities/User';
import { useThemeStore } from 'shared/config/theme/themeStore';
import { useGroupStore } from 'entities/Group';
import { useAlbumStore } from 'entities/Album';
import { deleteTrackFromAlbum } from 'entities/Album/model/api/deleteTrackFromAlbum/deleteTrackFromAlbum';
import { deleteTrack } from './api/deleteTrack/deleteTrack';
import { usePlayerStore } from 'entities/Player/model';
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

    // Данные из стора группы и альбома
    const currentGroup = useGroupStore((s) => s.currentGroup);
    const currentAlbum = useAlbumStore((s) => s.currentAlbum);

    // Данные авторизации и тема
    const authData = useUserStore((s) => s.authData);
    const theme = useThemeStore((s) => s.theme);

    // Для play/pause
    const currentPlayerTrack = usePlayerStore((s) => s.currentTrack);
    const togglePlay = usePlayerStore((s) => s.togglePlay);
    const setPlayerTrack = usePlayerStore((s) => s.setCurrentTrack);

    // Лайк
    const liked = Boolean(authData?.likedTracks?.includes(track.id));
    const toggleLike = useCallback(() => {
        likeTrack(track.id);
    }, [track.id]);

    // Плей/пауза
    const onPlayClick = useCallback(() => {
        if (currentPlayerTrack?.id !== track.id) {
            setPlayerTrack(track);
        } else {
            togglePlay();
        }
    }, [currentPlayerTrack, track, setPlayerTrack, togglePlay]);

    // Открытие/закрытие дропдауна
    const toggleDropdown = useCallback(() => setDropdownOpen((v) => !v), []);

    // Закрытие дропдауна при клике вне
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    // Клик "Удалить" — показываем ConfirmDeleteModal
    const onDeleteClick = () => {
        setDropdownOpen(false);
        setConfirmOpen(false);
        setTimeout(() => setConfirmOpen(true), 0);
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
        toggleLike,
        onPlayClick,
        toggleDropdown,
        onDeleteClick,
        onConfirmDeleteClick,
        setConfirmOpen,
        setDropdownOpen,
    };
}
