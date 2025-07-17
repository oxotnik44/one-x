import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, PageWrapper, Text } from 'shared/ui';

const ErrorPageComponent = () => {
    const { t } = useTranslation('errorPage'); // namespace errorPage

    const reloadPage = useCallback(() => {
        location.reload();
    }, []);

    return (
        <PageWrapper>
            <div className="flex flex-col items-center justify-center h-full gap-6">
                <Text className="text-xl md:text-2xl font-semibold mb-4">
                    {t('unexpectedError')}
                </Text>
                <Button onClick={reloadPage}>{t('refreshPage')}</Button>
            </div>
        </PageWrapper>
    );
};

export const ErrorPage = memo(ErrorPageComponent);
ErrorPage.displayName = 'ErrorPage';
