// src/features/AddTrackForm/model/useAddTrackForm.test.tsx
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAddTrackForm } from './useAddTrackForm';
import { useGroupStore } from 'entities/Group/model/slice/useGroupStore';
import { addTrack } from 'entities/Track/api/addTrack';

// Мокаем стор, возвращая именно строку groupName, а не объект
vi.mock('entities/Group/model/slice/useGroupStore', () => ({
    useGroupStore: vi.fn(),
}));

// Мокаем addTrack
vi.mock('entities/Track/api/addTrack', () => ({
    addTrack: vi.fn(),
}));

describe('useAddTrackForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        (useGroupStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            currentGroup: { name: 'TestGroup' },
        });

        global.URL.createObjectURL = vi.fn(() => 'mocked-url');
    });

    it('инициализирует форму с пустыми значениями', () => {
        const { result } = renderHook(() => useAddTrackForm());

        expect(result.current.errors).toEqual({});
        expect(result.current.coverPreview).toBeNull();
        expect(result.current.audioSelected).toBe(false);
        expect(result.current.audioFileName).toBeNull();
    });

    it('обрабатывает смену cover и устанавливает preview', async () => {
        const { result } = renderHook(() => useAddTrackForm());
        const file = new File(['dummy'], 'cover.png', { type: 'image/png' });

        await act(async () => {
            result.current.onCoverChange([file] as unknown as FileList);
            // Ждём, пока React применит все обновления состояния
            await new Promise((resolve) => setTimeout(resolve, 0));
        });

        expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
        expect(result.current.coverPreview).toBe('mocked-url');
    });

    it('обрабатывает смену аудио и устанавливает имя файла', async () => {
        const { result } = renderHook(() => useAddTrackForm());
        const file = new File(['dummy'], 'audio.mp3', { type: 'audio/mp3' });

        await act(async () => {
            result.current.onAudioChange([file] as unknown as FileList);
            // Ждём, пока React применит все обновления состояния
            await new Promise((resolve) => setTimeout(resolve, 0));
        });

        expect(result.current.audioSelected).toBe(true);
        expect(result.current.audioFileName).toBe('audio.mp3');
    });

    it('вызывает addTrack при submitHandler с правильными данными', async () => {
        const { result } = renderHook(() => useAddTrackForm());

        const coverFile = new File(['cover'], 'cover.png', { type: 'image/png' });
        const audioFile = new File(['audio'], 'audio.mp3', { type: 'audio/mp3' });

        act(() => {
            result.current.setValue('cover', [coverFile] as unknown as FileList);
            result.current.setValue('audio', [audioFile] as unknown as FileList);
            result.current.setValue('title', 'My Track');
        });

        (addTrack as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

        await act(async () => {
            await result.current.submitHandler()();
        });

        expect(addTrack).toHaveBeenCalledWith({
            title: 'My Track',
            cover: coverFile,
            audio: audioFile,
            groupName: 'TestGroup',
        });
    });
});
