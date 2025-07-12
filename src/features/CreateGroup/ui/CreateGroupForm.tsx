import type { FC } from 'react';
import { Controller } from 'react-hook-form';
import { Button, ButtonTheme, ButtonSize } from 'shared/ui/Button/Button';
import { Input } from 'shared/ui/Input/Input';
import { RxAvatar } from 'react-icons/rx';
import { useThemeStore } from 'shared/config/theme/themeStore';
import { Text } from 'shared/ui/Text/Text';
import { useCreateGroupForm } from '../model/useCreateGroupForm';
import { genresList } from 'entities/Group/model/types/group';

export const CreateGroupForm: FC = () => {
    const theme = useThemeStore((state) => state.theme);
    const {
        control,
        register,
        errors,
        isSubmitting,
        isHorizontal,
        preview,
        handleIconClick,
        handleSubmitForm,
    } = useCreateGroupForm();

    return (
        <>
            <div
                className={`
                    flex
                    ${isHorizontal ? 'flex-row' : 'flex-col'}
                    gap-6
                    w-full
                    max-w-4xl
                    p-6
                    rounded-lg
                    max-h-[80vh]
                    overflow-hidden
                `}
            >
                {/* Иконка */}
                <div
                    className={`
                        flex-shrink-0 flex justify-center items-center rounded-md border-2 border-dashed cursor-pointer
                        max-w-32 max-h-32
                        transition-colors
                        ${isHorizontal ? '' : 'mx-auto'}
                    `}
                    style={{
                        borderColor: theme['--primary-color'] || '#880015',
                        color: theme['--primary-color'] || '#880015',
                        width: preview ? 'auto' : '6rem',
                        height: preview ? 'auto' : '6rem',
                    }}
                    title="Добавить иконку группы"
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                            theme['--primary-color'] || '#880015';
                        e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = theme['--primary-color'] || '#880015';
                    }}
                    onClick={handleIconClick}
                >
                    {preview ? (
                        <img
                            src={preview}
                            alt="Иконка группы"
                            className="rounded-md object-contain"
                            style={{ maxWidth: '100%', maxHeight: '100%' }}
                        />
                    ) : (
                        <RxAvatar size={48} className="sm:w-28 sm:h-28 md:w-32 md:h-32" />
                    )}
                </div>

                {/* Правая часть (форма) */}
                <div
                    className="flex flex-col flex-1 overflow-y-auto"
                    style={{ maxHeight: '80vh', minWidth: 0 }}
                >
                    <Controller
                        control={control}
                        name="icon"
                        rules={{ required: 'Иконка обязательна' }}
                        render={({ field }) => (
                            <input
                                id="icon-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => field.onChange(e.target.files)}
                            />
                        )}
                    />
                    {errors.icon && (
                        <Text className="text-red-500 text-sm text-center mb-2">
                            {errors.icon.message}
                        </Text>
                    )}

                    <Text title="Создание группы" className="mb-4" />

                    <Text text="Название группы" className="text-white" size="medium" />
                    <Input
                        {...register('name', {
                            required: 'Название обязательно',
                            maxLength: { value: 50, message: 'Максимум 50 символов' },
                        })}
                        placeholder="Введите название"
                        className="bg-gray-700 border-gray-600 min-w-0 w-full mb-1"
                    />
                    {errors.name && (
                        <Text className="text-red-500 text-sm mb-3">{errors.name.message}</Text>
                    )}

                    <Text text="Краткое описание" className="text-white mt-2" size="medium" />
                    <Input
                        {...register('description', {
                            maxLength: { value: 200, message: 'Максимум 200 символов' },
                        })}
                        placeholder="Введите описание (необязательно)"
                        className="
                            p-2 rounded bg-gray-700 border border-gray-600 text-white resize-none
                            focus:outline-none focus:border-pink-600
                            min-w-0 w-full mb-4
                        "
                    />
                    {errors.description && (
                        <Text className="text-red-500 text-sm mb-4">
                            {errors.description.message}
                        </Text>
                    )}

                    <Text text="Выберите жанр" className="text-white mb-2" size="medium" />
                    <Controller
                        control={control}
                        name="genre"
                        rules={{ required: 'Жанр обязателен' }}
                        render={({ field }) => (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {genresList.map((genre) => {
                                    const isSelected = field.value === genre;
                                    return (
                                        <Button
                                            key={genre}
                                            type="button"
                                            onClick={() => field.onChange(genre)}
                                            className={`
                transition-colors border rounded px-3 py-1 cursor-pointer select-none
                ${isSelected ? 'text-white' : 'text-gray-300 hover:text-white'}
            `}
                                            style={{
                                                backgroundColor: isSelected
                                                    ? theme['--primary-color']
                                                    : '#2d2d2d',
                                                borderColor: isSelected
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
                        onClick={handleSubmitForm}
                    >
                        Создать группу
                    </Button>
                </div>
            </div>
        </>
    );
};
