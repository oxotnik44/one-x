import React from 'react';
import { RxAvatar, RxSpeakerLoud } from 'react-icons/rx';
import { IoMdMusicalNote } from 'react-icons/io';
import { Input } from 'shared/ui/Input/Input';
import { Button, ButtonSize, ButtonTheme } from 'shared/ui/Button/Button';
import { FilePicker } from 'shared/ui/FilePicker/FilePicker';
import { Text } from 'shared/ui/Text/Text';
import { useAddTrackForm } from '../model/useAddTrackForm';
import { useTranslation } from 'react-i18next';

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

    const { t } = useTranslation('addTrackForm');
    const titleValue = watch('title');

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                void submitHandler()(e);
            }}
            className="flex flex-col gap-6 w-full max-w-md mx-auto"
        >
            <div className="flex gap-4">
                <FilePicker
                    accept="image/*"
                    onChange={onCoverChange}
                    previewUrl={coverPreview}
                    placeholder={<RxAvatar size={48} />}
                    title={t('addCover')}
                />
                {errors.cover && <p className="text-red-600 text-sm mt-1">{t('coverRequired')}</p>}

                <FilePicker
                    accept="audio/mpeg"
                    onChange={onAudioChange}
                    placeholder={
                        audioSelected ? <IoMdMusicalNote size={48} /> : <RxSpeakerLoud size={48} />
                    }
                    title={t('addAudio')}
                    active={audioSelected}
                />
                {errors.audio && <p className="text-red-600 text-sm mt-1">{t('audioRequired')}</p>}
            </div>

            <Input
                placeholder={t('trackTitle')}
                {...register('title')}
                className={errors.title ? 'border-red-600' : ''}
            />
            {!titleValue && audioSelected && (
                <Text className="text-yellow-600 text-sm mt-1" size="medium">
                    {t('titleFromFile')} <b>{audioFileName?.replace(/\.[^/.]+$/, '')}</b>
                </Text>
            )}

            <Button
                type="submit"
                theme={ButtonTheme.OUTLINE}
                size={ButtonSize.L}
                className="self-center mt-2"
            >
                {t('addButton')}
            </Button>
        </form>
    );
};
