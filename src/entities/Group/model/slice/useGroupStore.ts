// src/entities/Group/model/store.ts
import { create } from 'zustand';
import type { Group, GroupSchema } from '../types/group';

interface GroupStore extends GroupSchema {
    groups: Group[];
    currentGroup: Group | null;
    setGroups: (groups: Group[]) => void; // ← новый
    setCurrentGroup: (group: Group | null) => void;
}

export const useGroupStore = create<GroupStore>()((set) => ({
    groups: [],
    currentGroup: null,

    setGroups: (groups) => set({ groups }), // ← реализация
    setCurrentGroup: (group) => set({ currentGroup: group }),
}));
