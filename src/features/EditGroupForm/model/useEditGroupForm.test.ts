import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { useEditGroupForm } from './useEditGroupForm';
import * as groupModule from 'entities/Group'; // Импортируем модуль целиком
import type { Group } from 'entities/Group';

describe('useEditGroupForm', () => {
    interface MockGroupStore {
        currentGroup: Group | null;
        setCurrentGroup: (group: Group) => void;
        clearCurrentGroup: () => void;
    }

    const mockSet = vi.fn();
    const mockClear = vi.fn();

    let store: MockGroupStore;

    beforeEach(() => {
        vi.clearAllMocks();

        // Мокаем createObjectURL
        global.URL.createObjectURL = vi.fn(() => 'blob:dummy-url');

        store = {
            currentGroup: null,
            setCurrentGroup: mockSet,
            clearCurrentGroup: mockClear,
        };

        // Мокаем useGroupStore
        vi.spyOn(groupModule, 'useGroupStore').mockImplementation((selector) => selector(store));
    });

    const wrapper = (props: { children: React.ReactNode }) =>
        React.createElement(React.Fragment, null, props.children);

    it('возвращает дефолтные значения при отсутствии currentGroup', () => {
        store.currentGroup = null;
        const { result } = renderHook(() => useEditGroupForm(), { wrapper });

        expect(result.current.preview).toBeNull();
        expect(result.current.isSubmitting).toBe(false);
    });

    it('handleIconChange обновляет preview и поле icon', () => {
        store.currentGroup = null;
        const { result } = renderHook(() => useEditGroupForm(), { wrapper });

        const file = new File(['x'], 'f.png', { type: 'image/png' });
        const fileList = {
            0: file,
            length: 1,
            item: (i: number) => (i === 0 ? file : null),
        } as unknown as FileList;

        act(() => {
            result.current.handleIconChange(fileList);
        });

        expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
        expect(result.current.preview).toBe('blob:dummy-url');
    });

    it('handleIconChange обнуляет preview при null', () => {
        store.currentGroup = null;
        const { result } = renderHook(() => useEditGroupForm(), { wrapper });

        act(() => {
            result.current.handleIconChange({ 0: new File(['x'], 'f.png') } as unknown as FileList);
        });
        expect(result.current.preview).toBe('blob:dummy-url');

        act(() => {
            result.current.handleIconChange(null);
        });
        expect(result.current.preview).toBeNull();
    });

    it('не вызывает editGroup если currentGroup отсутствует', async () => {
        store.currentGroup = null;

        const editGroupMock = vi.spyOn(groupModule, 'editGroup');

        const { result } = renderHook(() => useEditGroupForm(), { wrapper });

        act(() => {
            result.current.register('name').onChange({ target: { value: 'X' } });
            result.current.register('description').onChange({ target: { value: 'Y' } });
            result.current.register('genre').onChange({ target: { value: 'Рок' } });
        });

        await act(async () => {
            await result.current.onSubmit();
        });

        expect(editGroupMock).not.toHaveBeenCalled();

        editGroupMock.mockRestore();
    });
});
