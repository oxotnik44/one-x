// src/pages/SettingsUserPage.tsx
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { PageWrapper } from 'shared/ui';

export const SettingsUserPage: React.FC = () => {
    const { t, i18n } = useTranslation('settings');
    const onLanguageToggle = useCallback(() => {
        const next = i18n.language === 'ru' ? 'en' : 'ru';
        void i18n.changeLanguage(next);
    }, [i18n]);

    return (
        <PageWrapper>
            <div className="flex flex-col items-start gap-6">
                <h1 className="text-2xl font-bold">{t('title')}</h1>

                <button
                    onClick={onLanguageToggle}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                >
                    {i18n.language === 'ru' ? 'EN' : 'RU'} — {t('changeLanguage')}
                </button>
            </div>
        </PageWrapper>
    );
};
