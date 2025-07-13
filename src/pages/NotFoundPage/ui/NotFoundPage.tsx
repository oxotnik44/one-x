import { useNavigate } from 'react-router-dom';
import { Text } from 'shared/ui/Text/Text';
import { Button, ButtonTheme, ButtonSize } from 'shared/ui/Button/Button';
import { PageWrapper } from 'shared/ui/PageWrapper/PageWrapper';

export const NotFoundPage = () => {
    const navigate = useNavigate();

    const goHome = () => {
        navigate('/');
    };

    return (
        <PageWrapper>
            <div className="flex flex-col items-center justify-center h-full gap-6">
                <Text title="Страница не найдена" size="large" />
                <Button onClick={goHome} theme={ButtonTheme.OUTLINE} size={ButtonSize.L}>
                    Перейти на главную страницу
                </Button>
            </div>
        </PageWrapper>
    );
};
