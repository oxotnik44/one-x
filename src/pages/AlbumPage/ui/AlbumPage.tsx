import { ButtonNavigation, PageWrapper } from 'shared/ui';
import { Album } from 'widgets/Album';

export const AlbumPage = () => {
    return (
        <PageWrapper notCenter>
            <ButtonNavigation back />
            <Album />
        </PageWrapper>
    );
};
