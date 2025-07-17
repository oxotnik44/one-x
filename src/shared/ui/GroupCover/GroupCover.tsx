import { useGroupStore } from 'entities/Group/model/slice/useGroupStore';
import React, { useRef } from 'react';
import { Text } from 'shared/ui/Text/Text';
import { useTranslation } from 'react-i18next';

interface GroupCoverProps {
    edit?: boolean;
    preview?: string | null;
    onIconChange?: (files: FileList | null) => void;
}

export const GroupCover: React.FC<GroupCoverProps> = React.memo(
    ({ edit, preview, onIconChange }) => {
        const cover = useGroupStore((s) => s.currentGroup?.cover);
        const name = useGroupStore((s) => s.currentGroup?.name);
        const inputRef = useRef<HTMLInputElement>(null);
        const { t } = useTranslation('groupCover'); // namespace groupCover

        const handleClick = () => {
            if (edit && inputRef.current) {
                inputRef.current.click();
            }
        };

        const image = (
            <img
                src={preview ?? cover ?? ''}
                alt={name ?? t('noGroupSelected')}
                width={512}
                height={512}
                className={`object-contain bg-gray-100 rounded-xl ${
                    !preview && !cover ? 'hidden' : ''
                }`}
            />
        );

        const fallback = !preview && !cover && (
            <div className="w-48 h-48 sm:w-64 sm:h-64 bg-gray-200 rounded-3xl flex items-center justify-center text-gray-400 text-lg sm:text-xl">
                {t('noCover')}
            </div>
        );

        const imageWrapperClass = `relative ${edit ? 'cursor-pointer hover:opacity-80' : ''}`;

        return (
            <div className="flex flex-col items-center w-full md:w-1/3">
                <Text className="font-bold mb-6 text-center" title={name ?? t('noGroupSelected')} />
                <div
                    className={imageWrapperClass}
                    {...(edit && {
                        onClick: handleClick,
                        title: t('clickToChangeIcon'),
                    })}
                >
                    {image}
                    {fallback}
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
    },
);

GroupCover.displayName = 'GroupCover';
