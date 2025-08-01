// src/pages/ErrorPage/ui/ErrorPage.tsx
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from 'shared/config/theme/themeStore';
import { Button, Text } from 'shared/ui';

const ErrorPageComponent = () => {
    const { t } = useTranslation('errorPage'); // namespace errorPage
    const theme = useThemeStore((state) => state.theme);
    const bg = theme['--bg-container'];

    const reloadPage = useCallback(() => {
        location.reload();
    }, []);

    return (
        <div
            className="fixed inset-0 flex flex-col items-center justify-center gap-6"
            style={{ background: bg }}
        >
            <Text className="text-xl md:text-2xl font-semibold text-white mb-4">
                {t('unexpectedError')}
            </Text>
            <Button onClick={reloadPage}>{t('refreshPage')}</Button>
        </div>
    );
};

export const ErrorPage = memo(ErrorPageComponent);
ErrorPage.displayName = 'ErrorPage';
