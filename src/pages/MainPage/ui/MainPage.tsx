// src/pages/MainPage.tsx
import type { FC } from 'react';
import Logo from 'shared/assets/Logo.png';
import { PageWrapper } from 'shared/ui/PageWrapper/PageWrapper';

export const MainPage: FC = () => {
    return (
        <PageWrapper>
            <img src={Logo} alt="Логотип" className="w-full h-full object-contain" />
        </PageWrapper>
    );
};
