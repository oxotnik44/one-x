import type { FC } from 'react';
import { Controller } from 'react-hook-form';
import { Button, ButtonTheme, ButtonSize } from 'shared/ui/Button/Button';
import { Input } from 'shared/ui/Input/Input';
import { useThemeStore } from 'shared/config/theme/themeStore';
import { Text } from 'shared/ui/Text/Text';
import { useEditGroupForm } from '../model/useEditGroupForm';
import { genresList } from 'entities/Group/model/types/group';
import { GroupCover } from 'shared/ui/GroupCover/GroupCover';

export const EditGroupForm: FC = () => {
    const theme = useThemeStore((s) => s.theme);
    const { control, register, errors, isSubmitting, preview, handleIconChange, onSubmit } =
        useEditGroupForm();
    // При клике вызываем onSubmit вручную
    const handleSaveClick = () => {
        onSubmit();
    };

    return (
        <form
            className="flex flex-col md:flex-row md:items-center md:justify-center gap-14 max-w-4xl p-6 rounded-lg max-h-[80vh] overflow-hidden mx-auto"
            // Убираем onSubmit, так как это не форма
        >
            <GroupCover edit preview={preview} onIconChange={handleIconChange} />

            <div
                className="flex flex-col flex-1 overflow-y-auto"
                style={{ maxHeight: '80vh', minWidth: 0 }}
            >
                <Text title="Редактирование группы" className="mb-4" />

                <Text text="Название группы" size="medium" className="text-white" />
                <Input
                    {...register('name', {
                        required: 'Название обязательно',
                        maxLength: { value: 50, message: 'Максимум 50 символов' },
                    })}
                    placeholder="Введите название"
                    className="bg-gray-700 border-gray-600 w-full min-w-0 mb-1"
                />
                {errors.name && (
                    <Text error size={'small'}>
                        {errors.name.message}
                    </Text>
                )}

                <Text text="Краткое описание" size="medium" className="text-white mt-2" />
                <Input
                    {...register('description', {
                        maxLength: { value: 200, message: 'Максимум 200 символов' },
                    })}
                    placeholder="Введите описание (необязательно)"
                    className="p-2 rounded bg-gray-700 border border-gray-600 text-white resize-none focus:outline-none focus:border-pink-600 w-full min-w-0 mb-4"
                />
                {errors.description && (
                    <Text error size={'small'}>
                        {errors.description.message}
                    </Text>
                )}

                <Text text="Выберите жанр" size="medium" className="text-white mb-2" />
                <Controller
                    control={control}
                    name="genre"
                    rules={{ required: 'Жанр обязателен' }}
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
                    type="button" // теперь просто кнопка
                    disabled={isSubmitting}
                    theme={ButtonTheme.OUTLINE}
                    size={ButtonSize.L}
                    className="self-center"
                    onClick={handleSaveClick} // вызов сабмита вручную
                >
                    Сохранить изменения
                </Button>
            </div>
        </form>
    );
};
