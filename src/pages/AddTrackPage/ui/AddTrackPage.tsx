import { AddTrackForm } from 'features/AddTrackForm/ui/AddTrackForm';
import { type FC } from 'react';
import { ButtonNavigation } from 'shared/ui/ButtonNavigation/ButtonNavigation';
import { PageWrapper } from 'shared/ui/PageWrapper/PageWrapper';
export const AddTrackPage: FC = () => {
    return (
        <PageWrapper>
            <ButtonNavigation back />
            <AddTrackForm />
        </PageWrapper>
    );
};
