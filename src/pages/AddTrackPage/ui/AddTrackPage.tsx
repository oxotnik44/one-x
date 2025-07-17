import { AddTrackForm } from 'features/AddTrackForm';
import { type FC } from 'react';
import { ButtonNavigation, PageWrapper } from 'shared/ui';
export const AddTrackPage: FC = () => {
    return (
        <PageWrapper>
            <ButtonNavigation back />
            <AddTrackForm />
        </PageWrapper>
    );
};
