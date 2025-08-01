import { memo } from 'react';
import { PageWrapper } from '../PageWrapper/PageWrapper';
import { Loader } from '../Loader/Loader';

const PageLoader = memo(() => (
    <PageWrapper>
        <Loader />
    </PageWrapper>
));

PageLoader.displayName = 'PageLoader';

export default PageLoader;
