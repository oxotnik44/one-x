// src/entities/Group/model/groupStore.test.ts

import { describe, test, expect, beforeEach } from 'vitest';
import { useGroupStore } from './useGroupStore';
import type { Group } from '../types/group';

const mockGroup: Group = {
    userId: '2',
    name: 'Test Group',
    genre: 'Рок',
    cover: 'cover.png',
    createdAt: new Date().toISOString(),
    id: '123',
    description: 'qwe',
    updatedAt: '123',
};

describe('useGroupStore', () => {
    beforeEach(() => {
        // сбрасываем store перед каждым тестом
        useGroupStore.setState({ currentGroup: null });
    });

    test('устанавливает текущую группу', () => {
        useGroupStore.getState().setCurrentGroup(mockGroup);
        expect(useGroupStore.getState().currentGroup).toEqual(mockGroup);
    });
});
