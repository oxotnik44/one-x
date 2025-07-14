import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'shared/ui/Button/Button';
import { Text } from 'shared/ui/Text/Text';

const ErrorPageComponent = () => {
    const { t } = useTranslation('errorPage'); // namespace errorPage

    const reloadPage = useCallback(() => {
        location.reload();
    }, []);

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center">
            <Text className="text-xl md:text-2xl font-semibold mb-4">{t('unexpectedError')}</Text>
            <Button onClick={reloadPage}>{t('refreshPage')}</Button>
        </div>
    );
};

export const ErrorPage = memo(ErrorPageComponent);
ErrorPage.displayName = 'ErrorPage';
