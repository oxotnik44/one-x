import { useState, useEffect, Suspense, lazy } from 'react';
import { AppRouter } from './providers/routes';
import { Sidebar } from 'widgets/Sidebar';
import { useThemeStore } from 'shared/config/theme/themeStore';
import { Player } from 'features/Player';
import { loginUser, registrationUser, useUserStore } from 'entities/User';
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
        if (!user) {
            return;
        }

        (async () => {
            setLoadingGroup(true);
            const groups = await fetchGroup(user.id);
            if (groups) {
                setCurrentGroup(groups);
            }

            setLoadingGroup(false);
        })();
    }, [loginUser, registrationUser]);

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
            <Suspense fallback={null}>
                <Sidebar />
                <div className="content-page pl-24 pr-6 pt-6">
                    <AppRouter />
                </div>
                <Player />
            </Suspense>
        </div>
    );
}

export default App;
