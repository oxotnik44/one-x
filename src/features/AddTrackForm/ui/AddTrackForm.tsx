import React from 'react';
import { RxAvatar, RxSpeakerLoud } from 'react-icons/rx';
import { IoMdMusicalNote } from 'react-icons/io';
import { Input } from 'shared/ui/Input/Input';
import { Button, ButtonSize, ButtonTheme } from 'shared/ui/Button/Button';
import { FilePicker } from 'shared/ui/FilePicker/FilePicker';
import { Text } from 'shared/ui/Text/Text';
import { useAddTrackForm } from '../model/useAddTrackForm';

export const AddTrackForm: React.FC = () => {
    const {
        register,
        onCoverChange,
        onAudioChange,
        watch,
        errors,
        coverPreview,
        audioSelected,
        audioFileName,
        submitHandler,
    } = useAddTrackForm();

    const titleValue = watch('title');

    return (
        <div
            onSubmit={(e) => {
                e.preventDefault();
                void submitHandler()(e); // ← вызываем возвращённую функцию с событием
            }}
            className="flex flex-col gap-6 w-full max-w-md mx-auto"
        >
            <div className="flex gap-4">
                <FilePicker
                    accept="image/*"
                    onChange={onCoverChange}
                    previewUrl={coverPreview}
                    placeholder={<RxAvatar size={48} />}
                    title="Добавить обложку"
                />
                {errors.cover && <p className="text-red-600 text-sm mt-1">Обложка обязательна</p>}

                <FilePicker
                    accept="audio/mpeg"
                    onChange={onAudioChange}
                    placeholder={
                        audioSelected ? <IoMdMusicalNote size={48} /> : <RxSpeakerLoud size={48} />
                    }
                    title="Добавить аудиофайл"
                    active={audioSelected}
                />
                {errors.audio && <p className="text-red-600 text-sm mt-1">Аудиофайл обязателен</p>}
            </div>

            <Input
                placeholder="Название трека"
                {...register('title')}
                className={errors.title ? 'border-red-600' : ''}
            />
            {!titleValue && audioSelected && (
                <Text className="text-yellow-600 text-sm mt-1" size="medium">
                    Название трека не заполнено, будет взято из файла:{' '}
                    <b>{audioFileName?.replace(/\.[^/.]+$/, '')}</b>
                </Text>
            )}

            <Button
                type="submit"
                theme={ButtonTheme.OUTLINE}
                size={ButtonSize.L}
                className="self-center mt-2"
            >
                Добавить
            </Button>
        </div>
    );
};
