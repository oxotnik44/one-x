import { create } from 'zustand';
import type { Group, GroupSchema } from '../types/group';

interface GroupStore extends GroupSchema {
    setCurrentGroup: (group: Group) => void;
}

export const useGroupStore = create<GroupStore>()((set) => ({
    currentGroup: null,

    setCurrentGroup: (group) => {
        set({ currentGroup: group });
    },
}));
