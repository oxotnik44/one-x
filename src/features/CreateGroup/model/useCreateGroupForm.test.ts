import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCreateGroupForm } from './useCreateGroupForm';
import { createGroup } from 'entities/Group/model/api/createGroup';

// Мокаем createGroup
vi.mock('entities/Group/model/api/createGroup', () => ({
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
            // ждём, пока React применит обновления
            await new Promise((resolve) => setTimeout(resolve, 0));
        });

        expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
        expect(result.current.preview).toBe('mocked-url');
    });

    it('вызывает createGroup и сбрасывает форму при submit', async () => {
        const { result } = renderHook(() => useCreateGroupForm());

        (createGroup as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
            id: '123',
            name: 'Test',
        });

        act(() => {
            // Обновляем значения name и description через setValue
            result.current.setValue('name', 'Test Group');
            result.current.setValue('description', 'Desc');
        });

        act(() => {
            result.current.handleSubmitForm();
        });

        // Ждём, пока createGroup будет вызван
        await waitFor(() => {
            expect(createGroup).toHaveBeenCalled();
        });

        // Проверяем, что preview сброшен
        expect(result.current.preview).toBe(null);
    });
});
