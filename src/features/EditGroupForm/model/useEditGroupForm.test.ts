// src/features/EditGroupForm/model/useEditGroupForm.test.ts

import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { useEditGroupForm } from './useEditGroupForm';
import { useGroupStore } from 'entities/Group/model/slice/useGroupStore';
import { editGroup } from 'entities/Group/model/api/editGroup';
import type { Group } from 'entities/Group/model/types/group';

vi.mock('entities/Group/model/slice/useGroupStore');
vi.mock('entities/Group/model/api/editGroup');

describe('useEditGroupForm', () => {
    interface MockGroupStore {
        currentGroup: Group | null;
        setCurrentGroup: (group: Group) => void;
        clearCurrentGroup: () => void;
    }

    const mockSet = vi.fn();
    const mockClear = vi.fn();

    const mockGroup: Group = {
        id: 'group-1',
        userId: 'user-1',
        name: 'Test Group',
        description: 'Desc',
        cover: 'http://example.com/cover.png',
        genre: 'Поп',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    let store: MockGroupStore;

    beforeEach(() => {
        vi.clearAllMocks();

        // Мок для URL.createObjectURL
        global.URL.createObjectURL = vi.fn(() => 'blob:dummy-url');

        store = {
            currentGroup: null,
            setCurrentGroup: mockSet,
            clearCurrentGroup: mockClear,
        };
        vi.mocked(useGroupStore).mockImplementation((selector) => selector(store));
    });

    const wrapper = (props: { children: React.ReactNode }) =>
        React.createElement(React.Fragment, null, props.children);

    it('возвращает дефолтные значения', () => {
        store.currentGroup = null;
        const { result } = renderHook(() => useEditGroupForm(), { wrapper });

        expect(result.current.preview).toBeNull();
        expect(result.current.isSubmitting).toBe(false);
    });

    it('инициализирует значения из currentGroup', () => {
        store.currentGroup = mockGroup;
        const { result } = renderHook(() => useEditGroupForm(), { wrapper });

        expect(result.current.preview).toBe(mockGroup.cover);
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

        // Сначала установим превью
        act(() => {
            result.current.handleIconChange({ 0: new File(['x'], 'f.png') } as unknown as FileList);
        });
        expect(result.current.preview).toBe('blob:dummy-url');

        // Потом передадим null
        act(() => {
            result.current.handleIconChange(null);
        });
        expect(result.current.preview).toBeNull();
    });

    it('onSubmit вызывает editGroup с корректными данными', async () => {
        store.currentGroup = mockGroup;
        vi.mocked(editGroup).mockResolvedValue({
            ...mockGroup,
            updatedAt: mockGroup.updatedAt,
        });

        const { result } = renderHook(() => useEditGroupForm(), { wrapper });

        act(() => {
            result.current.register('name').onChange({ target: { value: mockGroup.name } });
            result.current
                .register('description')
                .onChange({ target: { value: mockGroup.description } });
            result.current.register('genre').onChange({ target: { value: mockGroup.genre } });
        });

        await act(async () => {
            await result.current.onSubmit();
        });

        expect(editGroup).toHaveBeenCalledWith(mockGroup.id, {
            name: mockGroup.name,
            description: mockGroup.description,
            genre: mockGroup.genre,
            cover: mockGroup.cover,
            newIconFile: null,
        });
    });

    it('при ошибке в editGroup логирует ошибку', async () => {
        store.currentGroup = mockGroup;
        const error = new Error('fail');
        vi.mocked(editGroup).mockRejectedValue(error);
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => void 0);

        const { result } = renderHook(() => useEditGroupForm(), { wrapper });

        act(() => {
            result.current.register('name').onChange({ target: { value: mockGroup.name } });
            result.current
                .register('description')
                .onChange({ target: { value: mockGroup.description } });
            result.current.register('genre').onChange({ target: { value: mockGroup.genre } });
        });

        await act(async () => {
            await result.current.onSubmit();
        });

        expect(consoleErrorSpy).toHaveBeenCalledWith('Ошибка обновления группы', error);
        consoleErrorSpy.mockRestore();
    });
    it('не вызывает editGroup если currentGroup отсутствует', async () => {
        store.currentGroup = null;
        const { result } = renderHook(() => useEditGroupForm(), { wrapper });

        // Заполним поля (хотя currentGroup отсутствует)
        act(() => {
            result.current.register('name').onChange({ target: { value: 'X' } });
            result.current.register('description').onChange({ target: { value: 'Y' } });
            result.current.register('genre').onChange({ target: { value: 'Рок' } });
        });

        await act(async () => {
            await result.current.onSubmit();
        });

        expect(editGroup).not.toHaveBeenCalled();
    });
});
