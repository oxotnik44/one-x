// src/entities/Group/model/groupStore.test.ts

import { describe, test, expect, beforeEach } from 'vitest';
import { useGroupStore } from './useGroupStore';

const mockGroup = {
    groupId: '1',
    userId: '2',
    name: 'Test Group',
    genre: 'Rock',
    cover: 'cover.png',
    createdAt: new Date().toISOString(),
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

    test('очищает текущую группу', () => {
        useGroupStore.getState().setCurrentGroup(mockGroup);
        useGroupStore.getState().clearCurrentGroup();
        expect(useGroupStore.getState().currentGroup).toBeNull();
    });
});
