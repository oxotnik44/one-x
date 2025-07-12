import { create } from 'zustand';
import type { Group, GroupSchema } from '../types/group';

interface GroupStore extends GroupSchema {
    setCurrentGroup: (group: Group) => void;
    clearCurrentGroup: () => void;
}

export const useGroupStore = create<GroupStore>()((set) => ({
    currentGroup: null,

    setCurrentGroup: (group) => {
        set({ currentGroup: group });
    },

    clearCurrentGroup: () => {
        set({ currentGroup: null });
    },
}));
