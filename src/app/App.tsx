import { useEffect, useState, Suspense, lazy } from 'react';
import { AppRouter } from './providers/routes';
import { Sidebar } from 'widgets/Sidebar';
import { useThemeStore } from 'shared/config/theme/themeStore';
import { Player } from 'features/Player';
import { loginUser, useUserStore } from 'entities/User';
import { fetchGroup, useGroupStore } from 'entities/Group';

const AuthModal = lazy(() => import('widgets/AuthModal'));

function App() {
    const user = useUserStore((s) => s.authData);
    const theme = useThemeStore((s) => s.theme);
    const setCurrentGroup = useGroupStore((s) => s.setCurrentGroup);
    const [isOpen, setIsOpen] = useState(true);
    const [isLogin, setIsLogin] = useState(true);
    const [loadingGroup, setLoadingGroup] = useState(false);
    useEffect(() => {
        const tryLogin = async () => {
            // Читаем куку 'user'
            const cookie = document.cookie.split('; ').find((row) => row.startsWith('user='));
            if (!cookie) return;
            try {
                const userFromCookie = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
                if (userFromCookie?.email && userFromCookie?.password) {
                    // Делаем вызов loginUser с email и password из куки
                    await loginUser({
                        email: userFromCookie.email,
                        password: userFromCookie.password,
                    });
                }
            } catch (e) {
                console.error('Ошибка чтения пользователя из куки или авторизации', e);
            }
        };

        tryLogin();
    }, []);
    useEffect(() => {
        const loadGroups = async () => {
            if (!user) return;
            setLoadingGroup(true);
            const groups = await fetchGroup(user.id);
            if (groups) {
                setCurrentGroup(groups);
            }
            setLoadingGroup(false);
        };

        loadGroups();
    }, [user?.id, setCurrentGroup]);
    if (!user)
        return (
            <Suspense fallback={null}>
                <AuthModal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    isLogin={isLogin}
                    setIsLogin={setIsLogin}
                />
            </Suspense>
        );

    if (loadingGroup) return <div>Загрузка данных группы...</div>;
    return (
        <div
            style={{
                backgroundColor: theme['--bg-color'],
                minHeight: '100vh',
                width: '100vw',
                overflowX: 'hidden',
            }}
        >
            <Sidebar />
            <div className="content-page pl-24 pr-6 pt-6">
                <AppRouter />
            </div>
            <Player />
        </div>
    );
}

export default App;
