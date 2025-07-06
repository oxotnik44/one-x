import { Loader } from 'shared/ui/Loader/Loader';

interface PageLoaderProps {
    className?: string;
}

const PageLoader = ({ className }: PageLoaderProps) => {
    return (
        <div className={`flex items-center justify-center h-screen w-full ${className ?? ''}`}>
            <Loader />
        </div>
    );
};

export default PageLoader;
