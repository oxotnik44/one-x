// src/shared/ui/Loader.tsx
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import loaderGif from 'shared/assets/Loader.gif';

const LoaderComponent: React.FC = () => {
    const { t } = useTranslation('loader'); // namespace loader
    return (
        <img
            src={loaderGif}
            alt={t('loading')}
            draggable={false}
            className="w-20 h-20 filter hue-rotate-0 saturate-0 brightness-0 invert-0" // сброс стилей
            style={{ filter: 'invert(28%) sepia(89%) saturate(6475%) hue-rotate(0deg)' }} // красный оттенок
        />
    );
};

export const Loader = memo(LoaderComponent);
Loader.displayName = 'Loader';
