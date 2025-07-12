import { create } from 'zustand';

export type ContentType = 'albums' | 'singles';

interface GroupContentSwitcherState {
    selected: ContentType;
    setSelected: (value: ContentType) => void;
}

export const useGroupContentSwitcherStore = create<GroupContentSwitcherState>((set) => ({
    selected: 'singles',
    setSelected: (value) => set({ selected: value }),
}));
