import { EditGroupForm } from 'features/EditGroupForm';
import React from 'react';
import { ButtonNavigation, PageWrapper } from 'shared/ui';

export const GroupSettingsPage: React.FC = () => {
    return (
        <PageWrapper>
            <EditGroupForm />
            <ButtonNavigation back />
        </PageWrapper>
    );
};
