import React, { useCallback } from 'react';
import { useGroupContentSwitcherStore, type ContentType } from '../model/useGroup';
import { useThemeStore } from 'shared/config/theme/themeStore';
import { ListTrack } from 'features/ListTrack/ui/ListTrack';
import { Button } from 'shared/ui/Button/Button';
import { GroupCover } from 'shared/ui/GroupCover/GroupCover';
import { ButtonNavigation } from 'shared/ui/ButtonNavigation/ButtonNavigation';

const tabs: { id: ContentType; label: string }[] = [
    { id: 'singles', label: 'Синглы' },
    { id: 'albums', label: 'Альбомы' },
];

const TabButton: React.FC<{
    id: ContentType;
    label: string;
    isActive: boolean;
    onClick: (id: ContentType) => void;
}> = React.memo(({ id, label, isActive, onClick }) => {
    const theme = useThemeStore((s) => s.theme);
    return (
        <Button
            type="button"
            className="px-6 py-3 rounded-lg font-semibold transition-colors duration-200 text-lg"
            style={{
                backgroundColor: isActive ? theme['--primary-color'] : '#E5E7EB',
                color: isActive ? '#fff' : theme['--text-color'],
                boxShadow: isActive ? `0 0 8px ${theme['--primary-color']}` : undefined,
            }}
            onClick={() => onClick(id)}
        >
            {label}
        </Button>
    );
});
TabButton.displayName = 'TabButton';
export const Group: React.FC = React.memo(() => {
    const selected = useGroupContentSwitcherStore((s) => s.selected);
    const setSelected = useGroupContentSwitcherStore((s) => s.setSelected);

    const onTabClick = useCallback((id: ContentType) => setSelected(id), [setSelected]);

    return (
        <div className="max-w-5xl mx-auto p-6 sm:p-8 flex flex-col md:flex-row gap-8 md:gap-12 justify-center items-center min-h-[70vh]">
            {/* Левая часть */}
            <GroupCover />

            {/* Правая часть */}
            <div className="flex flex-col w-full md:w-2/3 items-center mt-20">
                <nav className="flex justify-center gap-4 sm:gap-6 mb-6 sm:mb-8 w-full min-h-[56px] flex-wrap">
                    {tabs.map((tab) => (
                        <TabButton
                            key={tab.id}
                            {...tab}
                            isActive={selected === tab.id}
                            onClick={onTabClick}
                        />
                    ))}
                </nav>

                <section className="text-center text-gray-600 text-base sm:text-lg w-full min-h-[300px]">
                    {selected === 'albums' ? <div>Здесь будут альбомы</div> : <ListTrack />}
                </section>
            </div>
            <ButtonNavigation settings />
        </div>
    );
});

Group.displayName = 'Group';
