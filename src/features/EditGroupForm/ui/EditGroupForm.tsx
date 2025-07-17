import type { FC } from 'react';
import { Controller } from 'react-hook-form';
import { useEditGroupForm } from '../model/useEditGroupForm';
import { GroupCover } from 'shared/ui/GroupCover/GroupCover';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { genresList } from 'entities/Group';
import { useThemeStore } from 'shared/config/theme/themeStore';
import { Button, ButtonSize, ButtonTheme, Input, Text } from 'shared/ui';

export const EditGroupForm: FC = () => {
    const theme = useThemeStore((s) => s.theme);
    const { control, register, errors, isSubmitting, preview, handleIconChange, onSubmit } =
        useEditGroupForm();
    const navigate = useNavigate();
    const { t } = useTranslation('editGroupForm');

    const handleSaveClick = () => {
        onSubmit();
        navigate('/my_group');
    };

    return (
        <form className="flex flex-col md:flex-row md:items-center md:justify-center gap-14 max-w-4xl p-6 rounded-lg max-h-[80vh] overflow-hidden mx-auto">
            <GroupCover edit preview={preview} onIconChange={handleIconChange} />

            <div
                className="flex flex-col flex-1 overflow-y-auto"
                style={{ maxHeight: '80vh', minWidth: 0 }}
            >
                <Text title={t('title')} className="mb-4" />

                <Text text={t('name.label')} size="medium" className="text-white" />
                <Input
                    {...register('name', {
                        required: t('name.required'),
                        maxLength: { value: 50, message: t('name.max') },
                    })}
                    placeholder={t('name.placeholder')}
                    className="bg-gray-700 border-gray-600 w-full min-w-0 mb-1"
                />
                {errors.name && (
                    <Text error size="small">
                        {errors.name.message}
                    </Text>
                )}

                <Text text={t('description.label')} size="medium" className="text-white mt-2" />
                <Input
                    {...register('description', {
                        maxLength: { value: 200, message: t('description.max') },
                    })}
                    placeholder={t('description.placeholder')}
                    className="p-2 rounded bg-gray-700 border border-gray-600 text-white resize-none focus:outline-none focus:border-pink-600 w-full min-w-0 mb-4"
                />
                {errors.description && (
                    <Text error size="small">
                        {errors.description.message}
                    </Text>
                )}

                <Text text={t('genre.label')} size="medium" className="text-white mb-2" />
                <Controller
                    control={control}
                    name="genre"
                    rules={{ required: t('genre.required') }}
                    render={({ field }) => (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {genresList.map((genre) => {
                                const selected = field.value === genre;
                                return (
                                    <Button
                                        key={genre}
                                        type="button"
                                        onClick={() => field.onChange(genre)}
                                        className={`transition-colors border rounded px-3 py-1 cursor-pointer select-none ${
                                            selected
                                                ? 'text-white'
                                                : 'text-gray-300 hover:text-white'
                                        }`}
                                        style={{
                                            backgroundColor: selected
                                                ? theme['--primary-color']
                                                : '#2d2d2d',
                                            borderColor: selected
                                                ? theme['--primary-color']
                                                : '#4b5563',
                                        }}
                                    >
                                        {genre}
                                    </Button>
                                );
                            })}
                        </div>
                    )}
                />
                {errors.genre && (
                    <Text className="text-red-500 text-sm mb-4">{errors.genre.message}</Text>
                )}

                <Button
                    type="button"
                    disabled={isSubmitting}
                    theme={ButtonTheme.OUTLINE}
                    size={ButtonSize.L}
                    className="self-center"
                    onClick={handleSaveClick}
                >
                    {t('submit')}
                </Button>
            </div>
        </form>
    );
};
