import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import loaderGif from 'shared/assets/Loader.gif';

const LoaderComponent = () => {
    const { t } = useTranslation('loader'); // namespace loader
    return <img src={loaderGif} alt={t('loading')} draggable={false} />;
};

export const Loader = memo(LoaderComponent);
Loader.displayName = 'Loader';
