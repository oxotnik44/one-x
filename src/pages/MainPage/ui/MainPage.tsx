import type { FC } from 'react';
import { PageWrapper } from 'shared/ui';
import { Main } from 'widgets/Main/ui/Main';

export const MainPage: FC = () => {
    return (
        <PageWrapper>
            <Main />
        </PageWrapper>
    );
};
