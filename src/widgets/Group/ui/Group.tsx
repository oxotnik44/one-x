import React, { useCallback } from 'react';
import { useGroupStore } from 'entities/Group/model/slice/useGroupStore';
import { useGroupContentSwitcherStore, type ContentType } from '../model/useGroup';
import { useThemeStore } from 'shared/config/theme/themeStore';
import { ListTrack } from 'features/ListTrack/ui/ListTrack';
import { Button } from 'shared/ui/Button/Button';
import { Text } from 'shared/ui/Text/Text';

export const Group: React.FC = React.memo(() => {
    const selected = useGroupContentSwitcherStore((state) => state.selected);
    const setSelected = useGroupContentSwitcherStore((state) => state.setSelected);
    const currentGroup = useGroupStore((state) => state.currentGroup);
    const theme = useThemeStore((state) => state.theme);

    const tabs: { id: ContentType; label: string }[] = [
        { id: 'singles', label: 'Синглы' },
        { id: 'albums', label: 'Альбомы' },
    ];

    const onTabClick = useCallback(
        (id: ContentType) => {
            setSelected(id);
        },
        [setSelected],
    );

    return (
        <div
            className="w-full max-w-lg mx-auto p-4 flex flex-col"
            style={{ backgroundColor: 'transparent' }}
        >
            <header className="mb-6">
                <Text className="text-xl font-bold text-center">
                    {currentGroup ? currentGroup.name : 'Группа не выбрана'}
                </Text>
            </header>

            <nav className="flex justify-center gap-4 mb-6">
                {tabs.map((tab) => {
                    const isActive = selected === tab.id;
                    return (
                        <Button
                            key={tab.id}
                            type="button"
                            className="px-5 py-2 rounded-lg font-semibold transition-colors duration-200"
                            style={{
                                backgroundColor: isActive ? theme['--primary-color'] : '#E5E7EB',
                                color: isActive ? '#fff' : theme['--text-color'],
                                boxShadow: isActive
                                    ? `0 0 8px ${theme['--primary-color']}`
                                    : 'none',
                            }}
                            onClick={() => onTabClick(tab.id)}
                        >
                            {tab.label}
                        </Button>
                    );
                })}
            </nav>

            <section className="text-center text-gray-600">
                {selected === 'albums' && <div>Здесь будут альбомы</div>}
                {selected === 'singles' && <ListTrack />}
            </section>
        </div>
    );
});
Group.displayName = 'Group';
