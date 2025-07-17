import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, ButtonSize, ButtonTheme, PageWrapper, Text } from 'shared/ui';

export const NotFoundPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation('notFoundPage'); // namespace notFound

    const goHome = () => {
        navigate('/');
    };

    return (
        <PageWrapper>
            <div className="flex flex-col items-center justify-center h-full gap-6">
                <Text title={t('title')} size="large" />
                <Button onClick={goHome} theme={ButtonTheme.OUTLINE} size={ButtonSize.L}>
                    {t('goHome')}
                </Button>
            </div>
        </PageWrapper>
    );
};
