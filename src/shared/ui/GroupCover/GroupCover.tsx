import React, { useRef, memo } from 'react';
import { useGroupStore } from 'entities/Group/model/slice/useGroupStore';
import { Text } from 'shared/ui/Text/Text';
import { useTranslation } from 'react-i18next';

interface GroupCoverProps {
    edit?: boolean;
    preview?: string | null;
    onIconChange?: (files: FileList | null) => void;
}

export const GroupCover: React.FC<GroupCoverProps> = memo(({ edit, preview, onIconChange }) => {
    const { currentGroup } = useGroupStore();
    const inputRef = useRef<HTMLInputElement>(null);
    const { t } = useTranslation('groupCover');

    const handleClick = () => {
        if (edit) inputRef.current?.click();
    };

    const src = preview ?? currentGroup?.cover ?? '';
    const name = currentGroup?.name ?? t('noGroupSelected');
    const hasImage = !!src;

    return (
        <div className="flex flex-col items-center w-full md:w-1/3">
            <Text className="font-bold mb-6 text-center" title={name} />
            <div
                className={`relative ${edit ? 'cursor-pointer hover:opacity-80' : ''}`}
                {...(edit && { onClick: handleClick, title: t('clickToChangeIcon') })}
            >
                {hasImage ? (
                    <img
                        src={src}
                        alt={name}
                        width={512}
                        height={512}
                        className="object-contain bg-gray-100 rounded-xl"
                    />
                ) : (
                    <div className="w-48 h-48 sm:w-64 sm:h-64 bg-gray-200 rounded-3xl flex items-center justify-center text-gray-400 text-lg sm:text-xl">
                        {t('noCover')}
                    </div>
                )}

                {edit && (
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => onIconChange?.(e.target.files)}
                    />
                )}
            </div>
        </div>
    );
});

GroupCover.displayName = 'GroupCover';
