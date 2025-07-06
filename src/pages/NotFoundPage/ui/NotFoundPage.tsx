import { useNavigate } from 'react-router-dom';
import { Text } from 'shared/ui/Text/Text';
import { Button, ButtonTheme, ButtonSize } from 'shared/ui/Button/Button';
import { useThemeStore } from 'shared/config/theme/themeStore';

export const NotFoundPage = () => {
    const navigate = useNavigate();
    const theme = useThemeStore((state) => state.theme);

    const goHome = () => {
        navigate('/');
    };

    return (
        <div
            className="flex flex-col justify-center items-center gap-6 px-4"
            style={{
                color: theme['--text-color'],
                height: '100vh',
                width: '100vw',
            }}
        >
            <Text title="Страница не найдена" size="large" />
            <Button
                onClick={goHome}
                theme={ButtonTheme.OUTLINE}
                size={ButtonSize.L}
                className="hover:brightness-90 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
                Перейти на главную страницу
            </Button>
        </div>
    );
};
