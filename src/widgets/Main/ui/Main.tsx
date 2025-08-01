// src/pages/MainPage.tsx
import { ButtonTheme, PlayButton } from 'shared/ui';

export const Main = () => {
    return (
        <div className="p-4">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-white drop-shadow-md">
                    🎵 Рекомендации для вас
                </h1>
                <PlayButton theme={ButtonTheme.OUTLINE} recommendation />
            </div>
        </div>
    );
};
