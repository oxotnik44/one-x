import { EditGroupForm } from 'features/EditGroupForm';
import React from 'react';
import { ButtonNavigation } from 'shared/ui/ButtonNavigation/ButtonNavigation';
import { PageWrapper } from 'shared/ui/PageWrapper/PageWrapper';
export const GroupSettingsPage: React.FC = () => {
    return (
        <PageWrapper>
            <EditGroupForm />
            <ButtonNavigation back />
        </PageWrapper>
    );
};
