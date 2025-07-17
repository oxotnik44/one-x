import { AddAlbumForm } from 'features/AddAlbumForm';
import { type FC } from 'react';
import { ButtonNavigation, PageWrapper } from 'shared/ui';
export const AddAlbumPage: FC = () => {
    return (
        <PageWrapper>
            <ButtonNavigation back />
            <AddAlbumForm />
        </PageWrapper>
    );
};
