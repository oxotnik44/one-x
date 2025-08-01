import type { FC } from 'react';
import { PageWrapper } from 'shared/ui';
import { Main } from 'widgets/Main';

const RainbowBackground: FC = () => {
    return (
        <div
            className="
                absolute left-5/9 top-3/6 z-0 pointer-events-none
                w-[80%] h-[80%] -translate-x-1/2 -translate-y-1/2
                rounded-full bg-rainbow-gradient animate-gradient-shift
                opacity-50 blur-3xl
                mask-radial
            "
        />
    );
};
export const MainPage: FC = () => {
    return (
        <PageWrapper>
            <RainbowBackground />

            <Main />
        </PageWrapper>
    );
};
