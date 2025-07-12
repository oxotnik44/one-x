import { useState, useEffect, Suspense, lazy } from 'react';
import { classNames } from 'shared/lib/classNames/classNames';
import { AppRouter } from './providers/routes';
import { useUserStore } from 'entities/User/model/slice/useUserStore';
import { Sidebar } from 'widgets/Sidebar';
import { useThemeStore } from 'shared/config/theme/themeStore';
import { Player } from 'features/Player';
import { useGroupStore } from 'entities/Group/model/slice/useGroupStore';
import { fetchGroup } from 'entities/Group/model/api/fetchGroup';

const AuthModal = lazy(() => import('widgets/AuthModal'));

function App() {
    const user = useUserStore((state) => state.authData);
    const theme = useThemeStore((state) => state.theme);
    const setCurrentGroup = useGroupStore((state) => state.setCurrentGroup);

    const [isOpen, setIsOpen] = useState(true);
    const [isLogin, setIsLogin] = useState(true);
    const [loadingGroup, setLoadingGroup] = useState(false);

    const onCloseModal = () => setIsOpen(false);

    useEffect(() => {
        if (!user) {
            useGroupStore.getState().clearCurrentGroup();
            return;
        }

        async function loadGroup() {
            setLoadingGroup(true);
            if (user) {
                const group = await fetchGroup(user.userId);
                if (group) {
                    setCurrentGroup(group);
                } else {
                    useGroupStore.getState().clearCurrentGroup();
                }
                setLoadingGroup(false);
            }
        }
        void loadGroup();
    }, [user, setCurrentGroup]);

    if (!user) {
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

    if (loadingGroup) {
        return <div>Загрузка данных группы...</div>;
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
