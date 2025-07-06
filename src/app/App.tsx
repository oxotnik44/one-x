import { useState, Suspense, lazy } from 'react';
import { classNames } from 'shared/lib/classNames/classNames';
import { AppRouter } from './providers/routes';
import { useUserStore } from 'entities/User/model/slice/userStore';
import { Sidebar } from 'widgets/Sidebar';
import { useThemeStore } from 'shared/config/theme/themeStore';
import { Player } from 'widgets/Player/ui/Player';

// Ленивая загрузка AuthModal
const AuthModal = lazy(() => import('widgets/AuthModal'));

function App() {
    const user = useUserStore((state) => state.authData);
    const theme = useThemeStore((state) => state.theme);
    const [isOpen, setIsOpen] = useState(true);
    const [isLogin, setIsLogin] = useState(true);

    const onCloseModal = () => setIsOpen(false);

    if (!user) {
        // Ленивая загрузка и рендер только если нет user
        return (
            <Suspense fallback={null}>
                <AuthModal
                    isOpen={isOpen}
                    onClose={onCloseModal}
                    isLogin={isLogin}
                    setIsLogin={setIsLogin}
                />
            </Suspense>
        );
    }

    return (
        <div
            className={classNames('app', {}, [])}
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
