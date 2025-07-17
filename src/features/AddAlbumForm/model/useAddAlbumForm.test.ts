// src/widgets/AddAlbumForm/model/useAddAlbumForm.test.tsx
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { useAddAlbumForm } from './useAddAlbumForm';
import { act, renderHook } from '@testing-library/react';

vi.mock('entities/Group/model/slice/useGroupStore', () => ({
    useGroupStore: vi.fn(() => ({ currentGroup: { name: 'TestGroup' } })),
}));

vi.mock('entities/Album', () => ({
    addAlbum: vi.fn(() => Promise.resolve()),
}));

vi.mock('shared/lib/getAudioDuration/getAudioDuration', () => ({
    getAudioDuration: vi.fn(() => Promise.resolve(123)),
}));

vi.mock('shared/lib/extractTitleFromFile/extractTitleFromFile', () => ({
    extractTitleFromFile: vi.fn(() => 'Track Title'),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

describe('useAddAlbumForm', () => {
    beforeAll(() => {
        global.URL.createObjectURL = vi.fn(() => 'blob:http://localhost/fake-blob-url');
        global.URL.revokeObjectURL = vi.fn();
    });

    it('инициализация и обработка onFolderChange', () => {
        const { result } = renderHook(() => useAddAlbumForm());

        // Изначально нет выбранных файлов
        expect(result.current.folderSelected).toBe(false);
        expect(result.current.trackCount).toBe(0);
        expect(result.current.coverPreview).toBe(null);

        // Создаём fake файлы
        const files = [
            new File(['dummy'], 'cover.png', { type: 'image/png' }),
            new File(['dummy'], 'song.mp3', { type: 'audio/mp3' }),
        ];

        act(() => {
            const fileList = {
                length: files.length,
                item(index: number) {
                    return files[index];
                },
                0: files[0],
                1: files[1],
                *[Symbol.iterator](this: { length: number; [key: number]: File }) {
                    for (let i = 0; i < this.length; i++) {
                        yield this[i];
                    }
                },
            } as unknown as FileList;

            result.current.onFolderChange(fileList);
        });

        expect(result.current.folderSelected).toBe(true);
        expect(result.current.trackCount).toBe(1);
        expect(result.current.coverPreview).toContain('blob:'); // preview - blob url
    });

    it('успешный submit вызывает addAlbum и navigate', async () => {
        const { result } = renderHook(() => useAddAlbumForm());

        // Задаём файлы через onFolderChange
        const coverFile = new File(['dummy'], 'cover.png', { type: 'image/png' });
        const audioFile = new File(['dummy'], 'song.mp3', { type: 'audio/mp3' });

        act(() => {
            result.current.onFolderChange({
                length: 2,
                item: (i: number) => (i === 0 ? coverFile : audioFile),
                0: coverFile,
                1: audioFile,
            } as unknown as FileList);
        });

        // Устанавливаем title вручную
        act(() => {
            result.current.register('title');
            result.current.setValue?.('title', 'My Album');
        });

        const event = vi.fn();

        await act(async () => {
            const submitFn = result.current.submitHandler(() => event());
            await submitFn({ preventDefault: vi.fn() } as unknown as React.BaseSyntheticEvent);
        });

        // Проверяем, что addAlbum вызван
        const { addAlbum } = await import('entities/Album');
        expect(addAlbum).toHaveBeenCalled();

        // Проверяем, что navigate вызван
        expect(mockNavigate).toHaveBeenCalledWith(-1);

        // Проверяем, что onSuccess вызван
        expect(event).toHaveBeenCalled();
    });
});
