import { Button } from 'shared/ui/Button/Button';

export const ErrorPage = () => {
    const reloadPage = () => {
        location.reload();
    };

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center">
            <p className="text-xl md:text-2xl font-semibold mb-4">
                Произошла непредвиденная ошибка
            </p>
            <Button onClick={reloadPage}>Обновить страницу</Button>
        </div>
    );
};
