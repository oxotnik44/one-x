// src/pages/Group/ui/Group.tsx

import { type FC, memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useGroupContentSwitcherStore, type ContentType } from '../model/useGroup';
import { useThemeStore } from 'shared/config/theme/themeStore';
import { ListAlbum } from 'entities/Album';
import { ListTrack } from 'entities/Track';
import { Button, ButtonNavigation, GroupCover } from 'shared/ui';

const TabButton: FC<{
    id: ContentType;
    label: string;
    isActive: boolean;
    onClick: (id: ContentType) => void;
}> = memo(({ id, label, isActive, onClick }) => {
    const theme = useThemeStore((s) => s.theme);

    return (
        <Button
            type="button"
            className="px-6 py-3 rounded-lg font-semibold text-lg transition-colors duration-200"
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

export const Group: FC = memo(() => {
    const { t } = useTranslation('group');
    const selected = useGroupContentSwitcherStore((s) => s.selected);
    const setSelected = useGroupContentSwitcherStore((s) => s.setSelected);

    const onTabClick = useCallback((id: ContentType) => setSelected(id), [setSelected]);

    const tabs: { id: ContentType; label: string }[] = [
        { id: 'singles', label: t('singles') },
        { id: 'albums', label: t('albums') },
    ];

    return (
        <div className="max-w-5xl mx-auto p-6 sm:p-8 flex flex-col md:flex-row gap-8 md:gap-12 justify-center items-center min-h-[70vh]">
            <GroupCover />

            <div className="flex flex-col w-full md:w-2/3 items-center mt-20">
                <nav className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6 sm:mb-8 w-full min-h-[56px]">
                    {tabs.map((tab) => (
                        <TabButton
                            key={tab.id}
                            {...tab}
                            isActive={selected === tab.id}
                            onClick={onTabClick}
                        />
                    ))}
                </nav>

                <section className="w-full text-center text-gray-600 text-base sm:text-lg min-h-[300px]">
                    {selected === 'albums' ? (
                        <ListAlbum />
                    ) : (
                        <ListTrack albumId={''} albumName={''} />
                    )}
                </section>
            </div>

            <ButtonNavigation settings />
        </div>
    );
});

Group.displayName = 'Group';
