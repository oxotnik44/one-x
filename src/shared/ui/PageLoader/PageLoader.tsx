import { memo } from 'react';
import { Loader } from 'shared/ui/Loader/Loader';

interface PageLoaderProps {
    className?: string;
}

const PageLoaderComponent = ({ className }: PageLoaderProps) => {
    return (
        <div className={`flex items-center justify-center h-screen w-full ${className ?? ''}`}>
            <Loader />
        </div>
    );
};

const PageLoader = memo(PageLoaderComponent);
PageLoader.displayName = 'PageLoader';

export default PageLoader;
