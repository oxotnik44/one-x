// src/features/AddTrackForm/model/useAddTrackForm.test.tsx
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAddTrackForm } from './useAddTrackForm';
import { useGroupStore } from 'entities/Group/model/slice/useGroupStore';
import { addTrack } from 'entities/Track/model/api/addTrack/addTrack';

// Мокаем useNavigate из react-router-dom
vi.mock('react-router-dom', () => ({
    useNavigate: () => vi.fn(),
}));

// Мокаем стор
vi.mock('entities/Group/model/slice/useGroupStore', () => ({
    useGroupStore: vi.fn(),
}));

// Мокаем addTrack
vi.mock('entities/Track/model/api/addTrack/addTrack', () => ({
    addTrack: vi.fn(),
}));

// Мокаем getAudioDuration (если она импортируется отдельно)
vi.mock('shared/lib/getAudioDuration/getAudioDuration', () => ({
    getAudioDuration: vi.fn(() => Promise.resolve(120)),
}));

describe('useAddTrackForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Возвращаем строку groupName, а не объект с currentGroup
        (useGroupStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue('TestGroup');

        global.URL.createObjectURL = vi.fn(() => 'mocked-url');
        global.URL.revokeObjectURL = vi.fn();
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
            await new Promise((r) => setTimeout(r, 0));
        });

        expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
        expect(result.current.coverPreview).toBe('mocked-url');
    });

    it('обрабатывает смену аудио и устанавливает имя файла', async () => {
        const { result } = renderHook(() => useAddTrackForm());
        const file = new File(['dummy'], 'audio.mp3', { type: 'audio/mp3' });

        await act(async () => {
            result.current.onAudioChange([file] as unknown as FileList);
            await new Promise((r) => setTimeout(r, 0));
        });

        expect(result.current.audioSelected).toBe(true);
        expect(result.current.audioFileName).toBe('audio.mp3');
    });

    it('вызывает addTrack при submitHandler с правильными данными', async () => {
        const { result } = renderHook(() => useAddTrackForm());

        const coverFile = new File(['cover'], 'cover.png', { type: 'image/png' });
        const audioFile = new File(['audio'], 'audio.mp3', { type: 'audio/mp3' });

        // Устанавливаем cover
        act(() => {
            result.current.onCoverChange([coverFile] as unknown as FileList);
        });

        // Устанавливаем audio и ждём, чтобы audioDuration установилась (асинхронно)
        await act(async () => {
            result.current.onAudioChange([audioFile] as unknown as FileList);
            // Ждём, пока audioDuration обновится
            await new Promise((r) => setTimeout(r, 0));
        });

        // Устанавливаем title
        act(() => {
            result.current.setValue('title', 'My Track');
        });

        (addTrack as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

        // Теперь вызываем submit
        await act(async () => {
            await result.current.submitHandler()();
        });

        expect(addTrack).toHaveBeenCalledWith({
            title: 'My Track',
            cover: coverFile,
            audio: audioFile,
            duration: 120, // из мока getAudioDuration
            groupName: 'TestGroup',
        });
    });
});
