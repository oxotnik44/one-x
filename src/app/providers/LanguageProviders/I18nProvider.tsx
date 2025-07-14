import { type ReactNode, Suspense } from 'react';
import '../../../shared/config/i18n/i18n';

interface I18nProviderProps {
    children: ReactNode;
}

export const I18nProvider = ({ children }: I18nProviderProps) => (
    <Suspense fallback={<div>Загрузка переводов...</div>}>{children}</Suspense>
);
