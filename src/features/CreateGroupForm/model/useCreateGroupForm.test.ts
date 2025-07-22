import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCreateGroupForm } from './useCreateGroupForm';
import { createGroup } from 'entities/Group';

// Мокаем createGroup
vi.mock('entities/Group/model/api/createGroup/createGroup', () => ({
    createGroup: vi.fn(),
}));

describe('useCreateGroupForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        global.URL.createObjectURL = vi.fn(() => 'mocked-url');
        global.URL.revokeObjectURL = vi.fn();
    });

    it('устанавливает preview при смене иконки', async () => {
        const { result } = renderHook(() => useCreateGroupForm());

        const file = new File(['dummy'], 'icon.png', { type: 'image/png' });
        const fileList = {
            0: file,
            length: 1,
            item: (index: number) => (index === 0 ? file : null),
        } as unknown as FileList;

        await act(async () => {
            result.current.setValue('icon', fileList, { shouldValidate: true });
            // ждём, пока React применит обновления состояния
            await new Promise((resolve) => setTimeout(resolve, 0));
        });

        expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
        expect(result.current.preview).toBe('mocked-url');
    });

    it('вызывает createGroup и сбрасывает форму при submit', async () => {
        const { result } = renderHook(() => useCreateGroupForm());

        (createGroup as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
            id: '123',
            name: 'Test Group',
        });

        const file = new File(['dummy'], 'icon.png', { type: 'image/png' });
        const fileList = {
            0: file,
            length: 1,
            item: (index: number) => (index === 0 ? file : null),
        } as unknown as FileList;

        act(() => {
            result.current.setValue('name', 'Test Group', { shouldValidate: true });
            result.current.setValue('description', 'Desc', { shouldValidate: true });
            result.current.setValue('icon', fileList, { shouldValidate: true });
            result.current.setValue('genre', 'rock' as any, { shouldValidate: true }); // подставь актуальный жанр из genresList
        });

        await act(async () => {
            await result.current.handleSubmitForm();
        });

        await waitFor(() => {
            expect(createGroup).toHaveBeenCalled();
        });

        expect(result.current.preview).toBe(null);
    });
});
