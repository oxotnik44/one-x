// src/pages/MainPage.tsx
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Logo from '/assets/Logo.webp';
import { PageWrapper } from 'shared/ui';

export const MainPage: FC = () => {
    const { t } = useTranslation('mainPage'); // namespace 'main', создай его в переводах

    return (
        <PageWrapper>
            <img src={Logo} alt={t('logoAlt')} className="w-full h-full object-contain" />
        </PageWrapper>
    );
};
