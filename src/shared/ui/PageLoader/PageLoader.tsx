import { memo } from 'react';
import { PageWrapper } from '../PageWrapper/PageWrapper';
import { Loader } from '../Loader/Loader';

const PageLoaderComponent = () => {
    return (
        <PageWrapper>
            <Loader />
        </PageWrapper>
    );
};

const PageLoader = memo(PageLoaderComponent);
PageLoader.displayName = 'PageLoader';

export default PageLoader;
